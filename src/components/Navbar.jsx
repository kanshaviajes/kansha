import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
 
  const destinos = [
    {
      id: 1,
      nombre: "Búzios",
      slug: "buzios",
    },
    {
      id: 2,
      nombre: "Natal",
      slug: "natal",
    },
    {
      id: 3,
      nombre: "Río de Janeiro",
      slug: "rio-de-janeiro",
    },
    {
      id: 4,
      nombre: "Mendoza",
      slug: "mendoza",
    },
  ];

  return (
    <nav className="navbar navbar-expand-lg custom-navbar sticky-top">
      <div className="container">

        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img
            src="/logo.png"
            alt="Proyecto Kansha"
            className="navbar-logo"
          />
        </Link>

        {/* Botón Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarKansha"
          aria-controls="navbarKansha"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú */}
        <div className="collapse navbar-collapse" id="navbarKansha">
          <ul className="navbar-nav ms-auto align-items-lg-center">

            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-link" : ""}`
                }
              >
                Inicio
              </NavLink>
            </li>

            <li className="nav-item dropdown">
              <a
                href="/"
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={(e) => e.preventDefault()}
              >
                Destinos
              </a>

              <ul className="dropdown-menu dropdown-menu-end">

                {destinos.map((destino) => (
                  <li key={destino.id}>
                    <Link
                      className="dropdown-item"
                      to={`/destino/${destino.slug}`}
                    >
                      {destino.nombre}
                    </Link>
                  </li>
                ))}

              </ul>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;