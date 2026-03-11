import { useState, useEffect, useCallback, useRef } from 'react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const DIYANET_API = 'https://ezanvakti.emushaf.net'

// Türkiye şehirleri - plaka kodu sırasına göre
interface TurkishCity {
  plate: string
  name: string
  cityId: string
  lat: number
  lng: number
}

const turkishCities: TurkishCity[] = [
  { plate: '01', name: 'Adana', cityId: '500', lat: 37.0, lng: 35.3 },
  { plate: '02', name: 'Adıyaman', cityId: '501', lat: 37.8, lng: 38.3 },
  { plate: '03', name: 'Afyonkarahisar', cityId: '502', lat: 38.7, lng: 30.5 },
  { plate: '04', name: 'Ağrı', cityId: '503', lat: 39.7, lng: 43.1 },
  { plate: '05', name: 'Amasya', cityId: '505', lat: 40.7, lng: 35.8 },
  { plate: '06', name: 'Ankara', cityId: '506', lat: 39.9, lng: 32.9 },
  { plate: '07', name: 'Antalya', cityId: '507', lat: 36.9, lng: 30.7 },
  { plate: '08', name: 'Artvin', cityId: '508', lat: 41.2, lng: 41.8 },
  { plate: '09', name: 'Aydın', cityId: '509', lat: 37.8, lng: 27.8 },
  { plate: '10', name: 'Balıkesir', cityId: '510', lat: 39.6, lng: 27.9 },
  { plate: '11', name: 'Bilecik', cityId: '511', lat: 40.1, lng: 30.0 },
  { plate: '12', name: 'Bingöl', cityId: '512', lat: 39.1, lng: 40.5 },
  { plate: '13', name: 'Bitlis', cityId: '513', lat: 38.4, lng: 42.1 },
  { plate: '14', name: 'Bolu', cityId: '514', lat: 40.7, lng: 31.6 },
  { plate: '15', name: 'Burdur', cityId: '515', lat: 37.7, lng: 30.3 },
  { plate: '16', name: 'Bursa', cityId: '516', lat: 40.2, lng: 29.0 },
  { plate: '17', name: 'Çanakkale', cityId: '517', lat: 40.2, lng: 26.4 },
  { plate: '18', name: 'Çankırı', cityId: '518', lat: 40.6, lng: 33.6 },
  { plate: '19', name: 'Çorum', cityId: '519', lat: 40.5, lng: 34.9 },
  { plate: '20', name: 'Denizli', cityId: '520', lat: 37.8, lng: 29.1 },
  { plate: '21', name: 'Diyarbakır', cityId: '521', lat: 37.9, lng: 40.2 },
  { plate: '22', name: 'Edirne', cityId: '522', lat: 41.7, lng: 26.6 },
  { plate: '23', name: 'Elazığ', cityId: '523', lat: 38.7, lng: 39.2 },
  { plate: '24', name: 'Erzincan', cityId: '524', lat: 39.7, lng: 39.5 },
  { plate: '25', name: 'Erzurum', cityId: '525', lat: 39.9, lng: 41.3 },
  { plate: '26', name: 'Eskişehir', cityId: '526', lat: 39.8, lng: 30.5 },
  { plate: '27', name: 'Gaziantep', cityId: '527', lat: 37.1, lng: 37.4 },
  { plate: '28', name: 'Giresun', cityId: '528', lat: 40.9, lng: 38.4 },
  { plate: '29', name: 'Gümüşhane', cityId: '529', lat: 40.5, lng: 39.5 },
  { plate: '30', name: 'Hakkari', cityId: '530', lat: 37.6, lng: 43.7 },
  { plate: '31', name: 'Hatay', cityId: '531', lat: 36.4, lng: 36.3 },
  { plate: '32', name: 'Isparta', cityId: '532', lat: 37.8, lng: 30.6 },
  { plate: '33', name: 'Mersin', cityId: '533', lat: 36.8, lng: 34.6 },
  { plate: '34', name: 'İstanbul', cityId: '539', lat: 41.0, lng: 29.0 },
  { plate: '35', name: 'İzmir', cityId: '540', lat: 38.4, lng: 27.1 },
  { plate: '36', name: 'Kars', cityId: '541', lat: 40.6, lng: 43.1 },
  { plate: '37', name: 'Kastamonu', cityId: '542', lat: 41.4, lng: 33.8 },
  { plate: '38', name: 'Kayseri', cityId: '543', lat: 38.7, lng: 35.5 },
  { plate: '39', name: 'Kırklareli', cityId: '544', lat: 41.7, lng: 27.2 },
  { plate: '40', name: 'Kırşehir', cityId: '545', lat: 39.1, lng: 34.2 },
  { plate: '41', name: 'Kocaeli', cityId: '546', lat: 40.8, lng: 29.9 },
  { plate: '42', name: 'Konya', cityId: '552', lat: 37.9, lng: 32.5 },
  { plate: '43', name: 'Kütahya', cityId: '553', lat: 39.4, lng: 29.9 },
  { plate: '44', name: 'Malatya', cityId: '554', lat: 38.4, lng: 38.3 },
  { plate: '45', name: 'Manisa', cityId: '555', lat: 38.6, lng: 27.4 },
  { plate: '46', name: 'Kahramanmaraş', cityId: '547', lat: 37.6, lng: 36.9 },
  { plate: '47', name: 'Mardin', cityId: '556', lat: 37.3, lng: 40.7 },
  { plate: '48', name: 'Muğla', cityId: '558', lat: 37.2, lng: 28.4 },
  { plate: '49', name: 'Muş', cityId: '559', lat: 38.9, lng: 41.5 },
  { plate: '50', name: 'Nevşehir', cityId: '560', lat: 38.6, lng: 34.7 },
  { plate: '51', name: 'Niğde', cityId: '561', lat: 37.9, lng: 34.7 },
  { plate: '52', name: 'Ordu', cityId: '562', lat: 41.0, lng: 37.9 },
  { plate: '53', name: 'Rize', cityId: '563', lat: 41.0, lng: 40.5 },
  { plate: '54', name: 'Sakarya', cityId: '564', lat: 40.7, lng: 30.4 },
  { plate: '55', name: 'Samsun', cityId: '565', lat: 41.3, lng: 36.3 },
  { plate: '56', name: 'Siirt', cityId: '566', lat: 37.9, lng: 42.0 },
  { plate: '57', name: 'Sinop', cityId: '567', lat: 42.0, lng: 35.2 },
  { plate: '58', name: 'Sivas', cityId: '568', lat: 39.7, lng: 37.0 },
  { plate: '59', name: 'Tekirdağ', cityId: '569', lat: 41.0, lng: 27.5 },
  { plate: '60', name: 'Tokat', cityId: '570', lat: 40.3, lng: 36.6 },
  { plate: '61', name: 'Trabzon', cityId: '571', lat: 41.0, lng: 39.7 },
  { plate: '62', name: 'Tunceli', cityId: '572', lat: 39.1, lng: 39.5 },
  { plate: '63', name: 'Şanlıurfa', cityId: '573', lat: 37.2, lng: 38.8 },
  { plate: '64', name: 'Uşak', cityId: '574', lat: 38.7, lng: 29.4 },
  { plate: '65', name: 'Van', cityId: '575', lat: 38.5, lng: 43.4 },
  { plate: '66', name: 'Yozgat', cityId: '576', lat: 39.8, lng: 34.8 },
  { plate: '67', name: 'Zonguldak', cityId: '577', lat: 41.5, lng: 31.8 },
  { plate: '68', name: 'Aksaray', cityId: '504', lat: 38.4, lng: 34.0 },
  { plate: '69', name: 'Bayburt', cityId: '578', lat: 40.3, lng: 40.2 },
  { plate: '70', name: 'Karaman', cityId: '579', lat: 37.2, lng: 33.2 },
  { plate: '71', name: 'Kırıkkale', cityId: '548', lat: 39.8, lng: 33.5 },
  { plate: '72', name: 'Batman', cityId: '549', lat: 37.9, lng: 41.1 },
  { plate: '73', name: 'Şırnak', cityId: '550', lat: 37.5, lng: 42.5 },
  { plate: '74', name: 'Bartın', cityId: '551', lat: 41.6, lng: 32.3 },
  { plate: '75', name: 'Ardahan', cityId: '580', lat: 41.1, lng: 42.7 },
  { plate: '76', name: 'Iğdır', cityId: '534', lat: 39.9, lng: 44.0 },
  { plate: '77', name: 'Yalova', cityId: '535', lat: 40.7, lng: 29.3 },
  { plate: '78', name: 'Karabük', cityId: '536', lat: 41.2, lng: 32.6 },
  { plate: '79', name: 'Kilis', cityId: '537', lat: 36.7, lng: 37.1 },
  { plate: '80', name: 'Osmaniye', cityId: '538', lat: 37.1, lng: 36.2 },
  { plate: '81', name: 'Düzce', cityId: '557', lat: 40.8, lng: 31.2 },
]

// Şehir merkez ilçe kodları cache
const districtCodeCache: Record<string, string> = {}

interface DiyanetPrayerTime {
  MiladiTarihKisa: string
  Imsak: string
  Gunes: string
  Ogle: string
  Ikindi: string
  Aksam: string
  Yatsi: string
}

interface CityData {
  lat: number
  lng: number
  name: string
  timezone: number
  plate?: string
  cityId?: string
}

interface CityDataWithContinent extends CityData {
  continent: 'türkiye' | 'ortadoğu' | 'avrupa' | 'asya' | 'amerika' | 'afrika' | 'okyanusya'
}

// Türkiye şehirlerini cities objesine dönüştür
const turkishCitiesMap: Record<string, CityDataWithContinent> = Object.fromEntries(
  turkishCities.map(c => [
    c.name.toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c'),
    {
      lat: c.lat,
      lng: c.lng,
      name: c.name,
      timezone: 3,
      continent: 'türkiye' as const,
      plate: c.plate,
      cityId: c.cityId,
    }
  ])
)

const cities: Record<string, CityDataWithContinent> = {
  // Türkiye - tüm şehirler
  ...turkishCitiesMap,
  // Orta Doğu (4 timezone: +2, +3, +3.5, +4)
  jerusalem: { lat: 31.7683, lng: 35.2137, name: 'Kudüs', timezone: 2, continent: 'ortadoğu' },
  medina: { lat: 24.5247, lng: 39.5692, name: 'Medine', timezone: 3, continent: 'ortadoğu' },
  tehran: { lat: 35.6892, lng: 51.3890, name: 'Tahran', timezone: 3.5, continent: 'ortadoğu' },
  dubai: { lat: 25.2048, lng: 55.2708, name: 'Dubai', timezone: 4, continent: 'ortadoğu' },
  // Avrupa (4 timezone: 0, +1, +2, +3)
  london: { lat: 51.5074, lng: -0.1278, name: 'Londra', timezone: 0, continent: 'avrupa' },
  paris: { lat: 48.8566, lng: 2.3522, name: 'Paris', timezone: 1, continent: 'avrupa' },
  athens: { lat: 37.9838, lng: 23.7275, name: 'Atina', timezone: 2, continent: 'avrupa' },
  moscow: { lat: 55.7558, lng: 37.6173, name: 'Moskova', timezone: 3, continent: 'avrupa' },
  // Asya (4 timezone: +5, +6, +8, +9)
  karachi: { lat: 24.8607, lng: 67.0011, name: 'Karaçi', timezone: 5, continent: 'asya' },
  dhaka: { lat: 23.8103, lng: 90.4125, name: 'Dakka', timezone: 6, continent: 'asya' },
  beijing: { lat: 39.9042, lng: 116.4074, name: 'Pekin', timezone: 8, continent: 'asya' },
  tokyo: { lat: 35.6762, lng: 139.6503, name: 'Tokyo', timezone: 9, continent: 'asya' },
  // Amerika (4 timezone: -8, -6, -5, -3)
  losangeles: { lat: 34.0522, lng: -118.2437, name: 'Los Angeles', timezone: -8, continent: 'amerika' },
  mexicocity: { lat: 19.4326, lng: -99.1332, name: 'Mexico City', timezone: -6, continent: 'amerika' },
  newyork: { lat: 40.7128, lng: -74.0060, name: 'New York', timezone: -5, continent: 'amerika' },
  saopaulo: { lat: -23.5505, lng: -46.6333, name: 'São Paulo', timezone: -3, continent: 'amerika' },
  // Afrika (4 timezone: 0, +1, +2, +3)
  casablanca: { lat: 33.5731, lng: -7.5898, name: 'Kazablanka', timezone: 0, continent: 'afrika' },
  lagos: { lat: 6.5244, lng: 3.3792, name: 'Lagos', timezone: 1, continent: 'afrika' },
  cairo: { lat: 30.0444, lng: 31.2357, name: 'Kahire', timezone: 2, continent: 'afrika' },
  nairobi: { lat: -1.2921, lng: 36.8219, name: 'Nairobi', timezone: 3, continent: 'afrika' },
  // Okyanusya (4 timezone: +8, +10, +11, +12)
  perth: { lat: -31.9505, lng: 115.8605, name: 'Perth', timezone: 8, continent: 'okyanusya' },
  melbourne: { lat: -37.8136, lng: 144.9631, name: 'Melbourne', timezone: 10, continent: 'okyanusya' },
  sydney: { lat: -33.8688, lng: 151.2093, name: 'Sidney', timezone: 11, continent: 'okyanusya' },
  auckland: { lat: -36.8509, lng: 174.7645, name: 'Auckland', timezone: 12, continent: 'okyanusya' },
}

const continentOrder = ['türkiye', 'ortadoğu', 'avrupa', 'asya', 'amerika', 'afrika', 'okyanusya'] as const
const continentLabels: Record<string, string> = {
  'türkiye': '🇹🇷 Türkiye',
  'ortadoğu': '🕌 Orta Doğu',
  'avrupa': '🏰 Avrupa',
  'asya': '🏯 Asya',
  'amerika': '🗽 Amerika',
  'afrika': '🌍 Afrika',
  'okyanusya': '🦘 Okyanusya',
}

interface PrayerTimes {
  fajr: string
  sunrise: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
}

// Vakit renkleri - gün döngüsüne göre
const prayerColors = {
  fajr: '#0f172a',    // imsak - lacivert/siyah (gece)
  sunrise: '#dc2626', // güneş - kırmızı (kerahat)
  dhuhr: '#ca8a04',   // öğle - altın (sabah güneşi)
  asr: '#ea580c',     // ikindi - turuncu (öğleden sonra)
  maghrib: '#dc2626', // akşam - kırmızı (kerahat)
  isha: '#1e1b2e',    // yatsı - mor/siyah (gece)
}

// Islam - Vakit bilgileri
const prayerList = [
  { id: 'fajr', key: 'fajr' as keyof PrayerTimes, label: 'sabah', color: prayerColors.fajr },
  { id: 'sunrise', key: 'sunrise' as keyof PrayerTimes, label: 'güneş', color: prayerColors.sunrise },
  { id: 'dhuhr', key: 'dhuhr' as keyof PrayerTimes, label: 'öğle', color: prayerColors.dhuhr },
  { id: 'asr', key: 'asr' as keyof PrayerTimes, label: 'ikindi', color: prayerColors.asr },
  { id: 'maghrib', key: 'maghrib' as keyof PrayerTimes, label: 'akşam', color: prayerColors.maghrib },
  { id: 'isha', key: 'isha' as keyof PrayerTimes, label: 'yatsı', color: prayerColors.isha },
]

async function fetchDistrictCode(cityId: string): Promise<string | null> {
  if (districtCodeCache[cityId]) {
    return districtCodeCache[cityId]
  }

  try {
    const response = await fetch(`${DIYANET_API}/ilceler/${cityId}`)
    const districts = await response.json()

    // Merkez ilçeyi bul (şehir adıyla aynı olan veya ilk ilçe)
    const centerDistrict = districts.find((d: { IlceAdi: string }) =>
      d.IlceAdi.includes('MERKEZ') || districts.length === 1
    ) || districts[0]

    if (centerDistrict) {
      districtCodeCache[cityId] = centerDistrict.IlceID
      return centerDistrict.IlceID
    }
    return null
  } catch (error) {
    console.error('District fetch error:', error)
    return null
  }
}

async function fetchDiyanetPrayerTimes(cityKey: string): Promise<PrayerTimes | null> {
  const cityData = cities[cityKey]
  if (!cityData?.cityId) return null

  try {
    const districtCode = await fetchDistrictCode(cityData.cityId)
    if (!districtCode) return null

    const response = await fetch(`${DIYANET_API}/vakitler/${districtCode}`)
    const data: DiyanetPrayerTime[] = await response.json()

    // Bugünün tarihini bul
    const today = new Date()
    const todayStr = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`

    const todayData = data.find(d => d.MiladiTarihKisa === todayStr)
    if (!todayData) return null

    return {
      fajr: todayData.Imsak,
      sunrise: todayData.Gunes,
      dhuhr: todayData.Ogle,
      asr: todayData.Ikindi,
      maghrib: todayData.Aksam,
      isha: todayData.Yatsi,
    }
  } catch (error) {
    console.error('Diyanet API error:', error)
    return null
  }
}

// Belirli bir timezone'daki şu anki saati al
function getCurrentTimeInTimezone(timezone: number): { hours: number; minutes: number; seconds: number } {
  const now = new Date()
  const utcHours = now.getUTCHours()
  const utcMinutes = now.getUTCMinutes()
  const utcSeconds = now.getUTCSeconds()

  // Timezone offset'i dakikaya çevir (örn: -8 -> -480, 3.5 -> 210)
  const offsetMinutes = timezone * 60

  // Toplam dakikayı hesapla
  let totalMinutes = utcHours * 60 + utcMinutes + offsetMinutes

  // Gün sınırlarını ayarla
  if (totalMinutes < 0) totalMinutes += 1440
  if (totalMinutes >= 1440) totalMinutes -= 1440

  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
    seconds: utcSeconds
  }
}

function calculatePrayerTimes(lat: number, lng: number, date: Date, timezone: number = 3): PrayerTimes {
  const toRad = (d: number) => (d * Math.PI) / 180
  const toDeg = (r: number) => (r * 180) / Math.PI

  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  const declination = -23.45 * Math.cos(toRad((360 / 365) * (dayOfYear + 10)))
  const eqTime = 229.18 * (0.000075 + 0.001868 * Math.cos(toRad((360 / 365) * dayOfYear))
    - 0.032077 * Math.sin(toRad((360 / 365) * dayOfYear)))

  const solarNoon = 12 - lng / 15 + timezone - eqTime / 60

  const hourAngle = (angle: number) => {
    const cos_h = (Math.sin(toRad(angle)) - Math.sin(toRad(lat)) * Math.sin(toRad(declination))) /
      (Math.cos(toRad(lat)) * Math.cos(toRad(declination)))
    return toDeg(Math.acos(Math.max(-1, Math.min(1, cos_h)))) / 15
  }

  const fajrHA = hourAngle(-18)
  const sunriseHA = hourAngle(-0.833)
  const asrAngle = toDeg(Math.atan(1 + Math.tan(toRad(Math.abs(lat - declination)))))
  const asrHA = hourAngle(90 - asrAngle)
  const maghribHA = hourAngle(-0.833)
  const ishaHA = hourAngle(-17)

  const formatTime = (h: number) => {
    const hours = Math.floor(h)
    const minutes = Math.round((h - hours) * 60)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  return {
    fajr: formatTime(solarNoon - fajrHA),
    sunrise: formatTime(solarNoon - sunriseHA),
    dhuhr: formatTime(solarNoon + 0.05),
    asr: formatTime(solarNoon + asrHA),
    maghrib: formatTime(solarNoon + maghribHA),
    isha: formatTime(solarNoon + ishaHA),
  }
}


function LocationPicker({
  isOpen,
  onClose,
  onSelect,
  currentCity
}: {
  isOpen: boolean
  onClose: () => void
  onSelect: (cityKey: string) => void
  currentCity: string
}) {
  const [search, setSearch] = useState('')
  const [turkeyExpanded, setTurkeyExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const filteredCities = Object.entries(cities).filter(([, city]) => {
    const searchLower = search.toLowerCase()
    const nameMatch = city.name.toLowerCase().includes(searchLower)
    const plateMatch = city.plate && city.plate === search
    return nameMatch || plateMatch
  })

  if (!isOpen) return null

  return (
    <div className="location-modal-overlay" onClick={onClose}>
      <div className="location-modal" onClick={e => e.stopPropagation()}>
        <div className="location-modal-header">
          <h3>konum sec</h3>
          <button className="location-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="location-search">
          <input
            ref={inputRef}
            type="text"
            placeholder="sehir ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && filteredCities.length > 0) {
                onSelect(filteredCities[0][0])
                onClose()
              }
            }}
          />
        </div>

        <div className="location-city-list">
          {search ? (
            // Arama varsa düz liste
            <div className="location-continent-cities">
              {filteredCities.map(([key, city]) => {
                const info = city.plate ? city.plate : (city.timezone >= 0 ? `+${city.timezone}` : `${city.timezone}`)
                return (
                  <button
                    key={key}
                    className={`location-city-item ${key === currentCity ? 'selected' : ''}`}
                    onClick={() => { onSelect(key); onClose(); }}
                  >
                    <span className="city-name">{city.name}</span>
                    <span className="city-timezone">{info}</span>
                  </button>
                )
              })}
            </div>
          ) : (
            // Arama yoksa kıta bazında grupla
            continentOrder.map(continent => {
              let continentCities = Object.entries(cities).filter(([, city]) => city.continent === continent)

              // Türkiye için özel sıralama: Konya, İstanbul, sonra plaka sırasına göre
              if (continent === 'türkiye') {
                continentCities = continentCities.sort((a, b) => {
                  const plateA = a[1].plate || '0'
                  const plateB = b[1].plate || '0'
                  // Konya (42) en üstte
                  if (plateA === '42') return -1
                  if (plateB === '42') return 1
                  // İstanbul (34) ikinci
                  if (plateA === '34') return -1
                  if (plateB === '34') return 1
                  // Diğerleri plaka sırasına göre
                  return parseInt(plateA) - parseInt(plateB)
                })
              }

              if (continentCities.length === 0) return null

              const isCollapsible = continent === 'türkiye'
              const isExpanded = continent !== 'türkiye' || turkeyExpanded

              return (
                <div key={continent} className="location-continent-group">
                  <button
                    className={`location-continent-label ${isCollapsible ? 'collapsible' : ''}`}
                    onClick={() => isCollapsible && setTurkeyExpanded(!turkeyExpanded)}
                  >
                    {continentLabels[continent]}
                    {isCollapsible && (
                      <span className="collapse-icon">{turkeyExpanded ? '−' : '+'}</span>
                    )}
                  </button>
                  {isExpanded && (
                    <div className="location-continent-cities">
                      {continentCities.map(([key, city]) => {
                        const info = city.plate ? city.plate : (city.timezone >= 0 ? `+${city.timezone}` : `${city.timezone}`)
                        return (
                          <button
                            key={key}
                            className={`location-city-item ${key === currentCity ? 'selected' : ''}`}
                            onClick={() => { onSelect(key); onClose(); }}
                          >
                            <span className="city-name">{city.name}</span>
                            <span className="city-timezone">{info}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

function PrayerSunArc({
  currentMinutes,
  prayerTimes,
  nextPrayerId
}: {
  currentMinutes: number
  prayerTimes: PrayerTimes
  nextPrayerId: string
}) {
  const [hoveredPrayer, setHoveredPrayer] = useState<{ label: string; time: string; color: string } | null>(null)

  // Günün yüzdesi (0-100)
  const dayProgress = (currentMinutes / 1440) * 100

  // Güneş yayı üzerindeki pozisyon
  const angle = Math.PI - (dayProgress / 100) * Math.PI
  const radius = 85
  const centerX = 105
  const centerY = 101

  const sunX = centerX + radius * Math.cos(angle)
  const sunY = centerY - radius * Math.sin(angle)

  // Gece mi gündüz mü?
  const sunriseMinutes = prayerTimes.sunrise.split(':').map(Number).reduce((h, m) => h * 60 + m)
  const maghribMinutes = prayerTimes.maghrib.split(':').map(Number).reduce((h, m) => h * 60 + m)
  const isDay = currentMinutes >= sunriseMinutes && currentMinutes < maghribMinutes

  // Vakit noktaları için pozisyonları hesapla
  const getPrayerPosition = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number)
    const minutes = h * 60 + m
    const progress = (minutes / 1440) * 100
    const pAngle = Math.PI - (progress / 100) * Math.PI
    return {
      x: centerX + radius * Math.cos(pAngle),
      y: centerY - radius * Math.sin(pAngle)
    }
  }

  const prayerPositions = prayerList.map(p => ({
    ...p,
    pos: getPrayerPosition(prayerTimes[p.key]),
    time: prayerTimes[p.key],
    isNext: p.id === nextPrayerId
  }))

  return (
    <div className="prayer-sun-arc-container">
      <svg className="prayer-sun-arc" viewBox="0 0 210 118" fill="none">
        {/* Horizon çizgisi */}
        <line
          x1="10" y1="101" x2="200" y2="101"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="1"
        />

        {/* Hover tooltip - arc ortasında */}
        {hoveredPrayer && (
          <text
            x="105"
            y="60"
            textAnchor="middle"
            className="prayer-arc-hover-text"
            fill={hoveredPrayer.color}
          >
            <tspan fontWeight="600">{hoveredPrayer.label}</tspan>
            <tspan dx="8" fill="rgba(0,0,0,0.5)">{hoveredPrayer.time}</tspan>
          </text>
        )}

        {/* Ana yay - güneşin yolu */}
        <path
          d={`M 20 101 A 85 85 0 0 1 190 101`}
          stroke="url(#prayerArcGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.25"
        />

        {/* İlerleme yayı - large-arc her zaman 0 (üst yay ≤180°) */}
        <path
          d={`M 20 101 A 85 85 0 0 1 ${sunX} ${sunY}`}
          stroke="url(#prayerProgressGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />

        {/* Vakit noktaları */}
        {prayerPositions.map(p => (
          <g
            key={p.id}
            className="prayer-dot-group"
            onMouseEnter={() => setHoveredPrayer({ label: p.label, time: p.time, color: p.color })}
            onMouseLeave={() => setHoveredPrayer(null)}
            style={{ cursor: 'pointer' }}
          >
            {/* Görünmez büyük tıklama alanı */}
            <circle
              cx={p.pos.x}
              cy={p.pos.y}
              r="8"
              fill="transparent"
            />
            {p.isNext && (
              <circle
                cx={p.pos.x}
                cy={p.pos.y}
                r="6"
                fill={p.color}
                opacity="0.15"
              />
            )}
            <circle
              cx={p.pos.x}
              cy={p.pos.y}
              r={p.isNext ? 3.5 : 2.5}
              fill={p.color}
              opacity={p.isNext ? 1 : 0.6}
              className="prayer-dot"
            />
          </g>
        ))}

      {/* Güneş/Ay */}
      <g className="prayer-celestial">
        {isDay ? (
          <>
            <circle cx={sunX} cy={sunY} r="10" fill="url(#prayerSunGlow)" opacity="0.4" />
            <circle cx={sunX} cy={sunY} r="6" fill="url(#prayerSunGradient)" />
            {[0, 60, 120, 180, 240, 300].map((deg) => {
              const rad = (deg * Math.PI) / 180
              const x1 = sunX + 8 * Math.cos(rad)
              const y1 = sunY + 8 * Math.sin(rad)
              const x2 = sunX + 11 * Math.cos(rad)
              const y2 = sunY + 11 * Math.sin(rad)
              return (
                <line
                  key={deg}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              )
            })}
          </>
        ) : (
          <>
            <circle cx={sunX} cy={sunY} r="9" fill="url(#prayerMoonGlow)" opacity="0.35" />
            <circle cx={sunX} cy={sunY} r="5.5" fill="#e2e8f0" />
            <circle cx={sunX - 2} cy={sunY - 0.5} r="4.5" fill="rgba(0,0,0,0.1)" />
          </>
        )}
      </g>

      {/* Gradients */}
      <defs>
        <linearGradient id="prayerArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="20%" stopColor="#0891b2" />
          <stop offset="40%" stopColor="#d97706" />
          <stop offset="60%" stopColor="#ea580c" />
          <stop offset="80%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="prayerProgressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <radialGradient id="prayerSunGradient">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
        <radialGradient id="prayerSunGlow">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="prayerMoonGlow">
          <stop offset="0%" stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  </div>
  )
}

function PrayerTimesCard({ prayerTimes, cityName, onCityClick, timezone = 3 }: { prayerTimes: PrayerTimes | null; cityName?: string; onCityClick?: () => void; timezone?: number }) {
  const [, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  if (!prayerTimes) return null

  const cityTime = getCurrentTimeInTimezone(timezone)
  const currentMinutes = cityTime.hours * 60 + cityTime.minutes

  // Her vakit için kalan süreyi hesapla
  const getPrayerData = (key: keyof PrayerTimes) => {
    const [h, m] = prayerTimes[key].split(':').map(Number)
    const prayerMinutes = h * 60 + m
    let remainingMins = prayerMinutes - currentMinutes
    const passed = remainingMins <= 0
    if (remainingMins <= 0) remainingMins += 1440

    return {
      time: prayerTimes[key],
      remainingMins,
      passed,
      formatted: remainingMins >= 60
        ? `${Math.floor(remainingMins / 60)}sa ${remainingMins % 60}dk`
        : `${remainingMins}dk`
    }
  }

  // Sıradaki vakti bul
  const prayersWithData = prayerList.map(p => ({
    ...p,
    ...getPrayerData(p.key)
  }))

  const nextPrayer = prayersWithData.reduce((min, p) =>
    p.remainingMins < min.remainingMins ? p : min
  )

  return (
    <div className="prayer-times-card" style={{ '--active-prayer-color': nextPrayer.color } as React.CSSProperties}>
      {cityName && onCityClick && (
        <button className="prayer-city-btn" onClick={onCityClick} data-hover="konum seç">
          <span>{cityName.toLowerCase()}</span>
        </button>
      )}
      <PrayerSunArc
        currentMinutes={currentMinutes}
        prayerTimes={prayerTimes}
        nextPrayerId={nextPrayer.id}
      />
      <div className="prayer-list">
        {prayersWithData.map((p, i) => {
          const nextColor = prayersWithData[(i + 1) % prayersWithData.length].color
          return (
            <div
              key={p.id}
              className={`prayer-item ${p.id === nextPrayer.id ? 'is-next' : ''}`}
              style={{ '--prayer-color': p.color, '--next-color': nextColor } as React.CSSProperties}
            >
              <span className="prayer-item-label">{p.label}</span>
              <span className="prayer-item-time">{p.time}</span>
              <span className="prayer-item-remaining">{p.formatted}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function Progress() {
  useDocumentTitle('günün akışı')
  const [city, setCity] = useState(() => {
    return localStorage.getItem('progress-city') || 'konya'
  })
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null)
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false)

  const getLocationData = useCallback(() => {
    if (city === 'custom') {
      const lat = parseFloat(localStorage.getItem('progress-custom-lat') || '0')
      const lng = parseFloat(localStorage.getItem('progress-custom-lng') || '0')
      // Estimate timezone from longitude
      const timezone = Math.round(lng / 15)
      return { lat, lng, timezone, name: `${lat.toFixed(2)}, ${lng.toFixed(2)}` }
    }
    const cityData = cities[city]
    return cityData ? { ...cityData } : null
  }, [city])

  const updatePrayerTimes = useCallback(async () => {
    const locationData = getLocationData()
    if (!locationData) return

    // Türkiye şehirleri için Diyanet API'den dene
    const cityData = cities[city]
    if (cityData?.cityId) {
      const diyanetTimes = await fetchDiyanetPrayerTimes(city)
      if (diyanetTimes) {
        setPrayerTimes(diyanetTimes)
        return
      }
    }

    // Diyanet yoksa hesapla
    const times = calculatePrayerTimes(locationData.lat, locationData.lng, new Date(), locationData.timezone)
    setPrayerTimes(times)
  }, [getLocationData, city])

  useEffect(() => {
    updatePrayerTimes()
    const interval = setInterval(updatePrayerTimes, 60000)
    return () => clearInterval(interval)
  }, [updatePrayerTimes])

  useEffect(() => {
    localStorage.setItem('progress-city', city)
    // Notify other components (e.g., top bar widget)
    window.dispatchEvent(new CustomEvent('city-changed', { detail: city }))
  }, [city])

  return (
    <div className="progress-page">
      {/* Vakitler - En üstte */}
      <PrayerTimesCard prayerTimes={prayerTimes} cityName={cities[city]?.name || city} onCityClick={() => setIsLocationPickerOpen(true)} timezone={cities[city]?.timezone ?? 3} />

      <LocationPicker
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onSelect={setCity}
        currentCity={city}
      />

    </div>
  )
}
