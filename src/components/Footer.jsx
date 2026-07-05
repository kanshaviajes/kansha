import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="container">

        <div className="footer-grid">

          {/* Logo */}
          <div className="footer-logo">
            <img
              src="/logo.png"
              alt="Kansha Viajes"
            />
          </div>

          {/* Centro */}
          <div className="footer-center">

            <a
              href="https://wa.me/59800000000"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-whatsapp"></i>
              +598 00 000 000
            </a>

            <p>Uruguay 🇺🇾</p>

          </div>

          {/* Redes + Admin */}
          <div className="footer-social">

            <a href="#">
              <i className="bi bi-facebook"></i>
            </a>

            <a href="#">
              <i className="bi bi-instagram"></i>
            </a>

            {/* LOGIN ADMIN */}
            <Link
              to="/login"
              className="admin-link"
              title="Admin"
            >
              <i className="bi bi-gear-fill"></i>
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;