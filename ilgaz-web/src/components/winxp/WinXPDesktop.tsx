import { useState, useCallback, useEffect, useRef } from 'react'
import { posts } from '../../content/posts'
import { projects } from '../../content/projects'

// Page components
import { About } from '../../pages/About'
import { Blog } from '../../pages/Blog'
import { BlogPost } from '../../pages/BlogPost'
import { Projects } from '../../pages/Projects'
import { ProjectDetail } from '../../pages/ProjectDetail'
import { Tools } from '../../pages/Tools'
import { Pomodoro } from '../../pages/Pomodoro'
import { TextFormatterPage } from '../../pages/TextFormatterPage'
import { Base64Page } from '../../pages/Base64Page'
import { ColorPalettePage } from '../../pages/ColorPalettePage'
import { ColorShadesPage } from '../../pages/ColorShadesPage'
import { GradientGeneratorPage } from '../../pages/GradientGeneratorPage'
import { PixelArtPage } from '../../pages/PixelArtPage'
import { NasaApodPage } from '../../pages/NasaApodPage'
import { FailureLessonsPage } from '../../pages/FailureLessonsPage'
import { Progress } from '../../pages/Progress'
import { Collections } from '../../pages/Collections'
import { CollectionDetail } from '../../pages/CollectionDetail'

/* ─── Types ─── */
interface WindowState {
  id: string
  title: string
  minimized: boolean
  zIndex: number
  x: number
  y: number
  width: number
  route: string
}

/* ─── Route → Component mapping ─── */
function RouteContent({ route, onNavigate }: {
  route: string
  onNavigate: (id: string, title: string, route: string, x?: number, y?: number, width?: number) => void
}) {
  const blogMatch = route.match(/^\/blog\/(.+)$/)
  if (blogMatch) return <BlogPost slug={blogMatch[1]} />

  const projectMatch = route.match(/^\/projects\/(.+)$/)
  if (projectMatch) return <ProjectDetail slug={projectMatch[1]} />

  const collectionMatch = route.match(/^\/collections\/(.+)$/)
  if (collectionMatch) return <CollectionDetail slug={collectionMatch[1]} />

  switch (route) {
    case '/about': return <About />
    case '/blog': return <Blog />
    case '/projects': return <Projects />
    case '/tools': return <Tools />
    case '/pomodoro': return <Pomodoro />
    case '/text-formatter': return <TextFormatterPage />
    case '/base64': return <Base64Page />
    case '/color-palette': return <ColorPalettePage />
    case '/color-shades': return <ColorShadesPage />
    case '/gradient': return <GradientGeneratorPage />
    case '/pixel-art': return <PixelArtPage />
    case '/nasa-apod': return <NasaApodPage />
    case '/failure-lessons': return <FailureLessonsPage />
    case '/progress': return <Progress />
    case '/collections': return <Collections />
    default: return <WelcomeContent onNavigate={onNavigate} />
  }
}

/* ─── Clock ─── */
function Clock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(
        `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      )
    }
    update()
    const interval = setInterval(update, 10000)
    return () => clearInterval(interval)
  }, [])

  return <span>{time}</span>
}

/* ─── Route to display URL ─── */
function routeToUrl(route: string): string {
  if (route === '/') return 'http://ilg.az/'
  return `http://ilg.az${route}`
}

/* ─── IE6 Window ─── */
function IEWindow({
  id,
  title,
  initialX,
  initialY,
  width: winWidth,
  zIndex,
  minimized,
  route,
  onClose,
  onMinimize,
  onFocus,
  onNavigateBack,
  onNavigateForward,
  onNavigateHome,
  onInternalNavigate,
  children,
}: {
  id: string
  title: string
  initialX: number
  initialY: number
  width: number
  zIndex: number
  minimized: boolean
  route: string
  onClose?: () => void
  onMinimize: () => void
  onFocus: () => void
  onNavigateBack: () => void
  onNavigateForward: () => void
  onNavigateHome: () => void
  onInternalNavigate?: (windowId: string, route: string) => void
  children: React.ReactNode
}) {
  const [pos, setPos] = useState({ x: initialX, y: initialY })
  const [dragging, setDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const bodyRef = useRef<HTMLDivElement>(null)

  // Native capture-phase listener to intercept links before React Router
  useEffect(() => {
    const el = bodyRef.current
    if (!el || !onInternalNavigate) return
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (target) {
        const href = target.getAttribute('href')
        if (href && href.startsWith('/')) {
          e.preventDefault()
          e.stopPropagation()
          e.stopImmediatePropagation()
          onInternalNavigate(id, href)
        }
      }
    }
    el.addEventListener('click', handler, true) // true = capture phase
    return () => el.removeEventListener('click', handler, true)
  }, [id, onInternalNavigate])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.xp-btn')) return
    e.preventDefault()
    onFocus()
    dragOffset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    }
    setDragging(true)
  }, [pos, onFocus])

  useEffect(() => {
    if (!dragging) return
    const handleMove = (e: MouseEvent) => {
      setPos({
        x: e.clientX - dragOffset.current.x,
        y: Math.max(0, e.clientY - dragOffset.current.y),
      })
    }
    const handleUp = () => setDragging(false)
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [dragging])

  if (minimized) return null

  return (
    <div
      className="xp-window"
      data-window-id={id}
      style={{ left: pos.x, top: pos.y, width: winWidth, zIndex }}
      onMouseDown={() => onFocus()}
    >
      {/* Titlebar */}
      <div className="xp-titlebar" onMouseDown={handleMouseDown}>
        <span className="xp-titlebar-icon">🌐</span>
        <span className="xp-titlebar-text">{title} - Internet Explorer</span>
        <span className="xp-titlebar-btns">
          <button className="xp-btn xp-btn-min" onClick={onMinimize} title="Simge Durumuna Küçült">_</button>
          <button className="xp-btn xp-btn-max" title="Ekranı Kapla">□</button>
          {onClose && (
            <button className="xp-btn xp-btn-close" onClick={onClose} title="Kapat">×</button>
          )}
        </span>
      </div>

      {/* Menu bar */}
      <div className="xp-menubar">
        {['Dosya', 'Düzen', 'Görünüm', 'Sık Kullanılanlar', 'Araçlar', 'Yardım'].map(item => (
          <span key={item} className="xp-menu-item">{item}</span>
        ))}
      </div>

      {/* Toolbar with navigation + address bar */}
      <div className="xp-toolbar">
        <div className="xp-toolbar-buttons">
          <button className="xp-nav-btn" onClick={onNavigateBack} title="Geri">◀ Geri</button>
          <button className="xp-nav-btn" onClick={onNavigateForward} title="İleri">İleri ▶</button>
          <button className="xp-nav-btn" onClick={() => {}} title="Yenile">🔄</button>
          <button className="xp-nav-btn" onClick={onNavigateHome} title="Giriş">🏠</button>
        </div>
        <div className="xp-address-bar">
          <span className="xp-address-label">Adres</span>
          <div className="xp-address-input">
            <span className="xp-address-icon">📄</span>
            <span className="xp-address-text">{routeToUrl(route)}</span>
          </div>
          <button className="xp-address-go">Git</button>
        </div>
      </div>

      {/* Body */}
      <div className="xp-body" ref={bodyRef}>
        {children}
      </div>
    </div>
  )
}

/* ─── Initial state ─── */
const INITIAL_WINDOWS: WindowState[] = [
  {
    id: 'welcome',
    title: 'ilg.az',
    minimized: false,
    zIndex: 10,
    x: 140,
    y: 30,
    width: 580,
    route: '/',
  },
]

/* ─── Main Desktop ─── */
export function WinXPDesktop() {
  const [windows, setWindows] = useState<WindowState[]>(INITIAL_WINDOWS)
  const [nextZ, setNextZ] = useState(11)
  const [startOpen, setStartOpen] = useState(false)
  const [balloon, setBalloon] = useState(false)
  const [, setHistoryMap] = useState<Record<string, { stack: string[]; index: number }>>({
    welcome: { stack: ['/'], index: 0 },
  })

  // Balloon tip easter egg (replaces BSOD)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && (e.key === 'Delete' || e.key === 'Backspace')) {
        e.preventDefault()
        setBalloon(true)
        setTimeout(() => setBalloon(false), 5000)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const focusWindow = useCallback((id: string) => {
    setWindows(prev =>
      prev.map(w => w.id === id ? { ...w, zIndex: nextZ } : w)
    )
    setNextZ(z => z + 1)
  }, [nextZ])

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev =>
      prev.map(w => w.id === id ? { ...w, minimized: true } : w)
    )
  }, [])

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id))
    setHistoryMap(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const openWindow = useCallback((id: string, title: string, route: string, x?: number, y?: number, width?: number) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id)
      if (existing) {
        return prev.map(w => w.id === id ? { ...w, minimized: false, zIndex: nextZ, route } : w)
      }
      return [...prev, {
        id,
        title,
        minimized: false,
        zIndex: nextZ,
        x: x ?? 120 + prev.length * 30,
        y: y ?? 40 + prev.length * 25,
        width: width ?? 560,
        route,
      }]
    })
    setHistoryMap(prev => {
      const existing = prev[id]
      if (existing) {
        const newStack = [...existing.stack.slice(0, existing.index + 1), route]
        return { ...prev, [id]: { stack: newStack, index: newStack.length - 1 } }
      }
      return { ...prev, [id]: { stack: [route], index: 0 } }
    })
    setNextZ(z => z + 1)
  }, [nextZ])

  const navigateBack = useCallback((id: string) => {
    setHistoryMap(prev => {
      const h = prev[id]
      if (!h || h.index <= 0) return prev
      const newIndex = h.index - 1
      const newRoute = h.stack[newIndex]
      setWindows(ws => ws.map(w => w.id === id ? { ...w, route: newRoute } : w))
      return { ...prev, [id]: { ...h, index: newIndex } }
    })
  }, [])

  const navigateForward = useCallback((id: string) => {
    setHistoryMap(prev => {
      const h = prev[id]
      if (!h || h.index >= h.stack.length - 1) return prev
      const newIndex = h.index + 1
      const newRoute = h.stack[newIndex]
      setWindows(ws => ws.map(w => w.id === id ? { ...w, route: newRoute } : w))
      return { ...prev, [id]: { ...h, index: newIndex } }
    })
  }, [])

  const navigateHome = useCallback((id: string) => {
    openWindow(id, 'ilg.az', '/')
  }, [openWindow])

  const navigateInWindow = useCallback((windowId: string, route: string) => {
    // Navigate within the same window by updating its route
    setWindows(prev => prev.map(w => w.id === windowId ? { ...w, route } : w))
    setHistoryMap(prev => {
      const h = prev[windowId]
      if (h) {
        const newStack = [...h.stack.slice(0, h.index + 1), route]
        return { ...prev, [windowId]: { stack: newStack, index: newStack.length - 1 } }
      }
      return { ...prev, [windowId]: { stack: [route], index: 0 } }
    })
  }, [])

  const handleTaskbarClick = useCallback((id: string) => {
    setWindows(prev => {
      const w = prev.find(w => w.id === id)
      if (!w) return prev
      if (w.minimized) {
        return prev.map(w => w.id === id ? { ...w, minimized: false, zIndex: nextZ } : w)
      }
      return prev.map(w => w.id === id ? { ...w, minimized: true } : w)
    })
    setNextZ(z => z + 1)
  }, [nextZ])

  const desktopIcons = [
    { label: 'Bilgisayarım', icon: '🖥️', action: () => {} },
    { label: 'Belgelerim', icon: '📁', action: () => openWindow('blog', 'Yazılar', '/blog', 160, 50, 560) },
    { label: 'Geri Dönüşüm', icon: '🗑️', action: () => {} },
  ]

  const startItems = [
    { label: 'Ana Sayfa', icon: '🏠', onClick: () => openWindow('welcome', 'ilg.az', '/', 140, 30, 580) },
    { label: 'Yazılar', icon: '📝', onClick: () => openWindow('blog', 'Yazılar', '/blog', 160, 50, 560) },
    { label: 'Projeler', icon: '📂', onClick: () => openWindow('projects', 'Projeler', '/projects', 180, 60, 520) },
    { label: 'Araçlar', icon: '🔧', onClick: () => openWindow('tools', 'Araçlar', '/tools', 200, 70) },
    { label: 'Hakkında', icon: '📄', onClick: () => openWindow('about', 'Hakkında', '/about', 170, 55) },
    { divider: true, label: 'Tema Değiştir', icon: '🎨', onClick: () => {
      document.documentElement.setAttribute('data-theme', 'editorial')
      localStorage.setItem('ilgaz-theme', 'editorial')
      window.location.reload()
    }},
  ]

  return (
    <div className="xp-desktop">
      {/* Desktop Icons */}
      <div className="xp-desktop-icons">
        {desktopIcons.map(icon => (
          <button
            key={icon.label}
            className="xp-desktop-icon"
            onDoubleClick={icon.action}
          >
            <div className="xp-desktop-icon-img">{icon.icon}</div>
            <span className="xp-desktop-icon-label">{icon.label}</span>
          </button>
        ))}
      </div>

      {/* IE6 Windows */}
      {windows.map(win => (
        <IEWindow
          key={win.id}
          id={win.id}
          title={win.title}
          initialX={win.x}
          initialY={win.y}
          width={win.width}
          zIndex={win.zIndex}
          minimized={win.minimized}
          route={win.route}
          onClose={win.id === 'welcome' ? undefined : () => closeWindow(win.id)}
          onMinimize={() => minimizeWindow(win.id)}
          onFocus={() => focusWindow(win.id)}
          onNavigateBack={() => navigateBack(win.id)}
          onNavigateForward={() => navigateForward(win.id)}
          onNavigateHome={() => navigateHome(win.id)}
          onInternalNavigate={navigateInWindow}
        >
          <RouteContent route={win.route} onNavigate={openWindow} />
        </IEWindow>
      ))}

      {/* Start Menu */}
      {startOpen && (
        <>
          <div className="xp-start-overlay" onClick={() => setStartOpen(false)} />
          <div className="xp-start-menu">
            <div className="xp-start-header">
              <img src="/photo.jpg" alt="User" className="xp-start-avatar" />
              <span className="xp-start-username">Abdullah Ilgaz</span>
            </div>
            <div className="xp-start-body">
              <div className="xp-start-left">
                {startItems.map((item, i) => (
                  <div key={i}>
                    {item.divider && <div className="xp-start-divider" />}
                    <button
                      className="xp-start-item"
                      onClick={() => {
                        item.onClick()
                        setStartOpen(false)
                      }}
                    >
                      <span className="xp-start-item-icon">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="xp-start-footer">
              <button className="xp-start-footer-btn" onClick={() => {
                document.documentElement.setAttribute('data-theme', 'editorial')
                localStorage.setItem('ilgaz-theme', 'editorial')
                window.location.reload()
              }}>
                🔌 Kapat
              </button>
            </div>
          </div>
        </>
      )}

      {/* Balloon notification easter egg */}
      {balloon && (
        <div className="xp-balloon">
          <div className="xp-balloon-title">Windows Güvenlik Merkezi</div>
          <div className="xp-balloon-text">
            Bu bilgisayar güvende. ilg.az tarafindan korunmaktadir.
          </div>
          <button className="xp-balloon-close" onClick={() => setBalloon(false)}>×</button>
        </div>
      )}

      {/* Taskbar */}
      <div className="xp-taskbar">
        <button
          className={`xp-start-btn ${startOpen ? 'active' : ''}`}
          onClick={() => setStartOpen(!startOpen)}
        >
          <span className="xp-start-btn-icon">⊞</span>
          <span className="xp-start-btn-text">start</span>
        </button>

        <div className="xp-taskbar-items">
          {windows.map(w => (
            <button
              key={w.id}
              className={`xp-taskbar-item ${!w.minimized ? 'active' : ''}`}
              onClick={() => handleTaskbarClick(w.id)}
            >
              <span className="xp-taskbar-item-icon">🌐</span>
              {w.title.length > 24 ? w.title.slice(0, 24) + '...' : w.title}
            </button>
          ))}
        </div>

        <div className="xp-tray">
          <span className="xp-tray-icon" title="Ses">🔊</span>
          <span className="xp-tray-icon" title="Ağ">🌐</span>
          <span className="xp-tray-clock"><Clock /></span>
        </div>
      </div>
    </div>
  )
}

/* ─── Welcome Content (homepage inside IE window) ─── */
function WelcomeContent({ onNavigate }: {
  onNavigate: (id: string, title: string, route: string, x?: number, y?: number, width?: number) => void
}) {
  const recentPosts = posts.slice(0, 4)
  const recentProjects = projects.slice(0, 3)

  return (
    <div className="xp-welcome">
      <div className="xp-welcome-header">
        <h1>Hoş Geldin</h1>
        <p className="xp-welcome-subtitle">ilg.az — kişisel web sayfası</p>
      </div>

      <div className="xp-welcome-grid">
        <div className="xp-welcome-photo">
          <img src="/photo.jpg" alt="Abdullah Ilgaz" />
        </div>
        <div className="xp-welcome-text">
          <p>Merhaba. Ben <strong>Abdullah Ilgaz</strong>.</p>
          <p>Küçük deneyleri, yavaş okumaları ve var olmasını dilediğim yazılımları belgeleyen bir mühendis ve yazar.</p>
          <div className="xp-welcome-links">
            <button className="xp-link-btn" onClick={() => onNavigate('blog', 'Yazılar', '/blog', 160, 50, 560)}>
              📝 Yazılar
            </button>
            <button className="xp-link-btn" onClick={() => onNavigate('projects', 'Projeler', '/projects', 180, 60, 520)}>
              📂 Projeler
            </button>
            <button className="xp-link-btn" onClick={() => onNavigate('about', 'Hakkında', '/about', 170, 55)}>
              📄 Hakkında
            </button>
          </div>
        </div>
      </div>

      <div className="xp-welcome-section">
        <h2>Son Yazılar</h2>
        {recentPosts.map(post => (
          <div
            key={post.meta.slug}
            className="xp-file-entry"
            onClick={() => onNavigate(
              `post-${post.meta.slug}`,
              post.meta.title,
              `/blog/${post.meta.slug}`,
              130 + Math.random() * 80,
              30 + Math.random() * 60,
              580
            )}
          >
            <span className="xp-file-icon">📄</span>
            <span className="xp-file-name">{post.meta.title}</span>
            <span className="xp-file-meta">{post.meta.date}</span>
          </div>
        ))}
      </div>

      <div className="xp-welcome-section">
        <h2>Projeler</h2>
        {recentProjects.map(project => (
          <div
            key={project.meta.slug}
            className="xp-file-entry"
            onClick={() => onNavigate(
              `project-${project.meta.slug}`,
              project.meta.name,
              `/projects/${project.meta.slug}`,
              150 + Math.random() * 60,
              40 + Math.random() * 50,
              540
            )}
          >
            <span className="xp-file-icon">📁</span>
            <span className="xp-file-name">{project.meta.name}</span>
            <span className="xp-file-meta">{project.meta.description}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
