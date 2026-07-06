import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase";
import * as bootstrap from "bootstrap";
import "./Navbar.css";

function Navbar() {
  const [destinos, setDestinos] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function fetchDestinos() {
      const { data } = await supabase.from("destinos").select("id, nombre");
      setDestinos(data || []);
    }
    fetchDestinos();
  }, []);

  // Red de seguridad al cambiar de ruta
  useEffect(() => {
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "0px";
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) backdrop.remove();
  }, [location]);

  const handleNavigate = (id) => {
    const modalElement = document.getElementById("destinosModal");
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();

    // Delay para asegurar que la animación del modal termine antes de limpiar el DOM
    setTimeout(() => {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) backdrop.remove();
      
      navigate(`/destino/${id}`);
    }, 300);
  };

  return (
    <><nav className="navbar navbar-expand-lg custom-navbar">
      
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src="/logo.png" alt="Logo" className="navbar-logo" />
          </Link>
          <button 
            className="btn btn-primary rounded-pill px-4" 
            data-bs-toggle="modal" 
            data-bs-target="#destinosModal"
          >
            <i className="bi bi-compass me-2"></i> Destinos
          </button>
        </div>
      </nav>

      <div className="modal fade" id="destinosModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content rounded-4 border-0 shadow-lg">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">Nuestros Destinos</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="list-group list-group-flush">
                {destinos.map((d) => (
                  <button 
                    key={d.id} 
                    type="button"
                    onClick={() => handleNavigate(d.id)}
                    className="list-group-item list-group-item-action py-3 d-flex align-items-center"
                  >
                    <i className="bi bi-geo-alt-fill text-primary me-3"></i>
                    <span className="fw-medium">{d.nombre}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;