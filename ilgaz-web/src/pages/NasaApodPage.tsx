import { useState, useEffect } from 'react'

interface ApodData {
  url: string
  hdurl?: string
  title: string
  explanation: string
  date: string
  media_type: string
  copyright?: string
}

export function NasaApodPage() {
  const [apod, setApod] = useState<ApodData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [copied, setCopied] = useState(false)

  const fetchApod = async (date: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${date}`)
      if (!res.ok) {
        throw new Error('Fotoğraf yüklenemedi')
      }
      const data = await res.json()
      setApod(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApod(selectedDate)
  }, [selectedDate])

  const goToPreviousDay = () => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() - 1)
    setSelectedDate(date.toISOString().split('T')[0])
  }

  const goToNextDay = () => {
    const date = new Date(selectedDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() + 1)
    if (date <= today) {
      setSelectedDate(date.toISOString().split('T')[0])
    }
  }

  const goToToday = () => {
    const today = new Date()
    setSelectedDate(today.toISOString().split('T')[0])
  }

  const goToRandom = () => {
    const start = new Date('1995-06-16') // APOD'un başlangıç tarihi
    const end = new Date()
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime())
    const randomDate = new Date(randomTime)
    setSelectedDate(randomDate.toISOString().split('T')[0])
  }

  const copyLink = () => {
    const url = `${window.location.origin}/nasa-apod?date=${selectedDate}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isToday = selectedDate === new Date().toISOString().split('T')[0]

  return (
    <div className="apod-page">
      <h1>Günün Uzay Fotoğrafı</h1>
      <p className="lead">
        NASA'nın her gün seçtiği astronomik görüntü. 1995'ten beri evrenin güzelliklerini keşfedin.
      </p>

      <div className="apod-page-nav">
        <button onClick={goToPreviousDay} className="apod-nav-btn" title="Önceki gün">
          ←
        </button>
        <div className="apod-nav-center">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            min="1995-06-16"
            className="apod-date-input"
          />
          <span className="apod-date-display">{formatDate(selectedDate)}</span>
        </div>
        <button
          onClick={goToNextDay}
          className="apod-nav-btn"
          disabled={isToday}
          title="Sonraki gün"
        >
          →
        </button>
      </div>

      <div className="apod-page-actions">
        <button onClick={goToToday} disabled={isToday}>
          Bugün
        </button>
        <button onClick={goToRandom}>
          Rastgele
        </button>
        <button onClick={copyLink} className={copied ? 'copied' : ''}>
          {copied ? 'Kopyalandı!' : 'Linki Kopyala'}
        </button>
      </div>

      <div className="apod-page-content">
        {loading && (
          <div className="apod-page-loading">
            <div className="apod-spinner" />
            <span>Uzaydan veri alınıyor...</span>
          </div>
        )}

        {error && (
          <div className="apod-page-error">
            <span>{error}</span>
            <button onClick={() => fetchApod(selectedDate)}>Tekrar Dene</button>
          </div>
        )}

        {!loading && !error && apod && (
          <>
            <div className="apod-page-media">
              {apod.media_type === 'image' ? (
                <img src={apod.url} alt={apod.title} />
              ) : (
                <iframe src={apod.url} title={apod.title} allowFullScreen />
              )}
            </div>

            <div className="apod-page-info">
              <h2>{apod.title}</h2>

              <div className="apod-page-meta">
                {apod.copyright && (
                  <span className="apod-copyright">Telif: {apod.copyright}</span>
                )}
                {apod.hdurl && apod.media_type === 'image' && (
                  <a
                    href={apod.hdurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apod-hd-link"
                  >
                    HD Görüntü
                  </a>
                )}
              </div>

              <p className="apod-explanation">{apod.explanation}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
