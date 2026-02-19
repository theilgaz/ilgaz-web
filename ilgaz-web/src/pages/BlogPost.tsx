import { Link, useParams } from 'react-router-dom'

const posts: Record<string, {
  title: string
  date: string
  readTime: string
  tags: string[]
  content: React.ReactNode
}> = {
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
