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

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

function hexToHsl(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255
  const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm)
  let h = 0, s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break
      case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break
      case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 }
}

function hslToHex(h: number, s: number, l: number) {
  h = h % 360
  s = Math.max(0, Math.min(100, s)) / 100
  l = Math.max(0, Math.min(100, l)) / 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let r = 0, g = 0, b = 0
  if (h < 60) { r = c; g = x; b = 0 }
  else if (h < 120) { r = x; g = c; b = 0 }
  else if (h < 180) { r = 0; g = c; b = x }
  else if (h < 240) { r = 0; g = x; b = c }
  else if (h < 300) { r = x; g = 0; b = c }
  else { r = c; g = 0; b = x }

  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function getContrastColor(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)'
}

interface ShadeSettings {
  lightMax: number
  lightMin: number
  saturation: number
}

function generateShades(baseHex: string, settings: ShadeSettings): string[] {
  const hsl = hexToHsl(baseHex)
  const shades: string[] = []
  const baseL = hsl.l
  const centerIndex = 5

  const adjustedSat = Math.max(0, Math.min(100, hsl.s + settings.saturation))

  for (let i = 0; i <= 10; i++) {
    let lightness: number

    if (i < centerIndex) {
      const t = i / centerIndex
      lightness = settings.lightMax - (settings.lightMax - baseL) * t
    } else if (i === centerIndex) {
      lightness = baseL
    } else {
      const t = (i - centerIndex) / (10 - centerIndex)
      lightness = baseL - (baseL - settings.lightMin) * t
    }

    shades.push(hslToHex(hsl.h, adjustedSat, lightness))
  }

  return shades
}

export function ColorShadesPage() {
  useDocumentTitle('renk tonları')
  const [shadesBaseColor, setShadesBaseColor] = useState('#3b82f6')
  const [shadesHexInput, setShadesHexInput] = useState('#3B82F6')
  const [copiedShadeIndex, setCopiedShadeIndex] = useState<number | null>(null)
  const [shadeSettings, setShadeSettings] = useState<ShadeSettings>({
    lightMax: 95,
    lightMin: 5,
    saturation: 0
  })

  const shades = generateShades(shadesBaseColor, shadeSettings)

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setShadesBaseColor(val)
    setShadesHexInput(val.toUpperCase())
  }

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.trim().toUpperCase()
    val = val.replace(/^#+/, '')
    val = '#' + val
    val = val.slice(0, 1) + val.slice(1).replace(/[^0-9A-F]/gi, '')
    val = val.slice(0, 7)

    setShadesHexInput(val)

    if (/^#[0-9A-Fa-f]{6}$/i.test(val)) {
      setShadesBaseColor(val.toLowerCase())
    }
  }

  const copyShade = (shade: string, index: number) => {
    navigator.clipboard.writeText(shade)
    setCopiedShadeIndex(index)
    setTimeout(() => setCopiedShadeIndex(null), 1500)
  }

  const copyAllShades = () => {
    navigator.clipboard.writeText(shades.join('\n'))
    setCopiedShadeIndex(-1)
    setTimeout(() => setCopiedShadeIndex(null), 1500)
  }

  const exportShadesCSS = () => {
    const css = shades.map((s, i) => `--shade-${(i + 1) * 100}: ${s};`).join('\n')
    navigator.clipboard.writeText(`:root {\n  ${css.split('\n').join('\n  ')}\n}`)
    setCopiedShadeIndex(-2)
    setTimeout(() => setCopiedShadeIndex(null), 1500)
  }

  return (
    <div className="shades-page">
      <h1>Renk Tonları</h1>
      <p className="lead">
        Bir renkten açıktan koyuya ton skalası oluştur.
      </p>

      <div className="shades-section standalone">
        <div className="shades-header">
          <div className="shades-actions">
            <button onClick={copyAllShades}>
              {copiedShadeIndex === -1 ? <><CheckIcon /> Kopyalandı</> : <><CopyIcon /> Tümünü kopyala</>}
            </button>
            <button onClick={exportShadesCSS}>
              {copiedShadeIndex === -2 ? <><CheckIcon /> Kopyalandı</> : 'CSS'}
            </button>
          </div>
        </div>

        <div className="shades-picker">
          <div className="shades-picker-group">
            <span className="shades-picker-title">Temel Renk</span>
            <div className="shades-picker-inputs">
              <input
                type="color"
                value={shadesBaseColor}
                onChange={handleColorPickerChange}
                className="shades-color-input"
              />
              <input
                type="text"
                value={shadesHexInput}
                onChange={handleHexInputChange}
                placeholder="#3B82F6"
                className="shades-hex-input"
                maxLength={7}
              />
            </div>
          </div>

          <div className="shades-sliders">
            <label className="shades-slider">
              <span className="shades-slider-label">
                En Açık <span className="shades-slider-value">{shadeSettings.lightMax}%</span>
              </span>
              <input
                type="range"
                min="50"
                max="100"
                value={shadeSettings.lightMax}
                onChange={(e) => setShadeSettings(s => ({ ...s, lightMax: Number(e.target.value) }))}
              />
            </label>
            <label className="shades-slider">
              <span className="shades-slider-label">
                En Koyu <span className="shades-slider-value">{shadeSettings.lightMin}%</span>
              </span>
              <input
                type="range"
                min="0"
                max="50"
                value={shadeSettings.lightMin}
                onChange={(e) => setShadeSettings(s => ({ ...s, lightMin: Number(e.target.value) }))}
              />
            </label>
            <label className="shades-slider">
              <span className="shades-slider-label">
                Satürasyon <span className="shades-slider-value">{shadeSettings.saturation > 0 ? '+' : ''}{shadeSettings.saturation}</span>
              </span>
              <input
                type="range"
                min="-50"
                max="50"
                value={shadeSettings.saturation}
                onChange={(e) => setShadeSettings(s => ({ ...s, saturation: Number(e.target.value) }))}
              />
            </label>
          </div>
        </div>

        <div className="shades-grid">
          {shades.map((shade, i) => {
            const textColor = getContrastColor(shade)
            const isCenter = i === 5
            return (
              <div
                key={i}
                className={`shades-item ${copiedShadeIndex === i ? 'copied' : ''} ${isCenter ? 'center' : ''}`}
                style={{ background: shade, color: textColor }}
                onClick={() => copyShade(shade, i)}
                title="Tıkla ve kopyala"
              >
                <span className="shades-item-label">{(i + 1) * 100}</span>
                <span className="shades-item-hex">{shade.toUpperCase()}</span>
                {copiedShadeIndex === i && <span className="shades-item-copied"><CheckIcon /></span>}
              </div>
            )
          })}
        </div>

        <div className="tool-hint">
          <span>Tona tıkla</span>
          <span className="separator">→</span>
          <span>Kopyala</span>
        </div>
      </div>
    </div>
  )
}
