import { useState } from 'react'

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

export function Base64Page() {
  // Encode state
  const [encodeInput, setEncodeInput] = useState('')
  const [encodeOutput, setEncodeOutput] = useState('')
  const [encodeCopied, setEncodeCopied] = useState(false)

  // Decode state
  const [decodeInput, setDecodeInput] = useState('')
  const [decodeOutput, setDecodeOutput] = useState('')
  const [decodeError, setDecodeError] = useState('')
  const [decodeCopied, setDecodeCopied] = useState(false)

  const handleEncode = (value: string) => {
    setEncodeInput(value)
    if (!value) {
      setEncodeOutput('')
      return
    }
    try {
      setEncodeOutput(btoa(unescape(encodeURIComponent(value))))
    } catch {
      setEncodeOutput('')
    }
  }

  const handleDecode = (value: string) => {
    setDecodeInput(value)
    if (!value) {
      setDecodeOutput('')
      setDecodeError('')
      return
    }
    try {
      setDecodeOutput(decodeURIComponent(escape(atob(value))))
      setDecodeError('')
    } catch {
      setDecodeOutput('')
      setDecodeError('Geçersiz Base64')
    }
  }

  const copyEncode = () => {
    navigator.clipboard.writeText(encodeOutput)
    setEncodeCopied(true)
    setTimeout(() => setEncodeCopied(false), 1500)
  }

  const copyDecode = () => {
    navigator.clipboard.writeText(decodeOutput)
    setDecodeCopied(true)
    setTimeout(() => setDecodeCopied(false), 1500)
  }

  return (
    <div className="base64-page">
      <h1>Base64</h1>
      <p className="lead">
        Metinleri Base64 formatına dönüştür veya çöz.
      </p>

      <div className="base64-page-content">
        {/* Decode Section */}
        <div className="base64-section">
          <div className="base64-section-header">
            <span className="base64-section-title">Decode</span>
            <span className="base64-section-subtitle">Base64 → Metin</span>
          </div>
          <div className="base64-section-body">
            <div className="base64-section-panel">
              <textarea
                value={decodeInput}
                onChange={e => handleDecode(e.target.value)}
                placeholder="Base64 kodunu buraya yaz..."
                spellCheck={false}
              />
            </div>
            <div className="base64-section-arrow">→</div>
            <div className="base64-section-panel">
              {decodeError ? (
                <div className="base64-section-error">{decodeError}</div>
              ) : (
                <div className="base64-section-output">
                  {decodeOutput || <span className="base64-placeholder">Çözülmüş metin...</span>}
                </div>
              )}
              {decodeOutput && !decodeError && (
                <button className={`base64-section-copy ${decodeCopied ? 'copied' : ''}`} onClick={copyDecode} title="Kopyala">
                  {decodeCopied ? <CheckIcon /> : <CopyIcon />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Encode Section */}
        <div className="base64-section">
          <div className="base64-section-header">
            <span className="base64-section-title">Encode</span>
            <span className="base64-section-subtitle">Metin → Base64</span>
          </div>
          <div className="base64-section-body">
            <div className="base64-section-panel">
              <textarea
                value={encodeInput}
                onChange={e => handleEncode(e.target.value)}
                placeholder="Metni buraya yaz..."
                spellCheck={false}
              />
            </div>
            <div className="base64-section-arrow">→</div>
            <div className="base64-section-panel">
              <div className="base64-section-output">
                {encodeOutput || <span className="base64-placeholder">Base64 çıktısı...</span>}
              </div>
              {encodeOutput && (
                <button className={`base64-section-copy ${encodeCopied ? 'copied' : ''}`} onClick={copyEncode} title="Kopyala">
                  {encodeCopied ? <CheckIcon /> : <CopyIcon />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
