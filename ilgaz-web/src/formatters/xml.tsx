import { Formatter, FormatStats } from './types'

function formatXml(xml: string, indent: number): string {
  const tab = ' '.repeat(indent)
  let formatted = ''
  let depth = 0
  // Remove existing whitespace between tags
  const cleaned = xml.replace(/(>)\s*(<)/g, '$1\n$2').trim()
  const lines = cleaned.split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    // Closing tag
    if (trimmed.startsWith('</')) {
      depth--
      formatted += tab.repeat(Math.max(0, depth)) + trimmed + '\n'
    }
    // Self-closing or declaration/comment
    else if (trimmed.endsWith('/>') || trimmed.startsWith('<?') || trimmed.startsWith('<!')) {
      formatted += tab.repeat(depth) + trimmed + '\n'
    }
    // Opening tag (check if it also has closing tag on same line like <tag>text</tag>)
    else if (trimmed.startsWith('<') && !trimmed.startsWith('</')) {
      // Check for inline close: <tag>content</tag>
      const inlineClose = /<[^/][^>]*>[^<]*<\/[^>]+>/.test(trimmed)
      if (inlineClose) {
        formatted += tab.repeat(depth) + trimmed + '\n'
      } else {
        formatted += tab.repeat(depth) + trimmed + '\n'
        // Only increase depth if this is an opening tag (not self-closing)
        if (!trimmed.endsWith('/>')) {
          depth++
        }
      }
    } else {
      formatted += tab.repeat(depth) + trimmed + '\n'
    }
  }

  return formatted.trimEnd()
}

function highlightXml(xml: string): JSX.Element[] {
  const elements: JSX.Element[] = []
  let key = 0
  // Regex to match XML tokens
  const regex = /(<!--[\s\S]*?-->)|(<\?[\s\S]*?\?>)|(<\/?\w[\w.-]*)|(\s+[\w.-]+=)|("[^"]*")|('[\s\S]*?')|(\/>|>|<)|([^<>&]+)/g
  let match: RegExpExecArray | null

  while ((match = regex.exec(xml)) !== null) {
    const [token] = match

    // Comment
    if (match[1]) {
      elements.push(<span key={key++} className="hl-comment">{token}</span>)
    }
    // Declaration <?xml ...?>
    else if (match[2]) {
      elements.push(<span key={key++} className="hl-declaration">{token}</span>)
    }
    // Tag name
    else if (match[3]) {
      elements.push(<span key={key++} className="hl-tag">{token}</span>)
    }
    // Attribute name
    else if (match[4]) {
      const eqIdx = token.indexOf('=')
      elements.push(
        <span key={key++}>
          <span className="hl-attr">{token.slice(0, eqIdx)}</span>
          <span className="hl-punctuation">=</span>
        </span>
      )
    }
    // Attribute value (quoted)
    else if (match[5] || match[6]) {
      elements.push(<span key={key++} className="hl-string">{token}</span>)
    }
    // Closing bracket
    else if (match[7]) {
      elements.push(<span key={key++} className="hl-tag">{token}</span>)
    }
    // Text content
    else if (match[8]) {
      elements.push(<span key={key++} className="hl-text">{token}</span>)
    }
  }

  return elements
}

export const xmlFormatter: Formatter = {
  label: 'XML',
  placeholder: 'XML yapıştır veya yaz...',
  supportsMinify: true,
  supportsIndent: true,

  validate(input: string): string | null {
    const parser = new DOMParser()
    const doc = parser.parseFromString(input, 'application/xml')
    const errorNode = doc.querySelector('parsererror')
    if (errorNode) {
      return `Geçersiz XML: ${errorNode.textContent?.split('\n')[0] || 'Ayrıştırma hatası'}`
    }
    return null
  },

  format(input: string, indentSize: number): string {
    // Validate first
    const parser = new DOMParser()
    const doc = parser.parseFromString(input, 'application/xml')
    const errorNode = doc.querySelector('parsererror')
    if (errorNode) {
      throw new Error(errorNode.textContent?.split('\n')[0] || 'Ayrıştırma hatası')
    }
    return formatXml(input, indentSize)
  },

  minify(input: string): string {
    const parser = new DOMParser()
    const doc = parser.parseFromString(input, 'application/xml')
    const errorNode = doc.querySelector('parsererror')
    if (errorNode) {
      throw new Error(errorNode.textContent?.split('\n')[0] || 'Ayrıştırma hatası')
    }
    // Remove whitespace between tags
    return input.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim()
  },

  highlight(output: string): JSX.Element[] {
    return highlightXml(output)
  },

  getStats(output: string): FormatStats | null {
    const parser = new DOMParser()
    const doc = parser.parseFromString(output, 'application/xml')
    if (doc.querySelector('parsererror')) return null
    const elements = doc.getElementsByTagName('*')
    return {
      chars: output.length,
      lines: output.split('\n').length,
      detail: `${elements.length} eleman`
    }
  }
}
