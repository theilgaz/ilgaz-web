import { useState, useEffect } from 'react'

interface TaskbarWindow {
  id: string
  title: string
  minimized: boolean
}

interface TaskbarProps {
  windows: TaskbarWindow[]
  onWindowClick: (id: string) => void
  onStartClick: () => void
  startOpen: boolean
}

function Clock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(
        `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      )
    }
    update()
    const interval = setInterval(update, 10000)
    return () => clearInterval(interval)
  }, [])

  return <span>{time}</span>
}

export function Taskbar({ windows, onWindowClick, onStartClick, startOpen }: TaskbarProps) {
  return (
    <div className="w98-taskbar">
      <button
        className={`w98-start ${startOpen ? 'active' : ''}`}
        onClick={onStartClick}
      >
        <span className="w98-start-icon">▣</span> Start
      </button>

      <div className="w98-taskbar-divider" />

      <div className="w98-taskbar-items">
        {windows.map(w => (
          <button
            key={w.id}
            className={`w98-taskbar-item ${!w.minimized ? 'active' : ''}`}
            onClick={() => onWindowClick(w.id)}
          >
            {w.title.length > 20 ? w.title.slice(0, 20) + '…' : w.title}
          </button>
        ))}
      </div>

      <div className="w98-tray">
        <span className="w98-tray-icon" title="Ses">🔊</span>
        <span className="w98-tray-clock"><Clock /></span>
      </div>
    </div>
  )
}
