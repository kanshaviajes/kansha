
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import { getHeroDestinos } from "./heroService";
import "./Hero.css";

const MAX_DESCRIPCION = 155;

function resumirDescripcion(texto = "") {
  const descripcion = String(texto).replace(/\s+/g, " ").trim();

  if (descripcion.length <= MAX_DESCRIPCION) {
    return descripcion;
  }

  const fragmento = descripcion.slice(0, MAX_DESCRIPCION);
  const ultimoEspacio = fragmento.lastIndexOf(" ");

  return `${fragmento.slice(
    0,
    ultimoEspacio > 0 ? ultimoEspacio : MAX_DESCRIPCION
  )}...`;
}

function obtenerCategoria(destino) {
  const nombre = destino.nombre.toLowerCase();

  if (nombre.includes("río") || nombre.includes("buz")) {
    return "BRASIL";
  }

  if (nombre.includes("san andrés")) {
    return "CARIBE";
  }

  if (nombre.includes("mendoza")) {
    return "ARGENTINA";
  }

  return destino.categoria?.toUpperCase() || "DESTINO";
}

function obtenerSubtitulo(destino) {
  const nombre = destino.nombre.toLowerCase();

  if (nombre.includes("río")) {
    return "La ciudad maravillosa";
  }

  if (nombre.includes("buz")) {
    return "Playas y encanto";
  }

  if (nombre.includes("san andrés")) {
    return "El mar de siete colores";
  }

  if (nombre.includes("mendoza")) {
    return "Vinos y montañas";
  }

  return "Tu próxima aventura";
}

function Hero() {
  const [destinos, setDestinos] = useState([]);
  const [destinoActivoId, setDestinoActivoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let montado = true;

    async function cargarDestinos() {
      try {
        const data = await getHeroDestinos();

        if (!montado) return;

        setDestinos(data);
        setDestinoActivoId(data[0]?.id ?? null);
      } catch (err) {
        console.error("Error cargando destinos:", err);

        if (montado) {
          setError("No pudimos cargar los destinos.");
        }
      } finally {
        if (montado) {
          setLoading(false);
        }
      }
    }

    cargarDestinos();

    return () => {
      montado = false;
    };
  }, []);

  const destinoActivo =
    destinos.find((destino) => destino.id === destinoActivoId) ||
    null;

  if (loading || error || !destinoActivo) {
    return (
      <section className="kansha-hero kansha-hero--loading">
        <p>
          {loading
            ? "Cargando destinos..."
            : error || "No hay destinos disponibles."}
        </p>
      </section>
    );
  }

  return (
    <section
      className="kansha-hero"
      aria-label="Destinos destacados de Kansha Viajes"
    >
      {/* Fondos panorámicos */}
      <div className="kansha-hero__backgrounds" aria-hidden="true">
        {destinos.map((destino) => (
          <div
            key={destino.id}
            className={`kansha-hero__background ${
              destino.id === destinoActivoId
                ? "kansha-hero__background--active"
                : ""
            }`}
            style={{
              backgroundImage: `url("${destino.fondoImagen}")`,
            }}
          />
        ))}
      </div>

      <div className="kansha-hero__overlay" aria-hidden="true" />

      <div className="kansha-hero__layout">
        {/* Información principal */}
        <div className="kansha-hero__content">
          <span className="kansha-hero__eyebrow">
            DESCUBRÍ TU PRÓXIMO DESTINO
          </span>

          <div className="kansha-hero__info" key={destinoActivo.id}>
            <h1>{destinoActivo.nombre}</h1>

            {destinoActivo.descripcion && (
              <p className="kansha-hero__description">
                {resumirDescripcion(destinoActivo.descripcion)}
              </p>
            )}

            <Link
              to={`/destino/${destinoActivo.id}`}
              className="kansha-hero__button"
            >
              Explorar destino
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        {/* Carrusel extendido hacia el borde derecho */}
        <div className="kansha-hero__showcase">
          <Swiper
            className="kansha-hero__swiper"
            slidesPerView="auto"
            spaceBetween={16}
            grabCursor
            simulateTouch
            touchStartPreventDefault={false}
            threshold={5}
            resistanceRatio={0.65}
            speed={550}
            watchOverflow
            aria-label="Deslizá para descubrir destinos"
          >
            {destinos.map((destino) => (
              <SwiperSlide
                key={destino.id}
                className="kansha-hero__slide"
              >
                <button
                  type="button"
                  className={`kansha-hero__card ${
                    destinoActivoId === destino.id
                      ? "kansha-hero__card--active"
                      : ""
                  }`}
                  onClick={() => setDestinoActivoId(destino.id)}
                  aria-pressed={destinoActivoId === destino.id}
                  aria-label={`Seleccionar ${destino.nombre}`}
                >
                  <img
                    src={destino.cardImagen}
                    alt=""
                    loading="lazy"
                  />

                  <span className="kansha-hero__card-index">
                    {obtenerCategoria(destino)}
                  </span>

                  <div className="kansha-hero__card-details">
                    <span className="kansha-hero__card-title">
                      {destino.nombre}
                    </span>

                    <span className="kansha-hero__card-subtitle">
                      {obtenerSubtitulo(destino)}
                    </span>
                  </div>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default Hero;
