import { useState } from 'react'

export function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const format = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError('')
    } catch {
      setError('Geçersiz JSON')
      setOutput('')
    }
  }

  const minify = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
    } catch {
      setError('Geçersiz JSON')
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

  return (
    <div className="json-formatter">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="JSON yapıştır..."
      />
      <div className="json-buttons">
        <button onClick={format}>Format</button>
        <button onClick={minify}>Minify</button>
        <button onClick={pasteFromClipboard} className="secondary">Yapıştır</button>
        <button onClick={clear} className="secondary">Temizle</button>
      </div>
      {error && <span className="json-error">{error}</span>}
      {output && (
        <div className="json-output">
          <pre>{output}</pre>
          <button className="copy-btn" onClick={copyOutput}>
            {copied ? '✓' : '⎘'}
          </button>
        </div>
      )}
    </div>
  )
}
