import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const cityTimezones: Record<string, number> = {
  konya: 3, istanbul: 3, ankara: 3, izmir: 3,
  losangeles: -8, newyork: -5, london: 0, paris: 1,
  berlin: 1, dubai: 4, tokyo: 9, jerusalem: 2, medina: 3,
}

function getCurrentTimeInTimezone(timezone: number) {
  const now = new Date()
  const utcHours = now.getUTCHours()
  const utcMinutes = now.getUTCMinutes()
  const offsetMinutes = timezone * 60
  let totalMinutes = utcHours * 60 + utcMinutes + offsetMinutes
  if (totalMinutes < 0) totalMinutes += 1440
  if (totalMinutes >= 1440) totalMinutes -= 1440
  return totalMinutes
}

function useDayProgress() {
  const getProgress = () => {
    const city = localStorage.getItem('progress-city') || 'konya'
    const timezone = cityTimezones[city] ?? 3
    const minutes = getCurrentTimeInTimezone(timezone)
    return Math.round((minutes / 1440) * 100)
  }

  const [progress, setProgress] = useState(getProgress)

  useEffect(() => {
    const update = () => setProgress(getProgress())

    const interval = setInterval(update, 60000)
    window.addEventListener('city-changed', update)

    return () => {
      clearInterval(interval)
      window.removeEventListener('city-changed', update)
    }
  }, [])

  return progress
}

function SunArc({ progress }: { progress: number }) {
  // Güneş yayı üzerindeki pozisyon (0-100 -> 180-0 derece, sağdan sola)
  const angle = Math.PI - (progress / 100) * Math.PI
  const radius = 38
  const centerX = 50
  const centerY = 44

  // Güneşin pozisyonu
  const sunX = centerX + radius * Math.cos(angle)
  const sunY = centerY - radius * Math.sin(angle)

  // Gece mi gündüz mü? (yaklaşık olarak %25-%75 arası gündüz)
  const isDay = progress >= 25 && progress <= 75

  return (
    <svg className="sun-arc" viewBox="0 0 100 55" fill="none">
      {/* Horizon çizgisi */}
      <line
        x1="8" y1="44" x2="92" y2="44"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />

      {/* Yay - güneşin yolu */}
      <path
        d={`M 12 44 A 38 38 0 0 1 88 44`}
        stroke="url(#arcGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />

      {/* İlerleme yayı */}
      <path
        d={`M 12 44 A 38 38 0 0 1 ${sunX} ${sunY}`}
        stroke="url(#progressGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />

      {/* Güneş/Ay */}
      <g className="celestial-body">
        {isDay ? (
          <>
            {/* Güneş glow */}
            <circle cx={sunX} cy={sunY} r="8" fill="url(#sunGlow)" opacity="0.5" />
            {/* Güneş */}
            <circle cx={sunX} cy={sunY} r="5" fill="url(#sunGradient)" />
            {/* Güneş ışınları */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
              const rad = (deg * Math.PI) / 180
              const x1 = sunX + 7 * Math.cos(rad)
              const y1 = sunY + 7 * Math.sin(rad)
              const x2 = sunX + 9 * Math.cos(rad)
              const y2 = sunY + 9 * Math.sin(rad)
              return (
                <line
                  key={deg}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#f59e0b"
                  strokeWidth="1"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              )
            })}
          </>
        ) : (
          <>
            {/* Ay glow */}
            <circle cx={sunX} cy={sunY} r="7" fill="url(#moonGlow)" opacity="0.4" />
            {/* Ay */}
            <circle cx={sunX} cy={sunY} r="4.5" fill="#e2e8f0" />
            <circle cx={sunX - 1.5} cy={sunY - 0.5} r="4" fill="rgba(0,0,0,0.08)" />
          </>
        )}
      </g>

      {/* Gradients */}
      <defs>
        <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="25%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="75%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <radialGradient id="sunGradient">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
        <radialGradient id="sunGlow">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="moonGlow">
          <stop offset="0%" stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  )
}

export function Home() {
  const [showPhoto, setShowPhoto] = useState(false)
  const dayProgress = useDayProgress()

  return (
    <div className="landing">
      <div className="landing-intro">
        <p className="landing-bismillah" data-arabic="بِإِذْنِ الْخَالِقِ الْفَرِيدِ">eşsiz yaratıcının izniyle</p>
        <img
          src="/photo.jpg"
          alt="Abdullah Ilgaz"
          className="landing-photo"
          onClick={() => setShowPhoto(true)}
        />
        <h1 className="landing-name">Abdullah Ilgaz</h1>
        <p className="landing-tagline">
          A humble student of the Greatest Engineer.
        </p>
      </div>

      <div className="landing-bio">
        <p>
          Zihnimin kıvrımlarında dolaşan düşünceler buraya dökülüyor.
          Bazen bir satır kod, bazen bir tefekkür, bazen sadece sessizlik.
          Algoritmalar yok, beğeni sayıları yok. Sadece sen ve düşünceler.
          Merak eden keşfeder.
        </p>
      </div>

      <Link to="/progress" className="sun-arc-container">
        <SunArc progress={dayProgress} />
        <span className="sun-arc-label">{dayProgress}%</span>
      </Link>

      {showPhoto && (
        <div className="photo-modal" onClick={() => setShowPhoto(false)}>
          <img src="/photo.jpg" alt="Abdullah Ilgaz" />
        </div>
      )}
    </div>
  )
}
