
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getImagenesPorSeccion } from "../components/ImagenesWebService";
import "./Viajes.css";

function Viajes() {
  const [viajes, setViajes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    async function cargarViajes() {
      try {
        const data = await getImagenesPorSeccion("hero_cards");

        const ordenados = (data || [])
          .filter(
            (viaje) =>
              viaje.activo !== false &&
              viaje.imagen_url
          )
          .sort(
            (a, b) =>
              new Date(b.created_at || 0).getTime() -
              new Date(a.created_at || 0).getTime()
          );

        if (activo) {
          setViajes(ordenados);
        }
      } catch (error) {
        console.error("Error cargando catálogo:", error);
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarViajes();

    return () => {
      activo = false;
    };
  }, []);

  const viajesFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase("es");

    if (!termino) return viajes;

    return viajes.filter((viaje) =>
      (viaje.titulo || "")
        .toLocaleLowerCase("es")
        .includes(termino)
    );
  }, [viajes, busqueda]);

  return (
    <div className="viajes-page">
      <header className="viajes-hero">
        <div className="container">
          <span className="viajes-eyebrow">
            KANSHA VIAJES
          </span>

          <h1>Descubrí tu próximo viaje</h1>

          <p>
            Explorá nuestras propuestas y encontrá
            la aventura que estás buscando.
          </p>
        </div>
      </header>

      <section className="viajes-catalogo">
        <div className="container">
          <div className="viajes-toolbar">
            <div>
              <h2>Todos los viajes</h2>
              <p>
                {viajesFiltrados.length}{" "}
                {viajesFiltrados.length === 1
                  ? "propuesta disponible"
                  : "propuestas disponibles"}
              </p>
            </div>

            <label className="viajes-buscador">
              <span className="visually-hidden">
                Buscar viajes
              </span>
              <input
                type="search"
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(e.target.value)
                }
                placeholder="Buscar un destino..."
              />
              <span aria-hidden="true">⌕</span>
            </label>
          </div>

          {cargando ? (
            <p className="viajes-estado">
              Cargando viajes...
            </p>
          ) : viajesFiltrados.length === 0 ? (
            <div className="viajes-vacio">
              <h3>No encontramos viajes</h3>
              <p>
                Probá con otro destino o modificá
                tu búsqueda.
              </p>
            </div>
          ) : (
            <div className="viajes-grid">
              {viajesFiltrados.map((viaje) => {
                const tieneLink =
                  viaje.link !== null &&
                  viaje.link !== undefined &&
                  String(viaje.link).trim() !== "";

                const contenido = (
                  <div className="viajes-card">
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
                    className="viajes-card-link"
                    aria-label={
                      viaje.titulo
                        ? `Ver viaje a ${viaje.titulo}`
                        : "Ver promoción"
                    }
                  >
                    {contenido}
                  </Link>
                ) : (
                  <div
                    key={viaje.id}
                    className="viajes-card-link"
                  >
                    {contenido}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Viajes;
