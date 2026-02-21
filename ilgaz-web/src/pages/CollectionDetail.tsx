import { Link, useParams } from 'react-router-dom'
import { collectionsBySlug } from '../content/collections'
import { postsBySlug } from '../content/posts'

export function CollectionDetail() {
  const { slug } = useParams()
  const collection = collectionsBySlug[slug || '']

  if (!collection) {
    return (
      <div>
        <h1>Koleksiyon bulunamadı</h1>
        <p>
          <Link to="/koleksiyonlar">← Tüm koleksiyonlara dön</Link>
        </p>
      </div>
    )
  }

  const posts = collection.posts
    .map(postSlug => postsBySlug[postSlug])
    .filter(Boolean)

  const totalReadingTime = posts.reduce((acc, post) => acc + post.meta.readingTime, 0)

  return (
    <>
      <header className="collection-header">
        <Link to="/koleksiyonlar" className="back-link-small">
          ← koleksiyonlar
        </Link>
        <h1>{collection.title}</h1>
        <p className="lead">{collection.description}</p>
        <div className="collection-stats">
          <span>{posts.length} yazı</span>
          <span className="separator">·</span>
          <span>{totalReadingTime} dk toplam okuma</span>
        </div>
      </header>

      <ol className="collection-posts">
        {posts.map((post, index) => (
          <li key={post.meta.slug} className="collection-post-item">
            <span className="collection-post-number">{index + 1}</span>
            <div className="collection-post-content">
              <h3 className="collection-post-title">
                <Link to={`/blog/${post.meta.slug}`}>{post.meta.title}</Link>
              </h3>
              <span className="collection-post-time">{post.meta.readingTime} dk</span>
            </div>
          </li>
        ))}
      </ol>

      <footer className="collection-footer">
        <Link to={`/blog/${collection.posts[0]}`} className="start-reading-btn">
          Okumaya başla →
        </Link>
      </footer>
    </>
  )
}
