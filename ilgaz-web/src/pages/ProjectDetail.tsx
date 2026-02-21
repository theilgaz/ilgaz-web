import { useParams, Navigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { projectsBySlug } from '../content/projects'

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? projectsBySlug[slug] : null
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  const { data } = project

  return (
    <article className="newspaper">
      <header className="newspaper-header">
        <div className="newspaper-masthead">
          <span className="newspaper-issue">Teşebbüs {data.issue}</span>
          <span className="newspaper-date">{data.date}</span>
          <span className="newspaper-pub">İcad Defteri</span>
        </div>
        <div className="newspaper-rule" />
        <h1 className="newspaper-headline">{project.meta.name}</h1>
        <p className="newspaper-subhead">{data.tagline}</p>
        <div className="newspaper-byline">
          <span className="newspaper-status">{data.status}</span>
        </div>
        <div className="newspaper-rule" />
      </header>

      {data.heroImage && (
        <figure className="newspaper-hero" onClick={() => setLightboxImage(data.heroImage!.src)}>
          <img src={data.heroImage.src} alt={data.heroImage.caption} />
          <figcaption>{data.heroImage.caption}</figcaption>
        </figure>
      )}

      <div className="newspaper-body">
        <div className="newspaper-column newspaper-column-main">
          {data.motivation.split('\n\n').map((para, i) => (
            <p key={i} className={i === 0 ? 'newspaper-dropcap' : ''}>{para}</p>
          ))}

          <blockquote className="newspaper-pullquote">
            {data.pullQuote}
          </blockquote>

          <h2 className="newspaper-section-title">Hedefler</h2>
          <ul className="newspaper-list">
            {data.goals.map((goal, i) => (
              <li key={i}>{goal}</li>
            ))}
          </ul>

          <h2 className="newspaper-section-title">Kazanımlar</h2>
          <ul className="newspaper-list">
            {data.outcomes.map((outcome, i) => (
              <li key={i}>{outcome}</li>
            ))}
          </ul>
        </div>

        <aside className="newspaper-column newspaper-column-side">
          {data.gallery && data.gallery.length > 0 && (
            <div className="newspaper-gallery">
              {data.gallery.map((img, i) => (
                <figure key={i} onClick={() => setLightboxImage(img.src)}>
                  <img src={img.src} alt={img.caption} />
                  <figcaption>{img.caption}</figcaption>
                </figure>
              ))}
            </div>
          )}

          {data.specs && (
            <div className="newspaper-specs">
              <h3 className="newspaper-specs-title">Donanım</h3>
              <dl className="newspaper-specs-list">
                {data.specs.map((spec, i) => (
                  <div key={i} className="newspaper-spec-item">
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </aside>
      </div>

      <footer className="newspaper-footer">
        <div className="newspaper-rule" />
        <Link to="/projects" className="newspaper-back">← Tüm Projeler</Link>
      </footer>

      {lightboxImage && (
        <div className="lightbox" onClick={() => setLightboxImage(null)}>
          <img src={lightboxImage} alt="Büyütülmüş görsel" />
        </div>
      )}
    </article>
  )
}
