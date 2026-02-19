export function Projects() {
  const projects = [
    { name: 'Project A', description: 'yakında duyurulacak' },
    { name: 'Project B', description: 'yakında duyurulacak' },
    { name: 'Project C', description: 'yakında duyurulacak' },
    { name: 'Project D', description: 'yakında duyurulacak' },
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
            <span className="project-item-name">{project.name}</span>
            <span className="project-item-desc">{project.description}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
