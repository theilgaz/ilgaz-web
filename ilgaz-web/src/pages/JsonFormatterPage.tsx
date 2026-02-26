import { useState, useMemo } from 'react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function highlightJson(json: string): JSX.Element[] {
  const elements: JSX.Element[] = []
  let i = 0
  let key = 0

  while (i < json.length) {
    const char = json[i]

    // Whitespace
    if (/\s/.test(char)) {
      let ws = ''
      while (i < json.length && /\s/.test(json[i])) {
        ws += json[i]
        i++
      }
      elements.push(<span key={key++}>{ws}</span>)
      continue
    }

    // Strings
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

      // Check if it's a key (followed by :)
      let j = i
      while (j < json.length && /\s/.test(json[j])) j++
      if (json[j] === ':') {
        elements.push(<span key={key++} className="json-key">{str}</span>)
      } else {
        elements.push(<span key={key++} className="json-string">{str}</span>)
      }
      continue
    }

    // Numbers
    if (/[-\d]/.test(char)) {
      let num = ''
      while (i < json.length && /[-\d.eE+]/.test(json[i])) {
        num += json[i]
        i++
      }
      elements.push(<span key={key++} className="json-number">{num}</span>)
      continue
    }

    // Booleans and null
    if (json.slice(i, i + 4) === 'true') {
      elements.push(<span key={key++} className="json-boolean">true</span>)
      i += 4
      continue
    }
    if (json.slice(i, i + 5) === 'false') {
      elements.push(<span key={key++} className="json-boolean">false</span>)
      i += 5
      continue
    }
    if (json.slice(i, i + 4) === 'null') {
      elements.push(<span key={key++} className="json-null">null</span>)
      i += 4
      continue
    }

    // Brackets and punctuation
    if (/[{}\[\]:,]/.test(char)) {
      const className = /[{}]/.test(char) ? 'json-brace' : /[\[\]]/.test(char) ? 'json-bracket' : 'json-punctuation'
      elements.push(<span key={key++} className={className}>{char}</span>)
      i++
      continue
    }

    // Fallback
    elements.push(<span key={key++}>{char}</span>)
    i++
  }

  return elements
}

export function JsonFormatterPage() {
  useDocumentTitle('json formatter')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [indentSize, setIndentSize] = useState(2)

  const format = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, indentSize))
      setError('')
    } catch (e) {
      setError(`Geçersiz JSON: ${(e as Error).message}`)
      setOutput('')
    }
  }

  const minify = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
    } catch (e) {
      setError(`Geçersiz JSON: ${(e as Error).message}`)
      setOutput('')
    }
  }

  const clear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInput(text)
    } catch {
      // Clipboard access denied
    }
  }

  const swapInputOutput = () => {
    setInput(output)
    setOutput('')
  }

  // Stats
  const getStats = () => {
    if (!output) return null
    try {
      const parsed = JSON.parse(output)
      const keys = typeof parsed === 'object' && parsed !== null
        ? (Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length)
        : 0
      return {
        chars: output.length,
        lines: output.split('\n').length,
        keys: Array.isArray(JSON.parse(output)) ? `${keys} öğe` : `${keys} anahtar`
      }
    } catch {
      return null
    }
  }

  const stats = getStats()

  const highlightedOutput = useMemo(() => {
    if (!output) return null
    return highlightJson(output)
  }, [output])

  return (
    <div className="json-page">
      <h1>JSON Formatter</h1>
      <p className="lead">
        JSON verilerini formatla, minify et ve analiz et.
      </p>

      <div className="json-page-content">
        <div className="json-page-layout">
          <div className="json-page-panel">
            <div className="json-page-panel-header">
              <span>Girdi</span>
              <span className="json-page-panel-info">{input.length} karakter</span>
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="JSON yapıştır veya yaz..."
              spellCheck={false}
            />
          </div>

          <div className="json-page-actions">
            <button onClick={format} className="primary">Format →</button>
            <button onClick={minify}>Minify →</button>
            <div className="json-page-divider" />
            <button onClick={swapInputOutput} disabled={!output}>← Geri al</button>
            <button onClick={pasteFromClipboard}>Yapıştır</button>
            <button onClick={clear}>Temizle</button>
            <div className="json-page-divider" />
            <div className="json-page-options">
              <label>
                Girinti
                <select value={indentSize} onChange={e => setIndentSize(Number(e.target.value))}>
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                </select>
              </label>
            </div>
          </div>

          <div className="json-page-panel">
            <div className="json-page-panel-header">
              <span>Çıktı</span>
              {stats && (
                <span className="json-page-panel-info">
                  {stats.chars} · {stats.lines} satır · {stats.keys}
                </span>
              )}
              {output && (
                <button className={`json-page-copy ${copied ? 'copied' : ''}`} onClick={copyOutput} title="Kopyala">
                  {copied ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                  )}
                </button>
              )}
            </div>
            {error ? (
              <div className="json-page-error">{error}</div>
            ) : (
              <pre className="json-page-output">
                {highlightedOutput || <span className="json-placeholder">Çıktı burada görünecek...</span>}
              </pre>
            )}
          </div>
        </div>

        <div className="tool-hint">
          <span>JSON yapıştır</span>
          <span className="separator">→</span>
          <kbd>Format</kbd> <span>veya</span> <kbd>Minify</kbd>
          <span className="separator">·</span>
          <span>Syntax highlighting</span>
        </div>
      </div>
    </div>
  )
}
