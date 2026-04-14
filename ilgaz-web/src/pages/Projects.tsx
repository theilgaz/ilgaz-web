import { Link } from 'react-router-dom'
import { projects } from '../content/projects'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function Projects() {
  useDocumentTitle('projeler')
  return (
    <>
      <header className="projects-header">
        <p className="projects-header-label">projeler</p>
        <h1 className="projects-header-title">İnşa ettiğim şeyler.</h1>
        <div className="projects-header-stats">
          <span>{projects.length} proje</span>
        </div>
      </header>

      <div className="project-featured stagger-in">
        <span className="project-featured-label">öne çıkan</span>
        <a href="https://mahfuz.ilg.az" target="_blank" rel="noopener noreferrer" className="project-featured-card">
          <div className="project-featured-content">
            <span className="project-featured-name">mahfuz</span>
            <span className="project-featured-desc">Islamic learning with authentic sources.</span>
          </div>
          <span className="project-featured-link">mahfuz.ilg.az →</span>
        </a>
      </div>

      <div className="projects-list-section">
        <div className="projects-list-header">
          <span className="projects-list-label">tüm projeler</span>
          <span className="projects-list-count">{projects.length}</span>
        </div>
        <div className="projects-grid-list">
          {projects.map((project, i) => (
            <Link
              key={project.meta.slug}
              to={`/projects/${project.meta.slug}`}
              className="project-card-enhanced stagger-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="project-card-body">
                <h3 className="project-card-name">{project.meta.name}</h3>
                <p className="project-card-desc">{project.meta.description}</p>
              </div>
              <div className="project-card-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
