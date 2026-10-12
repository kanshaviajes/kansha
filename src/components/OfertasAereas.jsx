
import { useEffect, useState } from "react";
import { getImagenesPorSeccion } from "./ImagenesWebService";
import "./OfertasAereas.css";

// =========================================
// CONFIGURACIÓN
// =========================================

const WHATSAPP_KANSHA = "59891846311";
const LIMITE_OFERTAS = 6;

// =========================================
// ENLACE PERSONALIZADO DE WHATSAPP
// =========================================

function crearLinkWhatsApp(oferta) {
  const titulo =
    String(oferta.titulo || "").trim() ||
    "un viaje";

  const precio = oferta.precio
    ? ` (${oferta.precio})`
    : "";

  const mensaje =
    `¡Hola, Florencia! 👋\n\n` +
    `Vi en la web de Kansha la oferta de ${titulo}${precio} ` +
    `y me gustaría recibir más información.\n\n` +
    `¡Muchas gracias!`;

  return `https://wa.me/${WHATSAPP_KANSHA}?text=${encodeURIComponent(
    mensaje
  )}`;
}

// =========================================
// COMPONENTE
// =========================================

function OfertasAereas() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let activo = true;

    async function cargarOfertas() {
      try {
        const data = await getImagenesPorSeccion(
          "ofertas_aereas"
        );

        const ofertasRecientes = (data || [])
          .filter(
            (oferta) =>
              oferta.activo !== false &&
              oferta.imagen_url
          )
          .sort(
            (a, b) =>
              new Date(b.created_at || 0).getTime() -
              new Date(a.created_at || 0).getTime()
          )
          .slice(0, LIMITE_OFERTAS);

        if (activo) {
          setOfertas(ofertasRecientes);
        }
      } catch (error) {
        console.error(
          "Error cargando ofertas aéreas:",
          error
        );
      } finally {
        if (activo) {
          setLoading(false);
        }
      }
    }

    cargarOfertas();

    return () => {
      activo = false;
    };
  }, []);

  if (loading || ofertas.length === 0) {
    return null;
  }

  return (
    <section
      className="ofertas-aereas"
      aria-labelledby="ofertas-aereas-title"
    >
      <div className="container">
        <header className="ofertas-aereas-header">
          <span className="ofertas-aereas-eyebrow">
            OFERTAS ESPECIALES
          </span>

          <h2 id="ofertas-aereas-title">
            Oportunidades para{" "}
            <span>despegar.</span>
          </h2>

          <p>
            Descubrí propuestas especiales para tu
            próximo viaje. Elegí tu destino y empezá
            a planificar una nueva aventura.
          </p>
        </header>

        <div className="ofertas-aereas-grid">
          {ofertas.map((oferta) => (
            <article
              className="ofertas-aereas-card"
              key={oferta.id}
            >
              <div className="ofertas-aereas-imagen">
                <img
                  src={oferta.imagen_url}
                  alt={
                    oferta.titulo ||
                    "Oferta de Kansha Viajes"
                  }
                  loading="lazy"
                />

                {oferta.categoria && (
                  <span className="ofertas-aereas-categoria">
                    {oferta.categoria}
                  </span>
                )}
              </div>

              <div className="ofertas-aereas-contenido">
                <h3>
                  {oferta.titulo ||
                    "Descubrí esta oferta"}
                </h3>

                {oferta.descripcion && (
                  <p className="ofertas-aereas-descripcion">
                    {oferta.descripcion}
                  </p>
                )}

                <div className="ofertas-aereas-pie">
                  <div className="ofertas-aereas-precio">
                    <span>Precio</span>
                    <strong>
                      {oferta.precio || "Consultar"}
                    </strong>
                  </div>

                  <a
                    href={crearLinkWhatsApp(oferta)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ofertas-aereas-boton"
                    aria-label={`Consultar por WhatsApp sobre ${
                      oferta.titulo || "esta oferta"
                    }`}
                  >
                    Consultar
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OfertasAereas;
