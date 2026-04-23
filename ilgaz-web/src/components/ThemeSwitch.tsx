import { useState, useEffect, useRef } from 'react'

const themes = [
  {
    id: 'editorial',
    name: 'Editorial',
    desc: 'Warm paper, serif, hand-made',
    default: true,
    colors: ['#f6f2e9', '#a23a26', '#1a1714'],
  },
  {
    id: 'win98',
    name: 'Windows 98',
    desc: 'Teal, gray chrome, nostalgia',
    colors: ['#008080', '#c0c0c0', '#000080'],
    disabled: true,
  },
  {
    id: 'winxp',
    name: 'Windows XP',
    desc: 'Bliss wallpaper, Luna blue',
    colors: ['#0a1628', '#3a93ff', '#7bb563'],
    disabled: true,
  },
  {
    id: 'terminal',
    name: 'Terminal',
    desc: 'Phosphor green, keyboard-first',
    colors: ['#000', '#33ff33', '#000'],
    disabled: true,
  },
  {
    id: 'geocities',
    name: 'GeoCities',
    desc: 'Marquees, WordArt, chaos',
    colors: ['#000080', '#ffff00', '#ff00ff'],
    disabled: true,
  },
]

export function ThemeSwitch() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('editorial')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('ilgaz-theme')
    if (saved) setActive(saved)
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  function selectTheme(id: string) {
    setActive(id)
    localStorage.setItem('ilgaz-theme', id)
    document.documentElement.setAttribute('data-theme', id)
  }

  const current = themes.find(t => t.id === active)

  return (
    <div className="theme-switch" ref={ref}>
      <button className="ts-trigger" onClick={() => setOpen(!open)}>
        <span className="ts-swatch" />
        <span>{current?.name}</span>
        <span style={{ opacity: 0.5 }}>▾</span>
      </button>
      {open && (
        <div className="ts-panel">
          <h5 className="ts-heading">Appearance</h5>
          {themes.map(t => (
            <div
              key={t.id}
              className={`ts-opt ${t.id === active ? 'active' : ''} ${t.disabled ? 'disabled' : ''}`}
              onClick={() => !t.disabled && selectTheme(t.id)}
            >
              <div className="ts-preview">
                {t.colors.map((c, i) => (
                  <span key={i} style={{ background: c, flex: i === 0 ? 1 : i === 1 ? '0 0 6px' : '0 0 10px' }} />
                ))}
              </div>
              <div>
                <div className="ts-name">
                  {t.name}
                  {t.default && <em> (default)</em>}
                  {t.disabled && <span className="ts-soon">soon</span>}
                </div>
                <div className="ts-desc">{t.desc}</div>
              </div>
              {t.id === active && <span className="ts-check">✓</span>}
            </div>
          ))}
          <div className="ts-foot">Your choice is remembered. Switch anytime.</div>
        </div>
      )}
    </div>
  )
}
