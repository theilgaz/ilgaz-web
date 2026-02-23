import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Blog } from './pages/Blog'
import { BlogPost } from './pages/BlogPost'
import { Now } from './pages/Now'
import { Projects } from './pages/Projects'
import { ProjectDetail } from './pages/ProjectDetail'
import { Collections } from './pages/Collections'
import { CollectionDetail } from './pages/CollectionDetail'
import { Progress } from './pages/Progress'
import { Tools } from './pages/Tools'
import { Pomodoro } from './pages/Pomodoro'
import { JsonFormatterPage } from './pages/JsonFormatterPage'
import { Base64Page } from './pages/Base64Page'
import { ColorPalettePage } from './pages/ColorPalettePage'
import { ColorShadesPage } from './pages/ColorShadesPage'
import { GradientGeneratorPage } from './pages/GradientGeneratorPage'
import { PixelArtPage } from './pages/PixelArtPage'
import { NasaApodPage } from './pages/NasaApodPage'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/now" element={<Now />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:slug" element={<CollectionDetail />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/json-formatter" element={<JsonFormatterPage />} />
          <Route path="/base64" element={<Base64Page />} />
          <Route path="/color-palette" element={<ColorPalettePage />} />
          <Route path="/color-shades" element={<ColorShadesPage />} />
          <Route path="/gradient" element={<GradientGeneratorPage />} />
          <Route path="/pixel-art" element={<PixelArtPage />} />
          <Route path="/nasa-apod" element={<NasaApodPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
