import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ignoredDirectories = new Set(['.git', '.vercel', 'dist', 'node_modules'])
const forbiddenExtensions = new Set(['.env', '.key', '.pem', '.p12', '.pfx', '.docx', '.pdf', '.png', '.jpg', '.jpeg', '.webp'])
const sensitivePatterns = [
  { label: 'private key', pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { label: 'GitHub token', pattern: /\b(?:ghp|gho|ghu|ghs|github_pat)_[A-Za-z0-9_]{20,}\b/ },
  { label: 'AWS access key', pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/ },
  { label: 'Vercel token assignment', pattern: /\bVERCEL_TOKEN\s*=\s*\S+/ },
  { label: 'local user path', pattern: /\/Users\/[^/\s]+\// },
  { label: 'postMessage wildcard target', pattern: /postMessage\([\s\S]{0,240},\s*['"]\*['"]\s*\)/ },
]

async function walk(directory) {
  const files = []
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) continue
    const fullPath = path.join(directory, entry.name)
    if (entry.isSymbolicLink()) throw new Error(`Symlinks are not allowed: ${path.relative(root, fullPath)}`)
    if (entry.isDirectory()) files.push(...(await walk(fullPath)))
    if (entry.isFile()) files.push(fullPath)
  }
  return files
}

const errors = []
const files = await walk(root)

for (const file of files) {
  const relativePath = path.relative(root, file)
  const extension = path.extname(file).toLowerCase()
  const stat = await fs.stat(file)
  if (forbiddenExtensions.has(extension) || path.basename(file).startsWith('.env')) {
    errors.push(`${relativePath}: file type is not allowed in the public repository`)
    continue
  }
  if (stat.size > 500_000) errors.push(`${relativePath}: unusually large file (${stat.size} bytes)`)

  const contents = await fs.readFile(file, 'utf8')
  for (const { label, pattern } of sensitivePatterns) {
    if (pattern.test(contents)) errors.push(`${relativePath}: possible sensitive content (${label})`)
  }

  const runtimeUrls = contents.match(/https:\/\/(?:hypotech-widget\.vercel\.app|widgets\.hypo\.tech)[^\s"'<>)]*/g) || []
  for (const url of runtimeUrls) {
    if (/[?&](?:age|income|equity|assets)=/i.test(url)) errors.push(`${relativePath}: personal value in widget URL`)
  }
}

if (errors.length) {
  console.error(`Public repository audit failed:\n- ${errors.join('\n- ')}`)
  process.exit(1)
}

console.log(`✓ Audited ${files.length} public files: no credentials, private keys, local paths or personal URL parameters found.`)
