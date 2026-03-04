import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { posts, postsBySlug } from '../content/posts'
import { collections } from '../content/collections'
import { categoryInfo } from '../content/posts/categories'
import { searchIndex } from '../content/posts/searchIndex'
import { parseDate, sortByDateDesc } from '../utils/dateUtils'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const monthNames: Record<number, string> = {
  0: 'Oca', 1: 'Şub', 2: 'Mar', 3: 'Nis', 4: 'May', 5: 'Haz',
  6: 'Tem', 7: 'Ağu', 8: 'Eyl', 9: 'Eki', 10: 'Kas', 11: 'Ara'
}

function formatShortDate(dateStr: string): string {
  const d = parseDate(dateStr)
  return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`
}

function normalize(text: string): string {
  return text.toLocaleLowerCase('tr').replace(/[''ʼ`\-]/g, '')
}

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000

function isNew(dateStr: string): boolean {
  return Date.now() - parseDate(dateStr).getTime() < THREE_DAYS_MS
}

export function Blog() {
  useDocumentTitle('yazılar')

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const sortedPosts = useMemo(() => sortByDateDesc(posts), [])

  const allTags = useMemo(() => {
    const tagCounts: Record<string, number> = {}
    posts.forEach(post => {
      post.meta.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }))
  }, [])

  const filteredPosts = useMemo(() => {
    let result = sortedPosts

    if (selectedTags.length > 0) {
      result = result.filter(post =>
        selectedTags.some(tag => post.meta.tags.includes(tag))
      )
    }

    if (searchQuery.trim()) {
      const q = normalize(searchQuery)
      result = result.filter(post => {
        const titleMatch = normalize(post.meta.title).includes(q)
        const bodyText = searchIndex[post.meta.slug] || ''
        const bodyMatch = normalize(bodyText).includes(q)
        return titleMatch || bodyMatch
      })
    }

    return result
  }, [sortedPosts, selectedTags, searchQuery])

  const isFiltering = selectedTags.length > 0 || searchQuery.trim().length > 0

  const stats = useMemo(() => {
    const total = posts.length
    const totalReadingTime = posts.reduce((sum, p) => sum + p.meta.readingTime, 0)

    const dates = posts.map(p => parseDate(p.meta.date))
    const earliest = new Date(Math.min(...dates.map(d => d.getTime())))
    const latest = new Date(Math.max(...dates.map(d => d.getTime())))

    const monthSpan = Math.max(1,
      (latest.getFullYear() - earliest.getFullYear()) * 12 +
      (latest.getMonth() - earliest.getMonth()) + 1
    )
    const frequency = (total / monthSpan).toFixed(1)

    const latestDate = formatShortDate(
      posts.reduce((a, b) =>
        parseDate(a.meta.date).getTime() > parseDate(b.meta.date).getTime() ? a : b
      ).meta.date
    )

    return { total, totalReadingTime, frequency, latestDate }
  }, [])

  function toggleTag(tag: string) {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  function clearFilters() {
    setSelectedTags([])
    setSearchQuery('')
  }

  return (
    <>
      <header className="blog-header">
        <h1>Yazılar</h1>
        <p className="blog-subtitle">
          Yazılım, teknoloji ve hayat üzerine düşünceler.
        </p>
      </header>

      <div className="blog-search">
        <svg className="blog-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="başlık veya içerik ara..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="blog-search-input"
        />
      </div>

      <div className="blog-stats">
        <div className="blog-stat-card">
          <span className="blog-stat-value">{stats.total}</span>
          <span className="blog-stat-label">yazı</span>
        </div>
        <div className="blog-stat-card">
          <span className="blog-stat-value">{stats.totalReadingTime}</span>
          <span className="blog-stat-label">dk toplam</span>
        </div>
        <div className="blog-stat-card">
          <span className="blog-stat-value">{stats.frequency}</span>
          <span className="blog-stat-label">yazı/ay</span>
        </div>
        <div className="blog-stat-card">
          <span className="blog-stat-value">{stats.latestDate}</span>
          <span className="blog-stat-label">son yazı</span>
        </div>
      </div>

      <div className="blog-filter-chips">
        <button
          className={`blog-filter-chip ${selectedTags.length === 0 ? 'active' : ''}`}
          onClick={clearFilters}
        >
          tümü ({posts.length})
        </button>
        {allTags.map(({ tag, count }) => (
          <button
            key={tag}
            className={`blog-filter-chip ${selectedTags.includes(tag) ? 'active' : ''}`}
            onClick={() => toggleTag(tag)}
          >
            {categoryInfo[tag]?.title || tag} ({count})
          </button>
        ))}
      </div>

      {isFiltering && (
        <div className="blog-results-info">
          <span>{filteredPosts.length} sonuç</span>
          <button className="blog-results-clear" onClick={clearFilters}>temizle</button>
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div className="blog-empty">
          <p>Aramanızla eşleşen yazı bulunamadı.</p>
        </div>
      ) : (
        <div className="posts-grid full-width">
          {filteredPosts.map((post) => (
            <Link
              key={post.meta.slug}
              to={`/blog/${post.meta.slug}`}
              className="post-card"
            >
              <div className="post-card-content">
                <h3 className="post-card-title">
                  {post.meta.title}
                  {isNew(post.meta.date) && <span className="post-card-new">yeni</span>}
                </h3>
                <div className="post-card-meta">
                  <span className="post-card-tag">{post.meta.tags[0]}</span>
                  <span className="meta-dot">·</span>
                  <span>{post.meta.readingTime} dk</span>
                </div>
              </div>
              <div className="post-card-right">
                <span className="post-card-date">{post.meta.date}</span>
                <div className="post-card-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!isFiltering && collections.length > 0 && (
        <section className="collections-section">
          <div className="category-header static">
            <span className="category-label">koleksiyonlar</span>
            <span className="category-count">{collections.length}</span>
          </div>

          <div className="collections-grid">
            {collections.map((collection) => {
              const totalReadingTime = collection.posts.reduce((acc, slug) => {
                const post = postsBySlug[slug]
                return acc + (post?.meta.readingTime || 0)
              }, 0)

              return (
                <Link
                  key={collection.slug}
                  to={`/collections/${collection.slug}`}
                  className="collection-card"
                >
                  <div className="collection-card-content">
                    <div className="collection-card-title">{collection.title}</div>
                    <div className="collection-card-description">{collection.description}</div>
                  </div>
                  <div className="collection-card-footer">
                    <span>{collection.posts.length} yazı</span>
                    <span className="meta-dot">·</span>
                    <span>{totalReadingTime} dk</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}
