
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getImagenesPorSeccion } from "./ImagenesWebService";
import "./HeroCards.css";

const CANTIDAD_DESTACADOS = 6;

function HeroCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let activo = true;

    async function cargarCards() {
      try {
        const data = await getImagenesPorSeccion("hero_cards");

        const recientes = (data || [])
          .filter(
            (card) =>
              card.activo !== false &&
              card.imagen_url
          )
          .sort(
            (a, b) =>
              new Date(b.created_at || 0).getTime() -
              new Date(a.created_at || 0).getTime()
          )
          .slice(0, CANTIDAD_DESTACADOS);

        if (activo) {
          setCards(recientes);
        }
      } catch (error) {
        console.error(
          "Error cargando destinos destacados:",
          error
        );
      } finally {
        if (activo) {
          setLoading(false);
        }
      }
    }

    cargarCards();

    return () => {
      activo = false;
    };
  }, []);

  if (loading || cards.length === 0) {
    return null;
  }

  return (
    <section className="hero-cards">
      <div className="container">
        <div className="hero-cards-grid">
          {cards.map((card) => {
            const tieneLink =
              card.link !== null &&
              card.link !== undefined &&
              String(card.link).trim() !== "";

            const imagen = (
              <div className="hero-cards-item">
                <img
                  src={card.imagen_url}
                  alt={card.titulo || "Promoción de Kansha Viajes"}
                  loading="lazy"
                />
              </div>
            );

            return tieneLink ? (
              <Link
                key={card.id}
                to={`/destino/${card.link}`}
                className="hero-cards-link"
                aria-label={
                  card.titulo
                    ? `Ver viaje a ${card.titulo}`
                    : "Ver promoción"
                }
              >
                {imagen}
              </Link>
            ) : (
              <div
                key={card.id}
                className="hero-cards-link"
              >
                {imagen}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HeroCards;
