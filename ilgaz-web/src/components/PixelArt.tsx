import { useState, useRef } from 'react'

// Simple widget version for Tools page
export function PixelArt() {
  const [grid, setGrid] = useState(() => Array(64).fill('#ffffff'))
  const [history, setHistory] = useState<string[][]>([])
  const [color, setColor] = useState('#000000')
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const saveHistory = () => {
    setHistory(h => [...h.slice(-19), [...grid]])
  }

  const paint = (i: number) => {
    const newGrid = [...grid]
    newGrid[i] = color
    setGrid(newGrid)
  }

  const handleMouseDown = (i: number) => {
    saveHistory()
    setIsDrawing(true)
    paint(i)
  }

  const undo = () => {
    if (history.length > 0) {
      setGrid(history[history.length - 1])
      setHistory(h => h.slice(0, -1))
    }
  }

  const clear = () => {
    saveHistory()
    setGrid(Array(64).fill('#ffffff'))
  }

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 8
    canvas.width = 64
    canvas.height = 64

    grid.forEach((c, i) => {
      const x = (i % 8) * size
      const y = Math.floor(i / 8) * size
      ctx.fillStyle = c
      ctx.fillRect(x, y, size, size)
    })

    const link = document.createElement('a')
    link.download = 'pixel-art.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="pixel-art">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div
        className="pixel-grid"
        onMouseLeave={() => setIsDrawing(false)}
      >
        {grid.map((c, i) => (
          <div
            key={i}
            className="pixel"
            style={{ background: c }}
            onMouseDown={() => handleMouseDown(i)}
            onMouseUp={() => setIsDrawing(false)}
            onMouseEnter={() => isDrawing && paint(i)}
          />
        ))}
      </div>
      <div className="pixel-controls">
        <input type="color" value={color} onChange={e => setColor(e.target.value)} />
        <button onClick={undo} disabled={history.length === 0} title="Geri al">↶</button>
        <button onClick={clear} title="Temizle">🗑</button>
        <button onClick={download} title="İndir">↓</button>
      </div>
    </div>
  )
}
