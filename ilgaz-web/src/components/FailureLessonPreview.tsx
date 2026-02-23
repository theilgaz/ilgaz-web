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

const failedStartups: FailedStartup[] = [
  {
    name: "Quibi",
    idea: "Mobil için kısa video içerikleri",
    raised: "$1.75B",
    year: 2020,
    reason: "TikTok ve YouTube zaten ücretsiz içerik sunuyordu",
    doThis: "Lansmandan önce rakip analizi yap, ücretsiz alternatiflerle nasıl rekabet edeceğini planla",
    dontDoThis: "Pazarda zaten ücretsiz çözümler varken premium fiyatlandırma yapma",
    category: 'market'
  },
  {
    name: "Theranos",
    idea: "Bir damla kanla tüm testler",
    raised: "$700M",
    year: 2018,
    reason: "Teknoloji hiç çalışmadı, yatırımcılar kandırıldı",
    doThis: "Ürünün gerçekten çalıştığını kanıtla, şeffaf ol",
    dontDoThis: "Olmayan bir teknolojiyi varmış gibi satma",
    category: 'product'
  },
  {
    name: "Juicero",
    idea: "$700'lık WiFi'lı meyve sıkacağı",
    raised: "$120M",
    year: 2017,
    reason: "Poşetler elle sıkılabiliyordu, ürün gereksizdi",
    doThis: "Ürünün gerçek bir sorunu çözüp çözmediğini test et",
    dontDoThis: "Basit bir işi gereksiz yere karmaşıklaştırma",
    category: 'product'
  },
  {
    name: "MoviePass",
    idea: "Aylık $10'a sınırsız sinema",
    raised: "$68M",
    year: 2019,
    reason: "Her bilet için $5-10 kaybediyorlardı",
    doThis: "Unit economics'i en baştan hesapla",
    dontDoThis: "Sürdürülemez fiyatlandırmayla büyümeye çalışma",
    category: 'money'
  },
  {
    name: "Vine",
    idea: "6 saniyelik video paylaşım",
    raised: "$25M",
    year: 2016,
    reason: "Twitter satın aldı ama monetize edemedi, creator'lar kaçtı",
    doThis: "İçerik üreticilerini mutlu et, onlara para kazandır",
    dontDoThis: "Platform büyüdükten sonra creator'ları ihmal etme",
    category: 'team'
  },
  {
    name: "Google+",
    idea: "Google'ın sosyal ağ denemesi",
    raised: "Google",
    year: 2019,
    reason: "Kullanıcılar Facebook'tan geçmedi, farklılaşamadı",
    doThis: "Rakipten net bir şekilde farklılaş, geçiş için güçlü sebep sun",
    dontDoThis: "Sadece büyük şirket olduğun için başaracağını varsayma",
    category: 'market'
  },
  {
    name: "Katerra",
    idea: "Teknoloji odaklı inşaat şirketi",
    raised: "$2B",
    year: 2021,
    reason: "İnşaat sektörü çok karmaşık, teknoloji tek başına yetmedi",
    doThis: "Sektörü derinlemesine anla, adım adım ilerle",
    dontDoThis: "Geleneksel sektörleri teknoloji ile hızla disrupt edebileceğini sanma",
    category: 'market'
  },
  {
    name: "WeWork",
    idea: "Paylaşımlı ofis alanları",
    raised: "$12B",
    year: 2019,
    reason: "Aşırı değerleme, kontrolsüz harcama, zayıf yönetim",
    doThis: "Gerçekçi değerleme yap, maliyetleri kontrol et",
    dontDoThis: "Büyüme uğruna karlılığı tamamen göz ardı etme",
    category: 'money'
  },
  {
    name: "Pets.com",
    idea: "Online evcil hayvan ürünleri",
    raised: "$82M",
    year: 2000,
    reason: "Nakliye maliyetleri ürün fiyatını aştı",
    doThis: "Lojistik maliyetlerini en baştan hesapla",
    dontDoThis: "Ağır/hacimli ürünleri düşük marjla online satma",
    category: 'money'
  },
  {
    name: "Mixer",
    idea: "Microsoft'un Twitch rakibi",
    raised: "Microsoft",
    year: 2020,
    reason: "Streamer'lar ve izleyiciler Twitch'i bırakmadı",
    doThis: "Network effect'i kırmak için devrimci bir değer öner",
    dontDoThis: "Para atarak topluluk satın alabileceğini düşünme",
    category: 'market'
  },
]

const categoryLabels = {
  market: { label: 'Pazar', color: '#8b5cf6' },
  product: { label: 'Ürün', color: '#f59e0b' },
  money: { label: 'Finans', color: '#ef4444' },
  team: { label: 'Ekip', color: '#22c55e' },
  timing: { label: 'Zamanlama', color: '#3b82f6' },
}

export function FailureLessonPreview() {
  const [index, setIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(true)
  const startup = failedStartups[index]
  const category = categoryLabels[startup.category]

  const next = useCallback(() => {
    setIsFlipped(false)
    setIndex(i => (i + 1) % failedStartups.length)
  }, [])

  const prev = useCallback(() => {
    setIsFlipped(false)
    setIndex(i => (i - 1 + failedStartups.length) % failedStartups.length)
  }, [])

  useEffect(() => {
    setIndex(Math.floor(Math.random() * failedStartups.length))
  }, [])

  return (
    <div className="failure-lesson">
      <div className="failure-card">
        <div className="failure-header">
          <div className="failure-title">
            <span className="failure-name">{startup.name}</span>
            <span className="failure-year">{startup.year}</span>
          </div>
          <span className="failure-category" style={{ background: category.color }}>
            {category.label}
          </span>
        </div>

        <p className="failure-idea">{startup.idea}</p>

        <div className="failure-raised">
          <span className="failure-raised-label">Toplanan</span>
          <span className="failure-raised-value">{startup.raised}</span>
        </div>

        <div className="failure-reason">
          <span className="failure-section-label">Neden battı?</span>
          <p>{startup.reason}</p>
        </div>

        <div className={`failure-lessons ${isFlipped ? 'show' : ''}`}>
          <div className="failure-do">
            <span className="failure-do-icon">✓</span>
            <p>{startup.doThis}</p>
          </div>
          <div className="failure-dont">
            <span className="failure-dont-icon">✗</span>
            <p>{startup.dontDoThis}</p>
          </div>
        </div>

      </div>

      <div className="failure-nav">
        <button onClick={prev} className="failure-nav-btn">←</button>
        <span className="failure-counter">{index + 1} / {failedStartups.length}</span>
        <button onClick={next} className="failure-nav-btn">→</button>
      </div>
    </div>
  )
}
