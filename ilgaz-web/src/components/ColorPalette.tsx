import { useState, useEffect, useCallback } from 'react'

export function ColorPalette() {
  const [colors, setColors] = useState<string[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const generate = useCallback(() => {
    const newColors = Array.from({ length: 5 }, () =>
      '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    )
    setColors(newColors)
    setCopiedIndex(null)
  }, [])

  useEffect(() => { generate() }, [generate])

  const copy = (color: string, index: number) => {
    navigator.clipboard.writeText(color)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 1500)
  }

  return (
    <div className="color-palette">
      {colors.map((color, i) => (
        <div
          key={i}
          className={`color-swatch ${copiedIndex === i ? 'copied' : ''}`}
          style={{ background: color }}
          onClick={() => copy(color, i)}
        >
          <span className="color-hex">{color}</span>
          {copiedIndex === i && <span className="color-copied">✓</span>}
        </div>
      ))}
      <button className="palette-refresh" onClick={generate}>↻</button>
    </div>
  )
}
