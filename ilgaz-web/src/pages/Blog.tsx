import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { posts, postsBySlug } from '../content/posts'
import { collections } from '../content/collections'
import { categoryInfo } from '../content/posts/categories'
import { searchIndex } from '../content/posts/searchIndex'
import { parseDate, sortByDateDesc } from '../utils/dateUtils'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const monthNames: Record<number, string> = {
  0: 'Ocak', 1: 'Şubat', 2: 'Mart', 3: 'Nisan', 4: 'Mayıs', 5: 'Haziran',
  6: 'Temmuz', 7: 'Ağustos', 8: 'Eylül', 9: 'Ekim', 10: 'Kasım', 11: 'Aralık'
}

const shortMonthNames: Record<number, string> = {
  0: 'Oca', 1: 'Şub', 2: 'Mar', 3: 'Nis', 4: 'May', 5: 'Haz',
  6: 'Tem', 7: 'Ağu', 8: 'Eyl', 9: 'Eki', 10: 'Kas', 11: 'Ara'
}

function formatShortDate(dateStr: string): string {
  const d = parseDate(dateStr)
  return `${d.getDate()} ${shortMonthNames[d.getMonth()]} ${d.getFullYear()}`
}

function normalize(text: string): string {
  return text.toLocaleLowerCase('tr').replace(/[''ʼ`\-]/g, '')
}

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000

function isNew(dateStr: string): boolean {
  return Date.now() - parseDate(dateStr).getTime() < THREE_DAYS_MS
}

function getExcerpt(slug: string): string {
  const body = searchIndex[slug] || ''
  const clean = body.replace(/\s+/g, ' ').trim()
  if (clean.length <= 120) return clean
  return clean.slice(0, 120).replace(/\s+\S*$/, '') + '…'
}

function getMonthKey(dateStr: string): string {
  const d = parseDate(dateStr)
  return `${d.getFullYear()}-${d.getMonth()}`
}

function getMonthLabel(dateStr: string): string {
  const d = parseDate(dateStr)
  return `${monthNames[d.getMonth()]} ${d.getFullYear()}`
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

  const groupedPosts = useMemo(() => {
    const groups: { key: string; label: string; posts: typeof filteredPosts }[] = []
    let currentKey = ''

    for (const post of filteredPosts) {
      const key = getMonthKey(post.meta.date)
      if (key !== currentKey) {
        currentKey = key
        groups.push({ key, label: getMonthLabel(post.meta.date), posts: [] })
      }
      groups[groups.length - 1].posts.push(post)
    }

    return groups
  }, [filteredPosts])

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

  let globalIndex = 0

  return (
    <>
      <header className="blog-header">
        <p className="blog-header-label">yazılar</p>
        <h1 className="blog-header-title">Düşünceler, gözlemler, izler.</h1>
        <div className="blog-header-stats">
          <span>{stats.total} yazı</span>
          <span className="blog-header-dot">·</span>
          <span>{stats.totalReadingTime} dk okuma</span>
          <span className="blog-header-dot">·</span>
          <span>{stats.frequency} yazı/ay</span>
        </div>
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

      <div className="blog-filter-chips">
        <button
          className={`blog-filter-chip ${selectedTags.length === 0 ? 'active' : ''}`}
          onClick={clearFilters}
        >
          tümü
        </button>
        {allTags.map(({ tag, count }) => (
          <button
            key={tag}
            className={`blog-filter-chip ${selectedTags.includes(tag) ? 'active' : ''}`}
            onClick={() => toggleTag(tag)}
          >
            {categoryInfo[tag]?.title || tag} <span className="chip-count">{count}</span>
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
        <div className="blog-timeline">
          {groupedPosts.map((group) => (
            <div key={group.key} className="blog-month-group">
              <div className="blog-month-header">
                <span className="blog-month-label">{group.label}</span>
                <span className="blog-month-count">{group.posts.length}</span>
              </div>
              <div className="posts-grid">
                {group.posts.map((post) => {
                  const i = globalIndex++
                  const d = parseDate(post.meta.date)
                  return (
                    <Link
                      key={post.meta.slug}
                      to={`/blog/${post.meta.slug}`}
                      className="post-card stagger-in"
                      style={{ animationDelay: `${i * 0.04}s` }}
                    >
                      <div className="post-card-date-col">
                        <span className="post-card-day">{d.getDate()}</span>
                      </div>
                      <div className="post-card-content">
                        <h3 className="post-card-title">
                          {post.meta.title}
                          {isNew(post.meta.date) && <span className="post-card-new">yeni</span>}
                        </h3>
                        <p className="post-card-excerpt">{getExcerpt(post.meta.slug)}</p>
                        <div className="post-card-meta">
                          <span className="post-card-tag">{post.meta.tags[0]}</span>
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
                  )
                })}
              </div>
            </div>
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
            {collections.map((collection, i) => {
              const totalReadingTime = collection.posts.reduce((acc, slug) => {
                const post = postsBySlug[slug]
                return acc + (post?.meta.readingTime || 0)
              }, 0)

              return (
                <Link
                  key={collection.slug}
                  to={`/collections/${collection.slug}`}
                  className="collection-card stagger-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
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
