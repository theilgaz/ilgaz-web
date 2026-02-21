import { Link, useParams } from 'react-router-dom'
import { postsBySlug } from '../content/posts'

export function BlogPost() {
  const { slug } = useParams()
  const post = postsBySlug[slug || '']

  if (!post) {
    return (
      <div>
        <h1>Yazı bulunamadı</h1>
        <p>
          <Link to="/blog">← Tüm yazılara dön</Link>
        </p>
      </div>
    )
  }

  const { meta, Content } = post

  return (
    <article>
      <header className="article-header">
        <div className="article-tags">
          {meta.tags.map(tag => (
            <span key={tag} className="article-tag">{tag}</span>
          ))}
        </div>
        <div className="article-meta">
          <span>{meta.date}</span>
          <span className="separator">·</span>
          <span>{meta.readingTime} dk okuma</span>
        </div>
        <h1 className="article-title">{meta.title}</h1>
      </header>

      <div className="article-content">
        <Content />
      </div>

      <footer className="article-footer">
        <Link to="/blog" className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Tüm yazılar
        </Link>
      </footer>
    </article>
  )
}
