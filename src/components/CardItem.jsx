import { Link } from "react-router-dom";

function CardItem({ card }) {
  // Verificamos si existe un link (ID de destino) en la tarjeta
  const destinoLink = card.link || "#";

  return (
    // CAMBIO REALIZADO: Agregamos '/destino/' al path para coincidir con App.js
    <Link to={`/destino/${destinoLink}`} className="destination-link">
      <div className="destination-card">
        <img 
          src={card.imagen_url} 
          alt={card.titulo || "Destino"} 
          className="destination-image" 
        />
        <div className="destination-overlay">
          <span className="destination-button">
            {card.titulo || "Ver más"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default CardItem;