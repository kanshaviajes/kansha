
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getImagenesPorSeccion } from "../ImagenesWebService";
import "./DestinosDestacados.css";

const LIMITE = 6;

function DestinosDestacados() {
  const [viajes, setViajes] = useState([]);

  useEffect(() => {
    let activo = true;

    async function cargarViajes() {
      try {
        const data = await getImagenesPorSeccion("hero_cards");

        const recientes = (data || [])
          .filter(
            (viaje) =>
              viaje.activo !== false &&
              viaje.imagen_url
          )
          .sort(
            (a, b) =>
              new Date(b.created_at || 0).getTime() -
              new Date(a.created_at || 0).getTime()
          )
          .slice(0, LIMITE);

        if (activo) {
          setViajes(recientes);
        }
      } catch (error) {
        console.error(
          "Error cargando viajes destacados:",
          error
        );
      }
    }

    cargarViajes();

    return () => {
      activo = false;
    };
  }, []);

  if (viajes.length === 0) return null;

  return (
    <section
      className="destacados"
      aria-labelledby="destacados-title"
    >
      <div className="container destacados-container">
        <div className="destacados-layout">
          <div className="destacados-header">
            <span className="destacados-eyebrow">
              NUEVAS EXPERIENCIAS
            </span>

            <h2
              id="destacados-title"
              className="destacados-title"
            >
              Tu próxima aventura empieza acá.
            </h2>

            <p className="destacados-description">
              Descubrí las últimas propuestas de Kansha.
              Nuevos destinos, experiencias inolvidables
              y muchas razones para preparar las valijas.
            </p>

            <Link
              className="destacados-button"
              to="/viajes"
            >
              Descubrir viajes
              <span aria-hidden="true">↗</span>
            </Link>

            <div
              className="destacados-decoracion"
              aria-hidden="true"
            >
              <span>✈</span>
              <span className="destacados-linea" />
            </div>
          </div>

          <div
            id="destacados-viajes"
            className="destacados-grid"
          >
            {viajes.map((viaje) => {
              const tieneLink =
                viaje.link !== null &&
                viaje.link !== undefined &&
                String(viaje.link).trim() !== "";

              const afiche = (
                <div className="destacados-card">
                  <img
                    src={viaje.imagen_url}
                    alt={
                      viaje.titulo ||
                      "Promoción de Kansha Viajes"
                    }
                    loading="lazy"
                  />
                </div>
              );

              return tieneLink ? (
                <Link
                  key={viaje.id}
                  to={`/destino/${viaje.link}`}
                  className="destacados-link"
                  aria-label={
                    viaje.titulo
                      ? `Ver viaje a ${viaje.titulo}`
                      : "Ver promoción"
                  }
                >
                  {afiche}
                </Link>
              ) : (
                <div
                  key={viaje.id}
                  className="destacados-link"
                >
                  {afiche}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DestinosDestacados;
