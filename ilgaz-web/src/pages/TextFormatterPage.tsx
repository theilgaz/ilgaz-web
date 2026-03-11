import { useState, useMemo } from 'react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { FormatType, Formatter } from '../formatters/types'
import { jsonFormatter } from '../formatters/json'
import { xmlFormatter } from '../formatters/xml'
import { yamlFormatter } from '../formatters/yaml'
import { sqlFormatter } from '../formatters/sql'

const formatters: Record<FormatType, Formatter> = {
  json: jsonFormatter,
  xml: xmlFormatter,
  yaml: yamlFormatter,
  sql: sqlFormatter,
}

const formatTypes: FormatType[] = ['json', 'xml', 'yaml', 'sql']

export function TextFormatterPage() {
  useDocumentTitle('formatter')
  const [activeFormat, setActiveFormat] = useState<FormatType>('json')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [indentSize, setIndentSize] = useState(2)

  const formatter = formatters[activeFormat]

  const switchFormat = (fmt: FormatType) => {
    setActiveFormat(fmt)
    setOutput('')
    setError('')
  }

  const format = () => {
    if (!input.trim()) return
    const validationError = formatter.validate(input)
    if (validationError) {
      setError(validationError)
      setOutput('')
      return
    }
    try {
      setOutput(formatter.format(input, indentSize))
      setError('')
    } catch (e) {
      setError(`Hata: ${(e as Error).message}`)
      setOutput('')
    }
  }

  const minify = () => {
    if (!input.trim()) return
    const validationError = formatter.validate(input)
    if (validationError) {
      setError(validationError)
      setOutput('')
      return
    }
    try {
      setOutput(formatter.minify(input))
      setError('')
    } catch (e) {
      setError(`Hata: ${(e as Error).message}`)
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

  const stats = useMemo(() => {
    if (!output) return null
    return formatter.getStats(output)
  }, [output, formatter])

  const highlightedOutput = useMemo(() => {
    if (!output) return null
    return formatter.highlight(output)
  }, [output, formatter])

  return (
    <div className="formatter-page">
      <h1>Formatter</h1>
      <p className="lead">
        Metni formatla, minify et ve analiz et.
      </p>

      <div className="formatter-tabs">
        {formatTypes.map(fmt => (
          <button
            key={fmt}
            className={`formatter-tab ${activeFormat === fmt ? 'active' : ''}`}
            onClick={() => switchFormat(fmt)}
          >
            {formatters[fmt].label}
          </button>
        ))}
      </div>

      <div className="formatter-page-content">
        <div className="formatter-page-layout">
          <div className="formatter-page-panel">
            <div className="formatter-page-panel-header">
              <span>Girdi</span>
              <span className="formatter-page-panel-info">{input.length} karakter</span>
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={formatter.placeholder}
              spellCheck={false}
            />
          </div>

          <div className="formatter-page-actions">
            <button onClick={format} className="primary">Format →</button>
            {formatter.supportsMinify && (
              <button onClick={minify}>Minify →</button>
            )}
            <div className="formatter-page-divider" />
            <button onClick={swapInputOutput} disabled={!output}>← Geri al</button>
            <button onClick={pasteFromClipboard}>Yapıştır</button>
            <button onClick={clear}>Temizle</button>
            {formatter.supportsIndent && (
              <>
                <div className="formatter-page-divider" />
                <div className="formatter-page-options">
                  <label>
                    Girinti
                    <select value={indentSize} onChange={e => setIndentSize(Number(e.target.value))}>
                      <option value={2}>2</option>
                      <option value={4}>4</option>
                    </select>
                  </label>
                </div>
              </>
            )}
          </div>

          <div className="formatter-page-panel">
            <div className="formatter-page-panel-header">
              <span>Çıktı</span>
              {stats && (
                <span className="formatter-page-panel-info">
                  {stats.chars} · {stats.lines} satır · {stats.detail}
                </span>
              )}
              {output && (
                <button className={`formatter-page-copy ${copied ? 'copied' : ''}`} onClick={copyOutput} title="Kopyala">
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
              <div className="formatter-page-error">{error}</div>
            ) : (
              <pre className="formatter-page-output">
                {highlightedOutput || <span className="formatter-placeholder">Çıktı burada görünecek...</span>}
              </pre>
            )}
          </div>
        </div>

        <div className="tool-hint">
          <span>{formatter.label} yapıştır</span>
          <span className="separator">→</span>
          <kbd>Format</kbd>
          {formatter.supportsMinify && <><span>veya</span> <kbd>Minify</kbd></>}
          <span className="separator">·</span>
          <span>Syntax highlighting</span>
        </div>
      </div>
    </div>
  )
}
