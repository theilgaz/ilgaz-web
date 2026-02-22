import { useState, useCallback } from 'react'

export function Base64Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [copied, setCopied] = useState(false)

  const convert = useCallback((value: string, currentMode: 'encode' | 'decode') => {
    if (!value) {
      setOutput('')
      return
    }
    try {
      if (currentMode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(value))))
      } else {
        setOutput(decodeURIComponent(escape(atob(value))))
      }
    } catch {
      setOutput('Hata!')
    }
  }, [])

  const handleInputChange = (value: string) => {
    setInput(value)
    convert(value, mode)
  }

  const handleModeChange = (newMode: 'encode' | 'decode') => {
    setMode(newMode)
    convert(input, newMode)
  }

  const clear = () => {
    setInput('')
    setOutput('')
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="base64-tool">
      <div className="base64-toggle">
        <button className={mode === 'encode' ? 'active' : ''} onClick={() => handleModeChange('encode')}>Encode</button>
        <button className={mode === 'decode' ? 'active' : ''} onClick={() => handleModeChange('decode')}>Decode</button>
      </div>
      <input
        value={input}
        onChange={e => handleInputChange(e.target.value)}
        placeholder="Metin gir..."
      />
      <div className="base64-output-wrap">
        <div className="base64-output">{output || '...'}</div>
        {output && output !== 'Hata!' && (
          <button className="copy-btn-small" onClick={copyOutput}>{copied ? '✓' : '⎘'}</button>
        )}
      </div>
      {input && <button className="base64-clear" onClick={clear}>Temizle</button>}
    </div>
  )
}
