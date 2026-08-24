import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const output = path.join(root, 'dist')

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

function inlineMarkdown(value) {
  let html = escapeHtml(value)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    const normalizedHref = href.replace(/\.md(?=$|#)/, '.html')
    return `<a href="${escapeHtml(normalizedHref)}">${label}</a>`
  })
  html = html.replace(/&lt;(https:\/\/[^&]+)&gt;/g, '<a href="$1">$1</a>')
  return html
}

function isSpecialLine(lines, index) {
  const line = lines[index] || ''
  return (
    !line.trim() ||
    /^#{1,3} /.test(line) ||
    /^```/.test(line) ||
    /^[-*] /.test(line) ||
    /^\d+\. /.test(line) ||
    /^> /.test(line) ||
    (line.includes('|') && /^\s*\|?\s*:?-+/.test(lines[index + 1] || ''))
  )
}

function markdownToHtml(markdown) {
  const lines = markdown.replaceAll('\r\n', '\n').split('\n')
  const outputLines = []

  for (let index = 0; index < lines.length; ) {
    const line = lines[index]
    if (!line.trim()) {
      index += 1
      continue
    }

    const heading = /^(#{1,3}) (.+)$/.exec(line)
    if (heading) {
      const level = heading[1].length
      outputLines.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`)
      index += 1
      continue
    }

    if (line.startsWith('```')) {
      const language = line.slice(3).trim()
      const code = []
      index += 1
      while (index < lines.length && !lines[index].startsWith('```')) {
        code.push(lines[index])
        index += 1
      }
      index += 1
      outputLines.push(`<pre><code${language ? ` class="language-${escapeHtml(language)}"` : ''}>${escapeHtml(code.join('\n'))}</code></pre>`)
      continue
    }

    if (line.includes('|') && /^\s*\|?\s*:?-+/.test(lines[index + 1] || '')) {
      const rows = []
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        rows.push(lines[index].replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((cell) => cell.trim()))
        index += 1
      }
      const [header, , ...body] = rows
      outputLines.push('<table><thead><tr>')
      header.forEach((cell) => outputLines.push(`<th>${inlineMarkdown(cell)}</th>`))
      outputLines.push('</tr></thead><tbody>')
      body.forEach((row) => {
        outputLines.push('<tr>')
        row.forEach((cell) => outputLines.push(`<td>${inlineMarkdown(cell)}</td>`))
        outputLines.push('</tr>')
      })
      outputLines.push('</tbody></table>')
      continue
    }

    if (/^[-*] /.test(line)) {
      outputLines.push('<ul>')
      while (index < lines.length && /^[-*] /.test(lines[index])) {
        const value = lines[index].replace(/^[-*] /, '')
        const checkbox = /^\[([ xX])\] (.+)$/.exec(value)
        outputLines.push(
          checkbox
            ? `<li><input type="checkbox" disabled${checkbox[1] !== ' ' ? ' checked' : ''} /> ${inlineMarkdown(checkbox[2])}</li>`
            : `<li>${inlineMarkdown(value)}</li>`,
        )
        index += 1
      }
      outputLines.push('</ul>')
      continue
    }

    if (/^\d+\. /.test(line)) {
      outputLines.push('<ol>')
      while (index < lines.length && /^\d+\. /.test(lines[index])) {
        outputLines.push(`<li>${inlineMarkdown(lines[index].replace(/^\d+\. /, ''))}</li>`)
        index += 1
      }
      outputLines.push('</ol>')
      continue
    }

    if (line.startsWith('> ')) {
      const quote = []
      while (index < lines.length && lines[index].startsWith('> ')) {
        quote.push(lines[index].slice(2))
        index += 1
      }
      outputLines.push(`<blockquote>${inlineMarkdown(quote.join(' '))}</blockquote>`)
      continue
    }

    const paragraph = [line.trim()]
    index += 1
    while (index < lines.length && !isSpecialLine(lines, index)) {
      paragraph.push(lines[index].trim())
      index += 1
    }
    outputLines.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`)
  }

  return outputLines.join('\n')
}

function documentTemplate(title, content) {
  return `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <title>${escapeHtml(title)} · hypo.tech Partnerintegration</title>
    <link rel="stylesheet" href="../assets/styles.css" />
    <link rel="stylesheet" href="../assets/docs.css" />
  </head>
  <body>
    <header class="docs-header"><a href="../">← Partnerintegration</a><a href="https://github.com/hypotech-gmbh/hypotech-widget-integration">GitHub</a></header>
    <main class="docs-main">${content}</main>
    <footer><span>hypo.tech · Partnerintegration</span><a href="https://hypo.tech/datenschutz">Datenschutz</a></footer>
  </body>
</html>\n`
}

async function copy(source, destination) {
  await fs.mkdir(path.dirname(destination), { recursive: true })
  await fs.cp(source, destination, { recursive: true })
}

await fs.rm(output, { recursive: true, force: true })
await fs.mkdir(output, { recursive: true })
await copy(path.join(root, 'index.html'), path.join(output, 'index.html'))
await copy(path.join(root, 'assets'), path.join(output, 'assets'))
await copy(path.join(root, 'examples'), path.join(output, 'examples'))
await copy(path.join(root, 'types'), path.join(output, 'types'))

const documentFiles = (await fs.readdir(path.join(root, 'docs'))).filter((name) => name.endsWith('.md')).sort()
for (const name of documentFiles) {
  const markdown = await fs.readFile(path.join(root, 'docs', name), 'utf8')
  const title = markdown.match(/^# (.+)$/m)?.[1] || name.replace('.md', '')
  const html = documentTemplate(title, markdownToHtml(markdown))
  await fs.mkdir(path.join(output, 'docs'), { recursive: true })
  await fs.writeFile(path.join(output, 'docs', name.replace('.md', '.html')), html)
}

const securityMarkdown = await fs.readFile(path.join(root, 'SECURITY.md'), 'utf8')
await fs.writeFile(path.join(output, 'SECURITY.html'), documentTemplate('Sicherheitsmeldungen', markdownToHtml(securityMarkdown)))
console.log(`✓ Dokumentationsseite gebaut (${documentFiles.length} Fachseiten, 3 Beispiele).`)
