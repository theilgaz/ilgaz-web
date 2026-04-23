import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

interface Tool {
  id: string
  title: string
  link: string
  description: string
  category: string
}

const categoryLabels: Record<string, string> = {
  verimlilik: 'Verimlilik',
  gelistirici: 'Geliştirici',
  tasarim: 'Tasarım',
  ilham: 'İlham',
}

const tools: Tool[] = [
  { id: 'day-progress', title: 'Günün Akışı', link: '/progress', description: 'Günün ilerleyişini takip et', category: 'verimlilik' },
  { id: 'pomodoro', title: 'Pomodoro', link: '/pomodoro', description: 'Odaklan, mola ver, tekrarla', category: 'verimlilik' },
  { id: 'text-formatter', title: 'Formatter', link: '/text-formatter', description: 'JSON, XML, YAML, SQL biçimlendirici', category: 'gelistirici' },
  { id: 'antivibe', title: 'Antivibeürüs', link: '/antivibe', description: 'AI çıktısındaki em dash ve fazla boşluk virüslerini temizle', category: 'gelistirici' },
  { id: 'base64', title: 'Base64', link: '/base64', description: 'Metni encode ve decode et', category: 'gelistirici' },
  { id: 'color-palette', title: 'Renk Paleti', link: '/color-palette', description: 'Uyumlu renk paletleri oluştur', category: 'tasarim' },
  { id: 'color-shades', title: 'Tonlar', link: '/color-shades', description: 'Bir rengin açık ve koyu tonlarını keşfet', category: 'tasarim' },
  { id: 'gradient-generator', title: 'Gradyan', link: '/gradient', description: 'CSS gradyan oluşturucu', category: 'tasarim' },
  { id: 'color-converter', title: 'Renk Dönüştürücü', link: '/color-converter', description: 'HEX, RGB, HSL, OKLCH arası dönüşüm', category: 'tasarim' },
  { id: 'pixel-art', title: 'Pixel Art', link: '/pixel-art', description: 'Piksel piksel çiz', category: 'tasarim' },
  { id: 'nasa-apod', title: 'NASA', link: '/nasa-apod', description: 'Günün astronomi fotoğrafı', category: 'ilham' },
  { id: 'failure-lesson', title: 'Dersler', link: '/failure-lessons', description: 'Başarısızlıklardan çıkan dersler', category: 'ilham' },
]

export function Tools() {
  useDocumentTitle('araçlar')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const seen = new Set<string>()
    return tools.reduce<{ cat: string; count: number }[]>((acc, t) => {
      if (!seen.has(t.category)) {
        seen.add(t.category)
        acc.push({ cat: t.category, count: tools.filter(x => x.category === t.category).length })
      }
      return acc
    }, [])
  }, [])

  const filtered = selectedCategory ? tools.filter(t => t.category === selectedCategory) : tools

  // Group by category
  const grouped = useMemo(() => {
    const cats = selectedCategory ? [selectedCategory] : categories.map(c => c.cat)
    return cats.map(cat => ({
      cat,
      label: categoryLabels[cat] || cat,
      tools: filtered.filter(t => t.category === cat),
    })).filter(g => g.tools.length > 0)
  }, [filtered, selectedCategory, categories])

  return (
    <div className="tools-editorial">
      <div className="section-head">
        <div className="idx">§ Araçlar</div>
        <div>
          <h2>Küçük <em>araçlar</em>.</h2>
          <div className="sub">Günlük iş akışını hızlandıran {tools.length} araç, {categories.length} kategori.</div>
        </div>
      </div>

      <div className="tools-chips">
        <button
          className={`tools-chip ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          Tümü
        </button>
        {categories.map(({ cat }) => (
          <button
            key={cat}
            className={`tools-chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {grouped.map(group => (
        <div key={group.cat} className="tools-group">
          <div className="tools-group-head">
            <span className="tools-group-label">{group.label}</span>
            <span className="tools-group-count">{group.tools.length}</span>
          </div>
          <div className="tools-list">
            {group.tools.map((tool, i) => (
              <Link
                key={tool.id}
                to={tool.link}
                className="tools-entry stagger-in"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="tools-entry-title">{tool.title}</div>
                <div className="tools-entry-desc">{tool.description}</div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
