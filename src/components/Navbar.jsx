import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import "./Navbar.css";

function Navbar() {
  const [destinos, setDestinos] = useState([]);

  useEffect(() => {
    async function fetchDestinos() {
      const { data } = await supabase.from("destinos").select("id, nombre");
      setDestinos(data || []);
    }
    fetchDestinos();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="/logo.png" alt="Logo" className="navbar-logo" />
        </Link>
        
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navContent">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                Destinos
              </a>
              <ul className="dropdown-menu shadow-lg rounded-4">
                {destinos.map((d) => (
                  <li key={d.id}>
                    <Link className="dropdown-item" to={`/${d.id}`}>
                      <span className="destino-nombre">{d.nombre}</span>
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