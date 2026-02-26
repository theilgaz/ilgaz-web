import { useState, useCallback, useEffect } from 'react'
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
        const s = 25 + Math.random() * 20
        const l = 75 + Math.random() * 15
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

    default:
      return Array.from({ length: 5 }, () =>
        '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
      )
  }
}

interface ColorState {
  hex: string
  locked: boolean
}

export function ColorPalettePage() {
  useDocumentTitle('renk paleti')
  const [colors, setColors] = useState<ColorState[]>(() =>
    generateHarmonyColors('random').map(hex => ({ hex, locked: false }))
  )
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [history, setHistory] = useState<ColorState[][]>([])
  const [harmony, setHarmony] = useState<HarmonyType>('random')

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

  return (
    <div className="palette-page">
      <h1>Renk Paleti</h1>
      <p className="lead">
        Renk kombinasyonları oluştur. Space tuşu ile yenile.
      </p>

      <div className="palette-page-content">
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

        <div className="palette-page-toolbar">
          <button onClick={generate} className="primary">
            Yenile
          </button>
          <button onClick={undo} disabled={history.length === 0}>
            Geri al
          </button>
          <div className="palette-page-spacer" />
          <button onClick={copyAll}>
            {copiedIndex === -1 ? '✓' : 'Tümünü kopyala'}
          </button>
          <button onClick={exportCSS}>
            {copiedIndex === -2 ? '✓' : 'CSS'}
          </button>
        </div>

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

        <div className="tool-hint">
          <kbd>Space</kbd> <span>Yenile</span>
          <span className="separator">·</span>
          <span>Kilitle ile renkleri koru</span>
        </div>

        <div className="palette-presets-section">
          <h3 className="palette-presets-title">Hazır Paletler</h3>
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
        </div>
      </div>
    </div>
  )
}
