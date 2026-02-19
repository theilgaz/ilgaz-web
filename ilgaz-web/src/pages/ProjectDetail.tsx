import { useParams, Navigate, Link } from 'react-router-dom'
import { useState } from 'react'

const projects: Record<string, {
  name: string
  tagline: string
  issue: string
  date: string
  status: string
  pullQuote: string
  motivation: string
  goals: string[]
  outcomes: string[]
  specs?: { label: string; value: string }[]
  heroImage?: { src: string; caption: string }
  gallery?: { src: string; caption: string }[]
}> = {
  'seyyar-42': {
    name: 'Seyyar 42',
    tagline: 'Göçer ruha, sabit güç.',
    issue: '01',
    date: 'Şubat 2026',
    status: 'Tasarım Aşamasında',
    pullQuote: 'Satın alma, inşa et.',
    motivation: `Güçlü bir makine, ama taşınabilir. Hazır çözüm yoktu, iş başa düştü. Gerçek bir taşınabilir iş istasyonu projenin temel amacı.

Kendi bilgisayarını kendin yapabilirsin. Bu proje, bunun mümkün olduğunu kanıtlamak için var.`,
    goals: [
      'Tek parça taşınabilir sistem',
      '3D baskı özel kasa (FDM, PLA)',
      'Temiz kablo yönetimi',
      'Hızlı kurulum — 1 dakikadan kısa',
      'Cyberpunk estetiği',
      'Gençlere ilham: kendi bilgisayarını kendin tasarla',
      'Hackerspace ve maker kültürünü yaymak',
    ],
    outcomes: [
      '3D modelleme ve FDM baskı deneyimi',
      'Kasa tasarımı ve ergonomi',
      'Apple ekosistemi ile donanım entegrasyonu',
      'Menteşe ve kablo kanalı mühendisliği',
    ],
    specs: [
      { label: 'Bilgisayar', value: 'Mac M4 Mini' },
      { label: 'Ekran', value: 'MSI 15.6" PRO MP161 E2U' },
      { label: 'Klavye', value: 'Logitech Pebble 2' },
      { label: 'Trackpad', value: 'Magic Trackpad 2' },
      { label: 'Kasa', value: '3D Baskı PLA (FDM)' },
    ],
    heroImage: { src: '/nomad42_blueprint.png', caption: 'Teknik çizim — CD-001-REV-A' },
    gallery: [
      { src: '/nomad42_topview.png', caption: 'Üstten görünüm' },
      { src: '/nomad42_overview.png', caption: 'Genel görünüm' },
    ],
  },
}

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? projects[slug] : null
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  return (
    <article className="newspaper">
      <header className="newspaper-header">
        <div className="newspaper-masthead">
          <span className="newspaper-issue">Teşebbüs {project.issue}</span>
          <span className="newspaper-date">{project.date}</span>
          <span className="newspaper-pub">İcad Defteri</span>
        </div>
        <div className="newspaper-rule" />
        <h1 className="newspaper-headline">{project.name}</h1>
        <p className="newspaper-subhead">{project.tagline}</p>
        <div className="newspaper-byline">
          <span className="newspaper-status">{project.status}</span>
        </div>
        <div className="newspaper-rule" />
      </header>

      {project.heroImage && (
        <figure className="newspaper-hero" onClick={() => setLightboxImage(project.heroImage!.src)}>
          <img src={project.heroImage.src} alt={project.heroImage.caption} />
          <figcaption>{project.heroImage.caption}</figcaption>
        </figure>
      )}

      <div className="newspaper-body">
        <div className="newspaper-column newspaper-column-main">
          {project.motivation.split('\n\n').map((para, i) => (
            <p key={i} className={i === 0 ? 'newspaper-dropcap' : ''}>{para}</p>
          ))}

          <blockquote className="newspaper-pullquote">
            {project.pullQuote}
          </blockquote>

          <h2 className="newspaper-section-title">Hedefler</h2>
          <ul className="newspaper-list">
            {project.goals.map((goal, i) => (
              <li key={i}>{goal}</li>
            ))}
          </ul>

          <h2 className="newspaper-section-title">Kazanımlar</h2>
          <ul className="newspaper-list">
            {project.outcomes.map((outcome, i) => (
              <li key={i}>{outcome}</li>
            ))}
          </ul>
        </div>

        <aside className="newspaper-column newspaper-column-side">
          {project.gallery && project.gallery.length > 0 && (
            <div className="newspaper-gallery">
              {project.gallery.map((img, i) => (
                <figure key={i} onClick={() => setLightboxImage(img.src)}>
                  <img src={img.src} alt={img.caption} />
                  <figcaption>{img.caption}</figcaption>
                </figure>
              ))}
            </div>
          )}

          {project.specs && (
            <div className="newspaper-specs">
              <h3 className="newspaper-specs-title">Donanım</h3>
              <dl className="newspaper-specs-list">
                {project.specs.map((spec, i) => (
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
