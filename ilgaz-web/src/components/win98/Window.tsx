import { useState, useRef, useCallback, useEffect } from 'react'

interface WindowProps {
  id: string
  title: string
  initialX?: number
  initialY?: number
  width?: number
  height?: number
  children: React.ReactNode
  onClose?: () => void
  onMinimize?: () => void
  onFocus?: () => void
  onLinkClick?: (href: string) => void
  zIndex?: number
  minimized?: boolean
  menuBar?: string[]
}

export function Window({
  id,
  title,
  initialX = 100,
  initialY = 60,
  width = 480,
  height,
  children,
  onClose,
  onMinimize,
  onFocus,
  onLinkClick,
  zIndex = 10,
  minimized = false,
  menuBar,
}: WindowProps) {
  const [pos, setPos] = useState({ x: initialX, y: initialY })
  const [dragging, setDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  // Native capture-phase listener to intercept links before React Router
  useEffect(() => {
    const el = bodyRef.current
    if (!el || !onLinkClick) return
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (target) {
        const href = target.getAttribute('href')
        if (href && href.startsWith('/')) {
          e.preventDefault()
          e.stopPropagation()
          e.stopImmediatePropagation()
          onLinkClick(href)
        }
      }
    }
    el.addEventListener('click', handler, true)
    return () => el.removeEventListener('click', handler, true)
  }, [onLinkClick])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.w98-btn')) return
    e.preventDefault()
    onFocus?.()
    dragOffset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    }
    setDragging(true)
  }, [pos, onFocus])

  useEffect(() => {
    if (!dragging) return
    const handleMove = (e: MouseEvent) => {
      setPos({
        x: e.clientX - dragOffset.current.x,
        y: Math.max(0, e.clientY - dragOffset.current.y),
      })
    }
    const handleUp = () => setDragging(false)
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [dragging])

  if (minimized) return null

  return (
    <div
      ref={windowRef}
      className="w98-window"
      data-window-id={id}
      style={{
        left: pos.x,
        top: pos.y,
        width,
        height: height || 'auto',
        zIndex,
      }}
      onMouseDown={() => onFocus?.()}
    >
      <div className="w98-titlebar" onMouseDown={handleMouseDown}>
        <span className="w98-titlebar-text">{title}</span>
        <span className="w98-titlebar-btns">
          {onMinimize && (
            <button className="w98-btn" onClick={onMinimize} title="Minimize">_</button>
          )}
          <button className="w98-btn" title="Maximize">□</button>
          {onClose && (
            <button className="w98-btn w98-btn-close" onClick={onClose} title="Close">×</button>
          )}
        </span>
      </div>
      {menuBar && (
        <div className="w98-menubar">
          {menuBar.map(item => (
            <span key={item} className="w98-menu-item">{item}</span>
          ))}
        </div>
      )}
      <div className="w98-body" ref={bodyRef}>
        {children}
      </div>
    </div>
  )
}
