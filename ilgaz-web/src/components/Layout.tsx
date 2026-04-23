import { useState, useEffect } from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import { posts } from '../content/posts'
import { ThemeSwitch } from './ThemeSwitch'
import { Win98Desktop } from './win98/Win98Desktop'
import { WinXPDesktop } from './winxp/WinXPDesktop'
import { TerminalDesktop } from './terminal/TerminalDesktop'

// Şehir verileri (Progress.tsx ile senkron)
const cities: Record<string, { lat: number; lng: number; timezone: number; cityId?: string }> = {
  konya: { lat: 37.9, lng: 32.5, timezone: 3, cityId: '552' },
  istanbul: { lat: 41.0, lng: 29.0, timezone: 3, cityId: '539' },
  ankara: { lat: 39.9, lng: 32.9, timezone: 3, cityId: '506' },
  izmir: { lat: 38.4, lng: 27.1, timezone: 3, cityId: '540' },
  losangeles: { lat: 34.0522, lng: -118.2437, timezone: -8 },
  newyork: { lat: 40.7128, lng: -74.0060, timezone: -5 },
  london: { lat: 51.5074, lng: -0.1278, timezone: 0 },
  paris: { lat: 48.8566, lng: 2.3522, timezone: 1 },
  berlin: { lat: 52.52, lng: 13.405, timezone: 1 },
  dubai: { lat: 25.2048, lng: 55.2708, timezone: 4 },
  tokyo: { lat: 35.6762, lng: 139.6503, timezone: 9 },
  jerusalem: { lat: 31.7683, lng: 35.2137, timezone: 2 },
  medina: { lat: 24.5247, lng: 39.5692, timezone: 3 },
}

function getCurrentTimeInTimezone(timezone: number) {
  const now = new Date()
  const utcHours = now.getUTCHours()
  const utcMinutes = now.getUTCMinutes()
  const offsetMinutes = timezone * 60
  let totalMinutes = utcHours * 60 + utcMinutes + offsetMinutes
  if (totalMinutes < 0) totalMinutes += 1440
  if (totalMinutes >= 1440) totalMinutes -= 1440
  return { hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60 }
}

function calculatePrayerTimes(lat: number, lng: number, timezone: number) {
  const toRad = (d: number) => (d * Math.PI) / 180
  const toDeg = (r: number) => (r * 180) / Math.PI
  const date = new Date()
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  const declination = -23.45 * Math.cos(toRad((360 / 365) * (dayOfYear + 10)))
  const eqTime = 229.18 * (0.000075 + 0.001868 * Math.cos(toRad((360 / 365) * dayOfYear)) - 0.032077 * Math.sin(toRad((360 / 365) * dayOfYear)))
  const solarNoon = 12 - lng / 15 + timezone - eqTime / 60
  const hourAngle = (angle: number) => {
    const cos_h = (Math.sin(toRad(angle)) - Math.sin(toRad(lat)) * Math.sin(toRad(declination))) / (Math.cos(toRad(lat)) * Math.cos(toRad(declination)))
    return toDeg(Math.acos(Math.max(-1, Math.min(1, cos_h)))) / 15
  }
  const fajrHA = hourAngle(-18)
  const sunriseHA = hourAngle(-0.833)
  const asrAngle = toDeg(Math.atan(1 + Math.tan(toRad(Math.abs(lat - declination)))))
  const asrHA = hourAngle(90 - asrAngle)
  const ishaHA = hourAngle(-17)
  const formatTime = (h: number) => {
    const hours = Math.floor(h)
    const minutes = Math.round((h - hours) * 60)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }
  return {
    fajr: formatTime(solarNoon - fajrHA),
    sunrise: formatTime(solarNoon - sunriseHA),
    dhuhr: formatTime(solarNoon),
    asr: formatTime(solarNoon + asrHA),
    maghrib: formatTime(solarNoon + sunriseHA),
    isha: formatTime(solarNoon + ishaHA),
  }
}

const districtCache: Record<string, string> = {}

function useNextPrayer() {
  const [prayerInfo, setPrayerInfo] = useState<{ id: string; name: string; time: string; remaining: string } | null>(null)

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const savedCity = localStorage.getItem('progress-city') || 'konya'
        const cityData = cities[savedCity] || cities.konya
        const timezone = cityData.timezone

        let prayerTimes: { fajr: string; sunrise: string; dhuhr: string; asr: string; maghrib: string; isha: string }

        if (cityData.cityId) {
          let districtId = districtCache[cityData.cityId]
          if (!districtId) {
            const response = await fetch(`https://ezanvakti.emushaf.net/ilceler/${cityData.cityId}`)
            const districts = await response.json()
            districtId = districts[0]?.IlceID
            if (districtId) districtCache[cityData.cityId] = districtId
          }
          if (districtId) {
            const timesResponse = await fetch(`https://ezanvakti.emushaf.net/vakitler/${districtId}`)
            const times = await timesResponse.json()
            const today = new Date()
            const todayStr = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`
            const todayData = times.find((d: { MiladiTarihKisa: string }) => d.MiladiTarihKisa === todayStr)
            if (todayData) {
              prayerTimes = {
                fajr: todayData.Imsak,
                sunrise: todayData.Gunes,
                dhuhr: todayData.Ogle,
                asr: todayData.Ikindi,
                maghrib: todayData.Aksam,
                isha: todayData.Yatsi,
              }
            } else {
              prayerTimes = calculatePrayerTimes(cityData.lat, cityData.lng, timezone)
            }
          } else {
            prayerTimes = calculatePrayerTimes(cityData.lat, cityData.lng, timezone)
          }
        } else {
          prayerTimes = calculatePrayerTimes(cityData.lat, cityData.lng, timezone)
        }

        const prayers = [
          { id: 'fajr', name: 'imsak', time: prayerTimes.fajr },
          { id: 'sunrise', name: 'güneş', time: prayerTimes.sunrise },
          { id: 'dhuhr', name: 'öğle', time: prayerTimes.dhuhr },
          { id: 'asr', name: 'ikindi', time: prayerTimes.asr },
          { id: 'maghrib', name: 'akşam', time: prayerTimes.maghrib },
          { id: 'isha', name: 'yatsı', time: prayerTimes.isha },
        ]

        const cityTime = getCurrentTimeInTimezone(timezone)
        const currentMinutes = cityTime.hours * 60 + cityTime.minutes

        for (const prayer of prayers) {
          const [h, m] = prayer.time.split(':').map(Number)
          const prayerMinutes = h * 60 + m
          if (currentMinutes < prayerMinutes) {
            const remaining = prayerMinutes - currentMinutes
            const hours = Math.floor(remaining / 60)
            const mins = remaining % 60
            setPrayerInfo({
              id: prayer.id,
              name: prayer.name,
              time: prayer.time,
              remaining: hours > 0 ? `${hours}sa ${mins}dk` : `${mins}dk`
            })
            return
          }
        }

        const [h, m] = prayers[0].time.split(':').map(Number)
        const remaining = (h * 60 + m) + (1440 - currentMinutes)
        const hours = Math.floor(remaining / 60)
        const mins = remaining % 60
        setPrayerInfo({
          id: prayers[0].id,
          name: prayers[0].name,
          time: prayers[0].time,
          remaining: hours > 0 ? `${hours}sa ${mins}dk` : `${mins}dk`
        })
      } catch (error) {
        console.error('Prayer times fetch error:', error)
      }
    }

    fetchPrayerTimes()
    const interval = setInterval(fetchPrayerTimes, 60000)

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'progress-city') fetchPrayerTimes()
    }
    window.addEventListener('storage', handleStorageChange)

    const handleCityChange = () => fetchPrayerTimes()
    window.addEventListener('city-changed', handleCityChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('city-changed', handleCityChange)
    }
  }, [])

  return prayerInfo
}

function getTodayFormatted(): string {
  const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
  const now = new Date()
  return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
}

function useCurrentTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ilgaz-theme') || 'editorial'
  })

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const current = document.documentElement.getAttribute('data-theme') || 'editorial'
      setTheme(current)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  return theme
}

export function Layout() {
  useNextPrayer()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const theme = useCurrentTheme()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const today = getTodayFormatted()
  const todaysPosts = posts.filter(p => p.meta.date === today)

  // Win98 theme — completely different layout, manages its own content
  if (theme === 'win98') {
    return <Win98Desktop />
  }

  // WinXP Luna theme — IE6-style windowing
  if (theme === 'winxp') {
    return <WinXPDesktop />
  }

  // Terminal theme — CRT-style single-screen output
  if (theme === 'terminal') {
    return <TerminalDesktop />
  }

  // Editorial theme (default)
  return (
    <>
      {/* ─── Header ─── */}
      <header className="nav-header">
        <Link to="/" className="brand">
          <span className="dot" />
          ilg.az
        </Link>
        <nav className="menu">
          <ul>
            <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Başlangıç</NavLink></li>
            <li><NavLink to="/blog" className={({ isActive }) => isActive ? 'active' : ''}>Yazı</NavLink></li>
            <li><NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : ''}>Proje</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>Hakkında</NavLink></li>
            <li><NavLink to="/tools" className={({ isActive }) => isActive ? 'active' : ''}>Araçlar</NavLink></li>
          </ul>
        </nav>
      </header>

      {/* ─── Today banner ─── */}
      {isHome && todaysPosts.length > 0 && (
        <div className="today-banner">
          <div className="today-banner-content">
            <span className="today-banner-label">bugün</span>
            <span className="today-banner-dot">·</span>
            {todaysPosts.map((post, i) => (
              <span key={post.meta.slug}>
                <Link to={`/blog/${post.meta.slug}`} className="today-banner-link">{post.meta.title}</Link>
                {i < todaysPosts.length - 1 && <span className="today-banner-dot">·</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ─── Main ─── */}
      <main>
        {isHome ? (
          <Outlet />
        ) : (
          <div className="container">
            <Outlet />
          </div>
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer className="site-footer">
        <div className="wrap">
          <div className="foot-grid">
            <div className="signoff">
              Okuduğun için <b>teşekkürler</b> — analitiklerin asla gösteremeyeceği kadar değerli.
            </div>
            <div>
              <h4>Başka Yerde</h4>
              <ul>
                <li><a href="https://github.com/theilgaz" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                <li><a href="https://x.com/theilgaz" target="_blank" rel="noopener noreferrer">X</a></li>
              </ul>
            </div>
            <div>
              <h4>Takip</h4>
              <ul>
                <li><Link to="/about">Hakkında</Link></li>
                <li><Link to="/tools">Araçlar</Link></li>
              </ul>
            </div>
            <div>
              <h4>Projeler</h4>
              <ul>
                <li><a href="https://mahfuz.ilg.az" target="_blank" rel="noopener noreferrer">Mahfuz</a></li>
                <li><Link to="/projects">Tüm Projeler</Link></li>
              </ul>
            </div>
          </div>
          <div className="meta-row">
            <span>© 2026 ilg.az · built by hand</span>
            <span className="footer-arabic" title="Allah'tan başka galip yoktur">لا غالب إلا الله</span>
          </div>
        </div>
      </footer>

      {/* ─── Theme Switcher ─── */}
      <ThemeSwitch />
    </>
  )
}
