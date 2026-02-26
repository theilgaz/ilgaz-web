import { useState } from 'react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

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

export function GradientGeneratorPage() {
  useDocumentTitle('gradyan')
  const [gradientColors, setGradientColors] = useState<string[]>(['#667eea', '#764ba2'])
  const [gradientInputs, setGradientInputs] = useState<string[]>(['#667EEA', '#764BA2'])
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear')
  const [gradientAngle, setGradientAngle] = useState(90)
  const [copiedGradient, setCopiedGradient] = useState(false)

  const gradientCSS = gradientType === 'linear'
    ? `linear-gradient(${gradientAngle}deg, ${gradientColors.join(', ')})`
    : `radial-gradient(circle, ${gradientColors.join(', ')})`

  const addGradientColor = () => {
    if (gradientColors.length < 6) {
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
      setGradientColors([...gradientColors, randomColor])
      setGradientInputs([...gradientInputs, randomColor.toUpperCase()])
    }
  }

  const removeGradientColor = (index: number) => {
    if (gradientColors.length > 2) {
      setGradientColors(gradientColors.filter((_, i) => i !== index))
      setGradientInputs(gradientInputs.filter((_, i) => i !== index))
    }
  }

  const updateGradientColor = (index: number, color: string) => {
    setGradientColors(gradientColors.map((c, i) => i === index ? color : c))
    setGradientInputs(gradientInputs.map((c, i) => i === index ? color.toUpperCase() : c))
  }

  const handleGradientInputChange = (index: number, value: string) => {
    let val = value.trim().toUpperCase()
    val = val.replace(/^#+/, '')
    val = '#' + val.replace(/[^0-9A-F]/gi, '')
    val = val.slice(0, 7)

    setGradientInputs(gradientInputs.map((c, i) => i === index ? val : c))

    if (/^#[0-9A-Fa-f]{6}$/i.test(val)) {
      setGradientColors(gradientColors.map((c, i) => i === index ? val.toLowerCase() : c))
    }
  }

  const copyGradientCSS = () => {
    navigator.clipboard.writeText(`background: ${gradientCSS};`)
    setCopiedGradient(true)
    setTimeout(() => setCopiedGradient(false), 1500)
  }

  const randomizeColors = () => {
    const count = gradientColors.length
    const newColors = Array.from({ length: count }, () =>
      '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    )
    setGradientColors(newColors)
    setGradientInputs(newColors.map(c => c.toUpperCase()))
  }

  return (
    <div className="gradient-page">
      <h1>Gradyan Oluşturucu</h1>
      <p className="lead">
        Çoklu renk ile linear veya radial gradyan oluştur.
      </p>

      <div className="gradient-section standalone">
        <div className="gradient-header">
          <button
            onClick={copyGradientCSS}
            className={`gradient-copy-btn ${copiedGradient ? 'copied' : ''}`}
          >
            {copiedGradient ? <><CheckIcon /> Kopyalandı</> : <><CopyIcon /> CSS Kopyala</>}
          </button>
        </div>

        <div className="gradient-preview large" style={{ background: gradientCSS }} />

        <div className="gradient-controls">
          <div className="gradient-type-toggle">
            <button
              className={gradientType === 'linear' ? 'active' : ''}
              onClick={() => setGradientType('linear')}
            >
              Linear
            </button>
            <button
              className={gradientType === 'radial' ? 'active' : ''}
              onClick={() => setGradientType('radial')}
            >
              Radial
            </button>
          </div>

          {gradientType === 'linear' && (
            <div className="gradient-angle">
              <span>Açı</span>
              <input
                type="range"
                min="0"
                max="360"
                value={gradientAngle}
                onChange={(e) => setGradientAngle(Number(e.target.value))}
              />
              <input
                type="number"
                min="0"
                max="360"
                value={gradientAngle}
                onChange={(e) => {
                  const val = Math.max(0, Math.min(360, Number(e.target.value) || 0))
                  setGradientAngle(val)
                }}
                className="gradient-angle-input"
              />
              <span>°</span>
            </div>
          )}

          <button onClick={randomizeColors} className="gradient-randomize">
            Rastgele Renkler
          </button>
        </div>

        <div className="gradient-colors">
          {gradientColors.map((color, i) => (
            <div key={i} className="gradient-color-item">
              <input
                type="color"
                value={color}
                onChange={(e) => updateGradientColor(i, e.target.value)}
                className="gradient-color-picker"
              />
              <input
                type="text"
                value={gradientInputs[i] || color.toUpperCase()}
                onChange={(e) => handleGradientInputChange(i, e.target.value)}
                className="gradient-color-input"
                maxLength={7}
              />
              {gradientColors.length > 2 && (
                <button
                  onClick={() => removeGradientColor(i)}
                  className="gradient-color-remove"
                  title="Kaldır"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {gradientColors.length < 6 && (
            <button onClick={addGradientColor} className="gradient-add-color">
              + Renk Ekle
            </button>
          )}
        </div>

        <div className="gradient-output">
          <code>{`background: ${gradientCSS};`}</code>
        </div>

        <div className="tool-hint">
          <span>Renk ekle/çıkar</span>
          <span className="separator">·</span>
          <span>Açı ve tip ayarla</span>
          <span className="separator">·</span>
          <kbd>CSS Kopyala</kbd>
        </div>
      </div>
    </div>
  )
}
