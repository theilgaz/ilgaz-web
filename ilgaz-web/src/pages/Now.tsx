export function Now() {
  return (
    <>
      <h1>Şu An</h1>
      <p className="lead">
        Hayatımda neler oluyor, ne yapıyorum.
      </p>
      <p className="meta" style={{ marginBottom: '64px' }}>
        Son güncelleme: Şubat 2026, Konya
      </p>

      <div className="now-two-worlds">
        <section className="now-world">
          <h2 className="now-section-title"><span className="now-icon">●</span> İç Dünya</h2>
          <ul className="now-simple-list">
            <li>
              <span className="now-simple-label">ezberliyorum</span>
              <div className="now-simple-content">
                <span className="now-simple-title">Mülk Suresi</span>
                <div className="now-progress">
                  <div className="now-progress-bar">
                    <div className="now-progress-fill" style={{ width: '0%' }} />
                  </div>
                  <span className="now-progress-text">0 / 30 ayet</span>
                </div>
              </div>
            </li>
            <li>
              <span className="now-simple-label">öğreniyorum</span>
              <div className="now-simple-content">
                <span className="now-simple-title">Arapça</span>
                <span className="now-simple-badge">A2</span>
              </div>
            </li>
            <li>
              <span className="now-simple-label">izliyorum</span>
              <div className="now-simple-content">
                <span className="now-simple-title">
                  <a href="https://www.youtube.com/watch?v=poiBVJOvNzo" target="_blank" rel="noopener noreferrer">
                    عمر بن الخطاب
                  </a>
                </span>
                <span className="now-simple-desc">Hz. Ömer dizisi</span>
              </div>
            </li>
          </ul>
        </section>

        <section className="now-world">
          <h2 className="now-section-title"><span className="now-icon">○</span> Dış Dünya</h2>
          <ul className="now-simple-list">
            <li>
              <span className="now-simple-label">çalışıyorum</span>
              <div className="now-simple-content">
                <span className="now-simple-title">Kişisel web sitesi</span>
                <span className="now-simple-desc">E-Ink hissiyatında, minimalist alan</span>
              </div>
            </li>
            <li>
              <span className="now-simple-label">çalışıyorum</span>
              <div className="now-simple-content">
                <span className="now-simple-title">Kitap fikri</span>
                <span className="now-simple-desc">Teknik deneyimler ve çözümler</span>
              </div>
            </li>
            <li>
              <span className="now-simple-label">öğreniyorum</span>
              <div className="now-simple-content">
                <span className="now-simple-title">TanStack Start</span>
                <span className="now-simple-desc">Bu projede kullanmaya başladım</span>
              </div>
            </li>
            <li>
              <span className="now-simple-label">birlikte kuruyoruz</span>
              <div className="now-simple-content">
                <span className="now-simple-title">
                  <a href="https://konyahackerspace.org" target="_blank" rel="noopener noreferrer">Konya Hackerspace</a>
                </span>
                <span className="now-simple-desc">Makers için ortak çalışma ve üretim alanı</span>
              </div>
            </li>
          </ul>
        </section>
      </div>

      <hr />

      <p className="meta">
        Bu sayfa{' '}
        <a href="https://nownownow.com/about" target="_blank" rel="noopener noreferrer">
          nownownow.com
        </a>{' '}
        hareketinden ilham alıyor.
      </p>
    </>
  )
}
