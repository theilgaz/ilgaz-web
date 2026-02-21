import { useState } from 'react'
import { Link } from 'react-router-dom'
import { posts } from '../content/posts'

export function Blog() {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = [...new Set(posts.flatMap(post => post.meta.tags))]

  const filteredPosts = activeTag
    ? posts.filter(post => post.meta.tags.includes(activeTag))
    : posts

  return (
    <>
      <blockquote className="page-quote">
        "Yoktan var eden'den ilhamla."
      </blockquote>

      <h1>Yazılar</h1>
      <p className="lead">
        Yazılım, teknoloji ve hayat üzerine düşünceler.
      </p>

      <div className="tag-filters">
        <button
          className={`tag-filter ${activeTag === null ? 'active' : ''}`}
          onClick={() => setActiveTag(null)}
        >
          tümü
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            className={`tag-filter ${activeTag === tag ? 'active' : ''}`}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <ul className="post-list">
        {filteredPosts.map((post) => (
          <li key={post.meta.slug} className="post-item">
            <h3 className="post-title">
              <Link to={`/blog/${post.meta.slug}`}>{post.meta.title}</Link>
            </h3>
            <div className="post-meta">
              <span className="post-reading-time">{post.meta.readingTime} dk</span>
              <span className="post-date">{post.meta.date}</span>
            </div>
          </li>
        ))}
      </ul>

      {filteredPosts.length === 0 && (
        <p className="meta">Bu kategoride yazı yok.</p>
      )}
    </>
  )
}
