import { Formatter, FormatStats } from './types'

function highlightJson(json: string): JSX.Element[] {
  const elements: JSX.Element[] = []
  let i = 0
  let key = 0

  while (i < json.length) {
    const char = json[i]

    if (/\s/.test(char)) {
      let ws = ''
      while (i < json.length && /\s/.test(json[i])) {
        ws += json[i]
        i++
      }
      elements.push(<span key={key++}>{ws}</span>)
      continue
    }

    if (char === '"') {
      let str = '"'
      i++
      while (i < json.length && json[i] !== '"') {
        if (json[i] === '\\' && i + 1 < json.length) {
          str += json[i] + json[i + 1]
          i += 2
        } else {
          str += json[i]
          i++
        }
      }
      str += '"'
      i++

      let j = i
      while (j < json.length && /\s/.test(json[j])) j++
      if (json[j] === ':') {
        elements.push(<span key={key++} className="hl-key">{str}</span>)
      } else {
        elements.push(<span key={key++} className="hl-string">{str}</span>)
      }
      continue
    }

    if (/[-\d]/.test(char)) {
      let num = ''
      while (i < json.length && /[-\d.eE+]/.test(json[i])) {
        num += json[i]
        i++
      }
      elements.push(<span key={key++} className="hl-number">{num}</span>)
      continue
    }

    if (json.slice(i, i + 4) === 'true') {
      elements.push(<span key={key++} className="hl-boolean">true</span>)
      i += 4
      continue
    }
    if (json.slice(i, i + 5) === 'false') {
      elements.push(<span key={key++} className="hl-boolean">false</span>)
      i += 5
      continue
    }
    if (json.slice(i, i + 4) === 'null') {
      elements.push(<span key={key++} className="hl-null">null</span>)
      i += 4
      continue
    }

    if (/[{}\[\]:,]/.test(char)) {
      const className = /[{}]/.test(char) ? 'hl-brace' : /[\[\]]/.test(char) ? 'hl-bracket' : 'hl-punctuation'
      elements.push(<span key={key++} className={className}>{char}</span>)
      i++
      continue
    }

    elements.push(<span key={key++}>{char}</span>)
    i++
  }

  return elements
}

export const jsonFormatter: Formatter = {
  label: 'JSON',
  placeholder: 'JSON yapıştır veya yaz...',
  supportsMinify: true,
  supportsIndent: true,

  validate(input: string): string | null {
    try {
      JSON.parse(input)
      return null
    } catch (e) {
      return `Geçersiz JSON: ${(e as Error).message}`
    }
  },

  format(input: string, indentSize: number): string {
    const parsed = JSON.parse(input)
    return JSON.stringify(parsed, null, indentSize)
  },

  minify(input: string): string {
    const parsed = JSON.parse(input)
    return JSON.stringify(parsed)
  },

  highlight(output: string): JSX.Element[] {
    return highlightJson(output)
  },

  getStats(output: string): FormatStats | null {
    try {
      const parsed = JSON.parse(output)
      const keys = typeof parsed === 'object' && parsed !== null
        ? (Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length)
        : 0
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
