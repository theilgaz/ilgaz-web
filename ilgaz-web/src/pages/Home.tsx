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

      <Link to="/progress" className="landing-day-progress">
        <span className="day-progress-value">{dayProgress}%</span>
        <span className="day-progress-label">progress</span>
      </Link>

      {showPhoto && (
        <div className="photo-modal" onClick={() => setShowPhoto(false)}>
          <img src="/photo.jpg" alt="Abdullah Ilgaz" />
        </div>
      )}
    </div>
  )
}
