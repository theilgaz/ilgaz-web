import { useState, useCallback, useEffect } from 'react'

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

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 1 1 10 0v2h1zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3z"/>
    </svg>
  )
}

function UnlockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
      <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 1 1 10 0v2h1zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3z"/>
    </svg>
  )
}

function PasteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    </svg>
  )
}

// Preset palettes
const presetPalettes = {
  'Gün Batımı': ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'],
  'Okyanus': ['#0a3d62', '#3c6382', '#60a3bc', '#82ccdd', '#b8e994'],
  'Orman': ['#1e3c2f', '#2d5a3f', '#4a7c59', '#8cb369', '#d4e09b'],
  'Pastel Rüya': ['#ffeaa7', '#dfe6e9', '#fab1a0', '#81ecec', '#a29bfe'],
  'Neon Gece': ['#f368e0', '#ff9f43', '#ee5a24', '#0abde3', '#10ac84'],
  'Kahve': ['#4a3728', '#6f4e37', '#a67b5b', '#c4a77d', '#e8dcc4'],
  'Lavanta': ['#e8d5f2', '#d4b8e0', '#b794c6', '#9b6fa3', '#7d5181'],
  'Retro': ['#ff6f61', '#6b5b95', '#88b04b', '#f7cac9', '#92a8d1'],
  'Minimalist': ['#2d3436', '#636e72', '#b2bec3', '#dfe6e9', '#ffffff'],
  'Sıcak': ['#eb4d4b', '#f0932b', '#f9ca24', '#f6e58d', '#ffbe76'],
  'Soğuk': ['#30336b', '#6a89cc', '#82ccdd', '#b8e994', '#78e08f'],
  'Vintage': ['#d5aca9', '#c4b7a6', '#8e8c84', '#59514a', '#3d3835'],
}

// Harmony types
type HarmonyType = 'random' | 'analogous' | 'complementary' | 'triadic' | 'pastel' | 'monochrome'

const harmonyModes: { id: HarmonyType; label: string; desc: string }[] = [
  { id: 'random', label: 'Rastgele', desc: 'Tamamen rastgele renkler' },
  { id: 'pastel', label: 'Pastel', desc: 'Yumuşak, soluk tonlar' },
  { id: 'analogous', label: 'Analog', desc: 'Yan yana renkler' },
  { id: 'complementary', label: 'Tamamlayıcı', desc: 'Zıt renkler' },
  { id: 'triadic', label: 'Üçlü', desc: '120° arayla renkler' },
  { id: 'monochrome', label: 'Tek Ton', desc: 'Aynı rengin tonları' },
]

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

function generateHarmonyColors(harmony: HarmonyType): string[] {
  const baseHue = Math.random() * 360

  switch (harmony) {
    case 'pastel':
      return Array.from({ length: 5 }, () => {
        const h = Math.random() * 360
        const s = 25 + Math.random() * 20 // 25-45%
        const l = 75 + Math.random() * 15 // 75-90%
        return hslToHex(h, s, l)
      })

    case 'analogous':
      return Array.from({ length: 5 }, (_, i) => {
        const h = baseHue + (i - 2) * 25
        const s = 50 + Math.random() * 30
        const l = 45 + Math.random() * 25
        return hslToHex(h, s, l)
      })

    case 'complementary':
      const compHues = [baseHue, baseHue + 180]
      return Array.from({ length: 5 }, (_, i) => {
        const h = compHues[i % 2] + (Math.random() - 0.5) * 30
        const s = 50 + Math.random() * 30
        const l = 35 + i * 10
        return hslToHex(h, s, l)
      })

    case 'triadic':
      const triadHues = [baseHue, baseHue + 120, baseHue + 240]
      return Array.from({ length: 5 }, (_, i) => {
        const h = triadHues[i % 3] + (Math.random() - 0.5) * 20
        const s = 50 + Math.random() * 30
        const l = 40 + Math.random() * 30
        return hslToHex(h, s, l)
      })

    case 'monochrome':
      return Array.from({ length: 5 }, (_, i) => {
        const s = 30 + Math.random() * 40
        const l = 20 + i * 15
        return hslToHex(baseHue, s, l)
      })

    default: // random
      return Array.from({ length: 5 }, () =>
        '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
      )
  }
}

interface ColorState {
  hex: string
  locked: boolean
}

interface ShadeSettings {
  lightMax: number  // Lightest shade (0-100)
  lightMin: number  // Darkest shade (0-100)
  saturation: number // Saturation adjustment (-50 to +50)
}

function generateShades(baseHex: string, settings: ShadeSettings): string[] {
  const hsl = hexToHsl(baseHex)
  const shades: string[] = []
  const baseL = hsl.l
  const centerIndex = 5 // Middle position (index 5 of 0-10)

  // Apply saturation adjustment
  const adjustedSat = Math.max(0, Math.min(100, hsl.s + settings.saturation))

  // Generate 11 shades with the input color at center
  for (let i = 0; i <= 10; i++) {
    let lightness: number

    if (i < centerIndex) {
      // Lighter shades: interpolate from lightMax to baseL
      const t = i / centerIndex
      lightness = settings.lightMax - (settings.lightMax - baseL) * t
    } else if (i === centerIndex) {
      // Center: use the exact input color lightness
      lightness = baseL
    } else {
      // Darker shades: interpolate from baseL to lightMin
      const t = (i - centerIndex) / (10 - centerIndex)
      lightness = baseL - (baseL - settings.lightMin) * t
    }

    shades.push(hslToHex(hsl.h, adjustedSat, lightness))
  }

  return shades
}

export function ColorPalettePage() {
  const [colors, setColors] = useState<ColorState[]>(() =>
    generateHarmonyColors('random').map(hex => ({ hex, locked: false }))
  )
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [history, setHistory] = useState<ColorState[][]>([])
  const [harmony, setHarmony] = useState<HarmonyType>('random')
  const [showPresets, setShowPresets] = useState(false)
  const [shadesBaseColor, setShadesBaseColor] = useState('#3b82f6')
  const [shadesHexInput, setShadesHexInput] = useState('#3B82F6')
  const [copiedShadeIndex, setCopiedShadeIndex] = useState<number | null>(null)
  const [hasEverCopiedShade, setHasEverCopiedShade] = useState(false)
  const [shadeSettings, setShadeSettings] = useState<ShadeSettings>({
    lightMax: 95,
    lightMin: 5,
    saturation: 0
  })

  // Gradient generator state
  const [gradientColors, setGradientColors] = useState<string[]>(['#667eea', '#764ba2'])
  const [gradientInputs, setGradientInputs] = useState<string[]>(['#667EEA', '#764BA2'])
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear')
  const [gradientAngle, setGradientAngle] = useState(90)
  const [copiedGradient, setCopiedGradient] = useState(false)

  const shades = generateShades(shadesBaseColor, shadeSettings)

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

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setShadesBaseColor(val)
    setShadesHexInput(val.toUpperCase())
  }

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.trim().toUpperCase()

    // Remove # if present, then add it back (handles paste with or without #)
    val = val.replace(/^#+/, '')
    val = '#' + val

    // Only keep valid hex characters
    val = val.slice(0, 1) + val.slice(1).replace(/[^0-9A-F]/gi, '')

    // Limit to 7 characters (#XXXXXX)
    val = val.slice(0, 7)

    setShadesHexInput(val)

    // Update color when complete valid hex
    if (/^#[0-9A-Fa-f]{6}$/i.test(val)) {
      setShadesBaseColor(val.toLowerCase())
    }
  }

  const generate = useCallback(() => {
    setHistory(h => [...h.slice(-9), colors])
    const newColors = generateHarmonyColors(harmony)
    setColors(prev => prev.map((c, i) =>
      c.locked ? c : { hex: newColors[i], locked: false }
    ))
    setCopiedIndex(null)
  }, [colors, harmony])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault()
        generate()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [generate])

  const applyPreset = (name: string) => {
    const palette = presetPalettes[name as keyof typeof presetPalettes]
    if (palette) {
      setHistory(h => [...h.slice(-9), colors])
      setColors(palette.map(hex => ({ hex, locked: false })))
      setShowPresets(false)
    }
  }

  const undo = () => {
    if (history.length > 0) {
      setColors(history[history.length - 1])
      setHistory(h => h.slice(0, -1))
    }
  }

  const toggleLock = (index: number) => {
    setColors(prev => prev.map((c, i) =>
      i === index ? { ...c, locked: !c.locked } : c
    ))
  }

  const copy = (color: string, index: number) => {
    navigator.clipboard.writeText(color)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 1500)
  }

  const copyAll = () => {
    const allColors = colors.map(c => c.hex).join('\n')
    navigator.clipboard.writeText(allColors)
    setCopiedIndex(-1)
    setTimeout(() => setCopiedIndex(null), 1500)
  }

  const exportCSS = () => {
    const css = colors.map((c, i) => `--color-${i + 1}: ${c.hex};`).join('\n')
    navigator.clipboard.writeText(`:root {\n  ${css.split('\n').join('\n  ')}\n}`)
    setCopiedIndex(-2)
    setTimeout(() => setCopiedIndex(null), 1500)
  }

  const copyShade = (shade: string, index: number) => {
    navigator.clipboard.writeText(shade)
    setCopiedShadeIndex(index)
    setHasEverCopiedShade(true)
    setTimeout(() => setCopiedShadeIndex(null), 1500)
  }

  const pasteToShades = async () => {
    try {
      const text = await navigator.clipboard.readText()
      let val = text.trim().toUpperCase()
      val = val.replace(/^#+/, '')
      val = '#' + val.replace(/[^0-9A-F]/gi, '').slice(0, 6)

      if (/^#[0-9A-Fa-f]{6}$/i.test(val)) {
        setShadesBaseColor(val.toLowerCase())
        setShadesHexInput(val)
      }
    } catch {
      // Clipboard access denied
    }
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
    <div className="palette-page">
      <h1>Renk Paleti</h1>
      <p className="lead">
        Renk kombinasyonları oluştur. Space tuşu ile yenile.
      </p>

      <div className="palette-page-content">
        {/* Harmony modes */}
        <div className="palette-harmony-modes">
          {harmonyModes.map(mode => (
            <button
              key={mode.id}
              className={`palette-harmony-btn ${harmony === mode.id ? 'active' : ''}`}
              onClick={() => setHarmony(mode.id)}
              title={mode.desc}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="palette-page-toolbar">
          <button onClick={generate} className="primary">
            Yenile
          </button>
          <button onClick={undo} disabled={history.length === 0}>
            Geri al
          </button>
          <button onClick={() => setShowPresets(!showPresets)} className={showPresets ? 'active' : ''}>
            Hazır Paletler
          </button>
          <div className="palette-page-spacer" />
          <button onClick={copyAll}>
            {copiedIndex === -1 ? '✓' : 'Tümünü kopyala'}
          </button>
          <button onClick={exportCSS}>
            {copiedIndex === -2 ? '✓' : 'CSS'}
          </button>
        </div>

        {/* Preset palettes */}
        {showPresets && (
          <div className="palette-presets">
            {Object.entries(presetPalettes).map(([name, palette]) => (
              <button
                key={name}
                className="palette-preset"
                onClick={() => applyPreset(name)}
              >
                <div className="palette-preset-colors">
                  {palette.map((color, i) => (
                    <div key={i} style={{ background: color }} />
                  ))}
                </div>
                <span className="palette-preset-name">{name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Colors */}
        <div className="palette-page-colors">
          {colors.map((color, i) => {
            const rgb = hexToRgb(color.hex)
            const hsl = hexToHsl(color.hex)
            const textColor = getContrastColor(color.hex)

            return (
              <div
                key={i}
                className={`palette-page-color ${color.locked ? 'locked' : ''}`}
                style={{ background: color.hex, color: textColor }}
              >
                <button
                  className="palette-color-lock"
                  onClick={() => toggleLock(i)}
                  title={color.locked ? 'Kilidi aç' : 'Kilitle'}
                >
                  {color.locked ? <LockIcon /> : <UnlockIcon />}
                </button>

                <div className="palette-color-info">
                  <span className="palette-color-hex">{color.hex.toUpperCase()}</span>
                  <span className="palette-color-rgb">RGB({rgb.r}, {rgb.g}, {rgb.b})</span>
                  <span className="palette-color-hsl">HSL({Math.round(hsl.h)}°, {Math.round(hsl.s)}%, {Math.round(hsl.l)}%)</span>
                </div>

                <button
                  className={`palette-color-copy ${copiedIndex === i ? 'copied' : ''}`}
                  onClick={() => copy(color.hex, i)}
                  title="Kopyala"
                >
                  {copiedIndex === i ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
            )
          })}
        </div>

        <div className="palette-page-hint">
          <kbd>Space</kbd> Yenile &nbsp;·&nbsp; Kilitle ile renkleri koru
        </div>
      </div>

      {/* Color Shades Generator */}
      <div className="shades-section">
        <div className="shades-header">
          <div className="shades-title-group">
            <h2 className="shades-title">Renk Tonları</h2>
            <span className="shades-subtitle">Bir renkten açıktan koyuya tonlar oluştur</span>
          </div>
          <div className="shades-actions">
            <button onClick={copyAllShades}>
              {copiedShadeIndex === -1 ? '✓' : 'Tümünü kopyala'}
            </button>
            <button onClick={exportShadesCSS}>
              {copiedShadeIndex === -2 ? '✓' : 'CSS'}
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
              {hasEverCopiedShade && (
                <button
                  onClick={pasteToShades}
                  className="shades-paste-btn"
                  title="Yapıştır"
                >
                  <PasteIcon />
                </button>
              )}
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
      </div>

      {/* Gradient Generator */}
      <div className="gradient-section">
        <div className="gradient-header">
          <div className="gradient-title-group">
            <h2 className="gradient-title">Gradyan Oluşturucu</h2>
            <span className="gradient-subtitle">Çoklu renk ile linear veya radial gradyan</span>
          </div>
          <button
            onClick={copyGradientCSS}
            className={`gradient-copy-btn ${copiedGradient ? 'copied' : ''}`}
          >
            {copiedGradient ? <><CheckIcon /> Kopyalandı</> : <><CopyIcon /> CSS Kopyala</>}
          </button>
        </div>

        <div className="gradient-preview" style={{ background: gradientCSS }} />

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
      </div>
    </div>
  )
}
