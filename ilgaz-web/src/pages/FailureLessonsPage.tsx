import { useState, useCallback, useEffect } from 'react'

interface FailedStartup {
  name: string
  idea: string
  raised: string
  year: number
  reason: string
  doThis: string
  dontDoThis: string
  category: 'market' | 'product' | 'money' | 'team' | 'timing'
}

const categoryLabels = {
  market: { label: 'Pazar', color: '#8b5cf6' },
  product: { label: 'Ürün', color: '#f59e0b' },
  money: { label: 'Finans', color: '#ef4444' },
  team: { label: 'Ekip', color: '#22c55e' },
  timing: { label: 'Zamanlama', color: '#3b82f6' },
}

const failedStartups: FailedStartup[] = [
  {
    name: "Quibi",
    idea: "Mobil için kısa premium video içerikleri",
    raised: "$1.75B",
    year: 2020,
    reason: "TikTok ve YouTube zaten ücretsiz içerik sunuyordu, pandemi zamanlaması kötüydü",
    doThis: "Lansmandan önce rakip analizi yap, ücretsiz alternatiflerle nasıl rekabet edeceğini planla",
    dontDoThis: "Pazarda zaten ücretsiz çözümler varken premium fiyatlandırma yapma",
    category: 'market'
  },
  {
    name: "Theranos",
    idea: "Bir damla kanla tüm testler",
    raised: "$700M",
    year: 2018,
    reason: "Teknoloji hiç çalışmadı, yatırımcılar ve düzenleyiciler kandırıldı",
    doThis: "Ürünün gerçekten çalıştığını kanıtla, şeffaf ol, bağımsız doğrulama yaptır",
    dontDoThis: "Olmayan bir teknolojiyi varmış gibi satma, yatırımcıları yanıltma",
    category: 'product'
  },
  {
    name: "WeWork",
    idea: "Paylaşımlı ofis alanları",
    raised: "$12B",
    year: 2019,
    reason: "Aşırı değerleme, kontrolsüz harcama, zayıf kurumsal yönetim",
    doThis: "Gerçekçi değerleme yap, maliyetleri kontrol et, yönetim kurulunu güçlü tut",
    dontDoThis: "Büyüme uğruna karlılığı tamamen göz ardı etme, CEO'ya sınırsız yetki verme",
    category: 'money'
  },
  {
    name: "Juicero",
    idea: "$700'lık WiFi'lı meyve sıkacağı",
    raised: "$120M",
    year: 2017,
    reason: "Poşetler elle sıkılabiliyordu, ürün gereksiz karmaşıklıktaydı",
    doThis: "Ürünün gerçek bir sorunu çözüp çözmediğini test et, MVP ile başla",
    dontDoThis: "Basit bir işi gereksiz yere karmaşıklaştırma, over-engineering yapma",
    category: 'product'
  },
  {
    name: "MoviePass",
    idea: "Aylık $10'a sınırsız sinema bileti",
    raised: "$68M",
    year: 2019,
    reason: "Her bilet için $5-10 kaybediyorlardı, unit economics hiç çalışmadı",
    doThis: "Unit economics'i en baştan hesapla, her işlemde para kazan",
    dontDoThis: "Sürdürülemez fiyatlandırmayla büyümeye çalışma",
    category: 'money'
  },
  {
    name: "Vine",
    idea: "6 saniyelik video paylaşım platformu",
    raised: "$25M",
    year: 2016,
    reason: "Twitter satın aldı ama monetize edemedi, creator'lar Instagram'a kaçtı",
    doThis: "İçerik üreticilerini mutlu et, onlara para kazandır, platform ekonomisini kur",
    dontDoThis: "Platform büyüdükten sonra creator'ları ihmal etme",
    category: 'team'
  },
  {
    name: "Google+",
    idea: "Google'ın sosyal ağ denemesi",
    raised: "Google",
    year: 2019,
    reason: "Kullanıcılar Facebook'tan geçmedi, net farklılaşma yoktu",
    doThis: "Rakipten net bir şekilde farklılaş, geçiş için güçlü sebep sun",
    dontDoThis: "Sadece büyük şirket olduğun için başaracağını varsayma",
    category: 'market'
  },
  {
    name: "Katerra",
    idea: "Teknoloji odaklı inşaat şirketi",
    raised: "$2B",
    year: 2021,
    reason: "İnşaat sektörü çok karmaşık, tek başına teknoloji yetmedi",
    doThis: "Sektörü derinlemesine anla, adım adım ilerle, pilot projelerle test et",
    dontDoThis: "Geleneksel sektörleri teknoloji ile hızla disrupt edebileceğini sanma",
    category: 'market'
  },
  {
    name: "Pets.com",
    idea: "Online evcil hayvan ürünleri satışı",
    raised: "$110M",
    year: 2000,
    reason: "Nakliye maliyetleri ürün fiyatını aştı, dot-com balonu patladı",
    doThis: "Lojistik maliyetlerini en baştan hesapla, marjları koru",
    dontDoThis: "Ağır/hacimli ürünleri düşük marjla online satma",
    category: 'money'
  },
  {
    name: "Mixer",
    idea: "Microsoft'un Twitch rakibi",
    raised: "Microsoft",
    year: 2020,
    reason: "Streamer'lar ve izleyiciler Twitch'i bırakmadı, topluluk oluşmadı",
    doThis: "Network effect'i kırmak için devrimci bir değer öner",
    dontDoThis: "Para atarak topluluk satın alabileceğini düşünme",
    category: 'market'
  },
  {
    name: "Jawbone",
    idea: "Akıllı fitness bilekliği",
    raised: "$930M",
    year: 2017,
    reason: "Fitbit ve Apple Watch rekabeti, kalite sorunları",
    doThis: "Rakiplerin bir adım önünde ol, kaliteyi asla feda etme",
    dontDoThis: "Büyük rakipler varken fiyat/kalite dengesini kaçırma",
    category: 'product'
  },
  {
    name: "Webvan",
    idea: "Online market alışverişi",
    raised: "$800M",
    year: 2001,
    reason: "Devasa depo ve filo yatırımları, talep yeterli değildi",
    doThis: "Talebi doğrulamadan altyapı yatırımı yapma, kademeli büyü",
    dontDoThis: "Müşteri kazanmadan ölçeklendirme yapma",
    category: 'timing'
  },
  {
    name: "Better Place",
    idea: "Elektrikli araç batarya değişim istasyonları",
    raised: "$850M",
    year: 2013,
    reason: "Altyapı maliyetleri sürdürülemezdi, otomobil üreticileri iş birliği yapmadı",
    doThis: "Ekosistem ortaklarını en baştan dahil et, altyapı maliyetlerini paylaş",
    dontDoThis: "Tüm ekosistemi tek başına kurmaya çalışma",
    category: 'money'
  },
  {
    name: "Secret",
    idea: "Anonim sosyal ağ",
    raised: "$35M",
    year: 2015,
    reason: "Cyberbullying sorunu çözülemedi, kullanıcı güvenliği sağlanamadı",
    doThis: "Güvenlik ve moderasyonu en baştan planla, topluluk kuralları koy",
    dontDoThis: "Anonimliği kötüye kullanıma açık bırakma",
    category: 'product'
  },
  {
    name: "Homejoy",
    idea: "Ev temizliği için on-demand platform",
    raised: "$64M",
    year: 2015,
    reason: "Temizlikçiler platformu bypass edip müşterilerle direkt çalıştı",
    doThis: "İki taraflı pazarda her iki tarafın da bağlılığını sağla",
    dontDoThis: "Arz tarafının platformu bypass etmesine izin verme",
    category: 'team'
  },
  {
    name: "Fab",
    idea: "Flash-sale tasarım e-ticaret",
    raised: "$336M",
    year: 2015,
    reason: "Kontrolsüz büyüme, pivot'lar, cash burn",
    doThis: "Bir iş modelinde ustalaş, sonra büyü",
    dontDoThis: "Çalışan bir model olmadan hızla ölçeklendirme yapma",
    category: 'money'
  },
  {
    name: "Rdio",
    idea: "Spotify benzeri müzik streaming servisi",
    raised: "$125M",
    year: 2015,
    reason: "Spotify çok hızlı büyüdü, telif maliyetleri ezdi",
    doThis: "Winner-takes-all pazarda ya birinci ol ya da farklılaş",
    dontDoThis: "Lider rakibi kopyalamaya çalışma",
    category: 'market'
  },
  {
    name: "Essential",
    idea: "Android yaratıcısından premium telefon",
    raised: "$330M",
    year: 2020,
    reason: "iPhone/Samsung duopolü kırılamadı, dağıtım kanalları yetersizdi",
    doThis: "Yerleşik pazarlarda net niş bul, dağıtımı güvence altına al",
    dontDoThis: "Sadece ürün kalitesiyle dev rakipleri yeneceğini sanma",
    category: 'market'
  },
  {
    name: "Aereo",
    idea: "Online TV yayın servisi",
    raised: "$97M",
    year: 2014,
    reason: "Yüksek Mahkeme telif hakları davasını kaybetti",
    doThis: "Yasal riskleri en baştan değerlendir, düzenleyicilerle çalış",
    dontDoThis: "Yasal gri alanları iş modeli olarak kullanma",
    category: 'timing'
  },
  {
    name: "Color Labs",
    idea: "Yakınlık bazlı fotoğraf paylaşım uygulaması",
    raised: "$41M",
    year: 2012,
    reason: "Ürün-pazar uyumu bulunamadı, Instagram zaten vardı",
    doThis: "MVP ile hızlı test et, ürün-pazar uyumunu kanıtla",
    dontDoThis: "Büyük yatırımla ürün-pazar uyumu olmadan çık",
    category: 'product'
  },
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
  const [showLessons, setShowLessons] = useState(false)

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
    setShowLessons(false)
  }, [])

  useEffect(() => {
    sortStartups(sortBy)
  }, [sortBy, sortStartups])

  useEffect(() => {
    if (!isAutoPlay) return
    const interval = setInterval(() => {
      setCurrentIndex(i => (i + 1) % shuffledStartups.length)
      setShowLessons(false)
    }, 7000)
    return () => clearInterval(interval)
  }, [isAutoPlay, shuffledStartups.length])

  const next = () => {
    setCurrentIndex(i => (i + 1) % shuffledStartups.length)
    setShowLessons(false)
  }
  const prev = () => {
    setCurrentIndex(i => (i - 1 + shuffledStartups.length) % shuffledStartups.length)
    setShowLessons(false)
  }

  const startup = shuffledStartups[currentIndex]
  const category = categoryLabels[startup.category]

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
              <span className="failure-card-category" style={{ background: category.color }}>
                {category.label}
              </span>
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

          <div className={`failure-card-lessons ${showLessons ? 'show' : ''}`}>
            <div className="failure-card-do">
              <div className="failure-card-do-header">
                <span className="failure-card-do-icon">✓</span>
                <span className="failure-card-do-title">Bunu Yap</span>
              </div>
              <p>{startup.doThis}</p>
            </div>
            <div className="failure-card-dont">
              <div className="failure-card-dont-header">
                <span className="failure-card-dont-icon">✗</span>
                <span className="failure-card-dont-title">Bunu Yapma</span>
              </div>
              <p>{startup.dontDoThis}</p>
            </div>
          </div>

          {!showLessons && (
            <button className="failure-show-lesson-btn" onClick={() => setShowLessons(true)}>
              Dersi Gör
            </button>
          )}

          <div className="failure-card-nav">
            <button onClick={prev} className="failure-nav-btn">←</button>
            <span className="failure-card-counter">
              {currentIndex + 1} / {shuffledStartups.length}
            </span>
            <button onClick={next} className="failure-nav-btn">→</button>
          </div>
        </div>

        <div className="failure-grid">
          {shuffledStartups.map((s, i) => {
            const cat = categoryLabels[s.category]
            return (
              <button
                key={s.name}
                className={`failure-grid-item ${i === currentIndex ? 'active' : ''}`}
                onClick={() => {
                  setCurrentIndex(i)
                  setShowLessons(false)
                }}
              >
                <span className="failure-grid-category" style={{ background: cat.color }} />
                <span className="failure-grid-name">{s.name}</span>
                <span className="failure-grid-raised">{s.raised}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="failure-page-hint">
        Her başarısızlık, bir sonraki girişimci için değerli bir ders.
      </div>
    </div>
  )
}
