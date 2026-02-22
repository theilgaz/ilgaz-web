import { useState, useEffect, useRef } from 'react'

const pomodoroPresets = [
  { label: '25dk', minutes: 25, desc: 'Klasik' },
  { label: '50dk', minutes: 50, desc: 'Derin iş' },
  { label: '15dk', minutes: 15, desc: 'Kısa sprint' },
  { label: '5dk', minutes: 5, desc: 'Mola' },
]

function playAlarm() {
  const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  const playBeep = (time: number, freq: number) => {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    oscillator.frequency.value = freq
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(0.3, time)
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.15)
    oscillator.start(time)
    oscillator.stop(time + 0.15)
  }
  const now = audioContext.currentTime
  playBeep(now, 800)
  playBeep(now + 0.2, 1000)
  playBeep(now + 0.5, 800)
  playBeep(now + 0.7, 1000)
}

function getTodayPomoCount(): number {
  const history = getPomodoroHistory()
  const today = new Date().toISOString().split('T')[0]
  return history[today] || 0
}

function getPomodoroHistory(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem('pomodoro-history') || '{}')
  } catch {
    return {}
  }
}

function savePomodoroComplete() {
  const today = new Date().toISOString().split('T')[0]
  const history = getPomodoroHistory()
  history[today] = (history[today] || 0) + 1
  localStorage.setItem('pomodoro-history', JSON.stringify(history))
}

export function PomodoroHeatmap() {
  const [history, setHistory] = useState<Record<string, number>>({})

  useEffect(() => {
    setHistory(getPomodoroHistory())
    const handleStorage = () => setHistory(getPomodoroHistory())
    window.addEventListener('pomodoro-complete', handleStorage)
    return () => window.removeEventListener('pomodoro-complete', handleStorage)
  }, [])

  const days = []
  const today = new Date()

  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - 27)
  const dayOfWeek = startDate.getDay()
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  startDate.setDate(startDate.getDate() + daysToMonday)

  for (let i = 0; i < 28; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    const dayNum = date.getDate()
    const isToday = dateStr === today.toISOString().split('T')[0]
    days.push({ date: dateStr, day: dayNum, count: history[dateStr] || 0, isToday })
  }

  const maxCount = Math.max(...days.map(d => d.count), 1)

  return (
    <div className="pomodoro-heatmap">
      <div className="heatmap-grid">
        {days.map(day => (
          <div
            key={day.date}
            className={`heatmap-cell ${day.isToday ? 'today' : ''}`}
            style={{
              backgroundColor: day.count === 0
                ? 'rgba(0,0,0,0.05)'
                : `rgba(239, 68, 68, ${0.2 + (day.count / maxCount) * 0.8})`
            }}
            data-tooltip={`${day.day} - ${day.count} pomo`}
          />
        ))}
      </div>
      <div className="heatmap-legend">
        <span>Az</span>
        <div className="heatmap-cell" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }} />
        <div className="heatmap-cell" style={{ backgroundColor: 'rgba(239, 68, 68, 0.5)' }} />
        <div className="heatmap-cell" style={{ backgroundColor: 'rgba(239, 68, 68, 0.8)' }} />
        <div className="heatmap-cell" style={{ backgroundColor: 'rgba(239, 68, 68, 1)' }} />
        <span>Çok</span>
      </div>
    </div>
  )
}

export function Pomodoro() {
  const [initialMinutes, setInitialMinutes] = useState(25)
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showComplete, setShowComplete] = useState(false)
  const [showFlash, setShowFlash] = useState(false)
  const [todayCount, setTodayCount] = useState(getTodayPomoCount)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [customTime, setCustomTime] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const hasCompletedRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const originalTitle = useRef(document.title)

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    if (isRunning) {
      document.title = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} - Pomodoro`
    } else {
      document.title = originalTitle.current
    }
    return () => { document.title = originalTitle.current }
  }, [isRunning, minutes, seconds])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      if (e.code === 'Space') {
        e.preventDefault()
        setIsRunning(r => !r)
      } else if (e.code === 'KeyR') {
        reset()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [initialMinutes])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (isRunning) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsRunning(false)
            if (!hasCompletedRef.current && initialMinutes >= 15) {
              if (soundEnabled) playAlarm()
              savePomodoroComplete()
              window.dispatchEvent(new Event('pomodoro-complete'))
              hasCompletedRef.current = true
              setShowComplete(true)
              setShowFlash(true)
              setTodayCount(getTodayPomoCount())
              setTimeout(() => setShowComplete(false), 3000)
              setTimeout(() => setShowFlash(false), 500)
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Pomodoro Tamamlandı! 🍅', {
                  body: 'Harika iş! Mola zamanı.',
                  icon: '/favicon.png'
                })
              }
            }
          } else {
            setMinutes(m => m - 1)
            setSeconds(59)
          }
        } else {
          setSeconds(s => s - 1)
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, minutes, seconds, initialMinutes, soundEnabled])

  const reset = () => {
    setIsRunning(false)
    setMinutes(initialMinutes)
    setSeconds(0)
    hasCompletedRef.current = false
    setShowComplete(false)
  }

  const startPreset = (mins: number) => {
    setInitialMinutes(mins)
    setMinutes(mins)
    setSeconds(0)
    setIsRunning(true)
    hasCompletedRef.current = false
    setShowComplete(false)
  }

  const handleCustomTime = () => {
    const mins = parseInt(customTime)
    if (mins > 0 && mins <= 120) {
      startPreset(mins)
      setShowCustomInput(false)
      setCustomTime('')
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const progress = ((initialMinutes * 60 - (minutes * 60 + seconds)) / (initialMinutes * 60)) * 100
  const progressPercent = Math.round(progress)

  const getCompletionTime = () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() + minutes)
    now.setSeconds(now.getSeconds() + seconds)
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div
      ref={containerRef}
      className={`pomodoro ${isRunning ? 'running' : ''} ${showComplete ? 'completed' : ''} ${showFlash ? 'flash' : ''} ${isFullscreen ? 'fullscreen' : ''}`}
    >
      {showComplete && <div className="pomodoro-complete-badge">Tamamlandı!</div>}

      <div className="pomodoro-top-controls">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`pomodoro-icon-btn ${soundEnabled ? '' : 'muted'}`}
          data-tooltip={soundEnabled ? 'Sesi kapat' : 'Sesi aç'}
        >
          {soundEnabled ? '🔔' : '🔕'}
        </button>
        <button
          onClick={toggleFullscreen}
          className="pomodoro-icon-btn"
          data-tooltip={isFullscreen ? 'Küçült' : 'Tam ekran'}
        >
          {isFullscreen ? '⊙' : '⛶'}
        </button>
      </div>

      <svg className="pomodoro-ring" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="4" />
        <circle
          className="pomodoro-ring-progress"
          cx="50" cy="50" r="45" fill="none"
          stroke={initialMinutes <= 5 ? '#22c55e' : '#ef4444'}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${progress * 2.83} 283`}
          transform="rotate(-90 50 50)"
        />
      </svg>

      <div className="pomodoro-time">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div className="pomodoro-meta">
        <span className="pomodoro-percent">{progressPercent}%</span>
        {isRunning && <span className="pomodoro-eta">Bitecek: {getCompletionTime()}</span>}
      </div>

      <div className="pomodoro-today">Bugün: {todayCount} 🍅</div>

      <div className="pomodoro-controls">
        <button onClick={() => setIsRunning(!isRunning)} className={isRunning ? 'pause' : 'play'}>
          {isRunning ? '⏸' : '▶'}
        </button>
        <button onClick={reset} data-tooltip="Sıfırla (R)">↺</button>
      </div>

      <div className="pomodoro-presets">
        {pomodoroPresets.map(p => (
          <button
            key={p.minutes}
            className={initialMinutes === p.minutes && !showCustomInput ? 'active' : ''}
            onClick={() => startPreset(p.minutes)}
            data-tooltip={p.desc}
          >
            {p.label}
          </button>
        ))}
        <button
          className={showCustomInput ? 'active' : ''}
          onClick={() => setShowCustomInput(!showCustomInput)}
          data-tooltip="Özel süre"
        >
          ⚙
        </button>
      </div>

      {showCustomInput && (
        <div className="pomodoro-custom">
          <input
            type="number"
            min="1"
            max="120"
            placeholder="dk"
            value={customTime}
            onChange={e => setCustomTime(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCustomTime()}
          />
          <button onClick={handleCustomTime}>Başlat</button>
        </div>
      )}

      <div className="pomodoro-shortcuts">
        <span>Space: Başlat/Duraklat</span>
        <span>R: Sıfırla</span>
      </div>
    </div>
  )
}
