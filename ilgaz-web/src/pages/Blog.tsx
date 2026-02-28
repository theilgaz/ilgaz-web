import { Link } from 'react-router-dom'
import { posts, postsBySlug } from '../content/posts'
import { collections } from '../content/collections'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const categoryInfo: Record<string, { title: string; description: string }> = {
  muhasebe: {
    title: 'muhasebe',
    description: 'iç hesaplaşmalar, düşünceler, sorular'
  },
  zanaat: {
    title: 'zanaat',
    description: 'yazılım, kod, meslek'
  }
}

const monthMap: Record<string, number> = {
  'Oca': 0, 'Şub': 1, 'Mar': 2, 'Nis': 3, 'May': 4, 'Haz': 5,
  'Tem': 6, 'Ağu': 7, 'Eyl': 8, 'Eki': 9, 'Kas': 10, 'Ara': 11
}

function parseDate(dateStr: string): Date {
  const parts = dateStr.split(' ')
  const day = parseInt(parts[0])
  const month = monthMap[parts[1]] || 0
  const year = parseInt(parts[2])
  return new Date(year, month, day)
}

function sortByDateDesc<T extends { meta: { date: string } }>(items: T[]): T[] {
  return [...items].sort((a, b) =>
    parseDate(b.meta.date).getTime() - parseDate(a.meta.date).getTime()
  )
}

const POSTS_PER_CATEGORY = 3

export function Blog() {
  useDocumentTitle('yazılar')

  const allTags = [...new Set(posts.flatMap(post => post.meta.tags))]

  const postsByCategory = allTags.reduce((acc, tag) => {
    const categoryPosts = posts.filter(post => post.meta.tags.includes(tag))
    acc[tag] = sortByDateDesc(categoryPosts)
    return acc
  }, {} as Record<string, typeof posts>)

  return (
    <>
      <header className="blog-header">
        <h1>Yazılar</h1>
        <p className="blog-subtitle">
          Yazılım, teknoloji ve hayat üzerine düşünceler.
        </p>
      </header>

      <div className="category-sections">
        {allTags.map(tag => {
          const allPosts = postsByCategory[tag]
          const displayPosts = allPosts.slice(0, POSTS_PER_CATEGORY)

          return (
            <section key={tag} className="category-section">
              <Link to={`/kategori/${tag}`} className="category-header">
                <div className="category-header-left">
                  <span className="category-label">{categoryInfo[tag]?.title || tag}</span>
                  <span className="category-count">{allPosts.length}</span>
                </div>
                <svg className="category-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>

              <div className="posts-grid">
                {displayPosts.map((post) => (
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

            </section>
          )
        })}
      </div>

      {collections.length > 0 && (
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
