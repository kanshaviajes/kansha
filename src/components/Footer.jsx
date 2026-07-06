import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* Logo */}
          <div className="footer-logo">
            <img src="/logo.png" alt="Kansha Viajes" />
          </div>

          {/* Centro */}
          <div className="footer-center">
            <a
              href="https://wa.me/598091846311" // Corregí el link con el número correcto
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-whatsapp"></i>
              +598 091 846 311
            </a>
            
            
            {/* Imagen agregada */}
            <img 
              src="/mapauy.png" 
              alt="Mapa Uruguay" 
              className="footer-mapa"
              style={{ width: "190px", marginTop: "1px", opacity: "0.8" }} 
            />
            <p> <strong>Uruguay</strong></p>
          </div>
          

          {/* Redes + Admin */}
          <div className="footer-social">
            <a href="#">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#">
              <i className="bi bi-instagram"></i>
            </a>
            <Link to="/login" className="admin-link" title="Admin">
              <i className="bi bi-gear-fill"></i>
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;