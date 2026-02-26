import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { posts } from '../content/posts'

function getTodayFormatted(): string {
  const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
  const now = new Date()
  return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
}

export function Home() {
  useDocumentTitle('ana sayfa')
  const [showPhoto, setShowPhoto] = useState(false)

  const today = getTodayFormatted()
  const todaysPosts = posts.filter(p => p.meta.date === today)

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

      {todaysPosts.length > 0 && (
        <div className="landing-today">
          <span className="landing-today-label">bugün</span>
          <div className="landing-today-posts">
            {todaysPosts.map((post, i) => (
              <span key={post.meta.slug}>
                <Link to={`/blog/${post.meta.slug}`}>{post.meta.title}</Link>
                {i < todaysPosts.length - 1 && <span className="dot">·</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {showPhoto && (
        <div className="photo-modal" onClick={() => setShowPhoto(false)}>
          <img src="/photo.jpg" alt="Abdullah Ilgaz" />
        </div>
      )}
    </div>
  )
}
