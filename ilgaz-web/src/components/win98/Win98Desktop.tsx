import { useState, useCallback, useEffect } from 'react'
import { Window } from './Window'
import { Taskbar } from './Taskbar'
import { StartMenu } from './StartMenu'
import { DesktopIcon } from './DesktopIcon'
import { posts } from '../../content/posts'
import { projects } from '../../content/projects'

// Page components — each window renders its own
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

const INITIAL_WINDOWS: WindowState[] = [
  {
    id: 'welcome',
    title: 'ilg.az — Hoş Geldin',
    minimized: false,
    zIndex: 10,
    x: 180,
    y: 40,
    width: 520,
    route: '/',
  },
]

// Route → component mapping
function RouteContent({ route, onOpenWindow }: {
  route: string
  onOpenWindow: (id: string, title: string, route: string, x?: number, y?: number, width?: number) => void
}) {
  // Blog post detail
  const blogMatch = route.match(/^\/blog\/(.+)$/)
  if (blogMatch) return <BlogPost slug={blogMatch[1]} />

  // Project detail
  const projectMatch = route.match(/^\/projects\/(.+)$/)
  if (projectMatch) return <ProjectDetail slug={projectMatch[1]} />

  // Collection detail
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
    default: return <WelcomeContent onOpenWindow={onOpenWindow} />
  }
}

export function Win98Desktop() {
  const [windows, setWindows] = useState<WindowState[]>(INITIAL_WINDOWS)
  const [nextZ, setNextZ] = useState(11)
  const [startOpen, setStartOpen] = useState(false)
  const [bsod, setBsod] = useState(false)

  // BSOD easter egg
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && (e.key === 'Delete' || e.key === 'Backspace')) {
        e.preventDefault()
        setBsod(true)
        setTimeout(() => setBsod(false), 4000)
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
  }, [])

  const openWindow = useCallback((id: string, title: string, route: string, x?: number, y?: number, width?: number) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id)
      if (existing) {
        return prev.map(w => w.id === id ? { ...w, minimized: false, zIndex: nextZ } : w)
      }
      return [...prev, {
        id,
        title,
        minimized: false,
        zIndex: nextZ,
        x: x ?? 120 + prev.length * 30,
        y: y ?? 50 + prev.length * 25,
        width: width ?? 500,
        route,
      }]
    })
    setNextZ(z => z + 1)
  }, [nextZ])

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
    { label: 'Hakkında.txt', icon: '📄', action: () => openWindow('about', 'Hakkında.txt — Notepad', '/about', 160, 60) },
    { label: 'Yazılar', icon: '📁', action: () => openWindow('blog', 'Yazılar', '/blog', 200, 50) },
    { label: 'Projeler', icon: '📂', action: () => openWindow('projects', 'Projeler', '/projects', 220, 70, 460) },
    { label: 'Araçlar', icon: '🔧', action: () => openWindow('tools', 'Araçlar', '/tools', 240, 80) },
    { label: 'Geri Dönüşüm', icon: '🗑️', action: () => {} },
  ]

  const startItems = [
    { label: 'Ana Sayfa', icon: '🏠', onClick: () => openWindow('welcome', 'ilg.az — Hoş Geldin', '/', 180, 40, 520) },
    { label: 'Yazılar', icon: '📝', onClick: () => openWindow('blog', 'Yazılar', '/blog', 200, 50) },
    { label: 'Projeler', icon: '📂', onClick: () => openWindow('projects', 'Projeler', '/projects', 220, 70, 460) },
    { label: 'Araçlar', icon: '🔧', onClick: () => openWindow('tools', 'Araçlar', '/tools', 240, 80) },
    { label: 'Hakkında', icon: '📄', onClick: () => openWindow('about', 'Hakkında.txt — Notepad', '/about', 160, 60) },
    { divider: true, label: 'Tema Değiştir', icon: '🎨', onClick: () => {
      document.documentElement.setAttribute('data-theme', 'editorial')
      localStorage.setItem('ilgaz-theme', 'editorial')
      window.location.reload()
    }},
  ]

  if (bsod) {
    return (
      <div className="w98-bsod">
        <div className="w98-bsod-content">
          <div className="w98-bsod-title">ilg.az</div>
          <p>Beklenmeyen bir hata oluştu. İşlemleriniz kaydedildi.</p>
          <p>*  Herhangi bir tuşa basarak devam edin.</p>
          <p>*  Veya sayfayı yenilemek için CTRL+ALT+DEL tuşlarına tekrar basın.</p>
          <p style={{ marginTop: 24 }}>Hata: 0x000000ED UNMOUNTABLE_BOOT_VOLUME</p>
          <button onClick={() => setBsod(false)} className="w98-bsod-dismiss">
            Devam etmek için bir tuşa basın...
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w98-desktop">
      {/* Desktop Icons */}
      <div className="w98-desktop-icons">
        {desktopIcons.map(icon => (
          <DesktopIcon
            key={icon.label}
            label={icon.label}
            icon={icon.icon}
            onDoubleClick={icon.action}
          />
        ))}
      </div>

      {/* Windows — each renders its OWN content */}
      {windows.map(win => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          initialX={win.x}
          initialY={win.y}
          width={win.width}
          zIndex={win.zIndex}
          minimized={win.minimized}
          menuBar={win.id === 'welcome' ? ['Dosya', 'Düzen', 'Görünüm', 'Yardım'] : undefined}
          onClose={win.id === 'welcome' ? undefined : () => closeWindow(win.id)}
          onMinimize={() => minimizeWindow(win.id)}
          onFocus={() => focusWindow(win.id)}
          onLinkClick={(href) => {
            const slug = href.split('/').pop() || ''
            const title = slug.replace(/-/g, ' ')
            openWindow(
              `link-${href}`,
              title,
              href,
              150 + Math.random() * 80,
              40 + Math.random() * 60,
              540
            )
          }}
        >
          <RouteContent route={win.route} onOpenWindow={openWindow} />
        </Window>
      ))}

      {/* Start Menu */}
      {startOpen && (
        <StartMenu
          items={startItems}
          onClose={() => setStartOpen(false)}
        />
      )}

      {/* Taskbar */}
      <Taskbar
        windows={windows.map(w => ({ id: w.id, title: w.title, minimized: w.minimized }))}
        onWindowClick={handleTaskbarClick}
        onStartClick={() => setStartOpen(!startOpen)}
        startOpen={startOpen}
      />
    </div>
  )
}

function WelcomeContent({ onOpenWindow }: { onOpenWindow: (id: string, title: string, route: string, x?: number, y?: number, width?: number) => void }) {
  const recentPosts = posts.slice(0, 4)
  const recentProjects = projects.slice(0, 3)

  return (
    <div className="w98-welcome">
      <div className="w98-welcome-banner">
        ★ ILG.AZ'A HOŞ GELDİN ★
      </div>
      <div className="w98-welcome-grid">
        <div className="w98-welcome-photo">
          <img src="/photo.jpg" alt="Abdullah Ilgaz" />
        </div>
        <div className="w98-welcome-text">
          <p>Merhaba. Ben Abdullah Ilgaz.</p>
          <p>Küçük deneyleri, yavaş okumaları ve var olmasını dilediğim yazılımları belgeleyen bir mühendis ve yazar.</p>
          <div className="w98-welcome-buttons">
            <button className="w98-button" onClick={() => onOpenWindow('blog', 'Yazılar', '/blog', 200, 50)}>
              Yazılar →
            </button>
            <button className="w98-button" onClick={() => onOpenWindow('projects', 'Projeler', '/projects', 220, 70, 460)}>
              Projeler →
            </button>
          </div>
        </div>
      </div>

      <div className="w98-welcome-section">
        <div className="w98-section-title">Son Yazılar</div>
        {recentPosts.map(post => (
          <div
            key={post.meta.slug}
            className="w98-file-entry"
            onClick={() => onOpenWindow(
              `post-${post.meta.slug}`,
              `${post.meta.title} — Notepad`,
              `/blog/${post.meta.slug}`,
              150 + Math.random() * 80,
              40 + Math.random() * 60,
              540
            )}
          >
            <span className="w98-file-icon">📄</span>
            <span className="w98-file-name">{post.meta.title}</span>
            <span className="w98-file-meta">{post.meta.date}</span>
          </div>
        ))}
      </div>

      <div className="w98-welcome-section">
        <div className="w98-section-title">Projeler</div>
        {recentProjects.map(project => (
          <div
            key={project.meta.slug}
            className="w98-file-entry"
            onClick={() => onOpenWindow(
              `project-${project.meta.slug}`,
              project.meta.name,
              `/projects/${project.meta.slug}`,
              170 + Math.random() * 60,
              50 + Math.random() * 50,
              500
            )}
          >
            <span className="w98-file-icon">📁</span>
            <span className="w98-file-name">{project.meta.name}</span>
            <span className="w98-file-meta">{project.meta.description}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
