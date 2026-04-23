import { useState } from 'react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

// ─── Color conversion utilities ───

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '')
  // Support 3-char shorthand: #abc -> #aabbcc
  const expanded = clean.length === 3
    ? clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2]
    : clean
  const m = expanded.match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
  if (!m) return null
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)]
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l * 100]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max - min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v] }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ]
}

function srgbToLinear(c: number): number {
  c /= 255
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function linearToSrgb(c: number): number {
  c = clamp(c, 0, 1)
  return Math.round((c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055) * 255)
}

function rgbToOklch(r: number, g: number, b: number): [number, number, number] {
  const lr = srgbToLinear(r), lg = srgbToLinear(g), lb = srgbToLinear(b)
  const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb
  const l1 = Math.cbrt(l_), m1 = Math.cbrt(m_), s1 = Math.cbrt(s_)
  const L = 0.2104542553 * l1 + 0.7936177850 * m1 - 0.0040720468 * s1
  const a = 1.9779984951 * l1 - 2.4285922050 * m1 + 0.4505937099 * s1
  const bv = 0.0259040371 * l1 + 0.7827717662 * m1 - 0.8086757660 * s1
  const C = Math.sqrt(a * a + bv * bv)
  let H = Math.atan2(bv, a) * 180 / Math.PI
  if (H < 0) H += 360
  return [parseFloat((L * 100).toFixed(2)), parseFloat(C.toFixed(4)), parseFloat(H.toFixed(2))]
}

function oklchToRgb(L: number, C: number, H: number): [number, number, number] {
  L /= 100
  const hRad = H * Math.PI / 180
  const a = C * Math.cos(hRad)
  const b = C * Math.sin(hRad)
  const l1 = L + 0.3963377774 * a + 0.2158037573 * b
  const m1 = L - 0.1055613458 * a - 0.0638541728 * b
  const s1 = L - 0.0894841775 * a - 1.2914855480 * b
  const l_ = l1 * l1 * l1, m_ = m1 * m1 * m1, s_ = s1 * s1 * s1
  const lr = +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_
  const lg = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_
  const lb = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_
  return [linearToSrgb(lr), linearToSrgb(lg), linearToSrgb(lb)]
}

function rgbToCmyk(r: number, g: number, b: number): [number, number, number, number] {
  r /= 255; g /= 255; b /= 255
  const k = 1 - Math.max(r, g, b)
  if (k === 1) return [0, 0, 0, 100]
  return [
    Math.round(((1 - r - k) / (1 - k)) * 100),
    Math.round(((1 - g - k) / (1 - k)) * 100),
    Math.round(((1 - b - k) / (1 - k)) * 100),
    Math.round(k * 100),
  ]
}

function rgbToHwb(r: number, g: number, b: number): [number, number, number] {
  const [h] = rgbToHsl(r, g, b)
  const w = Math.min(r, g, b) / 255 * 100
  const bl = (1 - Math.max(r, g, b) / 255) * 100
  return [h, Math.round(w), Math.round(bl)]
}

function luminance(r: number, g: number, b: number): number {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b)
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

// ─── Auto-detect input format and parse ───

type DetectedFormat = 'hex' | 'rgb' | 'hsl' | 'oklch' | null

function detectAndParse(input: string): { format: DetectedFormat; rgb: [number, number, number] | null } {
  const trimmed = input.trim()
  if (!trimmed) return { format: null, rgb: null }

  // HEX: #abc, #aabbcc, abc, aabbcc
  if (/^#?[0-9a-f]{3}$/i.test(trimmed) || /^#?[0-9a-f]{6}$/i.test(trimmed)) {
    const hex = trimmed.startsWith('#') ? trimmed : '#' + trimmed
    return { format: 'hex', rgb: hexToRgb(hex) }
  }

  // rgb(r, g, b) or r, g, b (3 numbers 0-255)
  const rgbFn = trimmed.match(/^rgba?\(\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})/i)
  if (rgbFn) {
    const vals: [number, number, number] = [parseInt(rgbFn[1]), parseInt(rgbFn[2]), parseInt(rgbFn[3])]
    if (vals.every(v => v >= 0 && v <= 255)) return { format: 'rgb', rgb: vals }
  }

  // hsl(h, s%, l%)
  const hslFn = trimmed.match(/^hsla?\(\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})%?\s*[,\s]\s*(\d{1,3})%?/i)
  if (hslFn) {
    const h = parseInt(hslFn[1]), s = parseInt(hslFn[2]), l = parseInt(hslFn[3])
    if (h <= 360 && s <= 100 && l <= 100) return { format: 'hsl', rgb: hslToRgb(h, s, l) }
  }

  // oklch(L% C H)
  const oklchFn = trimmed.match(/^oklch\(\s*([\d.]+)%?\s+(\s*[\d.]+)\s+([\d.]+)/i)
  if (oklchFn) {
    const L = parseFloat(oklchFn[1]), C = parseFloat(oklchFn[2]), H = parseFloat(oklchFn[3])
    if (L <= 100 && C <= 0.5 && H <= 360) return { format: 'oklch', rgb: oklchToRgb(L, C, H) }
  }

  // Bare 3 numbers separated by comma or space: "162, 58, 38" or "162 58 38"
  const bare = trimmed.match(/^(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})$/)
  if (bare) {
    const vals: [number, number, number] = [parseInt(bare[1]), parseInt(bare[2]), parseInt(bare[3])]
    if (vals.every(v => v >= 0 && v <= 255)) return { format: 'rgb', rgb: vals }
  }

  return { format: null, rgb: null }
}

const FORMAT_LABELS: Record<string, string> = {
  hex: 'HEX',
  rgb: 'RGB',
  hsl: 'HSL',
  oklch: 'OKLCH',
}

const PLACEHOLDERS = [
  '#a23a26',
  'rgb(162, 58, 38)',
  'hsl(8, 62%, 39%)',
  'oklch(43.5% 0.1418 26.5)',
  '162, 58, 38',
]

export function ColorConverterPage() {
  useDocumentTitle('renk dönüştürücü')

  const [input, setInput] = useState('#a23a26')
  const [copied, setCopied] = useState<string | null>(null)
  const [pickerColor, setPickerColor] = useState('#a23a26')

  const { format, rgb } = detectAndParse(input)
  const isValid = rgb !== null

  const [r, g, b] = rgb ?? [0, 0, 0]
  const hex = rgbToHex(r, g, b)
  const hsl = rgbToHsl(r, g, b)
  const oklch = rgbToOklch(r, g, b)
  const cmyk = rgbToCmyk(r, g, b)
  const hwb = rgbToHwb(r, g, b)
  const lum = luminance(r, g, b)
  const contrastWhite = contrastRatio(lum, 1)
  const contrastBlack = contrastRatio(lum, 0)
  const textColor = lum > 0.4 ? '#1a1714' : '#ffffff'

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setPickerColor(val)
    setInput(val)
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 1500)
  }

  const formatOutputs = isValid ? [
    { label: 'HEX', value: hex.toUpperCase() },
    { label: 'RGB', value: `rgb(${r}, ${g}, ${b})` },
    { label: 'HSL', value: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)` },
    { label: 'OKLCH', value: `oklch(${oklch[0]}% ${oklch[1]} ${oklch[2]})` },
    { label: 'CMYK', value: `cmyk(${cmyk[0]}%, ${cmyk[1]}%, ${cmyk[2]}%, ${cmyk[3]}%)` },
    { label: 'HWB', value: `hwb(${hwb[0]} ${hwb[1]}% ${hwb[2]}%)` },
  ] : []

  return (
    <div className="cc-page">
      <div className="section-head">
        <div className="idx">&sect; Tasarım</div>
        <div>
          <h2>Renk <em>Dönüştürücü</em></h2>
          <p className="lead">Bir renk gir, tüm formatları gör.</p>
        </div>
      </div>

      {/* Single input + picker */}
      <div className="cc-input-bar">
        <input
          type="color"
          value={isValid ? hex : pickerColor}
          onChange={handlePickerChange}
          className="cc-native-picker"
        />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="cc-main-input"
          placeholder="#a23a26, rgb(162,58,38), hsl(8,62%,39%) ..."
          spellCheck={false}
          autoFocus
        />
        {format && (
          <span className="cc-detected-badge">{FORMAT_LABELS[format]}</span>
        )}
      </div>

      {/* Hint */}
      <div className="cc-format-hints">
        {PLACEHOLDERS.map((p) => (
          <button key={p} className="cc-hint-chip" onClick={() => setInput(p)}>{p}</button>
        ))}
      </div>

      {isValid ? (
        <>
          {/* Preview */}
          <div className="cc-preview" style={{ background: hex }}>
            <span className="cc-preview-hex" style={{ color: textColor }}>{hex.toUpperCase()}</span>
          </div>

          {/* All format outputs */}
          <div className="cc-outputs">
            <div className="cc-outputs-title">Tüm Formatlar</div>
            <div className="cc-outputs-grid">
              {formatOutputs.map(({ label, value }) => (
                <button
                  key={label}
                  className={`cc-output-card ${copied === label ? 'copied' : ''}`}
                  onClick={() => copyToClipboard(value, label)}
                >
                  <span className="cc-output-label">{label}</span>
                  <span className="cc-output-value">{value}</span>
                  <span className="cc-output-copy">{copied === label ? '✓' : 'Kopyala'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contrast checker */}
          <div className="cc-contrast">
            <div className="cc-outputs-title">Kontrast Oranları</div>
            <div className="cc-contrast-grid">
              <div className="cc-contrast-card" style={{ background: hex, color: '#ffffff' }}>
                <span className="cc-contrast-sample">Beyaz Metin</span>
                <span className="cc-contrast-ratio">{contrastWhite.toFixed(2)}:1</span>
                <span className={`cc-contrast-badge ${contrastWhite >= 7 ? 'aaa' : contrastWhite >= 4.5 ? 'aa' : contrastWhite >= 3 ? 'aa-large' : 'fail'}`}>
                  {contrastWhite >= 7 ? 'AAA' : contrastWhite >= 4.5 ? 'AA' : contrastWhite >= 3 ? 'AA Large' : 'Yetersiz'}
                </span>
              </div>
              <div className="cc-contrast-card" style={{ background: hex, color: '#000000' }}>
                <span className="cc-contrast-sample">Siyah Metin</span>
                <span className="cc-contrast-ratio">{contrastBlack.toFixed(2)}:1</span>
                <span className={`cc-contrast-badge ${contrastBlack >= 7 ? 'aaa' : contrastBlack >= 4.5 ? 'aa' : contrastBlack >= 3 ? 'aa-large' : 'fail'}`}>
                  {contrastBlack >= 7 ? 'AAA' : contrastBlack >= 4.5 ? 'AA' : contrastBlack >= 3 ? 'AA Large' : 'Yetersiz'}
                </span>
              </div>
            </div>
          </div>
        </>
      ) : input.trim() ? (
        <div className="cc-empty">
          Renk formatı tanınamadı. HEX, RGB, HSL veya OKLCH formatında gir.
        </div>
      ) : null}
    </div>
  )
}
