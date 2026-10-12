
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getImagenesPorSeccion } from "../components/ImagenesWebService";
import "./Viajes.css";

// =========================================
// CONFIGURACIÓN
// =========================================

const WHATSAPP = "59891846311";

const FILTROS = [
  { id: "todos", nombre: "Todos los viajes" },
  { id: "brasil", nombre: "Brasil" },
  { id: "argentina", nombre: "Argentina" },
  { id: "caribe", nombre: "Caribe" },
  { id: "otros", nombre: "Otros destinos" },
];

const DESTINOS = {
  brasil: [
    "brasil",
    "buzios",
    "búzios",
    "rio de janeiro",
    "río de janeiro",
    "porto de galinhas",
    "maragogi",
    "natal",
    "pipa",
    "florianopolis",
    "florianópolis",
    "imbe",
    "imbé",
    "gramado",
    "camboriu",
    "camboriú",
  ],
  argentina: [
    "argentina",
    "bariloche",
    "ushuaia",
    "calafate",
    "buenos aires",
    "mendoza",
    "salta",
    "jujuy",
    "norte argentino",
  ],
  caribe: [
    "caribe",
    "cancun",
    "cancún",
    "punta cana",
    "san andres",
    "san andrés",
    "aruba",
    "cartagena",
    "riviera maya",
    "republica dominicana",
    "república dominicana",
  ],
};

// =========================================
// FUNCIONES AUXILIARES
// =========================================

function normalizarTexto(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function obtenerTextoViaje(viaje) {
  return normalizarTexto(
    [
      viaje.titulo,
      viaje.descripcion,
      viaje.categoria,
    ].filter(Boolean).join(" ")
  );
}

function obtenerRegion(viaje) {
  const texto = obtenerTextoViaje(viaje);

  for (const [region, destinos] of Object.entries(
    DESTINOS
  )) {
    if (
      destinos.some((destino) =>
        texto.includes(normalizarTexto(destino))
      )
    ) {
      return region;
    }
  }

  return "otros";
}

function crearWhatsApp(viaje) {
  const mensaje =
    `¡Hola, Florencia! 👋\n\n` +
    `Vi la propuesta "${viaje.titulo || "Viaje"}" ` +
    `en la web de Kansha y me gustaría recibir ` +
    `más información.\n\n¡Gracias!`;

  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    mensaje
  )}`;
}

// =========================================
// COMPONENTE
// =========================================

function Viajes() {
  const [viajes, setViajes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroActivo, setFiltroActivo] =
    useState("todos");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let activo = true;

    async function cargarViajes() {
      try {
        const data = await getImagenesPorSeccion(
          "hero_cards"
        );

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
      } catch (err) {
        console.error(
          "Error cargando catálogo:",
          err
        );

        if (activo) setError(true);
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarViajes();

    return () => {
      activo = false;
    };
  }, []);

  // =========================================
  // FILTRADO
  // =========================================

  const viajesFiltrados = useMemo(() => {
    const termino = normalizarTexto(busqueda);

    return viajes.filter((viaje) => {
      const texto = obtenerTextoViaje(viaje);

      const coincideBusqueda =
        !termino || texto.includes(termino);

      const coincideFiltro =
        filtroActivo === "todos" ||
        obtenerRegion(viaje) === filtroActivo;

      return coincideBusqueda && coincideFiltro;
    });
  }, [viajes, busqueda, filtroActivo]);

  function limpiarFiltros() {
    setBusqueda("");
    setFiltroActivo("todos");
  }

  // =========================================
  // RENDER
  // =========================================

  return (
    <main className="viajes-page">

      {/* =====================================
          HERO
      ===================================== */}

      <header className="viajes-hero">
        <div className="container">

          <div className="viajes-hero-content">
            <span className="viajes-eyebrow">
              KANSHA VIAJES · EXPLORÁ EL MUNDO
            </span>

            <h1>
              Tu próximo destino
              <span> empieza acá.</span>
            </h1>

            <p>
              Descubrí experiencias, escapadas
              y aventuras. El viaje que estás
              imaginando puede estar más cerca
              de lo que pensás.
            </p>

            <a
              href="#catalogo-viajes"
              className="viajes-hero-cta"
            >
              Explorar viajes
              <span aria-hidden="true">↓</span>
            </a>
          </div>

        </div>
      </header>

      {/* =====================================
          CATÁLOGO
      ===================================== */}

      <section
        className="viajes-catalogo"
        id="catalogo-viajes"
      >
        <div className="container">

          <div className="viajes-section-header">
            <span className="viajes-section-eyebrow">
              ENCONTRÁ TU PRÓXIMA AVENTURA
            </span>

            <h2>
              Explorá nuestros <span>viajes.</span>
            </h2>

            <p>
              Propuestas seleccionadas para
              disfrutar, descubrir y crear
              recuerdos inolvidables.
            </p>
          </div>

          {/* BUSCADOR Y FILTROS */}

          <div className="viajes-filtros-panel">

            <label className="viajes-buscador">
              <i
                className="bi bi-search"
                aria-hidden="true"
              ></i>

              <span className="visually-hidden">
                Buscar viajes
              </span>

              <input
                type="search"
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(e.target.value)
                }
                placeholder="Buscar destino, categoría o palabra clave..."
              />
            </label>

            <div
              className="viajes-filtros"
              role="group"
              aria-label="Filtrar viajes por región"
            >
              {FILTROS.map((filtro) => (
                <button
                  key={filtro.id}
                  type="button"
                  className={`viajes-filtro ${
                    filtroActivo === filtro.id
                      ? "activo"
                      : ""
                  }`}
                  onClick={() =>
                    setFiltroActivo(filtro.id)
                  }
                  aria-pressed={
                    filtroActivo === filtro.id
                  }
                >
                  {filtro.nombre}
                </button>
              ))}
            </div>

          </div>

          {/* RESULTADOS */}

          {!cargando && !error && (
            <div className="viajes-resultados">
              <p>
                <strong>
                  {viajesFiltrados.length}
                </strong>{" "}
                {viajesFiltrados.length === 1
                  ? "viaje encontrado"
                  : "viajes encontrados"}
              </p>

              {(busqueda ||
                filtroActivo !== "todos") && (
                <button
                  type="button"
                  onClick={limpiarFiltros}
                  className="viajes-limpiar"
                >
                  Limpiar filtros
                  <span aria-hidden="true">×</span>
                </button>
              )}
            </div>
          )}

          {/* ESTADOS */}

          {cargando ? (
            <div
              className="viajes-estado"
              role="status"
            >
              Cargando viajes...
            </div>
          ) : error ? (
            <div className="viajes-vacio" role="alert">
              <h3>No pudimos cargar los viajes</h3>
              <p>
                Intentá actualizar la página
                dentro de unos momentos.
              </p>
            </div>
          ) : viajesFiltrados.length === 0 ? (
            <div className="viajes-vacio">
              <i
                className="bi bi-search"
                aria-hidden="true"
              ></i>

              <h3>No encontramos viajes</h3>

              <p>
                Probá con otro destino o cambiá
                los filtros de búsqueda.
              </p>

              <button
                type="button"
                onClick={limpiarFiltros}
                className="viajes-vacio-boton"
              >
                Ver todos los viajes
              </button>
            </div>
          ) : (
            <div className="viajes-grid">
              {viajesFiltrados.map((viaje) => {
                const tieneLink =
                  viaje.link !== null &&
                  viaje.link !== undefined &&
                  String(viaje.link).trim() !== "";

                const imagen = (
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

                return (
                  <article
                    key={viaje.id}
                    className="viajes-item"
                  >
                    {tieneLink ? (
                      <Link
                        to={`/destino/${viaje.link}`}
                        className="viajes-card-link"
                        aria-label={`Ver ${
                          viaje.titulo || "promoción"
                        }`}
                      >
                        {imagen}
                      </Link>
                    ) : (
                      <div className="viajes-card-link">
                        {imagen}
                      </div>
                    )}

                    <div className="viajes-card-footer">
                      <h3>
                        {viaje.titulo ||
                          "Descubrí este viaje"}
                      </h3>

                      {tieneLink ? (
                        <Link
                          to={`/destino/${viaje.link}`}
                          className="viajes-card-action"
                        >
                          Ver detalles
                          <span aria-hidden="true">↗</span>
                        </Link>
                      ) : (
                        <a
                          href={crearWhatsApp(viaje)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="viajes-card-action"
                        >
                          Consultar
                          <span aria-hidden="true">↗</span>
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* =====================================
          CIERRE
      ===================================== */}

      <section className="viajes-cierre">
        <div className="container">
          <div className="viajes-cierre-content">

            <span>¿NO ENCONTRASTE TU DESTINO?</span>

            <h2>
              El viaje que soñás,
              <br />
              lo planificamos juntos.
            </h2>

            <p>
              Contanos a dónde te gustaría ir
              y te ayudamos a encontrar
              la mejor propuesta.
            </p>

            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
                "¡Hola, Florencia! Me gustaría planificar un viaje con Kansha."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="viajes-cierre-boton"
            >
              <i
                className="bi bi-whatsapp"
                aria-hidden="true"
              ></i>
              Hablemos de tu viaje
            </a>

          </div>
        </div>
      </section>

    </main>
  );
}

export default Viajes;
