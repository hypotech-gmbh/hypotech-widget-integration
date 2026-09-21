// Publishes the built package (dist/) to its private S3 bucket behind
// widgets.hypo.tech and invalidates the CloudFront cache afterwards.
//
// Headers and redirects still live in vercel.json: while Vercel remains the
// rollback target, both platforms serve the same rules. This script translates
// them into the contract of the CloudFront functions in front of the buckets:
//
//   - pages are stored as <path>/index.html; <path>.html moves there
//   - Content-Type and Cache-Control are native S3 metadata
//   - other headers are stored as x-amz-meta-<header>, only the promoted ones
//   - a redirect is an empty object with x-amz-meta-location and -status
//
// The widget and its documentation publish with the same copy of this script.
//
//   node scripts/deploy-aws.mjs --target site --dry-run   # print the plan only
//   node scripts/deploy-aws.mjs --target site             # publish (AWS credentials)
import { execFile } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const execute = promisify(execFile)

export const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ts': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
}

// The viewer-response function turns exactly these into response headers.
export const PROMOTED_HEADERS = new Set([
  'access-control-allow-origin',
  'content-security-policy',
  'cross-origin-opener-policy',
  'cross-origin-resource-policy',
  'permissions-policy',
  'referrer-policy',
  'x-content-type-options',
  'x-frame-options',
])

// Vercel sent this with every static file; modules imported by partner pages need it.
export const DEFAULT_METADATA = { 'access-control-allow-origin': '*' }
// Browsers revalidate on every visit as they did on Vercel. CloudFront keeps a
// copy for at most a day and is invalidated after each deploy.
export const DEFAULT_CACHE_CONTROL = 'public, max-age=0, s-maxage=86400, must-revalidate'

export const TARGETS = {
  site: {
    required: ['index.html', 'errors/404.txt', 'v1/embed.js', 'v1/release.json'],
    owns: (key) => !key.startsWith('docs/'),
    // A preview build carries draft configuration and must never reach production.
    verify: async (directory) => {
      const release = JSON.parse(await fs.readFile(path.join(directory, 'v1', 'release.json'), 'utf8'))
      if (release.channel !== 'published') fail('only a production build (channel "published") can be deployed')
    },
  },
  docs: { required: ['docs/index.html'], owns: (key) => key.startsWith('docs/'), verify: async () => {} },
}

const REDIRECT_STATUSES = new Set([301, 302, 307, 308])
const METADATA_LIMIT_BYTES = 2048

function fail(message) {
  throw new Error(`deploy-aws: ${message}`)
}

// The key a file is served from once the edge function has resolved clean URLs.
export function objectKey(relativePath) {
  if (relativePath === 'index.html' || relativePath.endsWith('/index.html')) return relativePath
  if (relativePath.endsWith('.html')) return `${relativePath.slice(0, -5)}/index.html`
  return relativePath
}

// The public path a viewer requests for an object key.
export function publicPath(key) {
  return `/${key.endsWith('index.html') ? key.slice(0, -'index.html'.length) : key}`
}

function sameSitePath(value) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')
}

// Same normalization as the viewer-request function, so a redirect needs one hop.
function cleanPath(value) {
  const [pathname, query] = value.split(/\?(.*)/s)
  let clean = pathname
  if (clean.endsWith('/index.html')) clean = clean.slice(0, -'index.html'.length)
  else if (clean.endsWith('.html')) clean = `${clean.slice(0, -5)}/`
  else if (!clean.endsWith('/') && !path.posix.basename(clean).includes('.')) clean = `${clean}/`
  return query === undefined ? clean : `${clean}?${query}`
}

function headerRule({ source, headers }) {
  if (!sameSitePath(source)) fail(`unsupported header source ${source}`)
  const prefix = source.endsWith('(.*)') ? source.slice(0, -4) : null
  if (/[():*?[\]{}]/.test(prefix ?? source)) fail(`unsupported header source ${source}`)
  if (!Array.isArray(headers)) fail(`header rule ${source} has no headers`)
  return { matches: (pathname) => (prefix === null ? pathname === source : pathname.startsWith(prefix)), headers }
}

function headersFor(pathname, rules) {
  const metadata = { ...DEFAULT_METADATA }
  let cacheControl = DEFAULT_CACHE_CONTROL
  let contentType = null
  for (const rule of rules.filter(({ matches }) => matches(pathname))) {
    for (const { key, value } of rule.headers) {
      const name = String(key).toLowerCase()
      if (typeof value !== 'string' || /[^\x20-\x7e]/.test(value)) fail(`${name} for ${pathname} must be printable ASCII`)
      if (name === 'cache-control') cacheControl = value
      else if (name === 'content-type') contentType = value
      else if (PROMOTED_HEADERS.has(name)) metadata[name] = value
      else fail(`${name} for ${pathname} would be dropped by the edge function`)
    }
  }
  const size = Object.entries(metadata).reduce((total, [name, value]) => total + Buffer.byteLength(name) + Buffer.byteLength(value), 0)
  if (size > METADATA_LIMIT_BYTES) fail(`headers for ${pathname} exceed the S3 metadata limit`)
  return { metadata, cacheControl, contentType }
}

function redirectObjects(redirects) {
  const objects = new Map()
  for (const { source, destination, permanent, statusCode } of redirects) {
    if (!sameSitePath(source) || /[():*?[\]{}]/.test(source)) fail(`unsupported redirect source ${source}`)
    if (!sameSitePath(destination)) fail(`redirect ${source} must stay on this site`)
    const status = statusCode ?? (permanent ? 308 : 307)
    if (!REDIRECT_STATUSES.has(status)) fail(`redirect ${source} has unsupported status ${status}`)
    // The edge function has already added the trailing slash when the object is read.
    const requested = cleanPath(source)
    const key = requested.endsWith('/') ? `${requested.slice(1)}index.html` : requested.slice(1)
    const location = cleanPath(destination)
    const previous = objects.get(key)
    if (previous && (previous.metadata.location !== location || previous.metadata.status !== String(status))) {
      fail(`conflicting redirects for ${publicPath(key)}`)
    }
    objects.set(key, {
      key,
      file: null,
      contentType: 'text/plain; charset=utf-8',
      cacheControl: DEFAULT_CACHE_CONTROL,
      metadata: { location, status: String(status) },
    })
  }
  return objects
}

async function listFiles(directory, base = directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const absolute = path.join(directory, entry.name)
    if (entry.isSymbolicLink()) fail(`symlinks are not published: ${path.relative(base, absolute)}`)
    if (entry.isDirectory()) files.push(...(await listFiles(absolute, base)))
    else if (entry.isFile()) files.push({ absolute, relative: path.relative(base, absolute).split(path.sep).join('/') })
  }
  return files
}

function uploadOrder({ key, file }) {
  if (file === null) return 2
  return key.endsWith('.html') ? 1 : 0
}

export async function planDeployment({ outputDirectory, policy, target }) {
  if (!TARGETS[target]) fail(`unknown target ${target}`)
  if (policy.cleanUrls !== true || policy.trailingSlash !== true) fail('the edge functions implement cleanUrls and trailingSlash only')
  for (const { source } of policy.rewrites ?? []) {
    // /docs/* is its own CloudFront behavior backed by the documentation bucket.
    if (!String(source).startsWith('/docs/')) fail(`rewrite ${source} has no CloudFront equivalent`)
  }
  const rules = (policy.headers ?? []).map(headerRule)

  const files = await listFiles(outputDirectory)
  const present = new Set(files.map(({ relative }) => relative))
  const objects = new Map()
  for (const { absolute, relative } of files) {
    const key = objectKey(relative)
    // The explicit directory index wins over a page of the same name.
    if (key !== relative && present.has(key)) continue
    if (objects.has(key)) fail(`${relative} and another file both publish ${key}`)
    const extension = path.posix.extname(relative).toLowerCase()
    const { metadata, cacheControl, contentType } = headersFor(publicPath(key), rules)
    const type = contentType ?? CONTENT_TYPES[extension]
    if (!type) fail(`no content type for ${relative}`)
    objects.set(key, { key, file: absolute, contentType: type, cacheControl, metadata })
  }
  // Redirects take precedence over files, as on Vercel. A redirect for a path of
  // the other bucket (the documentation's own "/" on Vercel) belongs to that bucket.
  for (const [key, object] of redirectObjects(policy.redirects ?? [])) {
    if (TARGETS[target].owns(key)) objects.set(key, object)
    else console.log(`· ${publicPath(key)} is served from the other bucket; its redirect is not published here`)
  }

  for (const key of objects.keys()) {
    if (!TARGETS[target].owns(key)) fail(`${key} is not served from the ${target} bucket`)
  }
  for (const key of TARGETS[target].required) {
    if (!objects.has(key)) fail(`the package is missing ${key}`)
  }
  await TARGETS[target].verify(outputDirectory)
  return [...objects.values()].sort((left, right) => uploadOrder(left) - uploadOrder(right) || left.key.localeCompare(right.key))
}

async function aws(args) {
  const { stdout } = await execute('aws', [...args, '--no-cli-pager'], { maxBuffer: 64 * 1024 * 1024 })
  return stdout.trim()
}

async function inBatches(items, size, action) {
  for (let index = 0; index < items.length; index += size) {
    await Promise.all(items.slice(index, index + size).map(action))
  }
}

export async function publish({ plan, target, parameterName }) {
  const deployment = JSON.parse(await aws(['ssm', 'get-parameter', '--name', parameterName, '--query', 'Parameter.Value', '--output', 'text']))
  const bucket = deployment.buckets?.[target]
  if (!bucket || !deployment.distributionId) fail(`${parameterName} names no ${target} bucket or distribution`)

  await inBatches(plan, 8, async ({ key, file, contentType, cacheControl, metadata }) => {
    await aws([
      's3api', 'put-object', '--bucket', bucket, '--key', key,
      ...(file ? ['--body', file] : []),
      '--content-type', contentType, '--cache-control', cacheControl,
      '--metadata', JSON.stringify(metadata),
    ])
  })
  console.log(`✓ ${plan.length} objects published to ${bucket}`)

  const published = new Set(plan.map(({ key }) => key))
  const existing = JSON.parse((await aws(['s3api', 'list-objects-v2', '--bucket', bucket, '--query', 'Contents[].Key', '--output', 'json'])) || 'null') ?? []
  const stale = existing.filter((key) => !published.has(key))
  if (stale.length) {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'deploy-aws-'))
    try {
      for (let index = 0; index < stale.length; index += 1000) {
        const request = path.join(directory, `delete-${index}.json`)
        await fs.writeFile(request, JSON.stringify({ Objects: stale.slice(index, index + 1000).map((Key) => ({ Key })), Quiet: true }))
        await aws(['s3api', 'delete-objects', '--bucket', bucket, '--delete', `file://${request}`])
      }
    } finally {
      await fs.rm(directory, { recursive: true, force: true })
    }
  }
  console.log(`✓ ${stale.length} stale objects removed`)

  const paths = deployment.invalidationPaths?.[target] ?? ['/*']
  const invalidation = await aws([
    'cloudfront', 'create-invalidation', '--distribution-id', deployment.distributionId,
    '--paths', ...paths, '--query', 'Invalidation.Id', '--output', 'text',
  ])
  await aws(['cloudfront', 'wait', 'invalidation-completed', '--distribution-id', deployment.distributionId, '--id', invalidation])
  console.log(`✓ CloudFront invalidated (${paths.join(' ')})`)
  return deployment
}

function option(name, fallback) {
  const index = process.argv.indexOf(name)
  return index === -1 ? fallback : process.argv[index + 1]
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const target = option('--target')
  const outputDirectory = path.resolve(root, option('--dist', 'dist'))
  const policy = JSON.parse(await fs.readFile(path.join(root, 'vercel.json'), 'utf8'))
  const plan = await planDeployment({ outputDirectory, policy, target })

  if (process.argv.includes('--dry-run')) {
    for (const { key, contentType, cacheControl, metadata } of plan) {
      const extra = metadata.location ? `→ ${metadata.status} ${metadata.location}` : Object.keys(metadata).join(', ')
      console.log(`${key}\t${contentType}\t${cacheControl}\t${extra}`)
    }
    console.log(`✓ ${plan.length} objects planned for the ${target} bucket (dry run).`)
  } else {
    const deployment = await publish({ plan, target, parameterName: option('--parameter', '/hypotech-prod/widget/hosting') })
    if (process.env.GITHUB_OUTPUT) {
      await fs.appendFile(process.env.GITHUB_OUTPUT, `edge_url=https://${deployment.distributionDomain}\n`)
    }
  }
}
