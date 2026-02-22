import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function useDayProgress() {
  const [progress, setProgress] = useState(() => {
    const now = new Date()
    const minutes = now.getHours() * 60 + now.getMinutes()
    return Math.round((minutes / 1440) * 100)
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const minutes = now.getHours() * 60 + now.getMinutes()
      setProgress(Math.round((minutes / 1440) * 100))
    }, 60000)
    return () => clearInterval(interval)
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
        <span className="day-progress-label">gün</span>
      </Link>

      <div className="landing-links">
        <Link to="/blog">yazılar</Link>
        <Link to="/projects">projeler</Link>
        <Link to="/now">şu an</Link>
        <Link to="/about">hakkımda</Link>
      </div>

      {showPhoto && (
        <div className="photo-modal" onClick={() => setShowPhoto(false)}>
          <img src="/photo.jpg" alt="Abdullah Ilgaz" />
        </div>
      )}
    </div>
  )
}
