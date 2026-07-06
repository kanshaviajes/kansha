import { Link } from "react-router-dom";

function CardItem({ card }) {
  // 'card.link' debe contener el ID del destino (ej: '5') 
  // para que el Link sepa a qué página navegar.
  const destinoId = card.link;

  return (
    <Link to={`/${destinoId}`} className="destination-link">
      <div className="destination-card">
        {/* Imagen principal */}
        <img 
          src={card.imagen_url} 
          alt="Destino" 
          className="destination-image" 
        />
        
        {/* Overlay que contiene el botón */}
        <div className="destination-overlay">
          <div className="destination-button">
            Ver más
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CardItem;