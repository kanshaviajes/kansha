
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase";
import * as bootstrap from "bootstrap";

import "./Navbar.css";

function Navbar() {
  const [destinos, setDestinos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const esHome = location.pathname === "/";
  const transparente = esHome && !scrolled;

  // =========================================
  // DESTINOS
  // =========================================

  useEffect(() => {
    let activo = true;

    async function fetchDestinos() {
      const { data, error } = await supabase
        .from("destinos")
        .select("id, nombre")
        .eq("activo", true)
        .order("nombre", { ascending: true });

      if (error) {
        console.error("Error cargando destinos:", error);
        return;
      }

      if (activo) {
        setDestinos(data || []);
      }
    }

    fetchDestinos();

    return () => {
      activo = false;
    };
  }, []);

  // =========================================
  // AUTENTICACIÓN
  // =========================================

  useEffect(() => {
    let activo = true;

    async function obtenerSesion() {
      const { data } = await supabase.auth.getSession();

      if (activo) {
        setUsuario(data.session?.user || null);
      }
    }

    obtenerSesion();

    const { data: listener } =
      supabase.auth.onAuthStateChange((_event, session) => {
        if (activo) {
          setUsuario(session?.user || null);
        }
      });

    return () => {
      activo = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // =========================================
  // SCROLL
  // =========================================

  useEffect(() => {
    function controlarScroll() {
      setScrolled(window.scrollY > 35);
    }

    controlarScroll();

    window.addEventListener("scroll", controlarScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", controlarScroll);
    };
  }, [location.pathname]);

  // =========================================
  // CERRAR SESIÓN
  // =========================================

  async function cerrarSesion() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error cerrando sesión:", error);
      return;
    }

    setUsuario(null);
  }

  // =========================================
  // NAVEGAR DESDE EL MODAL
  // =========================================

  function handleNavigate(id) {
    const modalElement = document.getElementById("destinosModal");

    const modal = modalElement
      ? bootstrap.Modal.getInstance(modalElement)
      : null;

    if (!modalElement || !modal) {
      navigate(`/destino/${id}`);
      return;
    }

    modalElement.addEventListener(
      "hidden.bs.modal",
      () => navigate(`/destino/${id}`),
      { once: true }
    );

    modal.hide();
  }

  useEffect(() => {
    const modalElement = document.getElementById("destinosModal");

    if (!modalElement) return;

    bootstrap.Modal.getInstance(modalElement)?.hide();
  }, [location.pathname]);

  return (
    <>
      <nav
        className={`navbar custom-navbar ${
          transparente
            ? "custom-navbar--transparent"
            : "custom-navbar--solid"
        } ${esHome ? "custom-navbar--home" : ""}`}
        aria-label="Navegación principal"
      >
        <div className="custom-navbar__container">

          {/* IZQUIERDA: LOGO */}

          <div className="custom-navbar__left">
            <Link
              className="navbar-brand custom-navbar__brand"
              to="/"
              aria-label="Kansha Viajes - Inicio"
            >
              <img
                src={
                  transparente
                    ? "/logo-claro.png"
                    : "/logo-oscuro.png"
                }
                alt="Kansha Viajes"
                className="navbar-logo"
              />
            </Link>
          </div>

          {/* CENTRO: DESTINOS */}

          <div className="custom-navbar__center">
            <button
              type="button"
              className="navbar-destinos"
              data-bs-toggle="modal"
              data-bs-target="#destinosModal"
            >
              <i className="bi bi-compass" aria-hidden="true" />
              <span>Destinos</span>
            </button>
          </div>

          {/* DERECHA: USUARIO */}

          <div className="custom-navbar__right">
            {usuario && (
              <div className="navbar-user">
                <span className="navbar-user__greeting">
                  Hola 👋{" "}
                  {usuario.user_metadata?.nombre || usuario.email}
                </span>

                <button
                  type="button"
                  className="navbar-logout"
                  onClick={cerrarSesion}
                >
                  Salir
                </button>
              </div>
            )}
          </div>

        </div>
      </nav>

      {/* =========================================
          MODAL DE DESTINOS
      ========================================= */}

      <div
        className="modal fade kansha-destinos-modal"
        id="destinosModal"
        tabIndex="-1"
        aria-labelledby="destinosModalTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <span className="kansha-modal-eyebrow">
                  KANSHA VIAJES
                </span>

                <h5
                  className="modal-title"
                  id="destinosModalTitle"
                >
                  Nuestros destinos
                </h5>
              </div>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              />
            </div>

            <div className="modal-body">
              {destinos.length === 0 ? (
                <p className="text-muted mb-0">
                  No hay destinos disponibles.
                </p>
              ) : (
                <div className="list-group list-group-flush">
                  {destinos.map((destino) => (
                    <button
                      key={destino.id}
                      type="button"
                      className="list-group-item list-group-item-action kansha-destino-option"
                      onClick={() => handleNavigate(destino.id)}
                    >
                      <i
                        className="bi bi-geo-alt"
                        aria-hidden="true"
                      />

                      <span>{destino.nombre}</span>

                      <i
                        className="bi bi-arrow-up-right"
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
