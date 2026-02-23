import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

interface Tool {
  id: string
  title: string
  icon: string
  link: string
  gradient: string
}

const tools: Tool[] = [
  {
    id: 'day-progress',
    title: 'Günün Akışı',
    icon: '☀️',
    link: '/progress',
    gradient: 'linear-gradient(145deg, #ffb347 0%, #ffcc33 100%)',
  },
  {
    id: 'pomodoro',
    title: 'Pomodoro',
    icon: '🍅',
    link: '/pomodoro',
    gradient: 'linear-gradient(145deg, #ff6b6b 0%, #ee5a5a 100%)',
  },
  {
    id: 'json-formatter',
    title: 'JSON',
    icon: '{ }',
    link: '/json-formatter',
    gradient: 'linear-gradient(145deg, #4ade80 0%, #22c55e 100%)',
  },
  {
    id: 'base64',
    title: 'Base64',
    icon: '🔤',
    link: '/base64',
    gradient: 'linear-gradient(145deg, #38bdf8 0%, #0ea5e9 100%)',
  },
  {
    id: 'color-palette',
    title: 'Renk Paleti',
    icon: '🎨',
    link: '/color-palette',
    gradient: 'linear-gradient(145deg, #c084fc 0%, #a855f7 100%)',
  },
  {
    id: 'color-shades',
    title: 'Tonlar',
    icon: '🌈',
    link: '/color-shades',
    gradient: 'linear-gradient(145deg, #f472b6 0%, #ec4899 100%)',
  },
  {
    id: 'gradient-generator',
    title: 'Gradyan',
    icon: '🎭',
    link: '/gradient',
    gradient: 'linear-gradient(145deg, #fb923c 0%, #f97316 100%)',
  },
  {
    id: 'pixel-art',
    title: 'Pixel Art',
    icon: '🖼️',
    link: '/pixel-art',
    gradient: 'linear-gradient(145deg, #818cf8 0%, #6366f1 100%)',
  },
  {
    id: 'nasa-apod',
    title: 'NASA',
    icon: '🔭',
    link: '/nasa-apod',
    gradient: 'linear-gradient(145deg, #1e3a5f 0%, #0f172a 100%)',
  },
  {
    id: 'failure-lesson',
    title: 'Dersler',
    icon: '💡',
    link: '/failure-lessons',
    gradient: 'linear-gradient(145deg, #fbbf24 0%, #f59e0b 100%)',
  },
]

function AppIcon({ tool, index }: { tool: Tool; index: number }) {
  return (
    <Link
      to={tool.link}
      className="launchpad-item"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="launchpad-icon" style={{ background: tool.gradient }}>
        <span>{tool.icon}</span>
      </div>
      <span className="launchpad-title">{tool.title}</span>
    </Link>
  )
}

export function Tools() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return tools
    const q = search.toLowerCase()
    return tools.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div className="launchpad">
      <div className="launchpad-bg" />

      <div className="launchpad-content">
        <div className="spotlight">
          <svg className="spotlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="spotlight-input"
            placeholder="Ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
          {search && (
            <button className="spotlight-clear" onClick={() => setSearch('')}>
              ×
            </button>
          )}
        </div>

        <div className="launchpad-grid">
          {filtered.map((tool, i) => (
            <AppIcon key={tool.id} tool={tool} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="launchpad-empty">Sonuç bulunamadı</p>
        )}

        <div className="launchpad-dots">
          <span className="launchpad-dot active" />
          <span className="launchpad-dot" />
        </div>
      </div>
    </div>
  )
}
