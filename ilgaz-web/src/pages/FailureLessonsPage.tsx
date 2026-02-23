import { useState, useCallback, useEffect } from 'react'

const failedStartups = [
  { name: "Vine", idea: "6 saniyelik video paylaşım platformu", raised: "$25M", year: 2016, reason: "Twitter satın aldı ama monetize edemedi", category: "Sosyal Medya" },
  { name: "Google+", idea: "Google'ın sosyal ağ denemesi", raised: "Google", year: 2019, reason: "Kullanıcılar Facebook'tan geçmedi", category: "Sosyal Medya" },
  { name: "Quibi", idea: "Mobil için kısa video içerikleri", raised: "$1.75B", year: 2020, reason: "TikTok ve YouTube zaten vardı", category: "Medya" },
  { name: "Mixer", idea: "Microsoft'un Twitch rakibi", raised: "Microsoft", year: 2020, reason: "Streamer'lar Twitch'i bırakmadı", category: "Streaming" },
  { name: "Theranos", idea: "Bir damla kanla tüm testler", raised: "$700M", year: 2018, reason: "Teknoloji hiç çalışmadı, fraud", category: "Sağlık" },
  { name: "Jawbone", idea: "Akıllı fitness bilekliği", raised: "$930M", year: 2017, reason: "Fitbit ve Apple Watch rekabeti", category: "Donanım" },
  { name: "Rdio", idea: "Spotify benzeri müzik servisi", raised: "$125M", year: 2015, reason: "Spotify çok hızlı büyüdü", category: "Müzik" },
  { name: "Secret", idea: "Anonim sosyal ağ", raised: "$35M", year: 2015, reason: "Cyberbullying sorunu çözülemedi", category: "Sosyal Medya" },
  { name: "Yik Yak", idea: "Lokasyon bazlı anonim mesajlaşma", raised: "$73M", year: 2017, reason: "Üniversite sonrası kullanım düştü", category: "Sosyal Medya" },
  { name: "Homejoy", idea: "Ev temizliği için Uber", raised: "$64M", year: 2015, reason: "Temizlikçiler bağımsız çalışmayı tercih etti", category: "On-demand" },
  { name: "Beepi", idea: "Peer-to-peer araba satışı", raised: "$150M", year: 2017, reason: "Unit economics negatifti", category: "E-ticaret" },
  { name: "Juicero", idea: "700$'lık WiFi'lı meyve sıkacağı", raised: "$120M", year: 2017, reason: "Poşetler elle sıkılabiliyordu", category: "Donanım" },
  { name: "Katerra", idea: "Teknoloji odaklı inşaat", raised: "$2B", year: 2021, reason: "İnşaat sektörü disrupt edilemedi", category: "İnşaat" },
  { name: "MoviePass", idea: "Sınırsız sinema aboneliği", raised: "$68M", year: 2019, reason: "Her bilet için para kaybediyorlardı", category: "Eğlence" },
  { name: "Essential", idea: "Android yaratıcısının telefonu", raised: "$330M", year: 2020, reason: "iPhone/Samsung duopolü kırılamadı", category: "Donanım" },
  { name: "Shyp", idea: "On-demand kargo gönderimi", raised: "$62M", year: 2018, reason: "Marjlar çok düşüktü", category: "Lojistik" },
  { name: "Meerkat", idea: "Canlı video streaming öncüsü", raised: "$14M", year: 2016, reason: "Periscope ve Facebook Live ezdi", category: "Streaming" },
  { name: "Fab", idea: "Flash-sale e-ticaret", raised: "$336M", year: 2015, reason: "Kontrolsüz büyüme, cash burn", category: "E-ticaret" },
  { name: "Aereo", idea: "Online TV yayın servisi", raised: "$97M", year: 2014, reason: "Telif hakları davası kaybedildi", category: "Medya" },
  { name: "Pets.com", idea: "Online evcil hayvan ürünleri", raised: "$110M", year: 2000, reason: "Dot-com balonu patladı, lojistik maliyetleri", category: "E-ticaret" },
  { name: "Webvan", idea: "Online market alışverişi", raised: "$800M", year: 2001, reason: "Altyapı yatırımları çok yüksekti", category: "E-ticaret" },
  { name: "Color Labs", idea: "Fotoğraf paylaşım uygulaması", raised: "$41M", year: 2012, reason: "Ürün-pazar uyumu bulunamadı", category: "Sosyal Medya" },
  { name: "Clinkle", idea: "Mobil ödeme uygulaması", raised: "$30M", year: 2015, reason: "Hiçbir zaman lansman yapamadı", category: "Fintech" },
  { name: "Better Place", idea: "Elektrikli araç batarya değişimi", raised: "$850M", year: 2013, reason: "Altyapı maliyetleri sürdürülemezdi", category: "Otomotiv" },
]

type SortBy = 'random' | 'year' | 'raised'

function parseRaised(raised: string): number {
  if (raised === 'Google' || raised === 'Microsoft') return 10000
  const match = raised.match(/\$?([\d.]+)([MB])?/)
  if (!match) return 0
  const num = parseFloat(match[1])
  const unit = match[2]
  if (unit === 'B') return num * 1000
  return num
}

export function FailureLessonsPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sortBy, setSortBy] = useState<SortBy>('random')
  const [shuffledStartups, setShuffledStartups] = useState(failedStartups)
  const [isAutoPlay, setIsAutoPlay] = useState(false)

  const sortStartups = useCallback((sort: SortBy) => {
    let sorted = [...failedStartups]
    if (sort === 'year') {
      sorted.sort((a, b) => b.year - a.year)
    } else if (sort === 'raised') {
      sorted.sort((a, b) => parseRaised(b.raised) - parseRaised(a.raised))
    } else {
      sorted = sorted.sort(() => Math.random() - 0.5)
    }
    setShuffledStartups(sorted)
    setCurrentIndex(0)
  }, [])

  useEffect(() => {
    sortStartups(sortBy)
  }, [sortBy, sortStartups])

  useEffect(() => {
    if (!isAutoPlay) return
    const interval = setInterval(() => {
      setCurrentIndex(i => (i + 1) % shuffledStartups.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlay, shuffledStartups.length])

  const next = () => setCurrentIndex(i => (i + 1) % shuffledStartups.length)
  const prev = () => setCurrentIndex(i => (i - 1 + shuffledStartups.length) % shuffledStartups.length)

  const startup = shuffledStartups[currentIndex]

  const totalRaised = failedStartups.reduce((acc, s) => acc + parseRaised(s.raised), 0)

  return (
    <div className="failure-page">
      <h1>Başarısızlık Dersleri</h1>
      <p className="lead">
        Milyonlarca dolar yatırım aldılar, yine de battılar. Her başarısızlık bir ders.
      </p>

      <div className="failure-stats">
        <div className="failure-stat">
          <span className="failure-stat-value">{failedStartups.length}</span>
          <span className="failure-stat-label">Başarısız Girişim</span>
        </div>
        <div className="failure-stat">
          <span className="failure-stat-value">${(totalRaised / 1000).toFixed(1)}B+</span>
          <span className="failure-stat-label">Toplam Yatırım</span>
        </div>
        <div className="failure-stat">
          <span className="failure-stat-value">2000-2021</span>
          <span className="failure-stat-label">Dönem</span>
        </div>
      </div>

      <div className="failure-page-content">
        <div className="failure-controls">
          <div className="failure-sort">
            <button
              className={sortBy === 'random' ? 'active' : ''}
              onClick={() => setSortBy('random')}
            >
              Rastgele
            </button>
            <button
              className={sortBy === 'year' ? 'active' : ''}
              onClick={() => setSortBy('year')}
            >
              Yıla Göre
            </button>
            <button
              className={sortBy === 'raised' ? 'active' : ''}
              onClick={() => setSortBy('raised')}
            >
              Yatırıma Göre
            </button>
          </div>
          <button
            className={`failure-autoplay ${isAutoPlay ? 'active' : ''}`}
            onClick={() => setIsAutoPlay(!isAutoPlay)}
          >
            {isAutoPlay ? '⏸ Durdur' : '▶ Otomatik'}
          </button>
        </div>

        <div className="failure-card-large">
          <div className="failure-card-header">
            <div className="failure-card-meta">
              <span className="failure-card-category">{startup.category}</span>
              <span className="failure-card-year">{startup.year}</span>
            </div>
            <span className="failure-card-raised">{startup.raised}</span>
          </div>

          <h2 className="failure-card-name">{startup.name}</h2>
          <p className="failure-card-idea">{startup.idea}</p>

          <div className="failure-card-reason">
            <span className="failure-card-reason-label">Neden Battı?</span>
            <p>{startup.reason}</p>
          </div>

          <div className="failure-card-nav">
            <button onClick={prev} className="failure-nav-btn">←</button>
            <span className="failure-card-counter">
              {currentIndex + 1} / {shuffledStartups.length}
            </span>
            <button onClick={next} className="failure-nav-btn">→</button>
          </div>
        </div>

        <div className="failure-grid">
          {shuffledStartups.map((s, i) => (
            <button
              key={s.name}
              className={`failure-grid-item ${i === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(i)}
            >
              <span className="failure-grid-name">{s.name}</span>
              <span className="failure-grid-raised">{s.raised}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="failure-page-hint">
        Her başarısızlık, bir sonraki girişimci için değerli bir ders.
      </div>
    </div>
  )
}
