import { useState, useEffect, useCallback, useRef } from 'react'

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

// Route label map for breadcrumb display
const routeLabels: Record<string, string> = {
  '/about': 'hakkinda.txt',
  '/blog': 'yazilar/',
  '/projects': 'projeler/',
  '/tools': 'araclar/',
  '/collections': 'koleksiyonlar/',
  '/pomodoro': 'araclar/pomodoro',
  '/text-formatter': 'araclar/text-formatter',
  '/base64': 'araclar/base64',
  '/color-palette': 'araclar/color-palette',
  '/color-shades': 'araclar/color-shades',
  '/gradient': 'araclar/gradient',
  '/pixel-art': 'araclar/pixel-art',
  '/nasa-apod': 'araclar/nasa-apod',
  '/failure-lessons': 'araclar/failure-lessons',
  '/progress': 'progress/',
}

function RouteContent({ route }: { route: string }) {
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
    default: return null
  }
}

function getRouteLabel(route: string): string {
  if (routeLabels[route]) return routeLabels[route]
  if (route.startsWith('/blog/')) return `yazilar/${route.split('/').pop()}`
  if (route.startsWith('/projects/')) return `projeler/${route.split('/').pop()}`
  if (route.startsWith('/collections/')) return `koleksiyonlar/${route.split('/').pop()}`
  return route.slice(1)
}

export function TerminalDesktop() {
  const [currentRoute, setCurrentRoute] = useState('/')
  const [, setKonamiBuffer] = useState<string[]>([])
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

  const navigate = useCallback((route: string) => {
    setCurrentRoute(route)
  }, [])

  // Scroll to top when route changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [currentRoute])

  // Keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input/textarea
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      if (e.key === 'Escape') {
        e.preventDefault()
        setCurrentRoute('/')
        return
      }

      // Number keys on home page
      if (currentRoute === '/') {
        if (e.key === '6') {
          e.preventDefault()
          document.documentElement.setAttribute('data-theme', 'editorial')
          localStorage.setItem('ilgaz-theme', 'editorial')
          window.location.reload()
          return
        }
        const keyMap: Record<string, string> = {
          '1': '/about',
          '2': '/blog',
          '3': '/projects',
          '4': '/tools',
          '5': '/collections',
        }
        if (keyMap[e.key]) {
          e.preventDefault()
          setCurrentRoute(keyMap[e.key])
          return
        }
      }

      // Konami code detection
      setKonamiBuffer(prev => {
        const next = [...prev, e.key].slice(-10)
        if (next.length === 10 && next.every((k, i) => k === KONAMI[i])) {
          setShowEasterEgg(true)
          setTimeout(() => setShowEasterEgg(false), 3000)
          return []
        }
        return next
      })
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [currentRoute])

  // Intercept internal link clicks inside terminal content
  const handleContentClick = (e: React.MouseEvent) => {
    const target = (e.target as HTMLElement).closest('a')
    if (target) {
      const href = target.getAttribute('href')
      if (href && href.startsWith('/')) {
        e.preventDefault()
        setCurrentRoute(href)
      }
    }
  }

  const isHome = currentRoute === '/'

  return (
    <div className="term-desktop">
      <div className="term-crt" ref={scrollRef}>
        {/* Easter egg overlay */}
        {showEasterEgg && (
          <div className="term-easter-egg">
            <p>$ sudo rm -rf /</p>
            <p>Password: ********</p>
            <p>rm: çok tehlikeli bir operasyon. şaka yapıyorum, sakin ol.</p>
          </div>
        )}

        {isHome ? (
          <div className="term-home">
            <div className="term-ascii">
{`╔══════════════════════════════════════════╗
║   I L G . A Z                            ║
║   ─────────                              ║
║   kişisel köşe                            ║
╚══════════════════════════════════════════╝`}
            </div>

            <div className="term-block">
              <span className="term-prompt">&gt; whoami</span>
              <p className="term-output">  Abdullah Ilgaz. Mühendis ve yazar.</p>
            </div>

            <div className="term-block">
              <span className="term-prompt">&gt; ls ./</span>
              <div className="term-menu">
                <div className="term-menu-item" onClick={() => navigate('/about')}>
                  <span className="term-menu-key">[1]</span> hakkinda.txt
                </div>
                <div className="term-menu-item" onClick={() => navigate('/blog')}>
                  <span className="term-menu-key">[2]</span> yazilar/
                </div>
                <div className="term-menu-item" onClick={() => navigate('/projects')}>
                  <span className="term-menu-key">[3]</span> projeler/
                </div>
                <div className="term-menu-item" onClick={() => navigate('/tools')}>
                  <span className="term-menu-key">[4]</span> araclar/
                </div>
                <div className="term-menu-item" onClick={() => navigate('/collections')}>
                  <span className="term-menu-key">[5]</span> koleksiyonlar/
                </div>
                <div className="term-menu-item" onClick={() => {
                  document.documentElement.setAttribute('data-theme', 'editorial')
                  localStorage.setItem('ilgaz-theme', 'editorial')
                  window.location.reload()
                }}>
                  <span className="term-menu-key">[6]</span> :theme <span className="term-hint-inline">-- tema degistir</span>
                </div>
              </div>
            </div>

            <div className="term-hint">
              Sayi tuslariyla gezin · ESC = ana sayfa
            </div>

            <div className="term-block">
              <span className="term-prompt">&gt; <span className="term-cursor">█</span></span>
            </div>
          </div>
        ) : (
          <div className="term-page">
            <div className="term-nav">
              <span
                className="term-nav-back"
                onClick={() => setCurrentRoute('/')}
              >
                ← ESC · ana sayfa
              </span>
              <span className="term-nav-path">{getRouteLabel(currentRoute)}</span>
            </div>

            <div className="term-block">
              <span className="term-prompt">&gt; cd {getRouteLabel(currentRoute)}</span>
            </div>

            <div className="term-content" onClick={handleContentClick}>
              <RouteContent route={currentRoute} />
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="term-statusbar">
        <span>ILG.AZ · 80×24 · UTF-8</span>
        <span>MEM: 640K · DISK: OK</span>
        <span>LN 1 · COL 1</span>
      </div>
    </div>
  )
}
