import { Link } from 'react-router-dom'

export function Projects() {
  const projects = [
    { name: 'Seyyar 42', slug: 'seyyar-42', description: 'Göçer ruha, sabit güç' },
  ]

  return (
    <>
      <h1>Projeler</h1>
      <p className="lead">
        Üzerinde çalıştığım şeyler.
      </p>

      <ul className="project-list">
        {projects.map((project) => (
          <li key={project.name} className="project-item">
            {project.slug ? (
              <Link to={`/projects/${project.slug}`} className="project-item-link">
                <span className="project-item-name">{project.name}</span>
                <span className="project-item-desc">{project.description}</span>
              </Link>
            ) : (
              <>
                <span className="project-item-name">{project.name}</span>
                <span className="project-item-desc">{project.description}</span>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}
