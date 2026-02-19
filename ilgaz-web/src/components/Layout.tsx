import { Outlet, NavLink, Link } from 'react-router-dom'

export function Layout() {
  return (
    <>
      <header className="header">
        <div className="container">
          <nav>
            <Link to="/" className="logo">ilg.az</Link>
            <div className="nav-links">
              <NavLink to="/blog" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                yazılar
              </NavLink>
              <NavLink to="/projects" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                projeler
              </NavLink>
              <NavLink to="/now" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                şu an
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                hakkımda
              </NavLink>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content footer-centered">
            <span className="footer-arabic" title="Allah'tan başka galip yoktur">لا غالب إلا الله</span>
          </div>
        </div>
      </footer>
    </>
  )
}
