import { useState, useRef, useCallback } from 'react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

type GridSize = 8 | 16 | 32 | 64 | 128

// Generate 8-pointed Seljuk star (two overlapping squares)
function generateSeljukStar(size: number): { pixels: string[], colors: Record<string, string> } {
  const pixels: string[] = []
  const cx = size / 2
  const cy = size / 2

  // 8-pointed star = two overlapping squares (one straight, one rotated 45°)
  const squareSize = size * 0.30
  const diamondSize = size * 0.42
  const lineWidth = Math.max(2, size * 0.04)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx
      const dy = y - cy

      // Check if inside straight square
      const inSquare = Math.abs(dx) <= squareSize && Math.abs(dy) <= squareSize
      // Check if inside rotated square (diamond)
      const diamondDist = Math.abs(dx) + Math.abs(dy)
      const inDiamond = diamondDist <= diamondSize

      const insideStar = inSquare || inDiamond

      // Distance to square edges (perpendicular distance)
      const distToSquareEdgeX = Math.abs(Math.abs(dx) - squareSize)
      const distToSquareEdgeY = Math.abs(Math.abs(dy) - squareSize)
      const nearSquareEdge = (distToSquareEdgeX < lineWidth && Math.abs(dy) <= squareSize) ||
                             (distToSquareEdgeY < lineWidth && Math.abs(dx) <= squareSize)

      // Distance to diamond edge (perpendicular distance = dist / sqrt(2))
      const distToDiamondEdge = Math.abs(diamondDist - diamondSize) / Math.sqrt(2)
      const nearDiamondEdge = distToDiamondEdge < lineWidth && inDiamond

      // Draw edge with equal thickness
      const onOuterEdge = (nearSquareEdge && (!inDiamond || nearDiamondEdge)) ||
                          (nearDiamondEdge && (!inSquare || nearSquareEdge))

      if (insideStar) {
        if (onOuterEdge) {
          pixels.push('g') // outer outline
        } else {
          pixels.push('c') // fill
        }
      } else {
        pixels.push('_')
      }
    }
  }
  return {
    pixels,
    colors: { '_': '#f5e6d0', 'g': '#1e5631', 'c': '#fdf6e3' }
  }
}

function generateKonyaHS(size: number): { pixels: string[], colors: Record<string, string> } {
  const pixels: string[] = []
  const cx = size / 2
  const cy = size / 2

  // 8-pointed star (same as Seljuk star)
  const squareSize = size * 0.30
  const diamondSize = size * 0.42
  const lineWidth = Math.max(2, size * 0.04)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx
      const dy = y - cy

      const inSquare = Math.abs(dx) <= squareSize && Math.abs(dy) <= squareSize
      const diamondDist = Math.abs(dx) + Math.abs(dy)
      const inDiamond = diamondDist <= diamondSize

      const insideStar = inSquare || inDiamond

      const distToSquareEdgeX = Math.abs(Math.abs(dx) - squareSize)
      const distToSquareEdgeY = Math.abs(Math.abs(dy) - squareSize)
      const nearSquareEdge = (distToSquareEdgeX < lineWidth && Math.abs(dy) <= squareSize) ||
                             (distToSquareEdgeY < lineWidth && Math.abs(dx) <= squareSize)

      const distToDiamondEdge = Math.abs(diamondDist - diamondSize) / Math.sqrt(2)
      const nearDiamondEdge = distToDiamondEdge < lineWidth && inDiamond

      const onOuterEdge = (nearSquareEdge && (!inDiamond || nearDiamondEdge)) ||
                          (nearDiamondEdge && (!inSquare || nearSquareEdge))

      // ">_" prompt
      const promptThickness = Math.max(1, size * 0.02)

      // ">"
      const gtLeftX = cx - size * 0.12
      const gtRightX = cx + size * 0.02
      const gtTopY = cy - size * 0.10
      const gtMidY = cy
      const gtBottomY = cy + size * 0.10

      const inGtTop = y >= gtTopY && y <= gtMidY &&
                      Math.abs(x - (gtLeftX + (gtRightX - gtLeftX) * (y - gtTopY) / (gtMidY - gtTopY))) < promptThickness

      const inGtBottom = y >= gtMidY && y <= gtBottomY &&
                         Math.abs(x - (gtRightX - (gtRightX - gtLeftX) * (y - gtMidY) / (gtBottomY - gtMidY))) < promptThickness

      // "_"
      const underscoreX = cx + size * 0.05
      const underscoreWidth = size * 0.12
      const underscoreY = cy + size * 0.07
      const underscoreHeight = Math.max(1, size * 0.02)
      const inUnderscore = x >= underscoreX && x <= underscoreX + underscoreWidth &&
                           y >= underscoreY && y <= underscoreY + underscoreHeight

      const inPrompt = inGtTop || inGtBottom || inUnderscore

      if (insideStar) {
        if (onOuterEdge || inPrompt) {
          pixels.push('b')
        } else {
          pixels.push('w')
        }
      } else {
        pixels.push('_')
      }
    }
  }
  return {
    pixels,
    colors: { '_': '#ffffff', 'b': '#1a1a1a', 'w': '#f8f9fa' }
  }
}

// Generate example art at runtime (32x32 for performance)
const generatedExamples = [
  { name: 'Selçuklu Yıldızı', generator: generateSeljukStar },
  { name: 'Konya HS', generator: generateKonyaHS },
]

const exampleArt = generatedExamples.map(({ name, generator }) => {
  const { pixels, colors } = generator(32)
  return { name, size: 32, pixels, colors }
})

// Color palette with base colors and their shades (light → dark)
const colorPalette = [
  { name: 'Gri', shades: ['#f8f9fa', '#e9ecef', '#adb5bd', '#6c757d', '#343a40', '#212529'] },
  { name: 'Kırmızı', shades: ['#ffccd5', '#ff8fa3', '#ff4d6d', '#c9184a', '#a4133c', '#590d22'] },
  { name: 'Turuncu', shades: ['#ffe5d9', '#ffcdb2', '#ffb4a2', '#e5989b', '#b5838d', '#6d6875'] },
  { name: 'Sarı', shades: ['#fff3b0', '#ffe66d', '#ffd60a', '#ffc300', '#e6a800', '#997000'] },
  { name: 'Yeşil', shades: ['#d8f3dc', '#95d5b2', '#52b788', '#40916c', '#2d6a4f', '#1b4332'] },
  { name: 'Mavi', shades: ['#caf0f8', '#90e0ef', '#00b4d8', '#0077b6', '#023e8a', '#03045e'] },
  { name: 'Mor', shades: ['#e2d9f3', '#c8b6ff', '#9d4edd', '#7b2cbf', '#5a189a', '#3c096c'] },
  { name: 'Pembe', shades: ['#ffcbf2', '#f3c4fb', '#e0aaff', '#c77dff', '#9d4edd', '#7b2cbf'] },
]

export function PixelArtPage() {
  useDocumentTitle('pixel art')
  const [gridSize, setGridSize] = useState<GridSize>(32)
  const [grid, setGrid] = useState(() => Array(32 * 32).fill('#ffffff'))
  const [history, setHistory] = useState<string[][]>([])
  const [color, setColor] = useState('#000000')
  const [hexInput, setHexInput] = useState('#000000')
  const [isDrawing, setIsDrawing] = useState(false)
  const [recentColors, setRecentColors] = useState<string[]>([])
  const [templateColors, setTemplateColors] = useState<string[]>([])
  const [templateName, setTemplateName] = useState<string>('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const saveHistory = useCallback(() => {
    setHistory(h => [...h.slice(-29), [...grid]])
  }, [grid])

  const paint = useCallback((i: number) => {
    setGrid(prev => {
      const newGrid = [...prev]
      newGrid[i] = color
      return newGrid
    })
  }, [color])

  const handleMouseDown = (i: number) => {
    saveHistory()
    setIsDrawing(true)
    paint(i)
    if (!recentColors.includes(color)) {
      setRecentColors(prev => [color, ...prev.slice(0, 7)])
    }
  }

  const undo = () => {
    if (history.length > 0) {
      setGrid(history[history.length - 1])
      setHistory(h => h.slice(0, -1))
    }
  }

  const clear = () => {
    saveHistory()
    setGrid(Array(gridSize * gridSize).fill('#ffffff'))
  }

  const changeGridSize = (newSize: GridSize) => {
    setGridSize(newSize)
    setGrid(Array(newSize * newSize).fill('#ffffff'))
    setHistory([])
  }

  const setColorWithSync = (newColor: string) => {
    setColor(newColor)
    setHexInput(newColor.toUpperCase())
  }

  const handleHexInputChange = (value: string) => {
    let val = value.trim().toUpperCase()
    val = val.replace(/^#+/, '')
    val = '#' + val.replace(/[^0-9A-F]/gi, '')
    val = val.slice(0, 7)
    setHexInput(val)
    if (/^#[0-9A-Fa-f]{6}$/i.test(val)) {
      setColor(val.toLowerCase())
    }
  }

  const download = (scale: number = 1) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const pixelSize = 8 * scale
    canvas.width = gridSize * pixelSize
    canvas.height = gridSize * pixelSize

    grid.forEach((c, i) => {
      const x = (i % gridSize) * pixelSize
      const y = Math.floor(i / gridSize) * pixelSize
      ctx.fillStyle = c
      ctx.fillRect(x, y, pixelSize, pixelSize)
    })

    const link = document.createElement('a')
    link.download = `pixel-art-${gridSize}x${gridSize}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const fill = (startIndex: number) => {
    const targetColor = grid[startIndex]
    if (targetColor === color) return

    saveHistory()
    const newGrid = [...grid]
    const stack = [startIndex]
    const visited = new Set<number>()

    while (stack.length > 0) {
      const index = stack.pop()!
      if (visited.has(index)) continue
      if (newGrid[index] !== targetColor) continue

      visited.add(index)
      newGrid[index] = color

      const row = Math.floor(index / gridSize)
      const col = index % gridSize

      if (col > 0) stack.push(index - 1)
      if (col < gridSize - 1) stack.push(index + 1)
      if (row > 0) stack.push(index - gridSize)
      if (row < gridSize - 1) stack.push(index + gridSize)
    }

    setGrid(newGrid)
  }

  const loadTemplate = (template: typeof exampleArt[0]) => {
    saveHistory()

    // Scale template to current grid size
    const scale = gridSize / template.size
    const newGrid: string[] = []

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        // Find corresponding pixel in template
        const templateX = Math.floor(x / scale)
        const templateY = Math.floor(y / scale)
        const templateIndex = templateY * template.size + templateX
        const pixelKey = template.pixels[templateIndex]
        const pixelColor = template.colors[pixelKey as keyof typeof template.colors] || '#ffffff'
        newGrid.push(pixelColor)
      }
    }

    setGrid(newGrid)

    // Extract unique colors from template
    const colors = Object.values(template.colors)
    setTemplateColors(colors)
    setTemplateName(template.name)
  }

  const clearTemplateColors = () => {
    setTemplateColors([])
    setTemplateName('')
  }

  return (
    <div className="pixel-page">
      <h1>Pixel Art</h1>
      <p className="lead">
        Piksel piksel çiz, sanatını indir.
      </p>

      <div className="pixel-page-content">
        <div className="pixel-page-sidebar">
          {/* Color Picker */}
          <div className="pixel-section">
            <label className="pixel-section-title" htmlFor="pixel-color-picker">Renk</label>
            <div className="pixel-color-picker">
              <input
                type="color"
                id="pixel-color-picker"
                value={color}
                onChange={e => setColorWithSync(e.target.value)}
                aria-label="Renk seçici"
              />
              <input
                type="text"
                value={hexInput}
                onChange={e => handleHexInputChange(e.target.value)}
                className="pixel-hex-input"
                placeholder="#FF5733…"
                aria-label="Hex renk kodu"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Color Palette with Shades */}
          <div className="pixel-section">
            <span className="pixel-section-title" id="palette-label">Palet</span>
            <div className="pixel-palette" role="group" aria-labelledby="palette-label">
              {colorPalette.map((group, gi) => (
                <div key={gi} className="pixel-palette-row" role="group" aria-label={group.name}>
                  {group.shades.map((c, ci) => (
                    <button
                      key={ci}
                      type="button"
                      className={`pixel-palette-color ${color === c ? 'active' : ''}`}
                      style={{ background: c }}
                      onClick={() => setColorWithSync(c)}
                      aria-label={`${group.name} ${ci + 1}: ${c}`}
                      aria-pressed={color === c}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Template Colors */}
          {templateColors.length > 0 && (
            <div className="pixel-section">
              <div className="pixel-section-header">
                <span className="pixel-section-title" id="template-palette-label">{templateName} Paleti</span>
                <button
                  type="button"
                  className="pixel-section-close"
                  onClick={clearTemplateColors}
                  aria-label="Şablon paletini kapat"
                >×</button>
              </div>
              <div className="pixel-template-colors" role="group" aria-labelledby="template-palette-label">
                {templateColors.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`pixel-palette-color ${color === c ? 'active' : ''}`}
                    style={{ background: c }}
                    onClick={() => setColorWithSync(c)}
                    aria-label={`Şablon rengi: ${c}`}
                    aria-pressed={color === c}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recent Colors */}
          {recentColors.length > 0 && (
            <div className="pixel-section">
              <span className="pixel-section-title" id="recent-colors-label">Son Kullanılan</span>
              <div className="pixel-recent-colors" role="group" aria-labelledby="recent-colors-label">
                {recentColors.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`pixel-palette-color ${color === c ? 'active' : ''}`}
                    style={{ background: c }}
                    onClick={() => setColorWithSync(c)}
                    aria-label={`Son kullanılan renk: ${c}`}
                    aria-pressed={color === c}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pixel-section">
            <span className="pixel-section-title">İşlemler</span>
            <div className="pixel-actions">
              <button
                type="button"
                onClick={undo}
                disabled={history.length === 0}
                aria-label="Geri al"
              >
                ↶ Geri Al
              </button>
              <button type="button" onClick={clear} aria-label="Çizimi temizle">
                Temizle
              </button>
            </div>
          </div>

          {/* Download */}
          <div className="pixel-section">
            <span className="pixel-section-title" id="download-label">İndir</span>
            <div className="pixel-download-buttons" role="group" aria-labelledby="download-label">
              <button type="button" onClick={() => download(1)} aria-label="1x ölçekte indir">1x</button>
              <button type="button" onClick={() => download(2)} aria-label="2x ölçekte indir">2x</button>
              <button type="button" onClick={() => download(4)} aria-label="4x ölçekte indir">4x</button>
              <button type="button" onClick={() => download(8)} aria-label="8x ölçekte indir">8x</button>
            </div>
          </div>
        </div>

        <div className="pixel-page-canvas">
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div
            className={`pixel-grid-large size-${gridSize}`}
            role="grid"
            aria-label={`${gridSize}×${gridSize} piksel çizim alanı`}
            onMouseLeave={() => setIsDrawing(false)}
            onContextMenu={e => e.preventDefault()}
          >
            {grid.map((c, i) => (
              <div
                key={i}
                role="gridcell"
                tabIndex={i === 0 ? 0 : -1}
                className="pixel"
                style={{ background: c }}
                aria-label={`Piksel ${Math.floor(i / gridSize) + 1}, ${(i % gridSize) + 1}`}
                onMouseDown={(e) => {
                  if (e.button === 2) {
                    fill(i)
                  } else {
                    handleMouseDown(i)
                  }
                }}
                onMouseUp={() => setIsDrawing(false)}
                onMouseEnter={() => isDrawing && paint(i)}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault()
                    saveHistory()
                    paint(i)
                  } else if (e.key === 'ArrowRight' && (i + 1) % gridSize !== 0) {
                    (e.currentTarget.nextElementSibling as HTMLElement)?.focus()
                  } else if (e.key === 'ArrowLeft' && i % gridSize !== 0) {
                    (e.currentTarget.previousElementSibling as HTMLElement)?.focus()
                  } else if (e.key === 'ArrowDown' && i + gridSize < grid.length) {
                    const nextRow = e.currentTarget.parentElement?.children[i + gridSize] as HTMLElement
                    nextRow?.focus()
                  } else if (e.key === 'ArrowUp' && i - gridSize >= 0) {
                    const prevRow = e.currentTarget.parentElement?.children[i - gridSize] as HTMLElement
                    prevRow?.focus()
                  }
                }}
              />
            ))}
          </div>
          <div className="tool-hint">
            <kbd>Sol tık</kbd> <span>Çiz</span>
            <span className="separator">·</span>
            <kbd>Sağ tık</kbd> <span>Doldur</span>
          </div>

          {/* Canvas Size Selector */}
          <div className="pixel-size-scroll">
            <div className="pixel-size-track" role="group" aria-label="Kanvas boyutu">
              {([8, 16, 32, 64, 128] as GridSize[]).map(size => (
                <button
                  key={size}
                  type="button"
                  className={`pixel-size-option ${gridSize === size ? 'active' : ''}`}
                  onClick={() => changeGridSize(size)}
                  aria-pressed={gridSize === size}
                  aria-label={`${size}×${size} piksel`}
                >
                  {size}×{size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <section className="pixel-templates-section" aria-labelledby="templates-heading">
        <h2 id="templates-heading">Örnek Çizimler</h2>
        <p className="pixel-templates-desc">Tıklayarak yükle ve üzerinde değişiklik yap</p>
        <div className="pixel-templates-grid" role="group" aria-label="Örnek şablonlar">
          {/* Example Art */}
          {exampleArt.map((art, i) => (
            <button
              key={`example-${i}`}
              type="button"
              className="pixel-template-card"
              onClick={() => loadTemplate(art)}
              aria-label={`${art.name} şablonunu yükle`}
            >
              <div
                className="pixel-template-preview"
                style={{ gridTemplateColumns: `repeat(${art.size}, 1fr)` }}
                aria-hidden="true"
              >
                {art.pixels.map((p, pi) => (
                  <div
                    key={pi}
                    style={{ background: art.colors[p as keyof typeof art.colors] }}
                  />
                ))}
              </div>
              <span className="pixel-template-name">{art.name}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
