import { useState, useEffect } from 'react'
import { Outlet, NavLink, Link } from 'react-router-dom'

// Şehir verileri (Progress.tsx ile senkron)
const cities: Record<string, { lat: number; lng: number; timezone: number; cityId?: string }> = {
  // Türkiye
  konya: { lat: 37.9, lng: 32.5, timezone: 3, cityId: '552' },
  istanbul: { lat: 41.0, lng: 29.0, timezone: 3, cityId: '539' },
  ankara: { lat: 39.9, lng: 32.9, timezone: 3, cityId: '506' },
  izmir: { lat: 38.4, lng: 27.1, timezone: 3, cityId: '540' },
  // Uluslararası
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

// Vakit renkleri - Progress.tsx ile senkron
const prayerColors: Record<string, string> = {
  fajr: '#0f172a',    // imsak - lacivert/siyah (gece)
  sunrise: '#dc2626', // güneş - kırmızı (kerahat)
  dhuhr: '#ca8a04',   // öğle - altın (sabah güneşi)
  asr: '#ea580c',     // ikindi - turuncu (öğleden sonra)
  maghrib: '#dc2626', // akşam - kırmızı (kerahat)
  isha: '#1e1b2e',    // yatsı - mor/siyah (gece)
}

function useNextPrayer() {
  const [prayerInfo, setPrayerInfo] = useState<{ id: string; name: string; time: string; remaining: string } | null>(null)

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const savedCity = localStorage.getItem('progress-city') || 'konya'
        const cityData = cities[savedCity] || cities.konya
        const timezone = cityData.timezone

        let prayerTimes: { fajr: string; sunrise: string; dhuhr: string; asr: string; maghrib: string; isha: string }

        // Türkiye şehirleri için Diyanet API
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
          // Uluslararası şehirler için hesaplama
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

        // Gün bitti, yarın imsak
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

    // localStorage değişikliğini dinle (farklı tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'progress-city') fetchPrayerTimes()
    }
    window.addEventListener('storage', handleStorageChange)

    // Aynı tab'da şehir değişikliğini dinle
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

export function Layout() {
  const nextPrayer = useNextPrayer()

  return (
    <>
      <nav className="top-bar">
        <div className="top-bar-container">
          <Link to="/" className="top-bar-brand">
            <img src="/favicon.png" alt="ilg.az" />
          </Link>
          <div className="top-bar-nav">
            <NavLink to="/blog" className={({ isActive }) => `top-bar-link ${isActive ? 'active' : ''}`}>
              yazı
            </NavLink>
            <NavLink to="/projects" className={({ isActive }) => `top-bar-link ${isActive ? 'active' : ''}`}>
              proje
            </NavLink>
            <NavLink to="/now" className={({ isActive }) => `top-bar-link ${isActive ? 'active' : ''}`}>
              şimdi
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `top-bar-link ${isActive ? 'active' : ''}`}>
              hakkında
            </NavLink>
          </div>
          {nextPrayer && (
            <Link
              to="/progress"
              className="top-bar-prayer"
              style={{ '--prayer-color': prayerColors[nextPrayer.id] } as React.CSSProperties}
            >
              <span className="prayer-icon">☪</span>
              <span className="prayer-name">{nextPrayer.name}</span>
              <span className="prayer-time">{nextPrayer.time}</span>
              <span className="prayer-dot">·</span>
              <span className="prayer-remaining">{nextPrayer.remaining}</span>
            </Link>
          )}
        </div>
      </nav>

      <main>
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content footer-centered">
            <span className="footer-arabic" title="Allah'tan başka galip yoktur">لا غالب إلا الله</span>
          </div>
        </div>
      </footer>
    </>
  )
}
