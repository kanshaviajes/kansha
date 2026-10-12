
import { Link } from "react-router-dom";
import CurrencyConverter from "./CurrencyConverter";
import "./Footer.css";

// =========================================
// CONFIGURACIÓN
// =========================================

const WHATSAPP = "59891846311";

// Usar el logo claro sobre el fondo verde
const LOGO_CLARO = "/logo-claro.png";

// =========================================
// COMPONENTE FOOTER
// =========================================

function Footer() {
  const mensajeWhatsApp =
    "¡Hola, Florencia! Me gustaría recibir información para planificar un viaje con Kansha.";

  const enlaceWhatsApp =
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
      mensajeWhatsApp
    )}`;

  return (
    <footer className="footer">
      <div className="container">

        <div className="footer-grid">

          {/* =====================================
              IDENTIDAD KANSHA
          ===================================== */}

          <div className="footer-brand">

            <Link
              to="/"
              className="footer-logo"
              aria-label="Ir al inicio de Kansha Viajes"
            >
              <img
                src={LOGO_CLARO}
                alt="Kansha Viajes"
              />
            </Link>

            <p className="footer-brand-description">
              Creamos experiencias de viaje únicas,
              cuidando cada detalle para que disfrutes
              cada momento de tu aventura.
            </p>

            <div className="footer-location">
              <i
                className="bi bi-geo-alt-fill"
                aria-hidden="true"
              ></i>

              <span>Uruguay</span>
            </div>

          </div>

          {/* =====================================
              NAVEGACIÓN
          ===================================== */}

          <nav
            className="footer-navigation"
            aria-label="Navegación del pie de página"
          >
            <h3>Explorá Kansha</h3>

            <Link to="/">
              Inicio
            </Link>

            <Link to="/viajes">
              Descubrir viajes
            </Link>

            <Link to="/testimonios">
              Experiencias de viajeros
            </Link>
          </nav>

          {/* =====================================
              CONTACTO
          ===================================== */}

          <div className="footer-contact">

            <h3>Hablemos de tu viaje</h3>

            <p>
              ¿Tenés un destino en mente?
              Estamos para ayudarte a planificarlo.
            </p>

            <a
              href={enlaceWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-whatsapp"
              aria-label="Consultar por WhatsApp a Kansha Viajes"
            >
              <i
                className="bi bi-whatsapp"
                aria-hidden="true"
              ></i>

              <span>Escribinos por WhatsApp</span>

              <span aria-hidden="true">
                ↗
              </span>
            </a>

            <span className="footer-phone">
              +598 91 846 311
            </span>

            <img
              src="/mapauy.png"
              alt="Mapa de Uruguay"
              className="footer-mapa"
              loading="lazy"
            />

          </div>

          {/* =====================================
              CONVERSOR DE MONEDAS
          ===================================== */}

          <div className="footer-converter">

            <h3>Conversor de monedas</h3>

            <p>
              Consultá valores de referencia
              para organizar tu presupuesto.
            </p>

            <div className="footer-converter-wrapper">
              <CurrencyConverter />
            </div>

          </div>

        </div>

        {/* =====================================
            PIE INFERIOR
        ===================================== */}

        <div className="footer-bottom">

          <p>
            © {new Date().getFullYear()} Kansha Viajes.
            Todos los derechos reservados.
          </p>

          <div className="footer-social">

            {/* Pendiente agregar los enlaces
                oficiales de Instagram y Facebook */}

            <Link
              to="/login"
              className="admin-link"
              aria-label="Acceso administrativo"
              title="Administración"
            >
              <i
                className="bi bi-gear-fill"
                aria-hidden="true"
              ></i>
            </Link>

          </div>

        </div>

      </div>
    </footer>
  );
}

export default Footer;
