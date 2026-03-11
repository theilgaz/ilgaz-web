import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

interface Tool {
  id: string
  title: string
  icon: string
  link: string
  description: string
  category: string
}

const categoryLabels: Record<string, string> = {
  verimlilik: 'verimlilik',
  gelistirici: 'geliştirici',
  tasarim: 'tasarım',
  ilham: 'ilham',
}

const tools: Tool[] = [
  {
    id: 'day-progress',
    title: 'Günün Akışı',
    icon: '☀️',
    link: '/progress',
    description: 'Günün ilerleyişini takip et',
    category: 'verimlilik',
  },
  {
    id: 'time',
    title: 'Zaman',
    icon: '⏳',
    link: '/time',
    description: 'Dakikadan yıla, zamanın neresindeyiz',
    category: 'verimlilik',
  },
  {
    id: 'pomodoro',
    title: 'Pomodoro',
    icon: '🍅',
    link: '/pomodoro',
    description: 'Odaklan, mola ver, tekrarla',
    category: 'verimlilik',
  },
  {
    id: 'text-formatter',
    title: 'Formatter',
    icon: '{ }',
    link: '/text-formatter',
    description: 'JSON, XML, YAML, SQL biçimlendirici',
    category: 'gelistirici',
  },
  {
    id: 'base64',
    title: 'Base64',
    icon: '🔤',
    link: '/base64',
    description: 'Metni encode ve decode et',
    category: 'gelistirici',
  },
  {
    id: 'color-palette',
    title: 'Renk Paleti',
    icon: '🎨',
    link: '/color-palette',
    description: 'Uyumlu renk paletleri oluştur',
    category: 'tasarim',
  },
  {
    id: 'color-shades',
    title: 'Tonlar',
    icon: '🌈',
    link: '/color-shades',
    description: 'Bir rengin açık ve koyu tonlarını keşfet',
    category: 'tasarim',
  },
  {
    id: 'gradient-generator',
    title: 'Gradyan',
    icon: '🎭',
    link: '/gradient',
    description: 'CSS gradyan oluşturucu',
    category: 'tasarim',
  },
  {
    id: 'pixel-art',
    title: 'Pixel Art',
    icon: '🖼️',
    link: '/pixel-art',
    description: 'Piksel piksel çiz',
    category: 'tasarim',
  },
  {
    id: 'nasa-apod',
    title: 'NASA',
    icon: '🔭',
    link: '/nasa-apod',
    description: 'Günün astronomi fotoğrafı',
    category: 'ilham',
  },
  {
    id: 'failure-lesson',
    title: 'Dersler',
    icon: '💡',
    link: '/failure-lessons',
    description: 'Başarısızlıklardan çıkan dersler',
    category: 'ilham',
  },
]

export function Tools() {
  useDocumentTitle('araçlar')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const counts: Record<string, number> = {}
    tools.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count]) => ({ cat, count }))
  }, [])

  const filtered = useMemo(() => {
    let result = tools

    if (selectedCategory) {
      result = result.filter(t => t.category === selectedCategory)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      )
    }

    return result
  }, [search, selectedCategory])

  const isFiltering = selectedCategory !== null || search.trim().length > 0

  const stats = useMemo(() => {
    const total = tools.length
    const categoryCount = new Set(tools.map(t => t.category)).size
    const biggest = categories[0]
    return {
      total,
      categoryCount,
      biggestName: categoryLabels[biggest.cat] || biggest.cat,
      biggestCount: biggest.count,
    }
  }, [categories])

  function clearFilters() {
    setSelectedCategory(null)
    setSearch('')
  }

  return (
    <div className="tools-page">
      <div className="tools-header">
        <h1>Araçlar</h1>
        <p className="tools-lead">Günlük iş akışını hızlandıran küçük araçlar.</p>
      </div>

      <div className="tools-search">
        <svg className="tools-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="tools-search-input"
          placeholder="araç veya açıklama ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="tools-search-clear" onClick={() => setSearch('')}>
            ×
          </button>
        )}
      </div>

      <div className="tools-stats">
        <div className="tools-stat-card">
          <span className="tools-stat-value">{stats.total}</span>
          <span className="tools-stat-label">araç</span>
        </div>
        <div className="tools-stat-card">
          <span className="tools-stat-value">{stats.categoryCount}</span>
          <span className="tools-stat-label">kategori</span>
        </div>
        <div className="tools-stat-card">
          <span className="tools-stat-value">{stats.biggestCount}</span>
          <span className="tools-stat-label">{stats.biggestName}</span>
        </div>
      </div>

      <div className="tools-filter-chips">
        <button
          className={`tools-filter-chip ${selectedCategory === null ? 'active' : ''}`}
          onClick={clearFilters}
        >
          tümü ({tools.length})
        </button>
        {categories.map(({ cat, count }) => (
          <button
            key={cat}
            className={`tools-filter-chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
          >
            {categoryLabels[cat] || cat} ({count})
          </button>
        ))}
      </div>

      {isFiltering && (
        <div className="tools-results-info">
          <span>{filtered.length} sonuç</span>
          <button className="tools-results-clear" onClick={clearFilters}>temizle</button>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="tools-empty">Aramanızla eşleşen araç bulunamadı.</p>
      ) : (
        <div className="tools-grid">
          {filtered.map((tool, i) => (
            <Link
              key={tool.id}
              to={tool.link}
              className="tool-card"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className="tool-card-icon">{tool.icon}</span>
              <div className="tool-card-body">
                <span className="tool-card-title">{tool.title}</span>
                <span className="tool-card-desc">{tool.description}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
