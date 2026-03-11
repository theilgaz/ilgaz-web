import yaml from 'js-yaml'
import { Formatter, FormatStats } from './types'

function highlightYaml(text: string): JSX.Element[] {
  const elements: JSX.Element[] = []
  let key = 0
  const lines = text.split('\n')

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li]
    if (li > 0) elements.push(<span key={key++}>{'\n'}</span>)

    // Comment line
    if (line.trimStart().startsWith('#')) {
      const indent = line.match(/^(\s*)/)?.[1] || ''
      elements.push(
        <span key={key++}>
          {indent}<span className="hl-comment">{line.trimStart()}</span>
        </span>
      )
      continue
    }

    // Key: value line
    const kvMatch = line.match(/^(\s*)([\w.-]+)(\s*:\s*)(.*)$/)
    if (kvMatch) {
      const [, indent, k, colon, value] = kvMatch
      elements.push(<span key={key++}>{indent}</span>)
      elements.push(<span key={key++} className="hl-key">{k}</span>)
      elements.push(<span key={key++} className="hl-punctuation">{colon}</span>)

      if (value) {
        // Inline comment
        const commentIdx = value.indexOf(' #')
        const actualValue = commentIdx >= 0 ? value.slice(0, commentIdx) : value
        const comment = commentIdx >= 0 ? value.slice(commentIdx) : ''

        highlightYamlValue(actualValue, elements, key)
        key += 2

        if (comment) {
          elements.push(<span key={key++} className="hl-comment">{comment}</span>)
        }
      }
      continue
    }

    // List item
    const listMatch = line.match(/^(\s*)(- )(.*)$/)
    if (listMatch) {
      const [, indent, dash, value] = listMatch
      elements.push(<span key={key++}>{indent}</span>)
      elements.push(<span key={key++} className="hl-punctuation">{dash}</span>)
      highlightYamlValue(value, elements, key)
      key += 2
      continue
    }

    // Plain text / other
    elements.push(<span key={key++}>{line}</span>)
  }

  return elements
}

function highlightYamlValue(value: string, elements: JSX.Element[], key: number) {
  const trimmed = value.trim()

  if (trimmed === 'true' || trimmed === 'false') {
    elements.push(<span key={key + 100000} className="hl-boolean">{value}</span>)
  } else if (trimmed === 'null' || trimmed === '~') {
    elements.push(<span key={key + 200000} className="hl-null">{value}</span>)
  } else if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(trimmed)) {
    elements.push(<span key={key + 300000} className="hl-number">{value}</span>)
  } else if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    elements.push(<span key={key + 400000} className="hl-string">{value}</span>)
  } else {
    elements.push(<span key={key + 500000} className="hl-string">{value}</span>)
  }
}

export const yamlFormatter: Formatter = {
  label: 'YAML',
  placeholder: 'YAML yapıştır veya yaz...',
  supportsMinify: false,
  supportsIndent: false,

  validate(input: string): string | null {
    try {
      yaml.load(input)
      return null
    } catch (e) {
      return `Geçersiz YAML: ${(e as Error).message.split('\n')[0]}`
    }
  },

  format(input: string): string {
    const parsed = yaml.load(input)
    return yaml.dump(parsed, { indent: 2, lineWidth: -1, noRefs: true }).trimEnd()
  },

  minify(_input: string): string {
    // YAML is whitespace-significant, minify not supported
    return _input
  },

  highlight(output: string): JSX.Element[] {
    return highlightYaml(output)
  },

  getStats(output: string): FormatStats | null {
    try {
      const parsed = yaml.load(output)
      if (typeof parsed !== 'object' || parsed === null) {
        return { chars: output.length, lines: output.split('\n').length, detail: 'skaler değer' }
      }
      const keys = Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length
      return {
        chars: output.length,
        lines: output.split('\n').length,
        detail: Array.isArray(parsed) ? `${keys} öğe` : `${keys} anahtar`
      }
    } catch {
      return null
    }
  }
}
