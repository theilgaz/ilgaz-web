import { useState, useEffect, useCallback, useRef } from 'react'

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

interface TimeSlot {
  id: string
  label: string
  shortLabel: string
  color: string
}

const timeSlots: TimeSlot[] = [
  { id: 'minute', label: 'dakika', shortLabel: 'dk', color: '#EA4335' },
  { id: 'hour', label: 'saat', shortLabel: 'sa', color: '#34A853' },
  { id: 'day', label: 'gün', shortLabel: 'gün', color: '#4285F4' },
  { id: 'week', label: 'hafta', shortLabel: 'hft', color: '#FBBC05' },
  { id: 'month', label: 'ay', shortLabel: 'ay', color: '#4285F4' },
  { id: 'year', label: 'yıl', shortLabel: 'yıl', color: '#EA4335' },
]

interface ProgressItemConfig {
  id: string
  label: string
  category: 'islam' | 'kozmos' | 'teknoloji'
  row?: number
  color?: string
  description?: string
}

// Vakit renkleri - Apple style, light theme friendly
const prayerColors = {
  fajr: '#0891b2',    // sabah - cyan
  sunrise: '#d97706', // güneş - amber
  dhuhr: '#ca8a04',   // öğle - yellow
  asr: '#ea580c',     // ikindi - orange
  maghrib: '#dc2626', // akşam - red
  isha: '#7c3aed',    // yatsı - violet
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

// Islam - Önemli tarihler satırı
const islamicDates: ProgressItemConfig[] = [
  { id: 'friday', label: 'cuma', category: 'islam', row: 2, description: 'Haftalık bayram. Cuma namazı farz.' },
  { id: 'ramadan', label: 'ramazan', category: 'islam', row: 2, description: "Kur'an'ın indirildiği ay. Oruç ayı." },
  { id: 'zilhicce', label: 'zilhicce', category: 'islam', row: 2, description: 'Hac ayı. Kurban Bayramı.' },
  { id: 'muharrem', label: 'muharrem', category: 'islam', row: 2, description: 'Hicri yılbaşı. Aşure günü.' },
  { id: 'kadir', label: 'kadir', category: 'islam', row: 2, description: 'Bin aydan hayırlı gece.' },
]

const otherItems: ProgressItemConfig[] = [
  { id: 'moon', label: 'dolunay', category: 'kozmos' },
  { id: 'solar-eclipse', label: 'tutulma', category: 'kozmos' },
  { id: 'ipv4', label: 'ipv4', category: 'teknoloji' },
  { id: 'internet-age', label: 'internet', category: 'teknoloji' },
]

const categoryConfig: Record<string, { label: string; icon: string; color: string }> = {
  islam: { label: 'islam', icon: '☪', color: '#10b981' },
  kozmos: { label: 'kozmos', icon: '✧', color: '#8b5cf6' },
  teknoloji: { label: 'teknoloji', icon: '⚡', color: '#06b6d4' },
}

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

function getNextPrayer(times: PrayerTimes, timezone: number = 3): { name: string; time: string; prev: string; prevTime: string } {
  const prayers = [
    { name: 'imsak', time: times.fajr },
    { name: 'güneş', time: times.sunrise },
    { name: 'öğle', time: times.dhuhr },
    { name: 'ikindi', time: times.asr },
    { name: 'akşam', time: times.maghrib },
    { name: 'yatsı', time: times.isha },
  ]

  const cityTime = getCurrentTimeInTimezone(timezone)
  const currentMinutes = cityTime.hours * 60 + cityTime.minutes

  for (let i = 0; i < prayers.length; i++) {
    const [h, m] = prayers[i].time.split(':').map(Number)
    const prayerMinutes = h * 60 + m
    if (currentMinutes < prayerMinutes) {
      const prev = i === 0 ? prayers[prayers.length - 1] : prayers[i - 1]
      return { name: prayers[i].name, time: prayers[i].time, prev: prev.name, prevTime: prev.time }
    }
  }

  return { name: prayers[0].name, time: prayers[0].time, prev: prayers[prayers.length - 1].name, prevTime: prayers[prayers.length - 1].time }
}

function getTimeSlotData(id: string): { percentage: number; remaining: string } {
  const now = new Date()

  switch (id) {
    case 'minute': {
      const elapsed = now.getSeconds()
      return {
        percentage: (elapsed / 60) * 100,
        remaining: `${60 - elapsed}sn`,
      }
    }
    case 'hour': {
      const elapsed = now.getMinutes() * 60 + now.getSeconds()
      const remaining = 3600 - elapsed
      return {
        percentage: (elapsed / 3600) * 100,
        remaining: `${Math.floor(remaining / 60)}dk`,
      }
    }
    case 'day': {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const elapsed = now.getTime() - start.getTime()
      const remaining = 86400000 - elapsed
      const hours = Math.floor(remaining / 3600000)
      const mins = Math.floor((remaining % 3600000) / 60000)
      return {
        percentage: (elapsed / 86400000) * 100,
        remaining: `${hours}sa ${mins}dk`,
      }
    }
    case 'week': {
      const day = now.getDay() || 7
      const hours = now.getHours() + now.getMinutes() / 60
      const elapsed = ((day - 1) * 24 + hours) / 168
      const remainingHours = (1 - elapsed) * 168
      const days = Math.floor(remainingHours / 24)
      const hrs = Math.floor(remainingHours % 24)
      return {
        percentage: elapsed * 100,
        remaining: `${days}g ${hrs}sa`,
      }
    }
    case 'month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      const elapsed = now.getTime() - start.getTime()
      const total = end.getTime() - start.getTime()
      const remainingDays = Math.ceil((end.getTime() - now.getTime()) / 86400000)
      return {
        percentage: (elapsed / total) * 100,
        remaining: `${remainingDays}g`,
      }
    }
    case 'year': {
      const start = new Date(now.getFullYear(), 0, 1)
      const end = new Date(now.getFullYear() + 1, 0, 1)
      const elapsed = now.getTime() - start.getTime()
      const total = end.getTime() - start.getTime()
      const remainingDays = Math.ceil((end.getTime() - now.getTime()) / 86400000)
      const months = Math.floor(remainingDays / 30)
      const days = remainingDays % 30
      return {
        percentage: (elapsed / total) * 100,
        remaining: months > 0 ? `${months}ay ${days}g` : `${days}g`,
      }
    }
    default:
      return { percentage: 0, remaining: '-' }
  }
}

interface ProgressData {
  percentage: number
  remaining: string
}

function getProgressData(id: string, prayerTimes?: PrayerTimes, timezone: number = 3): ProgressData {
  const now = new Date()
  const cityTime = getCurrentTimeInTimezone(timezone)
  const cityMinutes = cityTime.hours * 60 + cityTime.minutes

  const formatRemaining = (ms: number): string => {
    const totalMinutes = Math.floor(ms / 60000)
    const totalHours = Math.floor(totalMinutes / 60)
    const totalDays = Math.floor(totalHours / 24)
    const totalMonths = Math.floor(totalDays / 30)
    const totalYears = Math.floor(totalDays / 365)

    if (totalMinutes < 60) return `${totalMinutes}dk`
    if (totalHours < 24) {
      const mins = totalMinutes % 60
      return mins > 0 ? `${totalHours}sa ${mins}dk` : `${totalHours}sa`
    }
    if (totalDays < 30) {
      const hours = totalHours % 24
      return hours > 0 ? `${totalDays}g ${hours}sa` : `${totalDays}g`
    }
    if (totalDays < 365) {
      const days = totalDays % 30
      return days > 0 ? `${totalMonths}ay ${days}g` : `${totalMonths}ay`
    }
    const months = Math.floor((totalDays % 365) / 30)
    return months > 0 ? `${totalYears}yıl ${months}ay` : `${totalYears}yıl`
  }

  switch (id) {
    case 'friday': {
      const day = now.getDay()
      const daysUntilFriday = (5 - day + 7) % 7 || 7
      const fridayNoon = new Date(now)
      fridayNoon.setDate(now.getDate() + daysUntilFriday)
      fridayNoon.setHours(13, 0, 0, 0)
      if (day === 5 && now.getHours() < 13) {
        fridayNoon.setDate(now.getDate())
      }
      const lastFriday = new Date(fridayNoon)
      lastFriday.setDate(lastFriday.getDate() - 7)
      const elapsed = now.getTime() - lastFriday.getTime()
      const total = fridayNoon.getTime() - lastFriday.getTime()
      return {
        percentage: (elapsed / total) * 100,
        remaining: formatRemaining(fridayNoon.getTime() - now.getTime()),
      }
    }
    case 'ramadan': {
      const ramadan2026 = new Date(2026, 1, 17)
      const ramadan2027 = new Date(2027, 1, 7)
      if (now < ramadan2026) {
        const lastRamadan = new Date(2025, 2, 1)
        const elapsed = now.getTime() - lastRamadan.getTime()
        const total = ramadan2026.getTime() - lastRamadan.getTime()
        return {
          percentage: (elapsed / total) * 100,
          remaining: formatRemaining(ramadan2026.getTime() - now.getTime()),
        }
      }
      const elapsed = now.getTime() - ramadan2026.getTime()
      const total = ramadan2027.getTime() - ramadan2026.getTime()
      return {
        percentage: (elapsed / total) * 100,
        remaining: formatRemaining(ramadan2027.getTime() - now.getTime()),
      }
    }
    case 'zilhicce': {
      const zilhicce2026 = new Date(2026, 4, 27)
      const zilhicce2027 = new Date(2027, 4, 17)
      if (now < zilhicce2026) {
        const lastZilhicce = new Date(2025, 5, 7)
        const elapsed = now.getTime() - lastZilhicce.getTime()
        const total = zilhicce2026.getTime() - lastZilhicce.getTime()
        return {
          percentage: (elapsed / total) * 100,
          remaining: formatRemaining(zilhicce2026.getTime() - now.getTime()),
        }
      }
      const elapsed = now.getTime() - zilhicce2026.getTime()
      const total = zilhicce2027.getTime() - zilhicce2026.getTime()
      return {
        percentage: (elapsed / total) * 100,
        remaining: formatRemaining(zilhicce2027.getTime() - now.getTime()),
      }
    }
    case 'muharrem': {
      const muharrem2026 = new Date(2026, 5, 26)
      const muharrem2027 = new Date(2027, 5, 16)
      if (now < muharrem2026) {
        const lastMuharrem = new Date(2025, 6, 7)
        const elapsed = now.getTime() - lastMuharrem.getTime()
        const total = muharrem2026.getTime() - lastMuharrem.getTime()
        return {
          percentage: (elapsed / total) * 100,
          remaining: formatRemaining(muharrem2026.getTime() - now.getTime()),
        }
      }
      const elapsed = now.getTime() - muharrem2026.getTime()
      const total = muharrem2027.getTime() - muharrem2026.getTime()
      return {
        percentage: (elapsed / total) * 100,
        remaining: formatRemaining(muharrem2027.getTime() - now.getTime()),
      }
    }
    case 'kadir': {
      // Kadir gecesi - Ramazan'ın 27. gecesi (tahmini)
      const kadir2026 = new Date(2026, 2, 13) // 13 Mart 2026
      const kadir2027 = new Date(2027, 2, 3)
      if (now < kadir2026) {
        const lastKadir = new Date(2025, 2, 27)
        const elapsed = now.getTime() - lastKadir.getTime()
        const total = kadir2026.getTime() - lastKadir.getTime()
        return {
          percentage: (elapsed / total) * 100,
          remaining: formatRemaining(kadir2026.getTime() - now.getTime()),
        }
      }
      const elapsed = now.getTime() - kadir2026.getTime()
      const total = kadir2027.getTime() - kadir2026.getTime()
      return {
        percentage: (elapsed / total) * 100,
        remaining: formatRemaining(kadir2027.getTime() - now.getTime()),
      }
    }
    case 'fajr':
    case 'dhuhr':
    case 'asr':
    case 'maghrib':
    case 'isha': {
      if (!prayerTimes) return { percentage: 0, remaining: '-' }

      const prayerMap: Record<string, keyof PrayerTimes> = {
        fajr: 'fajr',
        dhuhr: 'dhuhr',
        asr: 'asr',
        maghrib: 'maghrib',
        isha: 'isha',
      }
      const prayerKey = prayerMap[id]
      const prayerTime = prayerTimes[prayerKey]
      const [h, m] = prayerTime.split(':').map(Number)
      const prayerMinutes = h * 60 + m

      // Eğer vakit geçtiyse, yarına kadar olan süre
      let remainingMins: number
      if (cityMinutes >= prayerMinutes) {
        remainingMins = (1440 - cityMinutes) + prayerMinutes
      } else {
        remainingMins = prayerMinutes - cityMinutes
      }

      // 24 saat üzerinden yüzde
      const percentage = ((1440 - remainingMins) / 1440) * 100

      return {
        percentage,
        remaining: remainingMins >= 60
          ? `${Math.floor(remainingMins / 60)}sa ${remainingMins % 60}dk`
          : `${remainingMins}dk`,
      }
    }
    case 'prayer': {
      if (!prayerTimes) return { percentage: 0, remaining: '-' }
      const { time, prevTime } = getNextPrayer(prayerTimes, timezone)
      const [h1, m1] = prevTime.split(':').map(Number)
      const [h2, m2] = time.split(':').map(Number)
      let prevMinutes = h1 * 60 + m1
      let nextMinutes = h2 * 60 + m2
      const currentMinutes = cityMinutes

      if (nextMinutes < prevMinutes) nextMinutes += 1440
      let curr = currentMinutes
      if (curr < prevMinutes) curr += 1440

      const elapsed = curr - prevMinutes
      const total = nextMinutes - prevMinutes
      const remainingMins = total - elapsed

      return {
        percentage: (elapsed / total) * 100,
        remaining: remainingMins >= 60
          ? `${Math.floor(remainingMins / 60)}sa ${remainingMins % 60}dk`
          : `${remainingMins}dk`,
      }
    }
    case 'moon': {
      const lunarCycle = 29.53058867
      const knownNewMoon = new Date(2024, 0, 11, 11, 57)
      const daysSince = (now.getTime() - knownNewMoon.getTime()) / 86400000
      const phase = (daysSince % lunarCycle) / lunarCycle
      let percentage: number
      let remainingDays: number
      if (phase < 0.5) {
        percentage = phase * 2 * 100
        remainingDays = (0.5 - phase) * lunarCycle
      } else {
        percentage = (phase - 0.5) * 2 * 100
        remainingDays = (1 - phase) * lunarCycle + 0.5 * lunarCycle
      }
      return {
        percentage,
        remaining: `${Math.floor(remainingDays)}g`,
      }
    }
    case 'solar-eclipse': {
      const nextEclipse = new Date(2026, 7, 12)
      const lastEclipse = new Date(2024, 3, 8)
      if (now >= nextEclipse) {
        const next2027 = new Date(2027, 7, 2)
        const elapsed = now.getTime() - nextEclipse.getTime()
        const total = next2027.getTime() - nextEclipse.getTime()
        return {
          percentage: (elapsed / total) * 100,
          remaining: formatRemaining(next2027.getTime() - now.getTime()),
        }
      }
      const elapsed = now.getTime() - lastEclipse.getTime()
      const total = nextEclipse.getTime() - lastEclipse.getTime()
      return {
        percentage: (elapsed / total) * 100,
        remaining: formatRemaining(nextEclipse.getTime() - now.getTime()),
      }
    }
    case 'ipv4': {
      const start = new Date(2011, 1, 3)
      const end = new Date(2030, 0, 1)
      const elapsed = now.getTime() - start.getTime()
      const total = end.getTime() - start.getTime()
      return {
        percentage: (elapsed / total) * 100,
        remaining: formatRemaining(end.getTime() - now.getTime()),
      }
    }
    case 'internet-age': {
      const birth = new Date(1991, 7, 6)
      const target = new Date(2091, 7, 6)
      const elapsed = now.getTime() - birth.getTime()
      const total = target.getTime() - birth.getTime()
      return {
        percentage: (elapsed / total) * 100,
        remaining: formatRemaining(target.getTime() - now.getTime()),
      }
    }
    default:
      return { percentage: 0, remaining: '-' }
  }
}

function DeloreanIllustration() {
  return (
    <svg className="delorean-illustration" viewBox="0 0 285 200" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0, -85)">
        {/* Gull-wing doors */}
        <path fill="#2F2F2F" d="M181,157.9c-0.3,0-0.5-0.1-0.8-0.2L163.4,146c-0.6-0.4-0.8-1.3-0.4-1.9c0.4-0.6,1.3-0.8,1.9-0.4l16.8,11.6c0.6,0.4,0.8,1.3,0.4,1.9C181.9,157.7,181.5,157.9,181,157.9L181,157.9z"/>
        <path fill="#2F2F2F" d="M104,157.9c-0.4,0-0.9-0.2-1.1-0.6c-0.4-0.6-0.3-1.5,0.4-1.9l16.8-11.6c0.6-0.4,1.5-0.3,1.9,0.4c0.4,0.6,0.3,1.5-0.4,1.9l-16.8,11.6C104.5,157.8,104.2,157.9,104,157.9L104,157.9z"/>
        {/* Main body */}
        <path fill="#2F2F2F" d="M246.1,216.7l-7.5-14.2c-0.1-0.1-0.2-0.3-0.3-0.4c-0.1-0.2-0.2-0.4-0.3-0.6c0,0-18.9-21-19.5-21.5c-0.2-0.1-18.1-13.7-27-20.5c0,0-4.8-3.4-6.4-4.5c-1.3-1.1-7.4-1.1-7.4-1.1c-3.6,0-9.4,0-11.1,0l0.1-0.6c0-0.1,0.7-3.9,1.6-8.2l0.5-2.6c0.4-2,0.9-4,1.3-5.7c0.6-2.1,1.5-5.2,1.6-5.8c0,0,0,0,0.1-0.1c0.4-0.2,1.7-1,3-1.7c3-0.7,5.7-2,8.4-3.2c1.3-0.6,2.5-1.2,3.8-1.7c0.9-0.4,1.8-0.8,2.7-1.2c1.7-0.8,3.2-1.6,4.6-1.6c0.2,0,0.4,0,0.7,0.1c0.1,0,0.1,0,0.2,0c0.9,0.1,1.8,0.2,2.7,0.3c3.5,0.3,6.8,0.6,9.9,1.7c0,0,0.1,0,0.1,0c3.9,1.2,8.6,2.5,13.3,3.7c0.8,0.2,1.7,0.3,2.6,0.3c3.8,0,7.3-1.8,10.3-3.4c0.9-0.5,1.7-0.9,2.5-1.3c0.1,0,0.2-0.1,0.3-0.1c0.1,0,0.1,0,0.2-0.1c0,0,6.7-3.3,6.7-3.3c1.1-0.5,1.8-1.5,2-2.6c0.1-0.7,0-1.5-0.3-2.1c-0.3-0.6-0.7-1.2-1.4-1.5c-0.4-0.3-1-0.8-1.8-1.2c-1.8-1-4.5-2.4-7.3-3.8c-3.5-1.9-7-3.9-10.6-5.6c-0.4,0-0.7,0-1.1,0c-0.5-0.1-1.1-0.2-1.6-0.2c-0.2,0-0.3,0-0.5,0l-13.7,1.2c-0.4-3-0.8-6.2-1.5-9.4c-0.2-1-0.9-1.8-1.9-2.1c-1.8-0.6-3.7-0.9-5.6-0.9c-0.1,0-0.2,0-0.3,0c-1.2,0-2.2,0.7-2.6,1.8c-1,2.8-1.9,5.6-2.7,8.4c-0.6,2.2-1.3,4.5-2.1,6.7c-0.1,0.4-0.2,0.9-0.1,1.3c0,0,0,0,0,0.1c-0.1,0.4-0.3,0.8-0.5,1c-10.5,5.7-23.7,12.8-23.9,12.9c-1.3,0.7-2.3,2.1-2.6,3.5l-5,25.3l-0.2,1.1c0,0.2-0.1,0.3-0.1,0.5h-31.4c0-0.2,0-0.3-0.1-0.5l-0.2-1.1l-5-25.3c-0.3-1.4-1.3-2.8-2.6-3.5c-0.2-0.1-13.3-7.2-23.9-12.9c-0.3-0.3-0.5-0.6-0.5-1c0,0,0,0,0-0.1c0.1-0.4,0-0.9-0.1-1.3c-0.8-2.2-1.4-4.5-2.1-6.7c-0.8-2.8-1.6-5.6-2.7-8.4c-0.4-1.1-1.4-1.8-2.6-1.8c-0.1,0-0.2,0-0.3,0c-1.9,0-3.7,0.3-5.6,0.9c-1,0.3-1.7,1.1-1.9,2.1c-0.6,3.1-1.1,6.4-1.5,9.4L64,102.3c-0.1,0-0.3,0-0.5,0c-0.5,0-1.1,0.1-1.6,0.2c-0.4,0-0.7,0-1.1,0c-3.6,1.7-7.1,3.7-10.6,5.6c-2.8,1.4-5.5,2.8-7.3,3.8c-0.7,0.4-1.3,0.8-1.8,1.2c-0.6,0.4-1.1,0.9-1.4,1.5c-0.3,0.7-0.5,1.4-0.3,2.1c0.2,1.1,0.9,2.1,2,2.6l6.6,3.3c0,0,0.2,0.1,0.2,0.1c0.1,0.1,0.2,0.1,0.3,0.1c0.8,0.4,1.6,0.8,2.5,1.3c3.1,1.6,6.5,3.4,10.3,3.4c0,0,0,0,0,0c0.9,0,1.7-0.1,2.6-0.3c4.7-1.2,9.4-2.5,13.3-3.7c0,0,0.1,0,0.1,0c3.1-1.1,6.4-1.4,9.9-1.7c0.9-0.1,1.8-0.2,2.7-0.3c0.1,0,0.1,0,0.2,0c0.2,0,0.4-0.1,0.7-0.1c1.4,0,3,0.8,4.6,1.6c0.9,0.4,1.7,0.8,2.7,1.2c1.2,0.5,2.5,1.1,3.8,1.7c2.6,1.2,5.3,2.5,8.4,3.2c1.2,0.8,2.6,1.5,3,1.7c0,0,0,0,0.1,0.1c0.2,0.6,1,3.7,1.6,5.8c0.4,1.6,0.8,3.6,1.3,5.7l0.5,2.6c0.9,4.3,1.6,8.2,1.6,8.2l0.1,0.6c-1.8,0-7.5,0-11.1,0c0,0-5.9-0.2-7.4,1.1c-1.6,1.2-6.4,4.5-6.4,4.5c-8.9,6.8-26.8,20.4-27,20.5c-0.6,0.5-19.5,21.5-19.5,21.5c-0.1,0.2-0.2,0.4-0.3,0.6c-0.1,0.1-0.2,0.3-0.3,0.4l-7.5,14.2c-1,1.9-1.5,3.8-1.3,5.6c-0.1,2.1,0.5,4,1.8,5.5c0.5,1.2,1.1,2.4,1.9,3.7c0.6,1.4,1.4,3,2.1,4.7c0.6,2.1,1,4.3,0.9,6.5c0,6.9,0,18.9,0,24.9c0,2,1.6,3.6,3.6,3.6h23.3c2,0,3.6-1.6,3.6-3.6v-3.9h135.2v3.9c0,2,1.6,3.6,3.6,3.6h23.3c2,0,3.6-1.6,3.6-3.6c0-6,0-18,0-24.9c-0.1-2.1,0.2-4.1,0.8-6.1c0.8-1.7,1.5-3.5,2.2-5c0.9-1.9,1.6-3.3,1.8-3.6c0,0,0.1-0.1,0.1-0.1c1.3-1.5,1.9-3.4,1.8-5.5C247.6,220.5,247.1,218.6,246.1,216.7z"/>
        {/* Body details */}
        <path fill="#B1B1B1" d="M81.9,94.7c1.6-0.5,3.4-0.8,5.1-0.7c1.8,4.9,3,10.1,4.7,15c-3.8-1.6-7-4.7-11.3-5C80.9,100.8,81.3,97.7,81.9,94.7z"/>
        <path fill="#6C6C6C" d="M51.3,120.1l14.3-8.4l14.9-1.1c0,0,4.8,1.4,7,2.7c7.9,4.6,16.1,8.6,23.9,13.4c-4.3-0.9-8.1-3.3-12.2-4.9c-3.1-1.2-6-3.4-9.5-2.9c-4.4,0.5-9,0.6-13.2,2.1c-4.4,1.3-8.8,2.6-13.2,3.7c-4.8,1.1-9.5-2.3-13.6-4.2c0,0,0.1,0,0.1-0.1C50.3,120.4,50.9,120.3,51.3,120.1z"/>
        <path fill="#B1B1B1" d="M123.8,152.8l-5-25.3c-0.1-0.6-0.7-1.3-1.2-1.6c0,0-20.1-10.9-30.6-16.6c-2.1-1.1-5.5-2.3-5.5-2.3c-0.6-0.2-1.5-0.4-2.2-0.5l-15.6-1.3c-0.6-0.1-1.6,0.1-2.1,0.4c0,0-12.4,6.1-17.5,8.9c-1,0.5-1.7,1.2-1.7,1.2c-0.4,0.4-0.4,1,0.2,1.2l6.7,3.3c0.2,0.1,0.3,0.1,0.5,0.1c0.5,0.1,1.1,0,1.4-0.2l14.3-7.3c0.5-0.3,1.5-0.6,2.1-0.6c0,0,8.2-0.3,12.8-0.6c2.6-0.1,4.8,0.3,7,1.5c7.9,4.6,16.1,8.6,23.9,13.4c1.4,0.9,3.3,2,3.3,2c0.5,0.3,1.1,1,1.3,1.6c0,0,1,3.6,1.6,5.9c1.5,6,3.5,16.7,3.5,16.7c0.1,0.6,0.2,1.1,0.2,1.1h2.8C124,153.9,123.9,153.4,123.8,152.8z"/>
        <path fill="#A65A34" opacity="0.8" d="M47.4,114.8c-0.1-0.3,0-0.6,0.3-0.7l2.4-1.2c0.3-0.1,0.6,0,0.8,0.3l1.3,2.5c0.1,0.3,0,0.6-0.3,0.7l-2.5,1.1c-0.3,0.1-0.6,0-0.8-0.3L47.4,114.8z"/>
        {/* Right side details */}
        <path fill="#B1B1B1" d="M203.1,94.7c-1.6-0.5-3.4-0.8-5.1-0.7c-1.8,4.9-3,10.1-4.7,15c3.8-1.6,7-4.7,11.3-5C204.1,100.8,203.7,97.7,203.1,94.7z"/>
        <path fill="#6C6C6C" d="M233.7,120.1l-14.3-8.4l-14.9-1.1c0,0-4.8,1.4-7,2.7c-7.9,4.6-16.1,8.6-23.9,13.4c4.3-0.9,8.1-3.3,12.2-4.9c3.1-1.2,6-3.4,9.5-2.9c4.4,0.5,9,0.6,13.2,2.1c4.4,1.3,8.8,2.6,13.2,3.7c4.8,1.1,9.5-2.3,13.6-4.2c0,0-0.1,0-0.1-0.1C234.7,120.4,234.1,120.3,233.7,120.1z"/>
        <path fill="#B1B1B1" d="M242.6,115.6c0,0-0.8-0.7-1.7-1.2c-5.1-2.7-17.5-8.9-17.5-8.9c-0.5-0.3-1.5-0.5-2.1-0.4l-15.6,1.3c-0.6,0.1-1.6,0.3-2.2,0.5c0,0-3.4,1.3-5.5,2.3c-10.6,5.6-30.6,16.6-30.6,16.6c-0.5,0.3-1.1,1-1.2,1.6l-5,25.3c-0.1,0.6-0.2,1.1-0.2,1.1h2.8c0,0,0.1-0.5,0.2-1.1c0,0,2-10.7,3.5-16.7c0.6-2.3,1.6-5.9,1.6-5.9c0.2-0.6,0.7-1.3,1.3-1.6c0,0,1.9-1.1,3.3-2c7.8-4.8,16-8.8,23.9-13.4c2.2-1.3,4.4-1.7,7-1.5c4.6,0.3,12.8,0.6,12.8,0.6c0.6,0,1.6,0.3,2.1,0.6l14.3,7.3c0.4,0.2,0.9,0.3,1.4,0.2c0.2,0,0.4-0.1,0.5-0.1l6.7-3.3C242.9,116.6,243,116,242.6,115.6z"/>
        <path fill="#A65A34" opacity="0.8" d="M237.6,114.8c0.1-0.3,0-0.6-0.3-0.7l-2.4-1.2c-0.3-0.1-0.6,0-0.8,0.3l-1.3,2.5c-0.1,0.3,0,0.6,0.3,0.7l2.5,1.1c0.3,0.1,0.6,0,0.8-0.3L237.6,114.8z"/>
        {/* Front body panels */}
        <path fill="#B1B1B1" d="M50.5,201.4L50.5,201.4h-0.1l15.2-16.8H75c0,0-9.5,11.2-14.2,16.9l0,0l0,0H50.5z"/>
        <polygon fill="#F7F7F7" points="50.5,201.4 60.8,201.4 60.7,201.5 59.2,203.1 49.2,203.1 50.5,201.4"/>
        <polygon fill="#B1B1B1" points="182,156.5 103,156.5 98.5,159.1 186.5,159.1"/>
        <polygon fill="#D0D0D0" points="187.5,160.4 97.5,160.4 68.2,182.2 216.8,182.2"/>
        <polygon fill="#B1B1B1" points="222.9,201.4 208.8,184.6 76.2,184.6 62.1,201.4"/>
        <path fill="#B1B1B1" d="M234.5,201.4L234.5,201.4h0.1l-15.2-16.8H210c0,0,9.5,11.2,14.2,16.9l0,0l0,0H234.5z"/>
        <polygon fill="#F7F7F7" points="234.5,201.4 224.2,201.4 224.3,201.5 225.8,203.1 235.8,203.1 234.5,201.4"/>
        <path fill="#F7F7F7" d="M244.7,222.3c-0.3,2.7-2.6,4.5-6.3,4.5H46.6c-3.7,0-6-1.8-6.3-4.5c-0.3,3.3,2.1,5.7,6.3,5.7h191.7C242.6,227.9,245,225.6,244.7,222.3z"/>
        <path fill="#B1B1B1" d="M243.7,218l-2.8-5.3c-2.6-4.9-4.7-8.9-4.7-8.9H48.9c0,0-2.1,4-4.7,8.9l-2.8,5.3c-0.8,1.6-1.1,3-1,4.3c0.3,2.7,2.6,4.5,6.3,4.5h191.7c3.7,0,6-1.8,6.3-4.5C244.8,221,244.5,219.5,243.7,218z M238.7,224.6H46.3c-2.2,0-2.5-3.6-1.9-4.8l6.5-12.7h183.3l6.5,12.7C241.2,221,240.9,224.6,238.7,224.6z"/>
        <path fill="#2F2F2F" d="M240.6,219.8l-6.5-12.7H50.9l-6.5,12.7c-0.6,1.2-0.3,4.8,1.9,4.8h192.4C240.9,224.6,241.2,221,240.6,219.8z M75.6,221.3c0,0.6-0.5,1.1-1.1,1.1H56c-0.6,0-1.1-0.5-1.1-1.1v-10.6c0-0.6,0.5-1.1,1.1-1.1h18.6c0.6,0,1.1,0.5,1.1,1.1V221.3z M102.4,221.3c0,0.6-0.5,1.1-1.1,1.1H82.7c-0.6,0-1.1-0.5-1.1-1.1v-10.6c0-0.6,0.5-1.1,1.1-1.1h18.6c0.6,0,1.1,0.5,1.1,1.1V221.3z M203.4,221.3c0,0.6-0.5,1.1-1.1,1.1h-18.6c-0.6,0-1.1-0.5-1.1-1.1v-10.6c0-0.6,0.5-1.1,1.1-1.1h18.6c0.6,0,1.1,0.5,1.1,1.1V221.3z M230.2,221.3c0,0.6-0.5,1.1-1.1,1.1h-18.6c-0.6,0-1.1-0.5-1.1-1.1v-10.6c0-0.6,0.5-1.1,1.1-1.1H229c0.6,0,1.1,0.5,1.1,1.1V221.3z"/>
        <polygon fill="#373737" points="45.2,231.7 48.4,239.2 236.6,239.2 239.8,231.7"/>
        <polygon fill="#F7F7F7" points="222.9,201.4 62.1,201.4 60.5,203.1 224.5,203.1"/>
        <polygon fill="#B1B1B1" points="49.6,244 50.6,245.8 234.4,245.8 235.4,244"/>
        <polygon fill="#F7F7F7" points="49,242.5 49.6,244 235.4,244 236,242.5"/>
        {/* Ground line */}
        <path fill="#2F2F2F" d="M240.9,274.8c0,0.6-0.7,1.2-1.5,1.2H45.6c-0.8,0-1.5-0.5-1.5-1.2c0-0.6,0.7-1.2,1.5-1.2h193.8C240.2,273.6,240.9,274.2,240.9,274.8z"/>
        {/* Turn signals */}
        <path fill="#A65A34" d="M85.6,236.7c0,0.6-0.5,1.1-1.1,1.1H72.2c-0.6,0-1.1-0.5-1.1-1.1v-2.8c0-0.6,0.5-1.1,1.1-1.1h12.3c0.6,0,1.1,0.5,1.1,1.1V236.7z"/>
        <path fill="#A65A34" d="M213.9,236.7c0,0.6-0.5,1.1-1.1,1.1h-12.3c-0.6,0-1.1-0.5-1.1-1.1v-2.8c0-0.6,0.5-1.1,1.1-1.1h12.3c0.6,0,1.1,0.5,1.1,1.1V236.7z"/>
        {/* Headlights */}
        <path fill="#A7A7A7" d="M120.2,175.5h-18.4c-3.7,0-6.7,3-6.7,6.7h31.8C126.9,178.5,123.9,175.5,120.2,175.5z"/>
        <path fill="#A7A7A7" d="M183.2,175.5h-18.4c-3.7,0-6.7,3-6.7,6.7h31.8C189.9,178.5,186.9,175.5,183.2,175.5z"/>
        {/* Vent boxes */}
        <path fill="#F7F7F7" d="M56,209.5h18.6c0.6,0,1.1,0.5,1.1,1.1v10.6c0,0.6-0.5,1.1-1.1,1.1H56c-0.6,0-1.1-0.5-1.1-1.1v-10.6C54.8,210,55.4,209.5,56,209.5z"/>
        <path fill="#F7F7F7" d="M82.7,209.5h18.6c0.6,0,1.1,0.5,1.1,1.1v10.6c0,0.6-0.5,1.1-1.1,1.1H82.7c-0.6,0-1.1-0.5-1.1-1.1v-10.6C81.6,210,82.1,209.5,82.7,209.5z"/>
        <path fill="#F7F7F7" d="M229,209.5h-18.6c-0.6,0-1.1,0.5-1.1,1.1v10.6c0,0.6,0.5,1.1,1.1,1.1H229c0.6,0,1.1-0.5,1.1-1.1v-10.6C230.2,210,229.6,209.5,229,209.5z"/>
        <path fill="#F7F7F7" d="M202.3,209.5h-18.6c-0.6,0-1.1,0.5-1.1,1.1v10.6c0,0.6,0.5,1.1,1.1,1.1h18.6c0.6,0,1.1-0.5,1.1-1.1v-10.6C203.4,210,202.9,209.5,202.3,209.5z"/>
        {/* Center grille lines */}
        <path fill="#1A1A1A" d="M105.1,211.4h74.8c0.5,0,0.8-0.4,0.8-0.8c0-0.5-0.4-0.8-0.8-0.8h-74.8c-0.5,0-0.8,0.4-0.8,0.8C104.3,211.1,104.6,211.4,105.1,211.4z"/>
        <path fill="#1A1A1A" d="M179.9,213.4h-74.8c-0.5,0-0.8,0.4-0.8,0.8c0,0.5,0.4,0.8,0.8,0.8h74.8c0.5,0,0.8-0.4,0.8-0.8C180.7,213.7,180.4,213.4,179.9,213.4z"/>
        <path fill="#1A1A1A" d="M179.9,216.9h-74.8c-0.5,0-0.8,0.4-0.8,0.8c0,0.5,0.4,0.8,0.8,0.8h74.8c0.5,0,0.8-0.4,0.8-0.8C180.7,217.3,180.4,216.9,179.9,216.9z"/>
        <path fill="#1A1A1A" d="M179.9,220.5h-74.8c-0.5,0-0.8,0.4-0.8,0.8c0,0.5,0.4,0.8,0.8,0.8h74.8c0.5,0,0.8-0.4,0.8-0.8C180.7,220.8,180.4,220.5,179.9,220.5z"/>
        {/* Windshield reflections */}
        <g opacity="0.5">
          <polygon fill="#FFFFFF" points="139.6,181.4 158.7,161.1 153.3,161.1 134.5,181.4"/>
          <polygon fill="#FFFFFF" points="128.3,181.4 147.2,161.1 138.2,161.1 119.3,181.4"/>
        </g>
        {/* DMC Logo */}
        <g id="DMC_logo">
          <path fill="#CCCCCC" d="M150.2,212.6c-0.5,0-0.9,0.2-1.3,0.5c-0.3,0.3-0.5,0.7-0.5,1.2v2.2c0,0.5,0.2,0.9,0.5,1.2c0.3,0.3,0.8,0.5,1.3,0.5h6.8c0.1,0,0.2-0.1,0.2-0.2v-2.2c0-0.1-0.1-0.2-0.2-0.2h-5.3l0,0c-0.1,0-0.1,0-0.1-0.1c0,0-0.1-0.1-0.1-0.1l0,0c0-0.1,0-0.1,0.1-0.1c0,0,0.1-0.1,0.1-0.1h5.3c0.1,0,0.2-0.1,0.2-0.2v-2.2c0-0.1-0.1-0.2-0.2-0.2H150.2L150.2,212.6z M133.6,215.4c0-0.1,0-0.1-0.1-0.1c0,0-0.1-0.1-0.1-0.1h-5.4c-0.1,0-0.2-0.1-0.2-0.2v-2.2c0-0.1,0.1-0.2,0.2-0.2h6.9c0.5,0,0.9,0.2,1.3,0.5c0.3,0.3,0.5,0.7,0.5,1.2v0v2.2c0,0.5-0.2,0.9-0.5,1.2c-0.3,0.3-0.8,0.5-1.3,0.5h-6.9c-0.1,0-0.2-0.1-0.2-0.2v-2.2c0-0.1,0.1-0.2,0.2-0.2h5.4c0.1,0,0.1,0,0.1-0.1C133.6,215.5,133.6,215.5,133.6,215.4L133.6,215.4L133.6,215.4z M144,215.4v2.6c0,0.1-0.1,0.2-0.2,0.2h-2.6c-0.1,0-0.2-0.1-0.2-0.2v-2.6c0,0,0-0.1-0.1-0.1c0,0-0.1-0.1-0.1-0.1c-0.1,0-0.1,0-0.1,0.1c0,0-0.1,0.1-0.1,0.1v2.6c0,0.1-0.1,0.2-0.2,0.2h-2.5c-0.1,0-0.2-0.1-0.2-0.2v-3.7c0-0.5,0.2-0.9,0.5-1.2c0.3-0.3,0.8-0.5,1.3-0.5h6.1c0.5,0,0.9,0.2,1.3,0.5c0.3,0.3,0.5,0.7,0.5,1.2v0v3.7c0,0.1-0.1,0.2-0.2,0.2h-2.6c-0.1,0-0.2-0.1-0.2-0.2v-2.6c0,0,0-0.1-0.1-0.1c0,0-0.1-0.1-0.1-0.1c-0.1,0-0.1,0-0.1,0.1C144,215.3,144,215.4,144,215.4L144,215.4L144,215.4z"/>
        </g>
      </g>
    </svg>
  )
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

function TimeSlotDisplay({ slot }: { slot: TimeSlot }) {
  const [data, setData] = useState(() => getTimeSlotData(slot.id))

  useEffect(() => {
    const interval = setInterval(() => {
      setData(getTimeSlotData(slot.id))
    }, slot.id === 'minute' ? 100 : 1000)
    return () => clearInterval(interval)
  }, [slot.id])

  const percentage = Math.min(Math.max(data.percentage, 0), 100)

  return (
    <div className="time-slot" style={{ '--slot-color': slot.color } as React.CSSProperties}>
      <div className="time-slot-display">
        <span className="time-slot-value">{percentage.toFixed(0).padStart(2, '0')}</span>
        <span className="time-slot-unit">%</span>
      </div>
      <div className="time-slot-bar">
        <div className="time-slot-fill" style={{ width: `${percentage}%` }} />
      </div>
      <span className="time-slot-label">{slot.shortLabel}</span>
      <span className="time-slot-remaining">{data.remaining}</span>
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
  const radius = 52
  const centerX = 70
  const centerY = 58

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
      <svg className="prayer-sun-arc" viewBox="0 0 140 72" fill="none">
        {/* Horizon çizgisi */}
        <line
          x1="12" y1="58" x2="128" y2="58"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="1"
        />

        {/* Ana yay - güneşin yolu */}
        <path
          d={`M 18 58 A 52 52 0 0 1 122 58`}
          stroke="url(#prayerArcGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.25"
        />

        {/* İlerleme yayı */}
        <path
          d={`M 18 58 A 52 52 0 ${dayProgress > 50 ? 1 : 0} 1 ${sunX} ${sunY}`}
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
    <div className={`prayer-arc-tooltip ${hoveredPrayer ? 'visible' : ''}`}>
      {hoveredPrayer && (
        <>
          <span className="prayer-arc-tooltip-label" style={{ color: hoveredPrayer.color }}>
            {hoveredPrayer.label}
          </span>
          <span className="prayer-arc-tooltip-time">{hoveredPrayer.time}</span>
        </>
      )}
    </div>
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

function ProgressCard({
  item,
  prayerTimes,
  prayerInfo,
  color,
  timezone = 3
}: {
  item: ProgressItemConfig
  prayerTimes?: PrayerTimes
  prayerInfo?: { name: string; time: string }
  color: string
  timezone?: number
}) {
  const [data, setData] = useState(() => getProgressData(item.id, prayerTimes, timezone))

  useEffect(() => {
    const interval = setInterval(() => {
      setData(getProgressData(item.id, prayerTimes, timezone))
    }, 1000)
    return () => clearInterval(interval)
  }, [item.id, prayerTimes, timezone])

  const percentage = Math.min(Math.max(data.percentage, 0), 100)

  const getLabel = () => {
    if (item.id === 'prayer' && prayerInfo) {
      return prayerInfo.name
    }
    return item.label.replace('siradaki ', '')
  }

  // Item'ın kendi rengi varsa onu kullan, yoksa category rengini kullan
  const cardColor = item.color || color

  // SVG circular progress
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div
      className={`progress-card ${item.description ? 'has-tooltip' : ''}`}
      style={{ '--card-color': cardColor } as React.CSSProperties}
      data-tooltip={item.description}
    >
      <div className="progress-card-ring">
        <svg viewBox="0 0 100 100">
          <circle
            className="progress-ring-bg"
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="6"
          />
          <circle
            className="progress-ring-fill"
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="progress-card-percent">{percentage.toFixed(0)}%</div>
      </div>
      <div className="progress-card-info">
        <span className="progress-card-label">{getLabel()}</span>
        <span className="progress-card-remaining">{data.remaining}</span>
      </div>
    </div>
  )
}

export function Progress() {
  const [city, setCity] = useState(() => {
    return localStorage.getItem('progress-city') || 'konya'
  })
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null)
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false)
  const [progressExpanded, setProgressExpanded] = useState(false)

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

      {/* İlerleme - Genişletilebilir */}
      <div className="progress-expandable">
        <button
          className="progress-expandable-header"
          onClick={() => setProgressExpanded(!progressExpanded)}
        >
          <span>ilerleme</span>
          <span className="progress-expand-icon">{progressExpanded ? '−' : '+'}</span>
        </button>

        {progressExpanded && (
          <div className="progress-expandable-content">
            <div className="delorean-wrapper">
              <DeloreanIllustration />
              <div className="delorean-panel">
                <div className="delorean-header">
                  <span className="delorean-title">vakit</span>
                  <div className="delorean-indicator" />
                </div>
                <div className="delorean-slots">
                  {timeSlots.map(slot => (
                    <TimeSlotDisplay key={slot.id} slot={slot} />
                  ))}
                </div>
              </div>
            </div>

            <div className="progress-container">
              {/* Önemli günler */}
              <section
                className="progress-section"
                style={{ '--section-color': categoryConfig.islam.color } as React.CSSProperties}
              >
                <div className="progress-section-header">
                  <span className="progress-section-icon">{categoryConfig.islam.icon}</span>
                  <h2 className="progress-category">önemli günler</h2>
                </div>
                <div className="progress-cards progress-cards-5">
                  {islamicDates.map(item => (
                    <ProgressCard
                      key={item.id}
                      item={item}
                      prayerTimes={prayerTimes || undefined}
                      color={categoryConfig.islam.color}
                      timezone={cities[city]?.timezone ?? 3}
                    />
                  ))}
                </div>
              </section>

              {/* Kozmos ve Teknoloji - Yan yana */}
              <div className="progress-duo">
                {(['kozmos', 'teknoloji'] as const).map(category => {
                  const items = otherItems.filter(item => item.category === category)
                  const config = categoryConfig[category]
                  if (items.length === 0) return null
                  return (
                    <section
                      key={category}
                      className="progress-section progress-section-half"
                      style={{ '--section-color': config.color } as React.CSSProperties}
                    >
                      <div className="progress-section-header">
                        <span className="progress-section-icon">{config.icon}</span>
                        <h2 className="progress-category">{config.label}</h2>
                      </div>
                      <div className="progress-cards progress-cards-vertical">
                        {items.map(item => (
                          <ProgressCard
                            key={item.id}
                            item={item}
                            prayerTimes={prayerTimes || undefined}
                            color={config.color}
                            timezone={cities[city]?.timezone ?? 3}
                          />
                        ))}
                      </div>
                    </section>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
