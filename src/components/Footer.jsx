import { Link } from "react-router-dom";
import CurrencyConverter from "./CurrencyConverter"; // Asegúrate que esté en la misma carpeta
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-logo">
            <img src="/logo.png" alt="Kansha Viajes" />
          </div>

          <div className="footer-center">
            <a href="https://wa.me/598091846311" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-whatsapp"></i> +598 091 846 311
            </a>
            <img src="/mapauy.png" alt="Mapa Uruguay" className="footer-mapa" style={{ width: "190px" }} />
            <p><strong>Uruguay</strong></p>
          </div>

          {/* AQUÍ LO AGREGAMOS DIRECTAMENTE */}
          <div className="footer-converter-wrapper">
             <CurrencyConverter />
          </div>

          <div className="footer-social">
            <a href="#"><i className="bi bi-facebook"></i></a>
            <a href="#"><i className="bi bi-instagram"></i></a>
            <Link to="/login" className="admin-link"><i className="bi bi-gear-fill"></i></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;