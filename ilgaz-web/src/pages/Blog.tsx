import { useState } from 'react'
import { Link } from 'react-router-dom'

const posts = [
  {
    slug: 'essiz-yaraticinin-izniyle',
    title: 'eşsiz yaratıcının izniyle',
    date: '29 Oca 2026',
    readingTime: 4,
    tags: ['tefekkür'],
  },
  {
    slug: 'sessizligin-basladigi-yer',
    title: 'sessizliğin başladığı yer',
    date: '23 Oca 2026',
    readingTime: 3,
    tags: ['tefekkür'],
  },
]

export function Blog() {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = [...new Set(posts.flatMap(post => post.tags))]

  const filteredPosts = activeTag
    ? posts.filter(post => post.tags.includes(activeTag))
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
          <li key={post.slug} className="post-item">
            <h3 className="post-title">
              <Link to={`/blog/${post.slug}`}>{post.title}</Link>
            </h3>
            <div className="post-meta">
              <span className="post-reading-time">{post.readingTime} dk</span>
              <span className="post-date">{post.date}</span>
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
