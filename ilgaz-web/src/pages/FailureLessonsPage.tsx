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
  graveyard?: 'amazon' | 'google' | 'microsoft' | 'meta'
  logo?: string
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
    name: "Zulily",
    idea: "Flash-sale e-ticaret platformu",
    raised: "$194M",
    year: 2023,
    reason: "Kayıt zorunluluğu müşterileri kaçırdı, uzun teslimat süreleri, düşük sadakat",
    doThis: "Kullanıcı deneyimini zorlaştırma, önce değer sun",
    dontDoThis: "Ürünleri görmek için kayıt zorunluluğu koyma",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/60535863cb409e335debeb43_5af8aa5084ec1b933d80e117_13%25252520Zulily.png'
  },
  {
    name: "Dazo",
    idea: "Küratörlü yemek teslimat platformu",
    raised: "$2M",
    year: 2016,
    reason: "Yoğun rekabet ve fiyat savaşları, ek fon bulunamadı",
    doThis: "Food-tech'te sermaye gereksinimlerini ve rekabeti iyi hesapla",
    dontDoThis: "Yoğun rekabetli pazara yetersiz sermayeyle girme",
    category: 'money',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/60535b0795a9e0231d8a3aec_5c5657510464300b40b1536c_55%25252520Dazo.webp'
  },
  {
    name: "Zoomo",
    idea: "P2P ikinci el araba pazaryeri",
    raised: "$6M",
    year: 2016,
    reason: "Hindistan pazarı hazır değildi, her 100 araçtan sadece 20'si satılıyordu",
    doThis: "Pazar olgunluğunu doğrula, müşteri davranışlarını anla",
    dontDoThis: "Hazır olmayan pazara erken girme",
    category: 'timing',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/60535f276dba66047b426575_5af8aa77147ee369c13d2a9e_63%25252520Zoomo.png'
  },
  {
    name: "Pixate",
    idea: "Kodsuz mobil uygulama prototipleme aracı",
    raised: "$3.8M",
    year: 2016,
    reason: "Google satın aldı, bir yıl sonra kapattı (Acquisition Flu)",
    doThis: "Satın alınma sonrası entegrasyon planını netleştir",
    dontDoThis: "Büyük şirket tarafından satın alınınca bağımsızlığını tamamen kaybet",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/60535edb56f67fe1101e9ef4_5af7bf1395f858cf83ee2667_82%25252520Pixate.webp'
  },
  {
    name: "Quibi",
    idea: "Mobil için kısa premium video içerikleri",
    raised: "$1.75B",
    year: 2020,
    reason: "TikTok ve YouTube zaten ücretsiz içerik sunuyordu, pandemi zamanlaması kötüydü",
    doThis: "Lansmandan önce rakip analizi yap, ücretsiz alternatiflerle nasıl rekabet edeceğini planla",
    dontDoThis: "Pazarda zaten ücretsiz çözümler varken premium fiyatlandırma yapma",
    category: 'market',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/60536194ead6d97298ebeee6_5fda663b877f54391627c99b_Quibi.webp'
  },
  {
    name: "Theranos",
    idea: "Bir damla kanla tüm testler",
    raised: "$700M",
    year: 2018,
    reason: "Teknoloji hiç çalışmadı, yatırımcılar ve düzenleyiciler kandırıldı",
    doThis: "Ürünün gerçekten çalıştığını kanıtla, şeffaf ol, bağımsız doğrulama yaptır",
    dontDoThis: "Olmayan bir teknolojiyi varmış gibi satma, yatırımcıları yanıltma",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6053611b0452cbd2052dd83b_5da680e0bc6da7dadc893885_116%25252520Theranos.png'
  },
  {
    name: "WeWork",
    idea: "Paylaşımlı ofis alanları",
    raised: "$12B",
    year: 2019,
    reason: "Aşırı değerleme, kontrolsüz harcama, zayıf kurumsal yönetim",
    doThis: "Gerçekçi değerleme yap, maliyetleri kontrol et, yönetim kurulunu güçlü tut",
    dontDoThis: "Büyüme uğruna karlılığı tamamen göz ardı etme, CEO'ya sınırsız yetki verme",
    category: 'money',
    logo: 'https://cdn.brandfetch.io/id6_LVK2Ng/theme/dark/logo.svg'
  },
  {
    name: "Juicero",
    idea: "$700'lık WiFi'lı meyve sıkacağı",
    raised: "$120M",
    year: 2017,
    reason: "Poşetler elle sıkılabiliyordu, ürün gereksiz karmaşıklıktaydı",
    doThis: "Ürünün gerçek bir sorunu çözüp çözmediğini test et, MVP ile başla",
    dontDoThis: "Basit bir işi gereksiz yere karmaşıklaştırma, over-engineering yapma",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6035d72860071384622344dd_5af7ba93147ee315923c9478_44%2520Juicero.webp'
  },
  {
    name: "MoviePass",
    idea: "Aylık $10'a sınırsız sinema bileti",
    raised: "$68M",
    year: 2019,
    reason: "Her bilet için $5-10 kaybediyorlardı, unit economics hiç çalışmadı",
    doThis: "Unit economics'i en baştan hesapla, her işlemde para kazan",
    dontDoThis: "Sürdürülemez fiyatlandırmayla büyümeye çalışma",
    category: 'money',
    logo: 'https://cdn.brandfetch.io/idheassVWu/theme/dark/logo.svg'
  },
  {
    name: "Vine",
    idea: "6 saniyelik video paylaşım platformu",
    raised: "$25M",
    year: 2016,
    reason: "Twitter satın aldı ama monetize edemedi, creator'lar Instagram'a kaçtı",
    doThis: "İçerik üreticilerini mutlu et, onlara para kazandır, platform ekonomisini kur",
    dontDoThis: "Platform büyüdükten sonra creator'ları ihmal etme",
    category: 'team',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/60535d64460d0d990953c9aa_5af8acfc95f8581bc5eebe0c_5%25252520Vine.webp'
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
    category: 'market',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/60b1281ff99f5f6033f3209b_j3eCQxY.webp'
  },
  {
    name: "Katerra",
    idea: "Teknoloji odaklı inşaat şirketi",
    raised: "$2B",
    year: 2021,
    reason: "İnşaat sektörü çok karmaşık, tek başına teknoloji yetmedi",
    doThis: "Sektörü derinlemesine anla, adım adım ilerle, pilot projelerle test et",
    dontDoThis: "Geleneksel sektörleri teknoloji ile hızla disrupt edebileceğini sanma",
    category: 'market',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/612c9eb980c2d10416a7babf_katerralogo.png'
  },
  {
    name: "Pets.com",
    idea: "Online evcil hayvan ürünleri satışı",
    raised: "$110M",
    year: 2000,
    reason: "Nakliye maliyetleri ürün fiyatını aştı, dot-com balonu patladı",
    doThis: "Lojistik maliyetlerini en baştan hesapla, marjları koru",
    dontDoThis: "Ağır/hacimli ürünleri düşük marjla online satma",
    category: 'money',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6053516f7e372a54255615d4_Pets.webp'
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
    category: 'market',
    logo: 'https://cdn.simpleicons.org/mixer'
  },
  {
    name: "Jawbone",
    idea: "Akıllı fitness bilekliği",
    raised: "$930M",
    year: 2017,
    reason: "Fitbit ve Apple Watch rekabeti, kalite sorunları",
    doThis: "Rakiplerin bir adım önünde ol, kaliteyi asla feda etme",
    dontDoThis: "Büyük rakipler varken fiyat/kalite dengesini kaçırma",
    category: 'product',
    logo: 'https://cdn.brandfetch.io/idfK-sRnsZ/theme/dark/logo.svg'
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
    category: 'money',
    logo: 'https://cdn.brandfetch.io/idl8cylLKL/w/512/h/512/theme/dark/logo.png'
  },
  {
    name: "Secret",
    idea: "Anonim sosyal ağ",
    raised: "$35M",
    year: 2015,
    reason: "Cyberbullying sorunu çözülemedi, kullanıcı güvenliği sağlanamadı",
    doThis: "Güvenlik ve moderasyonu en baştan planla, topluluk kuralları koy",
    dontDoThis: "Anonimliği kötüye kullanıma açık bırakma",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6035d7814165bc5ca6691af6_5af8a78395f85869f5eeba25_4%2520Secret.webp'
  },
  {
    name: "Homejoy",
    idea: "Ev temizliği için on-demand platform",
    raised: "$64M",
    year: 2015,
    reason: "Temizlikçiler platformu bypass edip müşterilerle direkt çalıştı",
    doThis: "İki taraflı pazarda her iki tarafın da bağlılığını sağla",
    dontDoThis: "Arz tarafının platformu bypass etmesine izin verme",
    category: 'team',
    logo: 'https://cdn.brandfetch.io/idV3d3tFEK/w/400/h/400/theme/dark/icon.jpeg'
  },
  {
    name: "Fab",
    idea: "Flash-sale tasarım e-ticaret",
    raised: "$336M",
    year: 2015,
    reason: "Kontrolsüz büyüme, pivot'lar, cash burn",
    doThis: "Bir iş modelinde ustalaş, sonra büyü",
    dontDoThis: "Çalışan bir model olmadan hızla ölçeklendirme yapma",
    category: 'money',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/60535c1bc5fff32bc3b03151_5c5656d74ed796b0ecf04ef9_20%25252520Fab.webp'
  },
  {
    name: "Rdio",
    idea: "Spotify benzeri müzik streaming servisi",
    raised: "$125M",
    year: 2015,
    reason: "Spotify çok hızlı büyüdü, telif maliyetleri ezdi",
    doThis: "Winner-takes-all pazarda ya birinci ol ya da farklılaş",
    dontDoThis: "Lider rakibi kopyalamaya çalışma",
    category: 'market',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/60535be4478cb449ed2da264_5af8a6808b57f70c34989d33_65%25252520Rdio.png'
  },
  {
    name: "Essential",
    idea: "Android yaratıcısından premium telefon",
    raised: "$330M",
    year: 2020,
    reason: "iPhone/Samsung duopolü kırılamadı, dağıtım kanalları yetersizdi",
    doThis: "Yerleşik pazarlarda net niş bul, dağıtımı güvence altına al",
    dontDoThis: "Sadece ürün kalitesiyle dev rakipleri yeneceğini sanma",
    category: 'market',
    logo: 'https://cdn.brandfetch.io/idn04M4nmh/theme/dark/logo.svg'
  },
  {
    name: "Aereo",
    idea: "Online TV yayın servisi",
    raised: "$97M",
    year: 2014,
    reason: "Yüksek Mahkeme telif hakları davasını kaybetti",
    doThis: "Yasal riskleri en baştan değerlendir, düzenleyicilerle çalış",
    dontDoThis: "Yasal gri alanları iş modeli olarak kullanma",
    category: 'timing',
    logo: 'https://cdn.brandfetch.io/idP25dlN37/w/261/h/254/theme/dark/logo.png'
  },
  {
    name: "Color Labs",
    idea: "Yakınlık bazlı fotoğraf paylaşım uygulaması",
    raised: "$41M",
    year: 2012,
    reason: "Ürün-pazar uyumu bulunamadı, Instagram zaten vardı",
    doThis: "MVP ile hızlı test et, ürün-pazar uyumunu kanıtla",
    dontDoThis: "Büyük yatırımla ürün-pazar uyumu olmadan çık",
    category: 'product',
    logo: 'https://cdn.brandfetch.io/idhjnC-E6R/theme/dark/logo.svg'
  },
  {
    name: "Toys R Us",
    idea: "Oyuncak ve bebek ürünleri perakende zinciri",
    raised: "$5B",
    year: 2018,
    reason: "Amazon rekabeti, ağır borç yükü, dijital dönüşüm yapılamadı",
    doThis: "E-ticarete erken adapte ol, borç yönetimini iyi yap",
    dontDoThis: "Perakende deviyken dijital dönüşümü ihmal etme",
    category: 'market',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6345c5901eedc38a20eacbb3_Toys%20R%20Us.webp'
  },
  {
    name: "Houseparty",
    idea: "Arkadaşlarla görüntülü sohbet uygulaması",
    raised: "$52M",
    year: 2021,
    reason: "Zoom ve diğer platformlar pazarı ele geçirdi, odak kaybedildi",
    doThis: "Tek bir şeyi çok iyi yap, pazarda net konumlan",
    dontDoThis: "Pandemi gibi geçici trendlere bağımlı kalma",
    category: 'market',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/633cd241ce3b2c45dcf9f9ee_houseparty-logo-square-red-min.webp'
  },
  {
    name: "Xinja",
    idea: "Avustralya'nın ilk dijital bankası",
    raised: "$100M",
    year: 2020,
    reason: "Bankacılık lisansı maliyetleri, gelir modeli oluşturulamadı",
    doThis: "Düzenlenen sektörlerde sermaye gereksinimlerini iyi hesapla",
    dontDoThis: "Bankacılık gibi ağır düzenlenen sektörlere yetersiz sermayeyle girme",
    category: 'money',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6203437751399dac7dd5e43b_Xinja%20logo-min.webp'
  },
  {
    name: "Quirky",
    idea: "Topluluk destekli icat platformu",
    raised: "$185M",
    year: 2015,
    reason: "Çok fazla ürün, düşük kalite, envanter sorunları",
    doThis: "Az ama öz ürünle başla, kaliteyi koru",
    dontDoThis: "Aynı anda yüzlerce ürün geliştirmeye çalışma",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/62034a62433252afb58a633c_Quirky%20Logo-min.webp'
  },
  {
    name: "Atrium",
    idea: "Startup'lar için modern hukuk firması",
    raised: "$75M",
    year: 2020,
    reason: "Hukuk sektörünü teknoloji ile dönüştürmek beklenenden zor çıktı",
    doThis: "Geleneksel sektörlerde küçük adımlarla ilerle",
    dontDoThis: "Yüzyıllık iş modellerini bir gecede değiştirmeye çalışma",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/62034f0c5bf381d9238a3dc7_Atrium%27s%20logo-min.webp'
  },
  {
    name: "Glitch",
    idea: "Sosyal tarayıcı tabanlı MMO oyun",
    raised: "$17M",
    year: 2012,
    reason: "Oyun çok niş kaldı, geniş kitleye ulaşamadı",
    doThis: "Hedef kitlenin büyüklüğünü doğrula, pivot için hazır ol",
    dontDoThis: "Niş ürüne kitle pazarı yatırımı yapma",
    category: 'market',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/61b09fe772fa15088e90b3ea_glitchlogo-min.webp'
  },
  {
    name: "Tink Labs",
    idea: "Oteller için ücretsiz akıllı telefon hizmeti",
    raised: "$125M",
    year: 2019,
    reason: "Oteller maliyetleri üstlenmek istemedi, iş modeli sürdürülemezdi",
    doThis: "B2B'de müşterinin gerçekten ödeme yapacağını doğrula",
    dontDoThis: "Maliyeti başkasına yıkmaya dayanan model kurma",
    category: 'money',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/618b92f77dbe77d73911a836_tinklabs.webp'
  },
  {
    name: "Daqri",
    idea: "Endüstriyel artırılmış gerçeklik gözlükleri",
    raised: "$275M",
    year: 2019,
    reason: "AR teknolojisi henüz hazır değildi, pazar çok erken",
    doThis: "Teknoloji olgunluğunu değerlendir, zamanlamayı iyi ayarla",
    dontDoThis: "Pazarın hazır olmadığı teknolojiye büyük yatırım yapma",
    category: 'timing',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6114fc4e9b601523b9d10138_daqrilogo.webp'
  },
  {
    name: "HubHaus",
    idea: "Ortak yaşam alanları platformu",
    raised: "$17M",
    year: 2020,
    reason: "Pandemi ortak yaşam konseptini öldürdü",
    doThis: "Dış risklere karşı plan B hazırla",
    dontDoThis: "Tek bir trende tüm işi bağlama",
    category: 'timing',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/60dcb693807f39b00a7a48f1_hubhauslogo.png'
  },
  {
    name: "ScaleFactor",
    idea: "KOBİ'ler için yapay zeka destekli muhasebe",
    raised: "$100M",
    year: 2020,
    reason: "AI vaat edildi ama aslında manuel iş yapılıyordu",
    doThis: "Ürünün gerçekten söylediğin şeyi yaptığından emin ol",
    dontDoThis: "AI buzz'ını kullanıp aslında insan gücüyle çalışma",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/60afb7ecca36f1ba5b7fe1af_scalefactorlogo.webp'
  },
  {
    name: "Yik Yak",
    idea: "Anonim lokasyon bazlı sosyal ağ",
    raised: "$73M",
    year: 2017,
    reason: "Siber zorbalık sorunları, üniversitelerden yasaklar",
    doThis: "Anonimlik özelliğini güvenli moderasyonla dengele",
    dontDoThis: "Zararlı içeriği kontrol edemeyeceğin platform kurma",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/60535aef1f1a77419b3876ea_5af8ab9c4d23b2d330c428d1_1%25252520Yik%25252520Yak.png'
  },
  {
    name: "PepperTap",
    idea: "Hızlı market teslimatı",
    raised: "$51M",
    year: 2016,
    reason: "Düşük marjlar, yoğun rekabet, lojistik maliyetleri",
    doThis: "Grocery delivery'de unit economics'i en baştan çöz",
    dontDoThis: "Negatif marjla büyümeye çalışma",
    category: 'money',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6053584eed28de325824cf74_5c5661f84ed796fc6ff056ea_49%25252520PepperTap.webp'
  },
  {
    name: "Musical.ly",
    idea: "Kısa video ve müzik paylaşım uygulaması",
    raised: "$150M",
    year: 2018,
    reason: "TikTok tarafından satın alındı, marka sonlandırıldı",
    doThis: "Satın alma stratejini baştan planla",
    dontDoThis: "Daha büyük rakip karşısında bağımsız kalma stratejini geç planlama",
    category: 'market',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/635948fa923e4a5ab8821d89_Musical.ly_vector_logo-min.png'
  },
  {
    name: "Justin.tv",
    idea: "Canlı video yayın platformu",
    raised: "$35M",
    year: 2014,
    reason: "Gaming kısmı (Twitch) başarılı oldu, ana platform kapatıldı",
    doThis: "Hangi segmentin gerçekten çalıştığını bul, ona odaklan",
    dontDoThis: "Başarılı segmenti görmezden gelip her şeyi yapmaya çalışma",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/63504aacfceee91c22452735_Justin.tv.webp'
  },
  {
    name: "Zirtual",
    idea: "Profesyoneller için sanal asistan hizmeti",
    raised: "$5.5M",
    year: 2015,
    reason: "Nakit akışı yönetimi felaketi, bir gecede kapandı",
    doThis: "Nakit akışını günlük takip et, 6 aylık pist tut",
    dontDoThis: "Maaş ödeyemeyecek duruma düşene kadar bekleme",
    category: 'money',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/605357d64466ea464d8ecf31_5af8aaa495f85810a5eebd64_93%25252520Zirtual.webp'
  },
  {
    name: "Rafter",
    idea: "Üniversiteler için ders kitabı platformu",
    raised: "$90M",
    year: 2016,
    reason: "Amazon ve Chegg rekabeti, fiyat savaşında kaybetti",
    doThis: "Fiyat dışında rekabet avantajı oluştur",
    dontDoThis: "Amazon ile fiyat rekabetine girme",
    category: 'market',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6053580e4466ea56a68eebf6_5c56646f530958865f466bc4_85%25252520Rafter.webp'
  },
  {
    name: "Netscape",
    idea: "Web tarayıcısı ve internet yazılımları",
    raised: "$200M",
    year: 2008,
    reason: "Microsoft IE ile tarayıcı savaşını kaybetti",
    doThis: "Dev rakiple savaşırken dağıtım avantajını hesaba kat",
    dontDoThis: "İşletim sistemi sahibiyle bundled ürün savaşına girme",
    category: 'market',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/60535826edc8744de747a068_5c56614a53095803c146677b_70%25252520Netscape.webp'
  },
  {
    name: "Yogome",
    idea: "Çocuklar için eğitici mobil oyunlar",
    raised: "$12M",
    year: 2018,
    reason: "Kötü yönetim, odak kaybı, çok fazla oyun",
    doThis: "Yönetim ekibini güçlü tut, stratejik odağı koru",
    dontDoThis: "Her fırsatın peşinden koşup ana işi ihmal etme",
    category: 'team',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6193c2be9b571ad158f699a2_yogomelogo.webp'
  },
  {
    name: "Desti",
    idea: "Yapay zeka destekli seyahat rehberi",
    raised: "$4M",
    year: 2014,
    reason: "Monetizasyon bulunamadı, Nokia tarafından ucuza satın alındı",
    doThis: "Gelir modelini en baştan planla",
    dontDoThis: "Harika ürün yap ama nasıl para kazanacağını düşünme",
    category: 'money',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6053579a2d4ea23924ee216f_5af7b4c38b57f79f3297f78b_100%25252520Desti.png'
  },
  {
    name: "HiGear",
    idea: "Lüks araç paylaşım kulübü",
    raised: "$3M",
    year: 2011,
    reason: "Sigorta ve yasal sorunlar çözülemedi",
    doThis: "Düzenlenen sektörlerde yasal uyumu önce çöz",
    dontDoThis: "Yasal sorunları büyüdükten sonra çözmeye çalışma",
    category: 'timing',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/605357c2b15d78359ed0250d_5c565a2d530958de43466243_62%25252520HiGear.png'
  },
  {
    name: "RoomsTonite",
    idea: "Son dakika otel rezervasyonu",
    raised: "$6M",
    year: 2017,
    reason: "OTA'lar (Booking, Expedia) pazarı domine ediyordu, fon bulunamadı",
    doThis: "Güçlü rakipler karşısında niş bul veya farklılaş",
    dontDoThis: "Dev OTA'larla aynı pazarda direkt rekabete girme",
    category: 'market',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/605357e827f79460145ec891_5af8a71484ec1b1c5c80e005_99%25252520RoomsTonite.webp'
  },
  {
    name: "Sharingear",
    idea: "Müzisyenler için enstrüman kiralama pazaryeri",
    raised: "$500K",
    year: 2015,
    reason: "Pazar çok küçüktü, iki taraflı pazaryeri oluşturulamadı",
    doThis: "TAM (Total Addressable Market) hesabını gerçekçi yap",
    dontDoThis: "Hobi projesi büyüklüğündeki pazara startup kur",
    category: 'market',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6053583a3b3c1208142701db_5b01ea54a4116982cd118532_68%25252520Sharingear.webp'
  },
  {
    name: "HotelsAroundYou",
    idea: "Aynı gün otel rezervasyonu",
    raised: "$500K",
    year: 2017,
    reason: "OYO ve büyük OTA'lar pazarı ele geçirdi",
    doThis: "Büyük oyuncuların girmeyeceği niş bul",
    dontDoThis: "Büyük rakiplerin kolayca kopyalayabileceği iş modeli kur",
    category: 'market',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/605357ad1f1a77a83b359625_5c565ae14ed7961646f051bf_98%25252520HotelsAroundYou.webp'
  },
  {
    name: "Beepi",
    idea: "Peer-to-peer araba satış platformu",
    raised: "$150M",
    year: 2017,
    reason: "Operasyonel maliyetler çok yüksek, her arabayı kontrol etmek pahalıydı",
    doThis: "Operasyonel maliyetleri en baştan optimize et",
    dontDoThis: "Ölçeklenmeyen operasyonlarla büyümeye çalışma",
    category: 'money',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/60535ec7ac5373020e60bfca_5af7b2fa4d23b217e4c3970c_59%25252520Beepi.webp'
  },
  {
    name: "Shyp",
    idea: "On-demand kargo gönderim hizmeti",
    raised: "$62M",
    year: 2018,
    reason: "Unit economics negatifti, her gönderimde para kaybediliyordu",
    doThis: "Her işlemde para kazanacak model kur",
    dontDoThis: "Hacim ile karlılık geleceğini varsayma",
    category: 'money',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/605361085ae8224542c00ee2_5da675b1bc6da7ffee8902f3_115%25252520Shyp.png'
  },
  {
    name: "Sprig",
    idea: "Sağlıklı yemek teslimat servisi",
    raised: "$57M",
    year: 2017,
    reason: "Mutfak ve teslimat maliyetleri çok yüksek, UberEats rekabeti",
    doThis: "Dikey entegrasyon maliyetlerini iyi hesapla",
    dontDoThis: "Hem üretim hem teslimat yaparak maliyetleri katla",
    category: 'money',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/60535fd662180573966c5ced_5af8a8d64818964cffb96cb5_47%25252520Sprig.webp'
  },
  {
    name: "Munchery",
    idea: "Şef yapımı yemek teslimat servisi",
    raised: "$125M",
    year: 2019,
    reason: "Operasyonel karmaşıklık, yemek israfı, yetersiz talep",
    doThis: "Bozulabilir ürünlerde demand forecasting'i mükemmelleştir",
    dontDoThis: "Yüksek israflı iş modeliyle ölçeklenme",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6053616f72b72c7b0cb7d917_5dfcf68740d9e81c76ed928b_121%25252520Munchery.webp'
  },
  {
    name: "Maple",
    idea: "Premium yemek teslimat servisi",
    raised: "$29M",
    year: 2017,
    reason: "David Chang bile kurtaramadı, birim ekonomisi çalışmadı",
    doThis: "Ünlü isimler yeterli değil, iş modeli sağlam olmalı",
    dontDoThis: "Sadece marka gücüne güvenme",
    category: 'money',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/60535ac4e17134c099461b5a_5c565dc5c3ddd31bf9e6f536_48%25252520Maple.webp'
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
    category: 'product',
    logo: 'https://cdn.brandfetch.io/idlzKH91sR/w/180/h/180/theme/dark/logo.png'
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
    category: 'product',
    logo: 'https://cdn.brandfetch.io/idzPbE91be/theme/dark/logo.svg'
  },
  {
    name: "FTX",
    idea: "Kripto para borsası",
    raised: "$2B",
    year: 2022,
    reason: "Müşteri fonlarını zimmetine geçirme, dolandırıcılık",
    doThis: "Finansal kontrolleri ve denetimleri en baştan kur",
    dontDoThis: "Müşteri fonlarını riskli yatırımlarda kullanma",
    category: 'team',
    logo: 'https://cdn.brandfetch.io/idRgtuB0Ji/theme/dark/logo.svg'
  },
  {
    name: "Fast",
    idea: "Tek tıkla ödeme checkout sistemi",
    raised: "$125M",
    year: 2022,
    reason: "Çok az satıcı kullanıyordu, gelir neredeyse sıfırdı",
    doThis: "Traction olmadan büyük yatırım almaktan kaçın",
    dontDoThis: "Gelir olmadan 10M$/ay harcama",
    category: 'money',
    logo: 'https://cdn.brandfetch.io/idiHrS5vhj/w/800/h/261/theme/dark/logo.png'
  },
  {
    name: "IRL",
    idea: "Sosyal etkinlik planlama uygulaması",
    raised: "$200M",
    year: 2023,
    reason: "Kullanıcı sayıları sahte çıktı, 95% bot trafiği",
    doThis: "Metriklerin gerçek olduğunu doğrula ve denetle",
    dontDoThis: "Yatırımcılara sahte metrikler sunma",
    category: 'team',
    logo: 'https://cdn.brandfetch.io/idhYAUG66g/theme/dark/logo.svg'
  },
  {
    name: "Veev",
    idea: "Prefabrik ev üretimi",
    raised: "$600M",
    year: 2024,
    reason: "İnşaat maliyetleri beklenenden çok yüksek, talep yetersiz",
    doThis: "Construction tech'te pilot projeyle maliyetleri doğrula",
    dontDoThis: "İnşaat sektöründe maliyet varsayımlarına güvenme",
    category: 'money',
    logo: 'https://cdn.brandfetch.io/idsjB2G_03/theme/dark/logo.svg'
  },
  {
    name: "Convoy",
    idea: "Dijital kamyon taşımacılığı platformu",
    raised: "$1.1B",
    year: 2023,
    reason: "Navlun fiyatları düştü, komisyon marjları çok ince",
    doThis: "Döngüsel sektörlerde kötü senaryoyu planla",
    dontDoThis: "Boom döneminde alınan yatırımla bust dönemine hazırlıksız girme",
    category: 'timing',
    logo: 'https://cdn.brandfetch.io/idWHmCPspu/theme/dark/logo.svg'
  },
  {
    name: "Olive AI",
    idea: "Sağlık sektörü için otomasyon AI",
    raised: "$900M",
    year: 2023,
    reason: "Ürün vaatleri karşılanamadı, müşteriler kaybedildi",
    doThis: "Satış öncesi vaat ettiğini gerçekten teslim et",
    dontDoThis: "Ürün yetkinliğini aşan satış yapma",
    category: 'product',
    logo: 'https://cdn.brandfetch.io/id4yJvohfW/theme/dark/logo.svg'
  },
  {
    name: "Hopin",
    idea: "Sanal etkinlik platformu",
    raised: "$1B",
    year: 2023,
    reason: "Pandemi bitti, fiziksel etkinlikler geri döndü, $8M'a satıldı",
    doThis: "Geçici trendlerin kalıcılığını sorgula",
    dontDoThis: "Pandemi spike'ını kalıcı büyüme olarak planla",
    category: 'timing',
    logo: 'https://cdn.brandfetch.io/idhvgQJnGW/theme/dark/logo.svg'
  },
  {
    name: "Plastiq",
    idea: "Kredi kartıyla her yere ödeme yapma",
    raised: "$200M",
    year: 2023,
    reason: "Faiz oranları yükseldi, iş modeli sürdürülemez hale geldi",
    doThis: "Makro ekonomik riskleri değerlendir",
    dontDoThis: "Düşük faiz ortamına bağımlı iş modeli kur",
    category: 'timing',
    logo: 'https://cdn.brandfetch.io/idGhwqvUvc/theme/dark/logo.svg'
  },
  {
    name: "Bird",
    idea: "Elektrikli scooter paylaşımı",
    raised: "$900M",
    year: 2023,
    reason: "Scooter ömrü çok kısa, vandalizm, regülasyonlar",
    doThis: "Hardware maliyetlerini ve ömrünü gerçekçi hesapla",
    dontDoThis: "Şehirlerin regülasyonlarını hafife alma",
    category: 'money',
    logo: 'https://cdn.brandfetch.io/idxgsZgHXh/theme/dark/symbol.svg'
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
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/605351f106e9d45aa5238e2d_Fire-Phone.webp'
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
    category: 'market',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6053522943d916983edd6e10_Amazon-Destinations.webp'
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
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/605352f5cc70917ec795a548_Amazon-Spark-p-500.webp'
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
    category: 'market',
    logo: 'https://cdn.brandfetch.io/idawOgYOsG/w/400/h/400/theme/dark/icon.jpeg'
  },
  {
    name: "Haven Healthcare",
    idea: "Amazon-Berkshire-JPMorgan sağlık girişimi",
    raised: "$100M+",
    year: 2021,
    reason: "Üç dev şirket bile sağlık sistemini değiştiremedi",
    doThis: "Sağlık sektörünün karmaşıklığını hafife alma",
    dontDoThis: "Para ve marka gücünün her sorunu çözeceğini sanma",
    category: 'market',
    logo: 'https://cdn.brandfetch.io/idawOgYOsG/w/400/h/400/theme/dark/icon.jpeg'
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
    category: 'product',
    logo: 'https://cdn.brandfetch.io/idawOgYOsG/w/400/h/400/theme/dark/icon.jpeg'
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
    category: 'market',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6053521b59a58067ae5ec21f_Amazon-Local.webp'
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
    category: 'market',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6053528fc8b1c555064adb63_Amazon-Tickets.webp'
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
    category: 'market',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/605351e55ede5f782491512c_Amazon-Webpay.png'
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
    category: 'market',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/605351d8cfceb21b4b4cd949_Amazon-Askville.webp'
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
    category: 'timing',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6053520d96fa28586eac100c_Amazon-Wallet.webp'
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
    category: 'market',
    logo: 'https://cdn.brandfetch.io/idawOgYOsG/w/400/h/400/theme/dark/icon.jpeg'
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
    category: 'timing',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6053507fa720387f3c58492b_LoveFilm.webp'
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
    category: 'product',
    logo: 'https://cdn.brandfetch.io/idawOgYOsG/w/400/h/400/theme/dark/icon.jpeg'
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
    category: 'product',
    logo: 'https://cdn.brandfetch.io/idF0oF_pxy/w/224/h/79/theme/dark/logo.png'
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
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/605352d910299da997278a5d_Amazon-Storywriter.webp'
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
    category: 'market',
    logo: 'https://cdn.brandfetch.io/idawOgYOsG/w/400/h/400/theme/dark/icon.jpeg'
  },
  {
    name: "Kozmo.com",
    idea: "1 saat içinde teslimat servisi",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2001,
    reason: "Düşük marjlı ürünlerde hızlı teslimat ekonomisi tutmadı",
    doThis: "Unit economics'i en baştan doğrula",
    dontDoThis: "Düşük marjlı ürünlerde pahalı teslimat modeli kurma",
    category: 'money',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/60535196f17a62f1403ef4d8_Kozmo.webp'
  },
  {
    name: "Myhabit.com",
    idea: "Tasarımcı moda flash sales sitesi",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2016,
    reason: "Gilt ve HauteLook rekabeti, Amazon Fashion entegrasyonu",
    doThis: "Ana platformla sinerjileri değerlendir",
    dontDoThis: "Ana markayı kannibalize eden alt marka sürdürme",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/605352444adddf544a162d39_Myhabit.webp'
  },
  {
    name: "Shelfari",
    idea: "Kitap severler için sosyal ağ",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2016,
    reason: "Goodreads satın alındı, iki platform gereksiz kaldı",
    doThis: "Aynı kategoride tek markaya odaklan",
    dontDoThis: "Rakip satın alınca eski ürünü sürükleme",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/605350d0c2ed9fb16d2d31a1_Shelfari.webp'
  },
  {
    name: "TenMarks Education",
    idea: "Matematik eğitim platformu",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2019,
    reason: "Amazon eğitim pazarından çekildi",
    doThis: "Core business dışı yatırımları periyodik değerlendir",
    dontDoThis: "Stratejik fit olmayan satın almaları uzun süre tutma",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6053503ced4bcc399725913a_TenMarks-Education-Inc.webp'
  },
  {
    name: "Withoutabox",
    idea: "Film festivali başvuru platformu",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2019,
    reason: "FilmFreeway rakibi daha iyi UX sundu",
    doThis: "Satın alınan ürünü geliştirmeye devam et",
    dontDoThis: "Satın aldıktan sonra ürünü ihmal etme",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/605350dd4adddfeb35152058_Withoutabox.webp'
  },
  {
    name: "Mobipocket",
    idea: "E-kitap okuyucu yazılımı",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2016,
    reason: "Kindle ekosistemi altında birleştirildi",
    doThis: "Teknoloji satın alımlarını ana ürüne entegre et",
    dontDoThis: "Paralel teknolojileri ayrı tutma",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/605350fca7203885e758cf0b_Mobipocket.webp'
  },
  {
    name: "BuyVIP",
    idea: "Avrupa flash sales moda sitesi",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2016,
    reason: "Amazon Fashion Avrupa stratejisi değişti",
    doThis: "Bölgesel satın almalarda global stratejiyi düşün",
    dontDoThis: "Her bölge için ayrı marka sürdürme",
    category: 'market',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6053508d7c937371bd493230_BuyVIP.webp'
  },
  {
    name: "Yap",
    idea: "Ses tanıma teknolojisi şirketi",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2014,
    reason: "Alexa'ya entegre edildi, ayrı marka gereksiz",
    doThis: "Acqui-hire'larda teknolojiyi hızla entegre et",
    dontDoThis: "Satın alınan teknolojinin entegrasyonunu geciktirme",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/60535073b6f0b9412e7f2916_Yap.webp'
  },
  {
    name: "Teachstreet",
    idea: "Yerel kurs ve eğitmen bulma platformu",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2014,
    reason: "Amazon Local stratejisi değişti",
    doThis: "Satın alma stratejisini uzun vadeli planla",
    dontDoThis: "Kısa vadeli stratejiler için satın alma yapma",
    category: 'market',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/605350648bb37768c3e70bc7_Teachstreet.webp'
  },
  {
    name: "SnapTell",
    idea: "Görsel ürün tanıma teknolojisi",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2012,
    reason: "Flow uygulamasına entegre edildi",
    doThis: "Teknoloji satın alımlarını feature olarak kullan",
    dontDoThis: "Satın alınan teknolojinin değerini çıkarmadan bırakma",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/605350b5ffa658d2ff2c0cc6_SnapTell.webp'
  },
  {
    name: "Touchco",
    idea: "Çoklu dokunmatik ekran teknolojisi",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2010,
    reason: "Kindle touch ekranlarına entegre edildi",
    doThis: "Donanım teknolojisini ürüne entegre et",
    dontDoThis: "Satın alınan donanım IP'sini kullanmadan tutma",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/605350a70f8414a1109434b0_Touchco.webp'
  },
  {
    name: "Amie Street",
    idea: "Dinamik fiyatlı müzik mağazası",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2010,
    reason: "Amazon MP3 ile birleştirildi",
    doThis: "Benzersiz fiyatlama modellerini test et",
    dontDoThis: "İnovatif modeli ana ürüne entegre etmeden kapat",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6053509a9c1059c53a3a861e_Amie-Street-.webp'
  },
  {
    name: "TextPayMe",
    idea: "SMS ile P2P ödeme servisi",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2008,
    reason: "Amazon Payments'a entegre edildi",
    doThis: "Fintech satın almalarını hızla entegre et",
    dontDoThis: "Ödeme teknolojisini parçalı tutma",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/605350ee1eb1314db199d617_TextPayMe.webp'
  },
  {
    name: "Wing.ae",
    idea: "Dubai merkezli drone teslimat servisi",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2016,
    reason: "Regülasyonlar ve operasyonel zorluklar",
    doThis: "Drone teslimatında regülasyonları önce çöz",
    dontDoThis: "Regülasyon belirsizliğinde büyük yatırım yapma",
    category: 'timing',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/60534fe7cc70915b879401b7_Wing.webp'
  },
  {
    name: "Shoefitr",
    idea: "3D ayakkabı ölçüm teknolojisi",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2017,
    reason: "Zappos'a entegre edildi",
    doThis: "E-ticaret teknolojisini ana platforma entegre et",
    dontDoThis: "Satın alınan teknolojiyi izole tutma",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/605350113f1860158df75bfd_Shoefitr.webp'
  },
  {
    name: "Liquavista",
    idea: "Elektrowetting ekran teknolojisi",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2019,
    reason: "Kindle e-ink teknolojisi yeterli görüldü",
    doThis: "Ar-Ge yatırımlarını ürün yol haritasıyla hizala",
    dontDoThis: "Kullanılmayan teknolojiye yatırım yapmaya devam etme",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/60535049cc70912bfb94657d_Liquavista.webp'
  },
  {
    name: "Reflexive Entertainment",
    idea: "Casual oyun stüdyosu",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2016,
    reason: "Amazon Game Studios stratejisi değişti",
    doThis: "Oyun stüdyosu satın almalarında uzun vadeli strateji belirle",
    dontDoThis: "Gaming stratejisi netleşmeden stüdyo satın alma",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/605350c37fc238984c78a023_Reflexive-Entertainment.webp'
  },
  {
    name: "Rooftop Media",
    idea: "Video reklam teknolojisi",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2014,
    reason: "Amazon reklam platformuna entegre edildi",
    doThis: "AdTech satın almalarını hızla entegre et",
    dontDoThis: "Reklam teknolojisini parçalı tutma",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6053502035696b5340a46859_Rooftop-Media.webp'
  },
  {
    name: "Safaba",
    idea: "Makine çeviri teknolojisi",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2015,
    reason: "Amazon Translate'e entegre edildi",
    doThis: "AI teknolojilerini bulut servislerine entegre et",
    dontDoThis: "Satın alınan AI'ı ürünleştirmeden tutma",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/60535001ddd9442c19101e27_Safaba-.webp'
  },
  {
    name: "Partpic",
    idea: "Görsel parça tanıma uygulaması",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2019,
    reason: "Amazon Part Finder'a entegre edildi",
    doThis: "Niş teknolojileri büyük platformda kullan",
    dontDoThis: "Dar kullanımlı teknolojiyi ayrı ürün olarak sürdürme",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/60534ff41fee595fa018b886_Partpic.webp'
  },
  {
    name: "Amiato",
    idea: "İş zekası ve veri analizi",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2015,
    reason: "AWS analytics servislerine entegre edildi",
    doThis: "B2B satın almalarını bulut servislerine dönüştür",
    dontDoThis: "Enterprise teknolojisini entegre etmeden tutma",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6053502d72ff86d8bf0340b3_Amiato.webp'
  },
  {
    name: "Avalon Books",
    idea: "Romantik ve western kitap yayıncısı",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2012,
    reason: "Amazon Publishing'e entegre edildi",
    doThis: "Yayıncılık satın almalarında katalog değerini kullan",
    dontDoThis: "Eski markaları gereksiz yere sürdürme",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/605350577e372ac989556572_Avalon-Books.webp'
  },
  {
    name: "BookSurge",
    idea: "Talep üzerine kitap baskı servisi",
    raised: "Amazon",
    graveyard: 'amazon',
    year: 2009,
    reason: "CreateSpace olarak yeniden markalaştı, sonra KDP'ye entegre",
    doThis: "POD teknolojisini self-publishing ile birleştir",
    dontDoThis: "Aynı işi yapan birden fazla marka sürdürme",
    category: 'product',
    logo: 'https://cdn.prod.website-files.com/5fadb14c46b287ad224b60b9/6053510af17a626baa3e9fdb_BookSurge.webp'
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
    category: 'timing',
    logo: 'https://cdn.simpleicons.org/googleglass'
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
    category: 'product',
    logo: 'https://cdn.simpleicons.org/googlestadia'
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
    category: 'product',
    logo: 'https://cdn.simpleicons.org/googlehangouts'
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
    category: 'product',
    logo: 'https://cdn.simpleicons.org/google'
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
    category: 'market',
    logo: 'https://cdn.simpleicons.org/google'
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
    category: 'timing',
    logo: 'https://cdn.simpleicons.org/google'
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
    category: 'product',
    logo: 'https://cdn.simpleicons.org/google'
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
    category: 'product',
    logo: 'https://cdn.simpleicons.org/google'
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
    category: 'product',
    logo: 'https://cdn.simpleicons.org/facebook'
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
    category: 'market',
    logo: 'https://cdn.simpleicons.org/facebook'
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
    category: 'product',
    logo: 'https://cdn.simpleicons.org/facebook'
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
    category: 'timing',
    logo: 'https://cdn.simpleicons.org/facebook'
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
    category: 'product',
    logo: 'https://cdn.simpleicons.org/facebook'
  },
  {
    name: "Libra/Diem",
    idea: "Facebook'un kripto para projesi",
    raised: "$200M+",
    year: 2022,
    reason: "Düzenleyiciler izin vermedi, güven sorunu",
    doThis: "Fintech'te düzenleyicilerle erken çalış",
    dontDoThis: "Düzenleyicileri bypass etmeye çalışma",
    category: 'timing',
    logo: 'https://cdn.simpleicons.org/meta'
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
    category: 'timing',
    logo: 'https://cdn.simpleicons.org/microsoft'
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
    category: 'market',
    logo: 'https://cdn.simpleicons.org/microsoft'
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
    category: 'market',
    logo: 'https://cdn.simpleicons.org/microsoft'
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
    category: 'market',
    logo: 'https://cdn.simpleicons.org/microsoft'
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
    category: 'market',
    logo: 'https://cdn.simpleicons.org/microsoft'
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
    category: 'product',
    logo: 'https://cdn.simpleicons.org/microsoft'
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

// Get logo colors based on startup name
function getLogoColor(name: string): string {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e'
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

// Logo component with Failory logos
function StartupLogo({ startup, size = 48 }: { startup: FailedStartup; size?: number }) {
  const [imgError, setImgError] = useState(false)
  const [currentLogo, setCurrentLogo] = useState(startup.logo)

  // Reset error state when startup changes
  if (startup.logo !== currentLogo) {
    setCurrentLogo(startup.logo)
    setImgError(false)
  }

  if (startup.logo && !imgError) {
    return (
      <img
        src={startup.logo}
        alt={startup.name}
        className="failure-logo-img"
        style={{ width: size, height: size }}
        onError={() => setImgError(true)}
      />
    )
  }

  return (
    <div
      className="failure-logo-fallback"
      style={{ width: size, height: size, background: getLogoColor(startup.name) }}
    >
      {startup.name.charAt(0)}
    </div>
  )
}

export function FailureLessonsPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sortBy, setSortBy] = useState<SortBy>('random')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [graveyardFilter, setGraveyardFilter] = useState<GraveyardFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredStartups, setFilteredStartups] = useState(failedStartups)
  const [isAutoPlay, setIsAutoPlay] = useState(false)

  const filterAndSort = useCallback((sort: SortBy, category: CategoryFilter, graveyard: GraveyardFilter, search: string) => {
    let result = [...failedStartups]

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.idea.toLowerCase().includes(q) ||
        s.reason.toLowerCase().includes(q)
      )
    }

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
    } else if (!search.trim()) {
      // Only randomize if not searching
      result = result.sort(() => Math.random() - 0.5)
    }

    setFilteredStartups(result)
    setCurrentIndex(0)
  }, [])

  useEffect(() => {
    filterAndSort(sortBy, categoryFilter, graveyardFilter, searchQuery)
  }, [sortBy, categoryFilter, graveyardFilter, searchQuery, filterAndSort])

  useEffect(() => {
    if (!isAutoPlay || filteredStartups.length === 0) return
    const interval = setInterval(() => {
      setCurrentIndex(i => (i + 1) % filteredStartups.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [isAutoPlay, filteredStartups.length])

  const next = useCallback(() => {
    if (filteredStartups.length === 0) return
    setCurrentIndex(i => (i + 1) % filteredStartups.length)
  }, [filteredStartups.length])

  const prev = useCallback(() => {
    if (filteredStartups.length === 0) return
    setCurrentIndex(i => (i - 1 + filteredStartups.length) % filteredStartups.length)
  }, [filteredStartups.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowRight') {
        next()
      } else if (e.key === 'ArrowLeft') {
        prev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [next, prev])

  const startup = filteredStartups[currentIndex]

  const totalRaised = failedStartups.reduce((acc, s) => acc + parseRaised(s.raised), 0)

  return (
    <div className="failure-page">
      <h1>Başarısızlık Dersleri</h1>
      <p className="lead">
        {failedStartups.length} girişim, ${Math.round(totalRaised / 1000)}B+ yatırım, sayısız ders.
      </p>

      <div className="failure-page-content">
        {/* Search */}
        <div className="failure-search">
          <svg className="failure-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Girişim ara... (isim, fikir veya sebep)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="failure-search-input"
          />
          {searchQuery && (
            <button className="failure-search-clear" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>

        {/* Filters */}
        <div className="failure-filters">
          <div className="failure-filter-section">
            <div className="failure-filter-pills">
              {(['all', 'startups', 'amazon', 'google', 'microsoft', 'meta'] as GraveyardFilter[]).map(g => (
                <button
                  key={g}
                  className={`failure-pill ${graveyardFilter === g ? 'active' : ''}`}
                  onClick={() => setGraveyardFilter(g)}
                >
                  {g === 'all' ? 'Tümü' : g === 'startups' ? 'Startup' : g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="failure-filter-row">
            <div className="failure-filter-pills small">
              {(['all', 'market', 'product', 'money', 'team', 'timing'] as CategoryFilter[]).map(cat => (
                <button
                  key={cat}
                  className={`failure-pill ${categoryFilter === cat ? 'active' : ''}`}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat === 'all' ? 'Tüm Sebepler' : categoryLabels[cat].label}
                </button>
              ))}
            </div>
          </div>

          <div className="failure-filter-row">
            <div className="failure-filter-pills small">
              {(['random', 'year', 'raised'] as SortBy[]).map(s => (
                <button
                  key={s}
                  className={`failure-pill ${sortBy === s ? 'active' : ''}`}
                  onClick={() => setSortBy(s)}
                >
                  {s === 'random' ? 'Karışık' : s === 'year' ? 'Yeni → Eski' : 'Çok → Az $'}
                </button>
              ))}
              <button
                className={`failure-pill autoplay ${isAutoPlay ? 'active' : ''}`}
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                title={isAutoPlay ? 'Durdur' : 'Otomatik oynat'}
              >
                {isAutoPlay ? '⏸ Durdur' : '▶ Otomatik'}
              </button>
            </div>

            <div className="failure-hint">
              <kbd>←</kbd> <kbd>→</kbd> gezin · karta tıkla · ara
            </div>
          </div>
        </div>

        {/* Detail Card */}
        {startup ? (
        <div className="failure-card">
          <div className="failure-card-header">
            <StartupLogo key={startup.name} startup={startup} size={48} />
            <div className="failure-card-title">
              <h2 className="failure-card-name">{startup.name}</h2>
              <p className="failure-card-idea">{startup.idea}</p>
            </div>
            <div className="failure-card-meta">
              <span className="failure-card-raised">{startup.raised}</span>
              <span className="failure-card-year">{startup.year}</span>
            </div>
          </div>

          <div className="failure-card-body">
            <div className="failure-card-reason">
              <strong>Neden battı?</strong>
              <p>{startup.reason}</p>
            </div>

            <div className="failure-card-lessons">
              <div className="failure-card-do">
                <span className="failure-lesson-icon do">✓</span>
                <p>{startup.doThis}</p>
              </div>
              <div className="failure-card-dont">
                <span className="failure-lesson-icon dont">✗</span>
                <p>{startup.dontDoThis}</p>
              </div>
            </div>
          </div>

          <div className="failure-card-nav">
            <button onClick={prev} className="failure-nav-btn" aria-label="Önceki">←</button>
            <span className="failure-card-counter">{currentIndex + 1} / {filteredStartups.length}</span>
            <button onClick={next} className="failure-nav-btn" aria-label="Sonraki">→</button>
          </div>
        </div>
        ) : (
          <div className="failure-empty">Bu filtreyle eşleşen girişim yok.</div>
        )}

        {/* Mini Cards Grid */}
        <div className="failure-grid">
          {filteredStartups.map((s, i) => (
            <button
              key={s.name}
              className={`failure-mini-card ${i === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(i)}
              title={s.name}
            >
              <StartupLogo startup={s} size={36} />
              <span className="failure-mini-name">{s.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
