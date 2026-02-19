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
import './styles/global.css'

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
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
