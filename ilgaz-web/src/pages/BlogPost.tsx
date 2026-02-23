import { Link, useParams } from 'react-router-dom'
import { postsBySlug } from '../content/posts'
import { getCollectionForPost, getPostPositionInCollection } from '../content/collections'

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
  const collection = getCollectionForPost(meta.slug)
  const positionInCollection = collection ? getPostPositionInCollection(meta.slug, collection) : -1
  const prevPost = collection && positionInCollection > 0
    ? postsBySlug[collection.posts[positionInCollection - 1]]
    : null
  const nextPost = collection && positionInCollection < collection.posts.length - 1
    ? postsBySlug[collection.posts[positionInCollection + 1]]
    : null

  return (
    <article>
      {collection && (
        <div className="collection-indicator">
          <div className="collection-indicator-label">koleksiyon</div>
          <h3 className="collection-indicator-title">
            <Link to={`/collections/${collection.slug}`}>{collection.title}</Link>
          </h3>
          <div className="collection-indicator-position">
            {positionInCollection + 1} / {collection.posts.length}
          </div>
        </div>
      )}

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
        {collection && (prevPost || nextPost) && (
          <div className="collection-nav">
            <div className="collection-nav-item">
              {prevPost && (
                <>
                  <div className="collection-nav-label">← önceki</div>
                  <Link to={`/blog/${prevPost.meta.slug}`} className="collection-nav-link">
                    {prevPost.meta.title}
                  </Link>
                </>
              )}
            </div>
            <div className="collection-nav-item next">
              {nextPost && (
                <>
                  <div className="collection-nav-label">sonraki →</div>
                  <Link to={`/blog/${nextPost.meta.slug}`} className="collection-nav-link">
                    {nextPost.meta.title}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

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
