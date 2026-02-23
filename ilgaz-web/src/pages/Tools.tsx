import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Pomodoro, PomodoroHeatmap } from '../components/Pomodoro'
import { JsonFormatter } from '../components/JsonFormatter'
import { Base64Tool } from '../components/Base64Tool'
import { ColorPalette } from '../components/ColorPalette'
import { PixelArt } from '../components/PixelArt'

const cityTimezones: Record<string, number> = {
  konya: 3, istanbul: 3, ankara: 3, izmir: 3,
  losangeles: -8, newyork: -5, london: 0, paris: 1,
  berlin: 1, dubai: 4, tokyo: 9, jerusalem: 2, medina: 3,
}

function getCurrentTimeInTimezone(timezone: number) {
  const now = new Date()
  const utcHours = now.getUTCHours()
  const utcMinutes = now.getUTCMinutes()
  const offsetMinutes = timezone * 60
  let totalMinutes = utcHours * 60 + utcMinutes + offsetMinutes
  if (totalMinutes < 0) totalMinutes += 1440
  if (totalMinutes >= 1440) totalMinutes -= 1440
  return totalMinutes
}

function useDayProgress() {
  const getProgress = () => {
    const city = localStorage.getItem('progress-city') || 'konya'
    const timezone = cityTimezones[city] ?? 3
    const minutes = getCurrentTimeInTimezone(timezone)
    return Math.round((minutes / 1440) * 100)
  }

  const [progress, setProgress] = useState(getProgress)

  useEffect(() => {
    const update = () => setProgress(getProgress())

    const interval = setInterval(update, 60000)
    window.addEventListener('city-changed', update)

    return () => {
      clearInterval(interval)
      window.removeEventListener('city-changed', update)
    }
  }, [])

  return progress
}

function SunArc({ progress }: { progress: number }) {
  const angle = Math.PI - (progress / 100) * Math.PI
  const radius = 38
  const centerX = 50
  const centerY = 44

  const sunX = centerX + radius * Math.cos(angle)
  const sunY = centerY - radius * Math.sin(angle)

  const isDay = progress >= 25 && progress <= 75

  return (
    <svg className="sun-arc" viewBox="0 0 100 55" fill="none">
      <line
        x1="8" y1="44" x2="92" y2="44"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />

      <path
        d={`M 12 44 A 38 38 0 0 1 88 44`}
        stroke="url(#arcGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />

      <path
        d={`M 12 44 A 38 38 0 0 1 ${sunX} ${sunY}`}
        stroke="url(#progressGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />

      <g className="celestial-body">
        {isDay ? (
          <>
            <circle cx={sunX} cy={sunY} r="8" fill="url(#sunGlow)" opacity="0.5" />
            <circle cx={sunX} cy={sunY} r="5" fill="url(#sunGradient)" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
              const rad = (deg * Math.PI) / 180
              const x1 = sunX + 7 * Math.cos(rad)
              const y1 = sunY + 7 * Math.sin(rad)
              const x2 = sunX + 9 * Math.cos(rad)
              const y2 = sunY + 9 * Math.sin(rad)
              return (
                <line
                  key={deg}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#f59e0b"
                  strokeWidth="1"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              )
            })}
          </>
        ) : (
          <>
            <circle cx={sunX} cy={sunY} r="7" fill="url(#moonGlow)" opacity="0.4" />
            <circle cx={sunX} cy={sunY} r="4.5" fill="#e2e8f0" />
            <circle cx={sunX - 1.5} cy={sunY - 0.5} r="4" fill="rgba(0,0,0,0.08)" />
          </>
        )}
      </g>

      <defs>
        <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="25%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="75%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <radialGradient id="sunGradient">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
        <radialGradient id="sunGlow">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="moonGlow">
          <stop offset="0%" stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  )
}

// NASA APOD
function NasaApod() {
  const [apod, setApod] = useState<{ url: string; title: string; explanation: string; mediaType: string } | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
      .then(r => r.json())
      .then(data => {
        setApod({
          url: data.url,
          title: data.title,
          explanation: data.explanation,
          mediaType: data.media_type
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="apod-loading">
        <div className="apod-spinner" />
        <span>Uzaydan veri alınıyor...</span>
      </div>
    )
  }

  if (!apod) return <div className="apod-loading">Yüklenemedi</div>

  return (
    <>
      <div className="apod" onClick={() => setExpanded(true)}>
        {apod.mediaType === 'image' ? (
          <img src={apod.url} alt={apod.title} />
        ) : (
          <iframe src={apod.url} title={apod.title} allowFullScreen />
        )}
        <div className="apod-title">{apod.title}</div>
        <div className="apod-expand-hint">Büyütmek için tıkla</div>
      </div>
      {expanded && (
        <div className="apod-modal" onClick={() => setExpanded(false)}>
          <div className="apod-modal-content" onClick={e => e.stopPropagation()}>
            {apod.mediaType === 'image' ? (
              <img src={apod.url} alt={apod.title} />
            ) : (
              <iframe src={apod.url} title={apod.title} allowFullScreen />
            )}
            <h3>{apod.title}</h3>
            <p>{apod.explanation}</p>
            <button onClick={() => setExpanded(false)}>Kapat</button>
          </div>
        </div>
      )}
    </>
  )
}

// Başarısız Startup Dersleri - Failory'den ilham
const failedStartups = [
  { name: "Vine", idea: "6 saniyelik video paylaşım platformu", raised: "$25M", year: 2016, reason: "Twitter satın aldı ama monetize edemedi" },
  { name: "Google+", idea: "Google'ın sosyal ağ denemesi", raised: "Google", year: 2019, reason: "Kullanıcılar Facebook'tan geçmedi" },
  { name: "Quibi", idea: "Mobil için kısa video içerikleri", raised: "$1.75B", year: 2020, reason: "TikTok ve YouTube zaten vardı" },
  { name: "Mixer", idea: "Microsoft'un Twitch rakibi", raised: "Microsoft", year: 2020, reason: "Streamer'lar Twitch'i bırakmadı" },
  { name: "Theranos", idea: "Bir damla kanla tüm testler", raised: "$700M", year: 2018, reason: "Teknoloji hiç çalışmadı, fraud" },
  { name: "Jawbone", idea: "Akıllı fitness bilekliği", raised: "$930M", year: 2017, reason: "Fitbit ve Apple Watch rekabeti" },
  { name: "Rdio", idea: "Spotify benzeri müzik servisi", raised: "$125M", year: 2015, reason: "Spotify çok hızlı büyüdü" },
  { name: "Secret", idea: "Anonim sosyal ağ", raised: "$35M", year: 2015, reason: "Cyberbullying sorunu çözülemedi" },
  { name: "Yik Yak", idea: "Lokasyon bazlı anonim mesajlaşma", raised: "$73M", year: 2017, reason: "Üniversite sonrası kullanım düştü" },
  { name: "Homejoy", idea: "Ev temizliği için Uber", raised: "$64M", year: 2015, reason: "Temizlikçiler bağımsız çalışmayı tercih etti" },
  { name: "Beepi", idea: "Peer-to-peer araba satışı", raised: "$150M", year: 2017, reason: "Unit economics negatifti" },
  { name: "Juicero", idea: "700$'lık WiFi'lı meyve sıkacağı", raised: "$120M", year: 2017, reason: "Poşetler elle sıkılabiliyordu" },
  { name: "Katerra", idea: "Teknoloji odaklı inşaat", raised: "$2B", year: 2021, reason: "İnşaat sektörü disrupt edilemedi" },
  { name: "MoviePass", idea: "Sınırsız sinema aboneliği", raised: "$68M", year: 2019, reason: "Her bilet için para kaybediyorlardı" },
  { name: "Essential", idea: "Android yaratıcısının telefonu", raised: "$330M", year: 2020, reason: "iPhone/Samsung duopolü kırılamadı" },
  { name: "Shyp", idea: "On-demand kargo gönderimi", raised: "$62M", year: 2018, reason: "Marjlar çok düşüktü" },
  { name: "Meerkat", idea: "Canlı video streaming öncüsü", raised: "$14M", year: 2016, reason: "Periscope ve Facebook Live ezdi" },
  { name: "Fab", idea: "Flash-sale e-ticaret", raised: "$336M", year: 2015, reason: "Kontrolsüz büyüme, cash burn" },
  { name: "Aereo", idea: "Online TV yayın servisi", raised: "$97M", year: 2014, reason: "Telif hakları davası kaybedildi" },
]

function FailureLesson() {
  const [startup, setStartup] = useState(failedStartups[0])

  const generate = useCallback(() => {
    const random = failedStartups[Math.floor(Math.random() * failedStartups.length)]
    setStartup(random)
  }, [])

  useEffect(() => { generate() }, [generate])

  return (
    <div className="failure-lesson">
      <div className="failure-header">
        <span className="failure-name">{startup.name}</span>
        <span className="failure-raised">{startup.raised}</span>
      </div>
      <p className="failure-idea">{startup.idea}</p>
      <div className="failure-reason">
        <span className="failure-label">Neden battı?</span>
        <p>{startup.reason}</p>
      </div>
      <button onClick={generate}>→</button>
    </div>
  )
}

type Category = 'all' | 'zaman' | 'gelistirici' | 'yaratici' | 'ilham'

const categories: { id: Category; label: string }[] = [
  { id: 'all', label: 'Tümü' },
  { id: 'zaman', label: 'Zaman' },
  { id: 'gelistirici', label: 'Geliştirici' },
  { id: 'yaratici', label: 'Tasarım' },
  { id: 'ilham', label: 'İlham' },
]

export function Tools() {
  const dayProgress = useDayProgress()
  const [activeCategory, setActiveCategory] = useState<Category>('all')

  const tools = [
    {
      id: 'day-progress',
      category: 'zaman',
      title: 'Günün Akışı',
      desc: 'Vakit su gibi akıyor. Bugünün ne kadarı avuçlarından kayıp gitti?',
      detailLink: '/progress',
      visual: (
        <>
          <SunArc progress={dayProgress} />
          <span className="sun-arc-label">{dayProgress}%</span>
        </>
      ),
    },
    {
      id: 'pomodoro',
      category: 'zaman',
      title: 'Pomodoro',
      desc: '25 dakika odaklan, 5 dakika nefes al. Basit ama etkili.',
      detailLink: '/pomodoro',
      visual: <Pomodoro />,
      extra: <PomodoroHeatmap />,
    },
    {
      id: 'json-formatter',
      category: 'gelistirici',
      title: 'JSON Formatter',
      desc: 'Karmaşık JSON\'u okunabilir hale getir.',
      detailLink: '/json-formatter',
      visual: <JsonFormatter />,
    },
    {
      id: 'base64',
      category: 'gelistirici',
      title: 'Base64',
      desc: 'Encode ve decode işlemleri için hızlı araç.',
      detailLink: '/base64',
      visual: <Base64Tool />,
    },
    {
      id: 'color-palette',
      category: 'yaratici',
      title: 'Renk Paleti',
      desc: 'Rastgele renk kombinasyonları. Tıkla ve kopyala.',
      detailLink: '/renk-paleti',
      visual: <ColorPalette />,
    },
    {
      id: 'pixel-art',
      category: 'yaratici',
      title: 'Pixel Art',
      desc: 'Piksel piksel çiz, sanatını indir.',
      detailLink: '/pixel-art',
      visual: <PixelArt />,
    },
    {
      id: 'nasa-apod',
      category: 'ilham',
      title: 'Günün Uzay Fotoğrafı',
      desc: 'NASA\'nın her gün seçtiği astronomik görüntü. Evrenin büyüklüğünü hatırla.',
      visual: <NasaApod />,
    },
    {
      id: 'failure-lesson',
      category: 'ilham',
      title: 'Başarısızlık Dersleri',
      desc: 'Milyonlar yatırım aldı, yine de battı. Neden? Ders çıkar.',
      visual: <FailureLesson />,
    },
  ]

  const filteredTools = activeCategory === 'all'
    ? tools
    : tools.filter(t => t.category === activeCategory)

  return (
    <>
      <h1>Araçlar</h1>
      <p className="lead">
        Geliştirdiğim ve kullandığım faydalı araçlar.
      </p>

      <div className="tools-categories">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`tools-chip ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="tools-list">
        {filteredTools.map(tool => (
          <div className="tool-card" key={tool.id}>
            {'detailLink' in tool && tool.detailLink && (
              <Link to={tool.detailLink} className="tool-card-expand" title="Tam sayfa aç">
                <span>↗</span>
              </Link>
            )}
            <div className="tool-card-visual">{tool.visual}</div>
            <div className="tool-card-info">
              <h3 className="tool-card-title">{tool.title}</h3>
              <p className="tool-card-desc">{tool.desc}</p>
              {'extra' in tool && tool.extra}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
