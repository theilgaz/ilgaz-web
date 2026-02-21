import { Link } from 'react-router-dom'
import { collections } from '../content/collections'
import { postsBySlug } from '../content/posts'

export function Collections() {
  return (
    <>
      <blockquote className="page-quote">
        "Her yolculuk bir adımla başlar."
      </blockquote>

      <h1>Koleksiyonlar</h1>
      <p className="lead">
        Birbirine bağlı yazı serileri. Her koleksiyon bir yolculuk.
      </p>

      <div className="collections-grid">
        {collections.map((collection) => {
          const totalReadingTime = collection.posts.reduce((acc, slug) => {
            const post = postsBySlug[slug]
            return acc + (post?.meta.readingTime || 0)
          }, 0)

          return (
            <Link
              key={collection.slug}
              to={`/koleksiyonlar/${collection.slug}`}
              className="collection-card"
            >
              <h2 className="collection-title">{collection.title}</h2>
              <p className="collection-description">{collection.description}</p>
              <div className="collection-meta">
                <span>{collection.posts.length} yazı</span>
                <span className="separator">·</span>
                <span>{totalReadingTime} dk</span>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
