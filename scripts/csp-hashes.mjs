// Trägt die Hashes der Inline-Skripte des gebauten Doku-Pakets in die
// Content-Security-Policy ein.
//
// VitePress gibt ein Inline-Skript aus, das die Klasse `mac` setzt und damit
// zwischen Ctrl- und Cmd-Tastenhinweisen unterscheidet. Die Policy der
// Doku-Seite erlaubt Inline-Skripte nicht; statt `'unsafe-inline'` freizugeben,
// wird der Hash genau dieses Skripts erlaubt. Der Hash steht nach dem Build
// fest und wird deshalb hier gepflegt – nicht von Hand in hosting.json.

import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const outputDirectory = path.join(root, 'dist', 'docs')
const hostingPath = path.join(root, 'hosting.json')
const inlineScriptPattern = /<script(?![^>]*\bsrc=)[^>]*>(.*?)<\/script>/gs
const hashPattern = /'sha256-[A-Za-z0-9+/=]+'/g

async function htmlFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await htmlFiles(entryPath)))
    else if (entry.name.endsWith('.html')) files.push(entryPath)
  }
  return files
}

const hashes = new Set()
for (const filePath of await htmlFiles(outputDirectory)) {
  const html = await fs.readFile(filePath, 'utf8')
  for (const match of html.matchAll(inlineScriptPattern)) {
    const digest = crypto.createHash('sha256').update(match[1]).digest('base64')
    hashes.add(`'sha256-${digest}'`)
  }
}

if (!hashes.size) {
  console.log('✓ Keine Inline-Skripte im Paket; die CSP bleibt unverändert.')
  process.exit(0)
}

const config = JSON.parse(await fs.readFile(hostingPath, 'utf8'))
const header = config.headers
  ?.flatMap((entry) => entry.headers ?? [])
  .find((entry) => entry.key === 'Content-Security-Policy')

if (!header) {
  console.error('Keine Content-Security-Policy in hosting.json gefunden.')
  process.exit(1)
}

const directives = header.value
  .split(';')
  .map((directive) => directive.trim())
  .filter(Boolean)

const scriptIndex = directives.findIndex((directive) => directive.startsWith('script-src'))
const sources = scriptIndex >= 0 ? directives[scriptIndex].replace('script-src', '').replace(hashPattern, '').trim() : "'self'"
const directive = `script-src ${sources ? `${sources} ` : ''}${[...hashes].sort().join(' ')}`
if (scriptIndex >= 0) directives[scriptIndex] = directive
else directives.push(directive)

const updated = directives.join('; ')

if (updated === header.value) {
  console.log(`✓ CSP enthält bereits ${hashes.size} Inline-Skript-Hash(es).`)
  process.exit(0)
}

header.value = updated
await fs.writeFile(hostingPath, `${JSON.stringify(config, null, 2)}\n`)
console.log(`✓ CSP um ${hashes.size} Inline-Skript-Hash(es) ergänzt: ${[...hashes].sort().join(', ')}`)
