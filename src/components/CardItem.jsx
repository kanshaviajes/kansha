
import { Link } from "react-router-dom";

function CardItem({ card }) {
  const tieneDestino =
    card.link !== null &&
    card.link !== undefined &&
    String(card.link).trim() !== "";

  const titulo = card.titulo || "Descubrí este destino";

  const contenido = (
    <article className="destination-card">
      <img
        src={card.imagen_url}
        alt={titulo}
        className="destination-image"
        loading="lazy"
      />

      <div className="destination-overlay">
        <div className="destination-content">
          <span className="destination-eyebrow">
            KANSHA VIAJES
          </span>

          <h3 className="destination-title">
            {titulo}
          </h3>

          {tieneDestino && (
            <span className="destination-button">
              Explorar destino
              <span aria-hidden="true"> ↗</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );

  if (!tieneDestino) {
    return (
      <div className="destination-link">
        {contenido}
      </div>
    );
  }

  return (
    <Link
      to={`/destino/${card.link}`}
      className="destination-link"
      aria-label={`Explorar ${titulo}`}
    >
      {contenido}
    </Link>
  );
}

export default CardItem;
