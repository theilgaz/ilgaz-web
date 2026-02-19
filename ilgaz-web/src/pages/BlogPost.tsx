import { Link, useParams } from 'react-router-dom'

const posts: Record<string, {
  title: string
  date: string
  readTime: string
  tags: string[]
  content: React.ReactNode
}> = {
  'yapay-zeka-caginda-yazilimcinin-yeri': {
    title: 'yapay zeka çağında yazılımcının yeri',
    date: '19 Şub 2026',
    readTime: '11 dk',
    tags: ['tefekkür', 'yazılım'],
    content: (
      <>
        <p>
          Matbaa yazarlığı öldürmedi. Aksine, işinin gerekliliklerini yerine getirenler için muazzam
          bir avantaja dönüştü. Yapay zeka da yazılımcılık için aynı yolda ilerliyor.
        </p>

        <h2>Bugünün Sınırları, Yarının Fırsatları</h2>

        <p>
          Halüsinasyonlar, bağlam çözme zorlukları, devasa bir projeyi verip "içinden çıkmasını
          beklemek"... Bunlar kısa vadede hâlâ ciddi engeller. Ancak orta ve uzun vadede, yapay zeka
          öncesi dönemde tüm SDLC süreçlerinde derinleşmiş kişilerin ortaya koyacağı katma değer
          bariz bir fark oluşturacak.
        </p>

        <h2>Makine Düşünebilir mi?</h2>

        <p>
          Hissedebilir mi? Bu soru yüzyıllardır filozofları meşgul ediyor. Turing "makineler
          düşünebilir mi?" sorusunu sorduğunda, cevabı bir teste bağladı: Eğer bir makine insanı
          kandırabiliyorsa, düşünüyor sayılır. Ama kandırmak, düşünmek midir?
        </p>

        <p>
          Çin Odası deneyini düşünün. Bir odada Çince bilmeyen biri oturuyor. Dışarıdan Çince
          sorular geliyor. Adam elindeki kural kitabına bakarak sembolleri eşleştiriyor ve cevap
          üretiyor. Dışarıdan bakana mükemmel Çince bilen biri gibi görünüyor. Ama adam tek kelime
          Çince bilmiyor. Sadece sembolleri eşleştiriyor.
        </p>

        <p>
          Bugünün yapay zekası tam olarak bunu yapıyor. Milyarlarca metin üzerinde örüntü tanıma.
          Hangi kelimeden sonra hangi kelime gelir? Hangi kod parçası hangi problemi çözer?
          İstatistiksel eşleştirme. Anlam yok, niyet yok, kavrayış yok.
        </p>

        <p>
          İnsan düşüncesi farklı bir şey. Biz sadece bilgi işlemiyoruz. Anlam arıyoruz. "Neden?"
          diye soruyoruz. Vicdan azabı çekiyoruz. Pişman oluyoruz. Bir kararın ağırlığını
          hissediyoruz. Makine bu ağırlığı bilmez.
        </p>

        <p>
          Ruh, bilinç, irade. Bunlar hesaplanabilir şeyler değil. Bir algoritma sevemez, inanamaz,
          ümit edemez. Yapay zeka varolan insan çıktıları üzerinden çıkarım yapıyor, kopyalıyor,
          harmanlıyor. Ama hiçbir şeyi yoktan var etmiyor. Çünkü var etmek ona ait değil.
        </p>

        <p>
          Bu gerçeklik kritik bir soruyu gündeme getiriyor: Kariyerinizi nereye sürüklemek
          istiyorsunuz? Makinenin taklit edemeyeceği tarafta mı, yoksa kolayca kopyalayabileceği
          tarafta mı?
        </p>

        <p>
          Zira 5-6 kişiyle 2-3 yılda ortaya çıkarılabilecek ürünleri, yakın zamanda tek bir
          agent-skill-spec kombinasyonuyla herkes çözebilir hale gelecek. Ama anlam katmak, niyet
          taşımak, sorumluluk almak hâlâ insana ait kalacak.
        </p>

        <h2>Asıl Mesele: Probleme Bağlanmak</h2>

        <p>
          Çözülmesi gereken en büyük şey, problemin kendisine bağlanıp problem çözmeyi
          sürdürebilmek. Heyecan geçici, bağlılık kalıcı. İlk haftanın motivasyonu herkeste var.
          Üçüncü yılın sessiz sabrı ise nadir.
        </p>

        <p>
          Üzerinde 5-6 majör sürüm geçmiş projelerde görev aldım. Her sürümde farklı zorluklar,
          farklı kararlar, farklı ödünler. Hâlâ aktif desteklediğim legacy projeler var. Kod eski,
          ama çözdüğü problem hâlâ gerçek. Kullanıcılar hâlâ faydalanıyor.
        </p>

        <p>
          Yeni bir framework çıktığında eski projeler değersizleşmiyor. React çıktı diye jQuery
          projeleri anlamsızlaşmadı. Yapay zeka çıktı diye elle yazılmış sistemler çöp olmadı.
          Değer, teknolojiyle değil çözülen problemle ölçülür.
        </p>

        <p>
          Bir projeyle yıllar geçirmek, o alanın ustası olmak demek. Her edge case'i bilmek. Her
          kullanıcı şikayetinin arkasındaki gerçek sorunu görmek. Bu derinlik, hiçbir yapay zeka
          eğitim verisinde yok. Çünkü bu, yaşanarak kazanılıyor.
        </p>

        <p>
          Peki bu derinliği nerede kazanacaksınız? Bu yükselen trend, tekrar eden ve insana değer
          katmayan işleri ortadan kaldıracak. Geriye uzun soluklu, gerçek problemler kalacak. Eğer
          şu an böyle bir problem üzerinde çalışmıyorsanız veya yapmaya değer bir fikriniz yoksa,
          durup düşünmenin tam zamanı.
        </p>

        <p>
          Tarım, hayvancılık, sağlık, eğitim, eğlence, giyim. Bu alanlarda hâlâ çözülmemiş ciddi
          problemler var. Ailenizden veya çevrenizden bu disiplinlerde yol katetmiş insanlarla
          konuşun. Onların günlük sıkıntılarını dinleyin. Belki babanız çiftçi, belki teyzeniz
          öğretmen, belki komşunuz terzi. Bir SaaS veya operasyonel süreci kolaylaştıracak bir
          çözüm, size hem anlam hem de yön kazandırır.
        </p>

        <h2>Startup Mezarlıklarından Öğrenmek</h2>

        <p>
          Startup mezarlıkları diye siteler var. Binlerce "öldü" damgası yemiş girişim. Peki neden
          öldüler?
        </p>

        <p>
          <strong>Ürün-Pazar Uyumsuzluğu.</strong> En büyük katil bu. Kimsenin istemediği bir şeyi
          mükemmel şekilde inşa etmek. Kendi kafasındaki problemi çözmek, pazardaki problemi değil.
          "Bence bu lazım" ile "insanlar bunun için para verir" arasındaki uçurum, mezarlığın en
          kalabalık bölümü.
        </p>

        <p>
          <strong>Zamanlama.</strong> Çok erken olanlar öncü oldu, çok geç kalanlar takipçi bile
          olamadı. Webvan 1999'da online market teslimatı yaptı, battı. Aynı fikir 2020'de
          pandemiyle patladı. Fikir aynı, zamanlama farklı.
        </p>

        <p>
          <strong>Nakit Yanılsaması.</strong> Yatırım almak başarı değil, sorumluluk. Parayı büyüme
          metriklerine gömmek, birkaç çeyrek sonra "runway bitti" demek. Gelir modeli olmayan
          büyüme, ertelenmiş ölüm.
        </p>

        <p>
          <strong>Kurucu Yorgunluğu.</strong> Herkes lansmandan bahseder, kimse 3. yılın
          sessizliğinden bahsetmez. O sessizlikte pes edenler mezarlığın sessiz sakinleri.
        </p>

        <p>
          <strong>Ölçeklenememe.</strong> Tek kişiyle dönen operasyon. Kurucu gidince şirket gider.
          Sistem yok, süreç yok, sadece kahramanlık var. Kahramanlık ölçeklenmez.
        </p>

        <p>
          <strong>"Biz Farklıyız" Sendromu.</strong> Aynı hatayı yapıp farklı sonuç beklemek. Önceki
          50 girişim neden battı diye sormamak. Onların görmediğini gördüğüne inanmak. Bazen doğru,
          çoğunlukla kibir.
        </p>

        <p>
          Herkesin milyon dolarlık fikirleri var. Asıl mesele biraz dirsek çürütmek, daha önce
          yapılmamış fedakarlıkları yapabilmek, biraz olsun farklı düşünebilmek. Bunu yapanlar
          zaten kopartıp gidiyor.
        </p>

        <p>
          Türkiye'nin e-ticaret geçmişinde onlarca firma varken, son birkaç yılda akla gelen tek
          bir firma kaldı. Adını söylemeden bildiniz. İşte bu, kronikleri görüp çözen, sosyal
          inovasyon katan nitelikli üründür.
        </p>

        <h2>Yapay Zeka Çağında Doğru Konumlanmak</h2>

        <p>
          Konumlanma meselesi aslında bir kimlik meselesi. "Ben kod yazarım" diyorsanız, tehlike
          büyük. "Ben problem çözerim" diyorsanız, oyun yeni başlıyor.
        </p>

        <p>
          <strong>Koddan Sisteme.</strong> Artık satır satır kod yazmak değil, sistemleri tasarlamak
          ön planda. Hangi parçalar birbiriyle konuşacak? Veri nasıl akacak? Hata durumunda ne
          olacak? Bu soruları sormak ve cevaplayabilmek, yapay zekanın henüz giremediği derinlik.
        </p>

        <p>
          <strong>Domain Bilgisi: Asıl Silah.</strong> Sağlık sektörünü bilen bir yazılımcı ile
          sadece kod bilen yazılımcı arasındaki fark açılıyor. Tarımı anlayan, lojistiği bilen,
          eğitimin dinamiklerini kavramış yazılımcılar için yapay zeka bir çarpan. Diğerleri için
          bir rakip.
        </p>

        <p>
          <strong>Bağlamı Okumak.</strong> Müşteri "hızlı olsun" dediğinde neyi kastettiğini anlamak.
          Kullanıcının söylediği ile istediği arasındaki farkı görmek. Satır aralarını okumak.
          Yapay zeka veriyi işler, insan niyeti çözer.
        </p>

        <p>
          <strong>Belirsizlikte Karar Almak.</strong> Eksik bilgiyle hareket etmek. "Şu an elimizde
          bu var, ne yaparız?" sorusuna cevap vermek. Risk almak ve sonuçlarına katlanmak. Makine
          olasılık hesaplar, insan karar alır ve sahiplenir.
        </p>

        <p>
          <strong>Sistem Düşüncesi.</strong> Bir değişikliğin üç adım sonrasını görmek. "Bu özelliği
          eklersek şurada ne kırılır?" diye sormak. Kelebek etkisini hesaba katmak. Parçayı değil
          bütünü görmek.
        </p>

        <p>
          <strong>İletişim ve Köprü Olmak.</strong> Teknik ekip ile iş birimi arasında tercümanlık.
          Karmaşık kavramları sade anlatmak. Farklı disiplinleri bir araya getirmek. Yapay zeka
          araç olabilir ama köprü olamaz.
        </p>

        <p>
          <strong>Etik Pusula.</strong> "Yapabilir miyiz?" sorusu kolaylaşıyor. "Yapmalı mıyız?"
          sorusu zorlaşıyor. Veri mahremiyeti, algoritmik adalet, otomasyon etiği. Bu kararları
          vermek insana düşüyor.
        </p>

        <p>
          <strong>Öğrenmeyi Öğrenmek.</strong> Bugünün aracı yarın eskimiş olacak. Belirli bir
          framework'e değil, öğrenme yetisine yatırım yapmak. Adaptasyon kapasitesi en değerli
          sermaye.
        </p>

        <h2>Peki Pratikte Ne Yapmalı?</h2>

        <p>
          Bir domain seç ve derinleş. Yazılım artık tek başına yeterli değil. İş süreçlerini anla.
          Kod yazmadan önce işin kendisini öğren. İnsanlarla çalışmayı öğren. Teknik mükemmellik tek
          başına anlamsız. Belirsizlikle barış. Her şeyin tanımlı olmadığı projelere gir.
          Tükenmeden çalışmayı öğren. Bu bir maraton, sprint değil.
        </p>

        <p>
          Yapay zeka dönemi, kod yazmayı kolaylaştırırken düşünmeyi zorlaştırıyor. Herkes üretebilir
          hale gelince, neyin üretilmeye değer olduğunu bilmek asıl ayrışma noktası oluyor.
        </p>

        <h2>Middleware Olarak İnsan</h2>

        <p>
          Yeryüzünün tüm makine güçleri bir araya gelse, insan katmanının hâlâ bizim gibi onları
          daha net gözlemleyebilen bir <em>middleware</em> katmanına ihtiyacı olacak.
        </p>

        <p>Biz o katmanız.</p>
      </>
    ),
  },
  'essiz-yaraticinin-izniyle': {
    title: 'eşsiz yaratıcının izniyle',
    date: '29 Oca 2026',
    readTime: '4 dk',
    tags: ['tefekkür'],
    content: (
      <>
        <p><em>esselamu aleykum, selam olsun okuyana, düşünene, arayışta olana.</em></p>

        <p>
          Her şey yaşandı ve bitti. Yerin altına götürebileceklerimizi ve kimsenin götüremediklerini,
          çok geç olmadan anlayalım. Hiçbir şeyi boşa harcayacak lüksümüz yok.
        </p>

        <blockquote>
          <p>
            "Hayat üç bölümdür: dünyayı değiştireceğini sandığın, dünyanın değişmeyeceğine inandığın
            ve dünyanın seni değiştirdiğine emin olduğun."
          </p>
        </blockquote>

        <p>
          2003'te ilk blog yazımı yazdığımda ne tecrübem vardı ne fikrim. Hayat çok hızlı akıp gidiyor.
          Göz açıp kapayıncaya kadar her şey değişiyor. 2010 yılına 2040'tan daha uzaktayız.
        </p>

        <h2>Dikkat</h2>

        <p>
          Telefonumu minimal yaptım. Bildirimleri kapattım, renkli ikonları sildim. Sadece metin,
          renksiz, ikonsuz bir launcher kurdum. En çok ilgimi çeken: günün ilerleyişini yüzde olarak
          göstermesi. Sabah 6'da günün %30'u bitmiş. Öğlen %50. Farklı bir düşünce eşiği açıyor.
        </p>

        <p>
          Altered Carbon'da dendiği gibi: bir insan ömrü tüm bunlar için yeterli değil. Hedeflerimi,
          projelerimi, planlarımı yazmaya başladığımda bile yoruluyorum.
        </p>

        <h2>Telaş Çağı</h2>

        <p>
          Modern dünyanın sunduğu telaştan hepimiz nasibimizi alıyoruz. Sahteliğin içinde boğuluyoruz.
          Asıl gayemizi, yaratılış esprimizi unutuyoruz.
        </p>

        <p style={{ fontStyle: 'italic', textAlign: 'center', margin: '32px 0' }}>
          Akıl edip düşünmez misiniz?
        </p>

        <p>
          Bizleri düşünmekten alıkoyan, tek tip giydiren, toplumları hipnoz eden siyaset ve spor.
          Sürekli kaydırttıran, dikkat süresini saniyelere indiren, sorgusuzca tükettiren algoritmalar.
          Düşünce yapımızı nasıl ele geçirdiklerini hiç düşündünüz mü?
        </p>

        <h2>Umut</h2>

        <p>
          İçimde umudunu yeşerttiğim fidanlar var. Bazıları geceleri olgunlaşıyor, bazıları günün ilk
          ışıklarıyla. Bazıları sürekli ilgi bekliyor, bazıları sükûn halinde.
        </p>

        <p style={{ fontStyle: 'italic', textAlign: 'center', margin: '32px 0' }}>
          Toptan sarılalım yüce Kuran'a.
        </p>

        <p>
          Sadece cesetimiz arıza vermiyor. Ruhumuz da veriyor. Peki ruhumuzun şifası nerede?
          Bizi her an kabul eden, hiç cevapsız bırakmayan, huzuruna kabul eden eşsiz yaratıcıdan
          başka yerde değil.
        </p>

        <h2>Reçete</h2>

        <p>
          Kariyerimiz için İngilizce'ye sarıldığımız gibi, kulluk kariyerimiz için de reçete basit:
          Allah'a, Efendimiz aleyhisselatu vesselama ve Kuran'a toptan sarılmak.
        </p>

        <p>
          Telaş çağının dışında kalan düşüncelerimi bir araya getirmek, bazen dertleşmek, bazen
          sadece susmak için burada olacağım.
        </p>

        <p><em>wa akhiru dawana enilhamdulillahi rabbil alamin.</em></p>
      </>
    ),
  },
  'sessizligin-basladigi-yer': {
    title: 'sessizliğin başladığı yer',
    date: '23 Oca 2026',
    readTime: '3 dk',
    tags: ['tefekkür'],
    content: (
      <>
        <p>
          Uzun zamandır ertelediğim bir projeyi nihayet hayata geçiriyorum. Bu site, düşüncelerimi
          bir araya getireceğim, bazen sessizce duracağım kişisel alanım.
        </p>

        <h2>Tefekkür Alanı</h2>
        <p>
          Yazılım geliştirirken, bir problemi çözerken, kod yazarken aslında sürekli düşünüyoruz.
          Ama bu düşünceler uçup gidiyor. Burada onları yakalayıp bir yere koymak istiyorum.
          Hem kendim için hem de belki bir gün birilerinin işine yarar diye.
        </p>

        <h2>Dijital Emanet</h2>
        <p>
          Sosyal medyada paylaştıklarımız akıp gidiyor. Bugün var, yarın yok. Burada yazdıklarım
          kalıcı olsun istiyorum. Bir emanet gibi. Belki yıllar sonra çocuklarım okur, belki bir
          yabancı bir şeyler bulur.
        </p>

        <h2>İman ve Zanaat</h2>
        <p>
          "A humble student of the Greatest Engineer" diyorum kendime. Önce kul, sonra mühendis.
          Kod yazmak da bir tefekkür biçimi olabilir. Her satırda bir niyet, her projede bir gayret.
        </p>

        <h2>Sadelik</h2>
        <p>
          E-Ink bir ekrana girmiş gibi hissetmeni istedim. Gözü yormayan, dikkat dağıtmayan,
          keşfettikçe açılan bir yer. Her şeyi herkese göstermeye gerek yok. Merak eden tıklar, bakar.
        </p>

        <h2>Kendi Alanım</h2>
        <p>
          Algoritmaların ne göreceğime karar vermediği, beğeni sayılarının önemli olmadığı,
          kendi kurallarımla içerik ürettiğim bir köşe. Burada sessizlik de bir içerik.
        </p>

        <p>
          Hoş geldin.
        </p>
      </>
    ),
  },
}

export function BlogPost() {
  const { slug } = useParams()
  const post = posts[slug || '']

  if (!post) {
    return (
      <div>
        <h1>Yazı bulunamadı</h1>
        <p>
          <Link to="/blog">← Tüm yazılara dön</Link>
        </p>
      </div>
    )
  }

  return (
    <article>
      <header className="article-header">
        <div className="article-tag">{post.tags[0]}</div>
        <div className="article-meta">
          <span>{post.date}</span>
          <span className="separator">·</span>
          <span>{post.readTime} okuma</span>
        </div>
        <h1 className="article-title">{post.title}</h1>
      </header>

      <div className="article-content">
        {post.content}
      </div>

      <footer className="article-footer">
        <Link to="/blog" className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Tüm yazılar
        </Link>
      </footer>
    </article>
  )
}
