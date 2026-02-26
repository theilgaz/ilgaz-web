import { useState } from 'react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function Home() {
  useDocumentTitle('ana sayfa')
  const [showPhoto, setShowPhoto] = useState(false)

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

      {showPhoto && (
        <div className="photo-modal" onClick={() => setShowPhoto(false)}>
          <img src="/photo.jpg" alt="Abdullah Ilgaz" />
        </div>
      )}
    </div>
  )
}
