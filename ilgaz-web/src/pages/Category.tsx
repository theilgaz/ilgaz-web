import { Link, useParams } from 'react-router-dom'
import { posts } from '../content/posts'
import { categoryInfo } from '../content/posts/categories'
import { sortByDateDesc } from '../utils/dateUtils'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function Category() {
  const { tag } = useParams()
  const info = categoryInfo[tag || '']
  useDocumentTitle(info?.title || tag || 'kategori')

  const categoryPosts = sortByDateDesc(
    posts.filter(post => post.meta.tags.includes(tag || ''))
  )

  if (categoryPosts.length === 0) {
    return (
      <div>
        <h1>Kategori bulunamadı</h1>
        <p>
          <Link to="/blog">← Tüm yazılara dön</Link>
        </p>
      </div>
    )
  }

  return (
    <>
      <header className="category-page-header">
        <Link to="/blog" className="back-to-blog">← yazılar</Link>
        <h1>{info?.title || tag}</h1>
        <p className="category-page-description">{info?.description || ''}</p>
        <span className="category-page-count">{categoryPosts.length} yazı</span>
      </header>

      <div className="posts-grid full-width">
        {categoryPosts.map((post) => (
          <Link
            key={post.meta.slug}
            to={`/blog/${post.meta.slug}`}
            className="post-card"
          >
            <div className="post-card-content">
              <h3 className="post-card-title">{post.meta.title}</h3>
              <div className="post-card-meta">
                <span>{post.meta.date}</span>
                <span className="meta-dot">·</span>
                <span>{post.meta.readingTime} dk</span>
              </div>
            </div>
            <div className="post-card-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
