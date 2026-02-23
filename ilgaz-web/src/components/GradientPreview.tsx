import { useState, useCallback, useEffect } from 'react'

export function GradientPreview() {
  const [colors, setColors] = useState(['#667eea', '#764ba2'])
  const [angle, setAngle] = useState(135)

  const randomize = useCallback(() => {
    const newColors = [
      '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
      '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    ]
    setColors(newColors)
    setAngle(Math.floor(Math.random() * 360))
  }, [])

  useEffect(() => { randomize() }, [randomize])

  const gradient = `linear-gradient(${angle}deg, ${colors.join(', ')})`

  return (
    <div className="gradient-preview-widget">
      <div className="gradient-preview-box" style={{ background: gradient }} />
      <button className="gradient-refresh" onClick={randomize}>↻</button>
    </div>
  )
}
