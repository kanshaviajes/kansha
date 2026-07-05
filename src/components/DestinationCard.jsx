import { Link } from "react-router-dom";

function DestinationCard({ imagen }) {
  const card = (
    <div className="destination-card">
      <img
        src={imagen.imagen_url}
        alt={imagen.alt || "Destino"}
        className="destination-image"
      />

      <div className="destination-overlay">
        <div className="destination-icon">
          <i className="bi bi-arrow-right"></i>
        </div>
      </div>
    </div>
  );

  if (!imagen.link) return card;

  if (imagen.link.startsWith("/")) {
    return (
      <Link to={imagen.link} className="destination-link">
        {card}
      </Link>
    );
  }

  return (
    <a
      href={imagen.link}
      target="_blank"
      rel="noopener noreferrer"
      className="destination-link"
    >
      {card}
    </a>
  );
}

export default DestinationCard;