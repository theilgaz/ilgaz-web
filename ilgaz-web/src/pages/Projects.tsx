import { Link } from 'react-router-dom'
import { projects } from '../content/projects'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function Projects() {
  useDocumentTitle('projeler')
  return (
    <>
      <h1>Projeler</h1>
      <p className="lead">
        Üzerinde çalıştığım şeyler.
      </p>

      <div className="project-featured">
        <span className="project-featured-label">öne çıkan</span>
        <a href="https://mahfuz.ilg.az" target="_blank" rel="noopener noreferrer" className="project-featured-card">
          <span className="project-featured-name">mahfuz</span>
          <span className="project-featured-desc">Kur'an ezber takibi</span>
          <span className="project-featured-link">mahfuz.ilg.az →</span>
        </a>
      </div>

      <ul className="project-list">
        {projects.map((project) => (
          <li key={project.meta.slug} className="project-item">
            <Link to={`/projects/${project.meta.slug}`} className="project-item-link">
              <span className="project-item-name">{project.meta.name}</span>
              <span className="project-item-desc">{project.meta.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
