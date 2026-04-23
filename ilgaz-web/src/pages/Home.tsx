import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { posts } from '../content/posts'
import { projects } from '../content/projects'

export function Home() {
  useDocumentTitle('ana sayfa')
  const [showPhoto, setShowPhoto] = useState(false)

  const recentPosts = posts.slice(0, 5)
  const recentProjects = projects.slice(0, 4)

  return (
    <>
      {/* ─────────── HERO ─────────── */}
      <section className="hero">
        <div className="glyph">ı</div>
        <h1>Yazmak, inşa etmek ve <em>yüksek sesle düşünmek</em>.</h1>
        <p className="lede">
          Ben Abdullah Ilgaz. Küçük deneyleri, yavaş okumaları ve var olmasını dilediğim yazılımları belgeleyen bir mühendis ve yazar. Burası taslakların yaşadığı sessiz köşe.
        </p>
      </section>

      {/* ─────────── NOW ─────────── */}
      <section className="section wrap" id="now">
        <div className="section-head">
          <div className="idx">§ 01 Şimdi</div>
          <div>
            <h2>Bu hafta <em>ne yapıyorum</em>.</h2>
            <div className="sub">Canlı bir kesit. Genellikle Pazar günleri güncellenir.</div>
          </div>
        </div>
        <div className="now-panel">
          <div>
            <div className="k">Okuyorum</div>
            <div className="v"><em>Kur'an-ı Kerim</em>.</div>
          </div>
          <div>
            <div className="k">İnşa ediyorum</div>
            <div className="v"><em>Mahfuz</em>, Kur'an öğrenim platformu.</div>
          </div>
          <div>
            <div className="k">Dinliyorum</div>
            <div className="v">Sessizlik ve düşüncenin uğultusu.</div>
          </div>
        </div>
      </section>

      {/* ─────────── WRITING ─────────── */}
      <section className="section wrap" id="writing">
        <div className="section-head">
          <div className="idx">§ 02 Yazı</div>
          <div>
            <h2>Son <em>yazılar</em>.</h2>
            <div className="sub">Denemeler, notlar ve küçük teknik parçalar. Bülten yok, sadece düzenli okuma.</div>
          </div>
        </div>
        <div className="writing-list">
          {recentPosts.map(post => (
            <Link to={`/blog/${post.meta.slug}`} className="writing-entry" key={post.meta.slug}>
              <div className="date">{post.meta.date}</div>
              <div>
                <div className="title">{post.meta.title}</div>
              </div>
              <div className="read">{post.meta.readingTime} dk</div>
            </Link>
          ))}
        </div>
        <div className="writing-more">
          <Link to="/blog" className="link">Tüm yazılar ({posts.length} yazı) →</Link>
        </div>
      </section>

      {/* ─────────── WORK ─────────── */}
      <section className="section wrap" id="work">
        <div className="section-head">
          <div className="idx">§ 03 Proje</div>
          <div>
            <h2>Yaptığım <em>şeyler</em>.</h2>
            <div className="sub">Küçük, tamamlanmış ve hâlâ çevrimiçi.</div>
          </div>
        </div>
        <div className="work-grid">
          {recentProjects.map(project => (
            <Link to={`/projects/${project.meta.slug}`} className="work-card" key={project.meta.slug}>
              <div className="year">{project.data.date}</div>
              <div className="thumb">
                {project.data.heroImage ? (
                  <img src={project.data.heroImage.src} alt={project.meta.name} />
                ) : (
                  <span>ekran</span>
                )}
              </div>
              <h3>{project.meta.name}</h3>
              <div className="tagline">{project.meta.description}</div>
              {project.data.specs && (
                <div className="tags">
                  {project.data.specs.slice(0, 3).map(s => (
                    <span className="tag" key={s.label}>{s.value}</span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* ─────────── ABOUT ─────────── */}
      <section className="section wrap" id="about">
        <div className="section-head">
          <div className="idx">§ 04 Hakkında</div>
          <div>
            <h2>Kısa <em>biyografi</em>.</h2>
            <div className="sub">Zaman zaman güncellenir.</div>
          </div>
        </div>
        <div className="about-grid">
          <div>
            <div className="portrait" onClick={() => setShowPhoto(true)} style={{ cursor: 'pointer' }}>
              <img src="/photo.jpg" alt="Abdullah Ilgaz" />
            </div>
            <div className="portrait-caption">Abdullah Ilgaz</div>
          </div>
          <div className="about-copy">
            <p>
              Zihnimin kıvrımlarında dolaşan düşünceler buraya dökülüyor.
              Bazen bir satır kod, bazen bir tefekkür, bazen sadece sessizlik.
              Algoritmalar yok, beğeni sayıları yok. Sadece sen ve düşünceler.
              Merak eden keşfeder.
            </p>
            <p>
              Bu web sitesi bir <Link to="/blog" className="link">not defteri</Link>. Okuduklarımın,
              inşa ettiklerimin ve anlamaya çalıştıklarımın yavaş, el yapımı bir dizini.
              Bülten yok, önemli olan bir analitik yok.
            </p>
            <p>
              İletişime geçmek istersen <a href="mailto:ilgazdc@gmail.com" className="link">e-posta</a> ile yaklaşık bir hafta içinde yanıt veririm.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── MAHFUZ PROMO ─────────── */}
      <section className="section wrap">
        <a href="https://mahfuz.ilg.az" target="_blank" rel="noopener noreferrer" className="landing-promo">
          <img src="/images/mahfuz-logo.png" alt="Mahfuz" className="landing-promo-logo" />
          <span className="landing-promo-name">Mahfuz</span>
          <span className="landing-promo-desc">Kur'an öğrenim platformu. Sureler, Elif-Ba ve oyunlarla öğren.</span>
          <span className="landing-promo-link">mahfuz.ilg.az →</span>
        </a>
      </section>

      {showPhoto && (
        <div className="photo-modal" onClick={() => setShowPhoto(false)}>
          <img src="/photo.jpg" alt="Abdullah Ilgaz" />
        </div>
      )}
    </>
  )
}
