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
