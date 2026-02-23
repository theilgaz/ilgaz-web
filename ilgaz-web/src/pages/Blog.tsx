import { useState } from 'react'
import { Link } from 'react-router-dom'
import { posts, postsBySlug } from '../content/posts'
import { collections } from '../content/collections'

export function Blog() {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [showCollections, setShowCollections] = useState(false)

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

      <div className="tag-filters centered">
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

      {collections.length > 0 && (
        <section className="collections-toggle-section">
          <button
            className={`collections-toggle ${showCollections ? 'open' : ''}`}
            onClick={() => setShowCollections(!showCollections)}
          >
            <span>koleksiyonlar</span>
            <span className="toggle-icon">{showCollections ? '−' : '+'}</span>
          </button>

          {showCollections && (
            <div className="collections-dropdown">
              {collections.map((collection) => {
                const totalReadingTime = collection.posts.reduce((acc, slug) => {
                  const post = postsBySlug[slug]
                  return acc + (post?.meta.readingTime || 0)
                }, 0)

                return (
                  <Link
                    key={collection.slug}
                    to={`/collections/${collection.slug}`}
                    className="collection-dropdown-item"
                  >
                    <div className="collection-dropdown-title">{collection.title}</div>
                    <div className="collection-dropdown-description">{collection.description}</div>
                    <div className="collection-dropdown-meta">
                      {collection.posts.length} yazı · {totalReadingTime} dk
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      )}
    </>
  )
}
