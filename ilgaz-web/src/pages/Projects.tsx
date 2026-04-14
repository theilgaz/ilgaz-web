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

      <div className="projects-list-section">
        <div className="projects-grid-list">
          {projects.map((project, i) => (
            <Link
              key={project.meta.slug}
              to={`/projects/${project.meta.slug}`}
              className="project-card-enhanced stagger-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="project-card-body">
                <h3 className="project-card-name">
                  {project.meta.name}
                  {project.meta.award && <span className="project-card-award">🏆 {project.meta.award}</span>}
                </h3>
                <p className="project-card-desc">{project.meta.description}</p>
              </div>
              {project.meta.featured && <span className="project-card-star">★</span>}
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
