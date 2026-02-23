import { useState, useCallback, useEffect, useRef } from 'react'

// Number Ticker Component
function NumberTicker({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const startTime = performance.now()
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Easing function for smooth deceleration
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplayValue(Math.floor(eased * value))
            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              setDisplayValue(value)
            }
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, duration, hasAnimated])

  return (
    <span ref={ref} className="number-ticker">
      ${displayValue.toLocaleString('en-US')}
    </span>
  )
}

interface FailedStartup {
  name: string
  idea: string
  raised: string
  year: number
  reason: string
  doThis: string
  dontDoThis: string
  category: 'market' | 'product' | 'money' | 'team' | 'timing'
  graveyard?: 'amazon' | 'google' | 'microsoft' | 'meta'
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
    graveyard: 'google',
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
    graveyard: 'microsoft',
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
  // Failory Cemetery'den eklenenler
  {
    name: "Toys R Us",
    idea: "Oyuncak ve bebek ürünleri perakende zinciri",
    raised: "$5B",
    year: 2018,
    reason: "Amazon rekabeti, ağır borç yükü, dijital dönüşüm yapılamadı",
    doThis: "E-ticarete erken adapte ol, borç yönetimini iyi yap",
    dontDoThis: "Perakende deviyken dijital dönüşümü ihmal etme",
    category: 'market'
  },
  {
    name: "Houseparty",
    idea: "Arkadaşlarla görüntülü sohbet uygulaması",
    raised: "$52M",
    year: 2021,
    reason: "Zoom ve diğer platformlar pazarı ele geçirdi, odak kaybedildi",
    doThis: "Tek bir şeyi çok iyi yap, pazarda net konumlan",
    dontDoThis: "Pandemi gibi geçici trendlere bağımlı kalma",
    category: 'market'
  },
  {
    name: "Xinja",
    idea: "Avustralya'nın ilk dijital bankası",
    raised: "$100M",
    year: 2020,
    reason: "Bankacılık lisansı maliyetleri, gelir modeli oluşturulamadı",
    doThis: "Düzenlenen sektörlerde sermaye gereksinimlerini iyi hesapla",
    dontDoThis: "Bankacılık gibi ağır düzenlenen sektörlere yetersiz sermayeyle girme",
    category: 'money'
  },
  {
    name: "Quirky",
    idea: "Topluluk destekli icat platformu",
    raised: "$185M",
    year: 2015,
    reason: "Çok fazla ürün, düşük kalite, envanter sorunları",
    doThis: "Az ama öz ürünle başla, kaliteyi koru",
    dontDoThis: "Aynı anda yüzlerce ürün geliştirmeye çalışma",
    category: 'product'
  },
  {
    name: "Atrium",
    idea: "Startup'lar için modern hukuk firması",
    raised: "$75M",
    year: 2020,
    reason: "Hukuk sektörünü teknoloji ile dönüştürmek beklenenden zor çıktı",
    doThis: "Geleneksel sektörlerde küçük adımlarla ilerle",
    dontDoThis: "Yüzyıllık iş modellerini bir gecede değiştirmeye çalışma",
    category: 'product'
  },
  {
    name: "Glitch",
    idea: "Sosyal tarayıcı tabanlı MMO oyun",
    raised: "$17M",
    year: 2012,
    reason: "Oyun çok niş kaldı, geniş kitleye ulaşamadı",
    doThis: "Hedef kitlenin büyüklüğünü doğrula, pivot için hazır ol",
    dontDoThis: "Niş ürüne kitle pazarı yatırımı yapma",
    category: 'market'
  },
  {
    name: "Tink Labs",
    idea: "Oteller için ücretsiz akıllı telefon hizmeti",
    raised: "$125M",
    year: 2019,
    reason: "Oteller maliyetleri üstlenmek istemedi, iş modeli sürdürülemezdi",
    doThis: "B2B'de müşterinin gerçekten ödeme yapacağını doğrula",
    dontDoThis: "Maliyeti başkasına yıkmaya dayanan model kurma",
    category: 'money'
  },
  {
    name: "Daqri",
    idea: "Endüstriyel artırılmış gerçeklik gözlükleri",
    raised: "$275M",
    year: 2019,
    reason: "AR teknolojisi henüz hazır değildi, pazar çok erken",
    doThis: "Teknoloji olgunluğunu değerlendir, zamanlamayı iyi ayarla",
    dontDoThis: "Pazarın hazır olmadığı teknolojiye büyük yatırım yapma",
    category: 'timing'
  },
  {
    name: "HubHaus",
    idea: "Ortak yaşam alanları platformu",
    raised: "$17M",
    year: 2020,
    reason: "Pandemi ortak yaşam konseptini öldürdü",
    doThis: "Dış risklere karşı plan B hazırla",
    dontDoThis: "Tek bir trende tüm işi bağlama",
    category: 'timing'
  },
  {
    name: "ScaleFactor",
    idea: "KOBİ'ler için yapay zeka destekli muhasebe",
    raised: "$100M",
    year: 2020,
    reason: "AI vaat edildi ama aslında manuel iş yapılıyordu",
    doThis: "Ürünün gerçekten söylediğin şeyi yaptığından emin ol",
    dontDoThis: "AI buzz'ını kullanıp aslında insan gücüyle çalışma",
    category: 'product'
  },
  {
    name: "Yik Yak",
    idea: "Anonim lokasyon bazlı sosyal ağ",
    raised: "$73M",
    year: 2017,
    reason: "Siber zorbalık sorunları, üniversitelerden yasaklar",
    doThis: "Anonimlik özelliğini güvenli moderasyonla dengele",
    dontDoThis: "Zararlı içeriği kontrol edemeyeceğin platform kurma",
    category: 'product'
  },
  {
    name: "PepperTap",
    idea: "Hızlı market teslimatı",
    raised: "$51M",
    year: 2016,
    reason: "Düşük marjlar, yoğun rekabet, lojistik maliyetleri",
    doThis: "Grocery delivery'de unit economics'i en baştan çöz",
    dontDoThis: "Negatif marjla büyümeye çalışma",
    category: 'money'
  },
  {
    name: "Musical.ly",
    idea: "Kısa video ve müzik paylaşım uygulaması",
    raised: "$150M",
    year: 2018,
    reason: "TikTok tarafından satın alındı, marka sonlandırıldı",
    doThis: "Satın alma stratejini baştan planla",
    dontDoThis: "Daha büyük rakip karşısında bağımsız kalma stratejini geç planlama",
    category: 'market'
  },
  {
    name: "Justin.tv",
    idea: "Canlı video yayın platformu",
    raised: "$35M",
    year: 2014,
    reason: "Gaming kısmı (Twitch) başarılı oldu, ana platform kapatıldı",
    doThis: "Hangi segmentin gerçekten çalıştığını bul, ona odaklan",
    dontDoThis: "Başarılı segmenti görmezden gelip her şeyi yapmaya çalışma",
    category: 'product'
  },
  {
    name: "Zirtual",
    idea: "Profesyoneller için sanal asistan hizmeti",
    raised: "$5.5M",
    year: 2015,
    reason: "Nakit akışı yönetimi felaketi, bir gecede kapandı",
    doThis: "Nakit akışını günlük takip et, 6 aylık pist tut",
    dontDoThis: "Maaş ödeyemeyecek duruma düşene kadar bekleme",
    category: 'money'
  },
  {
    name: "Rafter",
    idea: "Üniversiteler için ders kitabı platformu",
    raised: "$90M",
    year: 2016,
    reason: "Amazon ve Chegg rekabeti, fiyat savaşında kaybetti",
    doThis: "Fiyat dışında rekabet avantajı oluştur",
    dontDoThis: "Amazon ile fiyat rekabetine girme",
    category: 'market'
  },
  {
    name: "Netscape",
    idea: "Web tarayıcısı ve internet yazılımları",
    raised: "$200M",
    year: 2008,
    reason: "Microsoft IE ile tarayıcı savaşını kaybetti",
    doThis: "Dev rakiple savaşırken dağıtım avantajını hesaba kat",
    dontDoThis: "İşletim sistemi sahibiyle bundled ürün savaşına girme",
    category: 'market'
  },
  {
    name: "Yogome",
    idea: "Çocuklar için eğitici mobil oyunlar",
    raised: "$12M",
    year: 2018,
    reason: "Kötü yönetim, odak kaybı, çok fazla oyun",
    doThis: "Yönetim ekibini güçlü tut, stratejik odağı koru",
    dontDoThis: "Her fırsatın peşinden koşup ana işi ihmal etme",
    category: 'team'
  },
  {
    name: "Desti",
    idea: "Yapay zeka destekli seyahat rehberi",
    raised: "$4M",
    year: 2014,
    reason: "Monetizasyon bulunamadı, Nokia tarafından ucuza satın alındı",
    doThis: "Gelir modelini en baştan planla",
    dontDoThis: "Harika ürün yap ama nasıl para kazanacağını düşünme",
    category: 'money'
  },
  {
    name: "HiGear",
    idea: "Lüks araç paylaşım kulübü",
    raised: "$3M",
    year: 2011,
    reason: "Sigorta ve yasal sorunlar çözülemedi",
    doThis: "Düzenlenen sektörlerde yasal uyumu önce çöz",
    dontDoThis: "Yasal sorunları büyüdükten sonra çözmeye çalışma",
    category: 'timing'
  },
  {
    name: "RoomsTonite",
    idea: "Son dakika otel rezervasyonu",
    raised: "$6M",
    year: 2017,
    reason: "OTA'lar (Booking, Expedia) pazarı domine ediyordu, fon bulunamadı",
    doThis: "Güçlü rakipler karşısında niş bul veya farklılaş",
    dontDoThis: "Dev OTA'larla aynı pazarda direkt rekabete girme",
    category: 'market'
  },
  {
    name: "Sharingear",
    idea: "Müzisyenler için enstrüman kiralama pazaryeri",
    raised: "$500K",
    year: 2015,
    reason: "Pazar çok küçüktü, iki taraflı pazaryeri oluşturulamadı",
    doThis: "TAM (Total Addressable Market) hesabını gerçekçi yap",
    dontDoThis: "Hobi projesi büyüklüğündeki pazara startup kur",
    category: 'market'
  },
  {
    name: "HotelsAroundYou",
    idea: "Aynı gün otel rezervasyonu",
    raised: "$500K",
    year: 2017,
    reason: "OYO ve büyük OTA'lar pazarı ele geçirdi",
    doThis: "Büyük oyuncuların girmeyeceği niş bul",
    dontDoThis: "Büyük rakiplerin kolayca kopyalayabileceği iş modeli kur",
    category: 'market'
  },
  {
    name: "Beepi",
    idea: "Peer-to-peer araba satış platformu",
    raised: "$150M",
    year: 2017,
    reason: "Operasyonel maliyetler çok yüksek, her arabayı kontrol etmek pahalıydı",
    doThis: "Operasyonel maliyetleri en baştan optimize et",
    dontDoThis: "Ölçeklenmeyen operasyonlarla büyümeye çalışma",
    category: 'money'
  },
  {
    name: "Shyp",
    idea: "On-demand kargo gönderim hizmeti",
    raised: "$62M",
    year: 2018,
    reason: "Unit economics negatifti, her gönderimde para kaybediliyordu",
    doThis: "Her işlemde para kazanacak model kur",
    dontDoThis: "Hacim ile karlılık geleceğini varsayma",
    category: 'money'
  },
  {
    name: "Sprig",
    idea: "Sağlıklı yemek teslimat servisi",
    raised: "$57M",
    year: 2017,
    reason: "Mutfak ve teslimat maliyetleri çok yüksek, UberEats rekabeti",
    doThis: "Dikey entegrasyon maliyetlerini iyi hesapla",
    dontDoThis: "Hem üretim hem teslimat yaparak maliyetleri katla",
    category: 'money'
  },
  {
    name: "Munchery",
    idea: "Şef yapımı yemek teslimat servisi",
    raised: "$125M",
    year: 2019,
    reason: "Operasyonel karmaşıklık, yemek israfı, yetersiz talep",
    doThis: "Bozulabilir ürünlerde demand forecasting'i mükemmelleştir",
    dontDoThis: "Yüksek israflı iş modeliyle ölçeklenme",
    category: 'product'
  },
  {
    name: "Maple",
    idea: "Premium yemek teslimat servisi",
    raised: "$29M",
    year: 2017,
    reason: "David Chang bile kurtaramadı, birim ekonomisi çalışmadı",
    doThis: "Ünlü isimler yeterli değil, iş modeli sağlam olmalı",
    dontDoThis: "Sadece marka gücüne güvenme",
    category: 'money'
  },
  {
    name: "Exec",
    idea: "On-demand ev temizlik hizmeti",
    raised: "$3.3M",
    year: 2014,
    reason: "Düşük marjlar, temizlikçileri elde tutma zorluğu",
    doThis: "Gig economy'de çalışan bağlılığını çöz",
    dontDoThis: "Arz tarafını sadece para ile tutmaya çalışma",
    category: 'team'
  },
  {
    name: "Washio",
    idea: "On-demand çamaşır yıkama servisi",
    raised: "$17M",
    year: 2016,
    reason: "Müşteri edinme maliyeti çok yüksek, tekrar kullanım düşük",
    doThis: "CAC ve LTV oranını sürekli takip et",
    dontDoThis: "Bir kez kullanan müşteriye pahalıya mal olma",
    category: 'money'
  },
  {
    name: "Cherry",
    idea: "On-demand araba yıkama servisi",
    raised: "$9M",
    year: 2013,
    reason: "Marjlar çok düşük, araba yıkama için insanlar extra ödemiyor",
    doThis: "Premium fiyat ödeyecek müşteri segmenti bul",
    dontDoThis: "Commodity hizmete on-demand premium eklemeye çalışma",
    category: 'product'
  },
  {
    name: "Luxe",
    idea: "On-demand vale park hizmeti",
    raised: "$75M",
    year: 2017,
    reason: "Şehir regülasyonları, yüksek işçilik maliyetleri",
    doThis: "Şehir bazlı regülasyonları en baştan araştır",
    dontDoThis: "Her şehirde aynı modelin çalışacağını varsayma",
    category: 'timing'
  },
  {
    name: "Zirx",
    idea: "On-demand vale park hizmeti",
    raised: "$36M",
    year: 2017,
    reason: "Luxe ile aynı sorunlar, pazar B2B'ye pivot etti ama yetmedi",
    doThis: "Pivot yaparken ana sorunu çözüp çözmediğini değerlendir",
    dontDoThis: "Çalışmayan modeli pivot ile kurtarmaya çalışma",
    category: 'product'
  },
  {
    name: "Priv",
    idea: "On-demand güzellik hizmetleri",
    raised: "$7M",
    year: 2016,
    reason: "Güzellik uzmanlarını platformda tutmak zor, bypass sorunu",
    doThis: "Platform bağımlılığı yaratacak özellikler ekle",
    dontDoThis: "Kolayca bypass edilebilir platform kur",
    category: 'team'
  },
  {
    name: "ContextLogic",
    idea: "Wish.com - Ucuz Çin ürünleri e-ticaret",
    raised: "$2B",
    year: 2023,
    reason: "Kalite sorunları, uzun teslimat süreleri, Temu rekabeti",
    doThis: "Kalite kontrolünü asla ihmal etme",
    dontDoThis: "En ucuz olmak için kaliteden ödün verme",
    category: 'product'
  },
  {
    name: "FTX",
    idea: "Kripto para borsası",
    raised: "$2B",
    year: 2022,
    reason: "Müşteri fonlarını zimmetine geçirme, dolandırıcılık",
    doThis: "Finansal kontrolleri ve denetimleri en baştan kur",
    dontDoThis: "Müşteri fonlarını riskli yatırımlarda kullanma",
    category: 'team'
  },
  {
    name: "Fast",
    idea: "Tek tıkla ödeme checkout sistemi",
    raised: "$125M",
    year: 2022,
    reason: "Çok az satıcı kullanıyordu, gelir neredeyse sıfırdı",
    doThis: "Traction olmadan büyük yatırım almaktan kaçın",
    dontDoThis: "Gelir olmadan 10M$/ay harcama",
    category: 'money'
  },
  {
    name: "IRL",
    idea: "Sosyal etkinlik planlama uygulaması",
    raised: "$200M",
    year: 2023,
    reason: "Kullanıcı sayıları sahte çıktı, 95% bot trafiği",
    doThis: "Metriklerin gerçek olduğunu doğrula ve denetle",
    dontDoThis: "Yatırımcılara sahte metrikler sunma",
    category: 'team'
  },
  {
    name: "Veev",
    idea: "Prefabrik ev üretimi",
    raised: "$600M",
    year: 2024,
    reason: "İnşaat maliyetleri beklenenden çok yüksek, talep yetersiz",
    doThis: "Construction tech'te pilot projeyle maliyetleri doğrula",
    dontDoThis: "İnşaat sektöründe maliyet varsayımlarına güvenme",
    category: 'money'
  },
  {
    name: "Convoy",
    idea: "Dijital kamyon taşımacılığı platformu",
    raised: "$1.1B",
    year: 2023,
    reason: "Navlun fiyatları düştü, komisyon marjları çok ince",
    doThis: "Döngüsel sektörlerde kötü senaryoyu planla",
    dontDoThis: "Boom döneminde alınan yatırımla bust dönemine hazırlıksız girme",
    category: 'timing'
  },
  {
    name: "Olive AI",
    idea: "Sağlık sektörü için otomasyon AI",
    raised: "$900M",
    year: 2023,
    reason: "Ürün vaatleri karşılanamadı, müşteriler kaybedildi",
    doThis: "Satış öncesi vaat ettiğini gerçekten teslim et",
    dontDoThis: "Ürün yetkinliğini aşan satış yapma",
    category: 'product'
  },
  {
    name: "Hopin",
    idea: "Sanal etkinlik platformu",
    raised: "$1B",
    year: 2023,
    reason: "Pandemi bitti, fiziksel etkinlikler geri döndü, $8M'a satıldı",
    doThis: "Geçici trendlerin kalıcılığını sorgula",
    dontDoThis: "Pandemi spike'ını kalıcı büyüme olarak planla",
    category: 'timing'
  },
  {
    name: "Plastiq",
    idea: "Kredi kartıyla her yere ödeme yapma",
    raised: "$200M",
    year: 2023,
    reason: "Faiz oranları yükseldi, iş modeli sürdürülemez hale geldi",
    doThis: "Makro ekonomik riskleri değerlendir",
    dontDoThis: "Düşük faiz ortamına bağımlı iş modeli kur",
    category: 'timing'
  },
  {
    name: "Bird",
    idea: "Elektrikli scooter paylaşımı",
    raised: "$900M",
    year: 2023,
    reason: "Scooter ömrü çok kısa, vandalizm, regülasyonlar",
    doThis: "Hardware maliyetlerini ve ömrünü gerçekçi hesapla",
    dontDoThis: "Şehirlerin regülasyonlarını hafife alma",
    category: 'money'
  },
  // Amazon Mezarlığı
  {
    name: "Amazon Fire Phone",
    idea: "3D özellikli akıllı telefon",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2015,
    reason: "Gereksiz 3D özelliği, yüksek fiyat, az uygulama, iPhone/Android hakimiyeti",
    doThis: "Kullanıcının gerçekten istediği özellikleri araştır",
    dontDoThis: "Gimmick özellikleri ürünün merkezi yapma",
    category: 'product'
  },
  {
    name: "Amazon Destinations",
    idea: "Yerel otel ve butik konaklama rezervasyonu",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2015,
    reason: "Booking ve Expedia çok güçlüydü, farklılaşma yoktu",
    doThis: "Yerleşik pazarlara girerken net fark yarat",
    dontDoThis: "Dev rakiplerin olduğu pazara me-too ürünle girme",
    category: 'market'
  },
  {
    name: "Amazon Spark",
    idea: "Instagram benzeri alışveriş sosyal ağı",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2019,
    reason: "Kullanıcılar Amazon'da sosyalleşmek istemedi",
    doThis: "Kullanıcı davranışını anla, her yerde sosyal olmaz",
    dontDoThis: "E-ticaret sitesini sosyal ağa çevirmeye çalışma",
    category: 'product'
  },
  {
    name: "Amazon Restaurants",
    idea: "Prime üyeleri için restoran teslimatı",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2019,
    reason: "DoorDash, UberEats, Grubhub çok ilerideydi",
    doThis: "Geç girilen pazarlarda agresif farklılaş",
    dontDoThis: "Pazara geç girip aynı şeyi yapmaya çalışma",
    category: 'market'
  },
  {
    name: "Haven Healthcare",
    idea: "Amazon-Berkshire-JPMorgan sağlık girişimi",
    raised: "$100M+",
    year: 2021,
    reason: "Üç dev şirket bile sağlık sistemini değiştiremedi",
    doThis: "Sağlık sektörünün karmaşıklığını hafife alma",
    dontDoThis: "Para ve marka gücünün her sorunu çözeceğini sanma",
    category: 'market'
  },
  {
    name: "Amazon Dash Button",
    idea: "Tek tuşla ürün sipariş etme cihazı",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2019,
    reason: "Alexa ve mobil uygulama aynı işi yapıyordu, plastik israfı",
    doThis: "Kendi ürünlerinin kanibalizasyonunu planla",
    dontDoThis: "Kendi diğer ürünlerin çözdüğü soruna fiziksel cihaz yap",
    category: 'product'
  },
  {
    name: "Amazon Local",
    idea: "Groupon benzeri yerel fırsatlar",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2015,
    reason: "Groupon bile zorlanırken Amazon fark yaratamadı",
    doThis: "Batan bir pazara daha geç girme",
    dontDoThis: "Başarısız iş modelini kopyalama",
    category: 'market'
  },
  {
    name: "Amazon Tickets",
    idea: "Etkinlik bileti satış platformu",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2018,
    reason: "Ticketmaster anlaşmaları çok güçlüydü, envanter bulunamadı",
    doThis: "B2B anlaşmaların önemini hesaba kat",
    dontDoThis: "Eksklüzif anlaşmalarla korunan pazara hazırlıksız girme",
    category: 'market'
  },
  {
    name: "Amazon WebPay",
    idea: "P2P ödeme servisi (PayPal rakibi)",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2014,
    reason: "PayPal ve Venmo çok ilerideydi, güven oluşturulamadı",
    doThis: "Fintech'te güven inşa etmek zaman alır",
    dontDoThis: "Ödeme alışkanlıklarını hızla değiştirmeyi bekleme",
    category: 'market'
  },
  {
    name: "Amazon Askville",
    idea: "Yahoo Answers benzeri soru-cevap sitesi",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2013,
    reason: "Yahoo Answers ve Quora zaten vardı, topluluk oluşmadı",
    doThis: "Topluluk ürünlerinde ilk hareket avantajı kritik",
    dontDoThis: "Yerleşik topluluklara geç rakip çıkma",
    category: 'market'
  },
  {
    name: "Amazon Wallet",
    idea: "Hediye kartı ve sadakat kartı cüzdanı",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2015,
    reason: "Apple Wallet ve Google Wallet zaten yaygındı",
    doThis: "Mobil cüzdan pazarında ekosistem avantajı şart",
    dontDoThis: "İşletim sistemi avantajı olmadan cüzdan uygulaması çıkarma",
    category: 'timing'
  },
  {
    name: "Amazon Register",
    idea: "Square benzeri kart okuyucu POS cihazı",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2015,
    reason: "Square çok ilerideydi, satıcılar geçmedi",
    doThis: "POS pazarında ilk değilsen çok farklı ol",
    dontDoThis: "Square'in aynısını yapıp farklı sonuç bekleme",
    category: 'market'
  },
  {
    name: "LoveFilm",
    idea: "DVD kiralama ve video streaming servisi",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2017,
    reason: "DVD öldü, Prime Video markası altında birleştirildi",
    doThis: "Eski teknolojiyi zamanında terk et",
    dontDoThis: "Ölen formatı çok uzun süre destekleme",
    category: 'timing'
  },
  {
    name: "Endless.com",
    idea: "Ayakkabı ve çanta e-ticaret sitesi",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2012,
    reason: "Zappos satın alındı, iki marka gereksizdi",
    doThis: "Satın almalardan sonra marka stratejisini netleştir",
    dontDoThis: "Aynı kategoride birden fazla marka yarıştırma",
    category: 'product'
  },
  {
    name: "Quidsi (Diapers.com)",
    idea: "Bebek ürünleri e-ticaret sitesi",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2017,
    reason: "Amazon.com ile kanibalizasyon, ayrı site gereksiz kaldı",
    doThis: "Satın alınan şirketin ana platformla ilişkisini planla",
    dontDoThis: "Kendi platformunla rekabet eden şirketi ayrı tutma",
    category: 'product'
  },
  {
    name: "Amazon Storywriter",
    idea: "Senaryo yazma bulut uygulaması",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2019,
    reason: "Final Draft ve diğer profesyonel araçlar çok yerleşikti",
    doThis: "Profesyonel araçlarda switching cost'u hesapla",
    dontDoThis: "Yerleşik workflow'ları olan profesyonellere basit araç sunma",
    category: 'product'
  },
  {
    name: "Amazon Inspire",
    idea: "Öğretmenler için eğitim içeriği paylaşım platformu",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2019,
    reason: "Teachers Pay Teachers ve diğerleri pazarı domine ediyordu",
    doThis: "Eğitim teknolojisinde öğretmen topluluğu kritik",
    dontDoThis: "Topluluk olmadan içerik platformu kurma",
    category: 'market'
  },
  // Google Mezarlığı
  {
    name: "Google Glass",
    idea: "Artırılmış gerçeklik gözlüğü",
    raised: "Google",
    graveyard: 'google',
    year: 2015,
    reason: "Gizlilik endişeleri, sosyal kabul görmedi, çok pahalı",
    doThis: "Tüketici ürünlerinde sosyal kabulü test et",
    dontDoThis: "Toplumun hazır olmadığı teknolojiyi zorla pazara sürme",
    category: 'timing'
  },
  {
    name: "Google Stadia",
    idea: "Bulut tabanlı oyun streaming servisi",
    raised: "Google",
    graveyard: 'google',
    year: 2023,
    reason: "Oyun kütüphanesi yetersiz, gecikme sorunları, oyuncu güveni yok",
    doThis: "Gaming'de içerik kraldır, önce oyunları garantile",
    dontDoThis: "Oyunsuz oyun platformu çıkarma",
    category: 'product'
  },
  {
    name: "Google Hangouts",
    idea: "Mesajlaşma ve video konferans uygulaması",
    raised: "Google",
    graveyard: 'google',
    year: 2022,
    reason: "Google Meet, Chat, Duo kafa karışıklığı, strateji belirsizliği",
    doThis: "Tek bir üründe ustalaş, sonra genişle",
    dontDoThis: "Aynı işi yapan beş farklı ürün çıkarma",
    category: 'product'
  },
  {
    name: "Google Inbox",
    idea: "Yenilikçi e-posta istemcisi",
    raised: "Google",
    graveyard: 'google',
    year: 2019,
    reason: "Gmail ile kanibalizasyon, kullanıcılar geçmedi",
    doThis: "Ana ürünü geliştir, paralel ürün çıkarma",
    dontDoThis: "Kendi ürününle rekabet et",
    category: 'product'
  },
  {
    name: "Google Allo",
    idea: "Yapay zeka destekli mesajlaşma uygulaması",
    raised: "Google",
    graveyard: 'google',
    year: 2019,
    reason: "WhatsApp ve iMessage çok güçlüydü, SMS entegrasyonu yoktu",
    doThis: "Mesajlaşmada network effect kritik",
    dontDoThis: "Arkadaşların olmadığı mesajlaşma uygulaması çıkarma",
    category: 'market'
  },
  {
    name: "Google Reader",
    idea: "RSS besleme okuyucusu",
    raised: "Google",
    graveyard: 'google',
    year: 2013,
    reason: "Sosyal medya RSS'i öldürdü, kullanıcı sayısı düştü",
    doThis: "Kullanıcı davranış değişimlerini izle",
    dontDoThis: "Değişen tüketim alışkanlıklarını görmezden gelme",
    category: 'timing'
  },
  {
    name: "Google Wave",
    idea: "Gerçek zamanlı işbirliği ve iletişim platformu",
    raised: "Google",
    graveyard: 'google',
    year: 2010,
    reason: "Çok karmaşık, kimse ne olduğunu anlamadı",
    doThis: "Ürünü basit ve anlaşılır tut",
    dontDoThis: "Açıklaması 10 dakika süren ürün çıkarma",
    category: 'product'
  },
  {
    name: "Google Buzz",
    idea: "Gmail entegreli sosyal ağ",
    raised: "Google",
    graveyard: 'google',
    year: 2011,
    reason: "Gizlilik skandalı, kişiler otomatik public oldu",
    doThis: "Gizlilik ayarlarını varsayılan güvenli yap",
    dontDoThis: "Kullanıcı izni olmadan sosyal özellik aç",
    category: 'product'
  },
  // Meta/Facebook Mezarlığı
  {
    name: "Facebook Home",
    idea: "Android için Facebook launcher",
    raised: "Meta",
    graveyard: 'meta',
    year: 2013,
    reason: "Telefonun tamamını Facebook yapma kimse istemedi",
    doThis: "Kullanıcı cihazına saygı göster",
    dontDoThis: "Tüm deneyimi ele geçirmeye çalışma",
    category: 'product'
  },
  {
    name: "Facebook Slingshot",
    idea: "Snapchat rakibi fotoğraf paylaşım uygulaması",
    raised: "Meta",
    graveyard: 'meta',
    year: 2015,
    reason: "Snapchat'i kopyalamak yetmedi, geç kalındı",
    doThis: "Kopyalamak yerine satın al veya farklılaş",
    dontDoThis: "Rakibi birebir kopyalayıp başarılı olmayı bekleme",
    category: 'market'
  },
  {
    name: "Facebook Paper",
    idea: "Haber okuma uygulaması",
    raised: "Meta",
    graveyard: 'meta',
    year: 2016,
    reason: "Ana Facebook uygulaması aynı işi yapıyordu",
    doThis: "Ayrı uygulama yerine ana ürüne özellik ekle",
    dontDoThis: "Her özellik için ayrı uygulama çıkarma",
    category: 'product'
  },
  {
    name: "Facebook Poke",
    idea: "Snapchat rakibi kaybolan mesajlaşma",
    raised: "Meta",
    graveyard: 'meta',
    year: 2014,
    reason: "Snapchat çok hızlı büyüdü, geç kalındı",
    doThis: "Hızlı hareket et veya satın al",
    dontDoThis: "Rakip çok büyüdükten sonra kopyalamaya çalışma",
    category: 'timing'
  },
  {
    name: "Facebook Gifts",
    idea: "Arkadaşlara hediye gönderme servisi",
    raised: "Meta",
    graveyard: 'meta',
    year: 2014,
    reason: "E-ticaret lojistiği Facebook'un uzmanlık alanı değildi",
    doThis: "Core competency dışına dikkatli çık",
    dontDoThis: "Uzmanlığın olmayan alana dalma",
    category: 'product'
  },
  {
    name: "Libra/Diem",
    idea: "Facebook'un kripto para projesi",
    raised: "$200M+",
    year: 2022,
    reason: "Düzenleyiciler izin vermedi, güven sorunu",
    doThis: "Fintech'te düzenleyicilerle erken çalış",
    dontDoThis: "Düzenleyicileri bypass etmeye çalışma",
    category: 'timing'
  },
  // Microsoft Mezarlığı
  {
    name: "Windows Phone",
    idea: "Microsoft'un mobil işletim sistemi",
    raised: "Microsoft",
    graveyard: 'microsoft',
    year: 2017,
    reason: "Uygulama ekosistemi oluşturulamadı, geç kalındı",
    doThis: "Platform savaşlarında erken ol veya girme",
    dontDoThis: "App gap'i kapatamayacaksan mobil OS çıkarma",
    category: 'timing'
  },
  {
    name: "Microsoft Band",
    idea: "Fitness takip bilekliği",
    raised: "Microsoft",
    graveyard: 'microsoft',
    year: 2016,
    reason: "Apple Watch ve Fitbit çok güçlüydü",
    doThis: "Wearable'da ekosistem avantajı kritik",
    dontDoThis: "Ekosistem olmadan wearable çıkarma",
    category: 'market'
  },
  {
    name: "Microsoft Groove Music",
    idea: "Müzik streaming servisi",
    raised: "Microsoft",
    graveyard: 'microsoft',
    year: 2017,
    reason: "Spotify çok ilerideydi, telif maliyetleri yüksek",
    doThis: "Content licensing çok pahalıysa partnerlık yap",
    dontDoThis: "Spotify ile direkt rekabete girme",
    category: 'market'
  },
  {
    name: "Microsoft Cortana",
    idea: "Yapay zeka sesli asistan",
    raised: "Microsoft",
    graveyard: 'microsoft',
    year: 2023,
    reason: "Alexa ve Google Assistant çok ilerideydi, tüketici kullanmadı",
    doThis: "Sesli asistanda erken ol veya B2B'ye odaklan",
    dontDoThis: "Tüketici sesli asistan pazarına geç girme",
    category: 'market'
  },
  {
    name: "Zune",
    idea: "Microsoft'un iPod rakibi müzik çalar",
    raised: "Microsoft",
    graveyard: 'microsoft',
    year: 2012,
    reason: "iPod çok güçlüydü, iTunes ekosistemi rakipsizdi",
    doThis: "Ekosisteme karşı tek ürünle savaşma",
    dontDoThis: "Apple ekosistemine tek cihazla meydan okuma",
    category: 'market'
  },
  {
    name: "Internet Explorer",
    idea: "Web tarayıcısı",
    raised: "Microsoft",
    graveyard: 'microsoft',
    year: 2022,
    reason: "Chrome ve Firefox çok ileride geçti, web standartları geride kaldı",
    doThis: "Web standartlarını takip et ve hızlı güncelle",
    dontDoThis: "Pazar lideriyken inovasyonu durdurma",
    category: 'product'
  },
]

type SortBy = 'random' | 'year' | 'raised'
type CategoryFilter = 'all' | 'market' | 'product' | 'money' | 'team' | 'timing'
type GraveyardFilter = 'all' | 'startups' | 'amazon' | 'google' | 'microsoft' | 'meta'

function parseRaised(raised: string): number {
  if (raised === 'Google' || raised === 'Microsoft' || raised === 'Amazon' || raised === 'Meta') return 10000
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
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [graveyardFilter, setGraveyardFilter] = useState<GraveyardFilter>('all')
  const [filteredStartups, setFilteredStartups] = useState(failedStartups)
  const [isAutoPlay, setIsAutoPlay] = useState(false)

  const filterAndSort = useCallback((sort: SortBy, category: CategoryFilter, graveyard: GraveyardFilter) => {
    let result = [...failedStartups]

    // Filter by graveyard
    if (graveyard === 'startups') {
      result = result.filter(s => !s.graveyard)
    } else if (graveyard !== 'all') {
      result = result.filter(s => s.graveyard === graveyard)
    }

    // Filter by category
    if (category !== 'all') {
      result = result.filter(s => s.category === category)
    }

    // Sort
    if (sort === 'year') {
      result.sort((a, b) => b.year - a.year)
    } else if (sort === 'raised') {
      result.sort((a, b) => parseRaised(b.raised) - parseRaised(a.raised))
    } else {
      result = result.sort(() => Math.random() - 0.5)
    }

    setFilteredStartups(result)
    setCurrentIndex(0)
  }, [])

  useEffect(() => {
    filterAndSort(sortBy, categoryFilter, graveyardFilter)
  }, [sortBy, categoryFilter, graveyardFilter, filterAndSort])

  useEffect(() => {
    if (!isAutoPlay || filteredStartups.length === 0) return
    const interval = setInterval(() => {
      setCurrentIndex(i => (i + 1) % filteredStartups.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [isAutoPlay, filteredStartups.length])

  const next = () => {
    if (filteredStartups.length === 0) return
    setCurrentIndex(i => (i + 1) % filteredStartups.length)
  }
  const prev = () => {
    if (filteredStartups.length === 0) return
    setCurrentIndex(i => (i - 1 + filteredStartups.length) % filteredStartups.length)
  }

  const startup = filteredStartups[currentIndex]

  const totalRaised = failedStartups.reduce((acc, s) => acc + parseRaised(s.raised), 0)

  // Category counts for filter badges
  const categoryCounts = {
    all: failedStartups.length,
    market: failedStartups.filter(s => s.category === 'market').length,
    product: failedStartups.filter(s => s.category === 'product').length,
    money: failedStartups.filter(s => s.category === 'money').length,
    team: failedStartups.filter(s => s.category === 'team').length,
    timing: failedStartups.filter(s => s.category === 'timing').length,
  }

  // Graveyard counts
  const graveyardCounts = {
    all: failedStartups.length,
    startups: failedStartups.filter(s => !s.graveyard).length,
    amazon: failedStartups.filter(s => s.graveyard === 'amazon').length,
    google: failedStartups.filter(s => s.graveyard === 'google').length,
    microsoft: failedStartups.filter(s => s.graveyard === 'microsoft').length,
    meta: failedStartups.filter(s => s.graveyard === 'meta').length,
  }

  // Total in actual dollars for ticker
  const totalDollars = totalRaised * 1000000

  return (
    <div className="failure-page">
      <h1>Başarısızlık Dersleri</h1>
      <p className="lead">
        <span className="highlight">Milyonlarca dolar</span> yatırım aldılar, yine de{' '}
        <span className="highlight">battılar</span>. Her başarısızlık bir{' '}
        <span className="highlight">ders</span>.
      </p>

      <div className="failure-stats-hero">
        <NumberTicker value={totalDollars} duration={2500} />
        <span className="failure-stats-hero-label">Toplam Kaybedilen Yatırım</span>
      </div>

      <div className="failure-stats">
        <div className="failure-stat">
          <span className="failure-stat-value">{failedStartups.length}</span>
          <span className="failure-stat-label">Girişim</span>
        </div>
        <div className="failure-stat">
          <span className="failure-stat-value">1998-2024</span>
          <span className="failure-stat-label">Dönem</span>
        </div>
      </div>

      <div className="failure-graveyard-filter">
        <button
          className={`failure-graveyard-btn ${graveyardFilter === 'all' ? 'active' : ''}`}
          onClick={() => setGraveyardFilter('all')}
        >
          Tümü <span>{graveyardCounts.all}</span>
        </button>
        <button
          className={`failure-graveyard-btn ${graveyardFilter === 'startups' ? 'active' : ''}`}
          onClick={() => setGraveyardFilter('startups')}
        >
          Startup'lar <span>{graveyardCounts.startups}</span>
        </button>
        <button
          className={`failure-graveyard-btn ${graveyardFilter === 'amazon' ? 'active' : ''}`}
          onClick={() => setGraveyardFilter('amazon')}
        >
          Amazon <span>{graveyardCounts.amazon}</span>
        </button>
        <button
          className={`failure-graveyard-btn ${graveyardFilter === 'google' ? 'active' : ''}`}
          onClick={() => setGraveyardFilter('google')}
        >
          Google <span>{graveyardCounts.google}</span>
        </button>
        <button
          className={`failure-graveyard-btn ${graveyardFilter === 'microsoft' ? 'active' : ''}`}
          onClick={() => setGraveyardFilter('microsoft')}
        >
          Microsoft <span>{graveyardCounts.microsoft}</span>
        </button>
        <button
          className={`failure-graveyard-btn ${graveyardFilter === 'meta' ? 'active' : ''}`}
          onClick={() => setGraveyardFilter('meta')}
        >
          Meta <span>{graveyardCounts.meta}</span>
        </button>
      </div>

      <div className="failure-page-content">
        <div className="failure-controls">
          <div className="failure-sort">
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
            <button
              className={`failure-sort-category ${categoryFilter !== 'all' ? 'active' : ''}`}
              onClick={() => setCategoryFilter(categoryFilter === 'all' ? 'market' : 'all')}
            >
              Sebebe Göre {categoryFilter !== 'all' && '▼'}
            </button>
          </div>
          <button
            className={`failure-autoplay ${isAutoPlay ? 'active' : ''}`}
            onClick={() => setIsAutoPlay(!isAutoPlay)}
          >
            {isAutoPlay ? '⏸ Durdur' : '▶ Otomatik'}
          </button>
        </div>

        {categoryFilter !== 'all' && (
          <div className="failure-category-chips">
            <button
              className={`failure-chip ${categoryFilter === 'market' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('market')}
            >
              Pazar <span>{categoryCounts.market}</span>
            </button>
            <button
              className={`failure-chip ${categoryFilter === 'product' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('product')}
            >
              Ürün <span>{categoryCounts.product}</span>
            </button>
            <button
              className={`failure-chip ${categoryFilter === 'money' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('money')}
            >
              Finans <span>{categoryCounts.money}</span>
            </button>
            <button
              className={`failure-chip ${categoryFilter === 'team' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('team')}
            >
              Ekip <span>{categoryCounts.team}</span>
            </button>
            <button
              className={`failure-chip ${categoryFilter === 'timing' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('timing')}
            >
              Zamanlama <span>{categoryCounts.timing}</span>
            </button>
          </div>
        )}

        {startup ? (
        <div className="failure-card-large">
          <div className="failure-card-header">
            <div className="failure-card-meta">
              <span className="failure-card-category">
                {categoryLabels[startup.category].label}
              </span>
              <span className="failure-card-year">{startup.year}</span>
            </div>
            <span className="failure-card-raised">{startup.raised}</span>
          </div>

          <h2 className="failure-card-name">{startup.name}</h2>
          <p className="failure-card-idea">{startup.idea}</p>

          <div className="failure-card-insights">
            <div className="failure-card-reason">
              <div className="failure-card-reason-header">
                <span className="failure-card-reason-icon">!</span>
                <span className="failure-card-reason-title">Neden Battı?</span>
              </div>
              <p>{startup.reason}</p>
            </div>

            <div className="failure-card-actions">
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
          </div>

          <div className="failure-card-nav">
            <button onClick={prev} className="failure-nav-btn">←</button>
            <span className="failure-card-counter">
              {currentIndex + 1} / {filteredStartups.length}
            </span>
            <button onClick={next} className="failure-nav-btn">→</button>
          </div>
        </div>
        ) : (
          <div className="failure-empty">
            <p>Bu kategoride başarısız girişim bulunamadı.</p>
          </div>
        )}

        <div className="failure-grid">
          {filteredStartups.map((s, i) => (
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
