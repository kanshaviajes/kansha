
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../supabase";

import {
  guardarCache,
  leerCache,
} from "../services/kanshaCache";

import { getHeroDestinos } from "../components/hero/heroService";

import fallback from "../data/kanshaFallback.json";

import "./PageDestino.css";

// =========================================
// CONFIGURACIÓN
// =========================================

const TIMEOUT_MS = 7000;
const WHATSAPP = "59891846311";

// =========================================
// TIMEOUT DE SEGURIDAD
// =========================================

function conTimeout(promesa, ms = TIMEOUT_MS) {
  let temporizador;

  const limite = new Promise((_, reject) => {
    temporizador = setTimeout(() => {
      reject(
        new Error(
          "Supabase demoró demasiado en responder"
        )
      );
    }, ms);
  });

  return Promise.race([promesa, limite]).finally(
    () => clearTimeout(temporizador)
  );
}

// =========================================
// FALLBACK ESTÁTICO
// =========================================

function obtenerDestinoFallback(id) {
  return (fallback.destinos || []).find(
    (item) =>
      Number(item.id) === Number(id) &&
      item.activo === true
  );
}

// =========================================
// FORMATO DE PRECIO
// =========================================

function formatearPrecio(precio, moneda) {
  if (
    precio === null ||
    precio === undefined ||
    String(precio).trim() === ""
  ) {
    return "Consultar";
  }

  const simbolo =
    moneda === "UYU" ? "UYU $" : "USD";

  return `${simbolo} ${precio}`;
}

// =========================================
// SELECCIONAR IMAGEN PANORÁMICA
// =========================================

function obtenerImagenHero(destino, destinosHero) {
  // Prioridad 1: imagen panorámica propia.
  if (destino.hero_imagen_url) {
    return destino.hero_imagen_url;
  }

  // Prioridad 2: imagen del mismo destino
  // dentro de los destacados del Hero.
  const coincidencia = destinosHero.find(
    (item) => Number(item.id) === Number(destino.id)
  );

  if (coincidencia?.fondoImagen) {
    return coincidencia.fondoImagen;
  }

  // Prioridad 3: una de las imágenes del Hero.
  // Selección estable según el ID del destino.
  const fondosDisponibles = destinosHero
    .map((item) => item.fondoImagen)
    .filter(Boolean);

  if (fondosDisponibles.length > 0) {
    const indice =
      Math.abs(Number(destino.id) || 0) %
      fondosDisponibles.length;

    return fondosDisponibles[indice];
  }

  // Si no hay fotografías disponibles,
  // el CSS mostrará el fondo verde.
  return null;
}

// =========================================
// CONTENIDO DEL DESTINO
// =========================================

function DestinoContenido({
  destino,
  imagenHero,
}) {
  const nombre =
    destino.nombre || "Tu próximo destino";

  const tieneNoches =
    destino.noches !== null &&
    destino.noches !== undefined &&
    String(destino.noches).trim() !== "";

  const tienePrecio =
    destino.precio !== null &&
    destino.precio !== undefined &&
    String(destino.precio).trim() !== "";

  const precio = formatearPrecio(
    destino.precio,
    destino.moneda
  );

  const mensajeWhatsApp =
    `¡Hola, Florencia! 👋\n\n` +
    `Vi en la web de Kansha el destino ${nombre}` +
    (tieneNoches
      ? ` (${destino.noches} noches)`
      : "") +
    ` y me gustaría recibir más información.\n\n` +
    `¡Muchas gracias!`;

  const whatsappLink =
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
      mensajeWhatsApp
    )}`;

  return (
    <div className="page-destino">

      {/* =====================================
          HERO PANORÁMICO
      ===================================== */}

      <header className="hero-destino">

        {imagenHero && (
          <div
            className="hero-destino-fondo"
            style={{
              backgroundImage: `url("${imagenHero}")`,
            }}
            aria-hidden="true"
          />
        )}

        <div
          className="hero-destino-overlay"
          aria-hidden="true"
        />

        <div className="container">
          <div className="hero-destino-content">

            <Link
              to="/viajes"
              className="destino-volver"
            >
              <i
                className="bi bi-arrow-left"
                aria-hidden="true"
              ></i>
              Todos los viajes
            </Link>

            <span className="destino-eyebrow">
              KANSHA VIAJES · DESCUBRÍ EL MUNDO
            </span>

            <h1>{nombre}</h1>

            <p>
              Hay lugares que se visitan y otros
              que se convierten en recuerdos
              inolvidables.
            </p>

            {tieneNoches && (
              <div className="destino-hero-info">
                <i
                  className="bi bi-moon-stars"
                  aria-hidden="true"
                ></i>

                <span>
                  {destino.noches}{" "}
                  {Number(destino.noches) === 1
                    ? "noche"
                    : "noches"}{" "}
                  de estadía
                </span>
              </div>
            )}

          </div>
        </div>
      </header>

      {/* =====================================
          INFORMACIÓN PRINCIPAL
      ===================================== */}

      <section className="destino-detalles">
        <div className="container">
          <div className="destino-layout">

            {/* DESCRIPCIÓN */}

            <div className="destino-descripcion">

              <span className="destino-section-eyebrow">
                TU PRÓXIMA EXPERIENCIA
              </span>

              <h2>
                Descubrí <span>{nombre}.</span>
              </h2>

              <div className="destino-acento"></div>

              {destino.descripcion ? (
                <p className="destino-texto">
                  {destino.descripcion}
                </p>
              ) : (
                <p className="destino-texto">
                  Descubrí todo lo que este destino
                  tiene para ofrecerte. Consultanos
                  y te ayudamos a organizar tu viaje.
                </p>
              )}

              <div className="destino-experiencia">
                <div className="destino-experiencia-icono">
                  <i
                    className="bi bi-compass"
                    aria-hidden="true"
                  ></i>
                </div>

                <div>
                  <h3>Viajá a tu manera</h3>

                  <p>
                    En Kansha te acompañamos para
                    encontrar una propuesta que se
                    adapte a tus ganas de viajar.
                  </p>
                </div>
              </div>

            </div>

            {/* TARJETA DE CONSULTA */}

            <aside className="destino-reserva">

              <div className="destino-reserva-header">
                <span>
                  PLANIFICÁ TU VIAJE
                </span>

                <h2>
                  Tu próxima aventura
                  comienza acá.
                </h2>
              </div>

              <div className="destino-reserva-body">

                <div className="destino-precio">
                  <span>
                    {tienePrecio
                      ? "Precio desde"
                      : "Precio del viaje"}
                  </span>

                  <strong>{precio}</strong>

                  {tienePrecio && (
                    <small>
                      Consultá condiciones
                      y disponibilidad.
                    </small>
                  )}
                </div>

                {tieneNoches && (
                  <div className="destino-dato">
                    <div className="destino-dato-icono">
                      <i
                        className="bi bi-moon-stars"
                        aria-hidden="true"
                      ></i>
                    </div>

                    <div>
                      <span>Duración</span>

                      <strong>
                        {destino.noches}{" "}
                        {Number(destino.noches) === 1
                          ? "noche"
                          : "noches"}
                      </strong>
                    </div>
                  </div>
                )}

                <div className="destino-dato">
                  <div className="destino-dato-icono">
                    <i
                      className="bi bi-geo-alt"
                      aria-hidden="true"
                    ></i>
                  </div>

                  <div>
                    <span>Destino</span>
                    <strong>{nombre}</strong>
                  </div>
                </div>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="destino-whatsapp"
                >
                  <i
                    className="bi bi-whatsapp"
                    aria-hidden="true"
                  ></i>

                  Consultar por WhatsApp

                  <span aria-hidden="true">↗</span>
                </a>

                <p className="destino-reserva-nota">
                  Te ayudamos a conocer las
                  opciones disponibles para
                  este destino.
                </p>

              </div>

            </aside>

          </div>
        </div>
      </section>

      {/* =====================================
          CIERRE
      ===================================== */}

      <section className="destino-cierre">
        <div className="container">
          <div className="destino-cierre-content">

            <span>
              SEGUÍ DESCUBRIENDO
            </span>

            <h2>
              Hay un mundo esperando
              por vos.
            </h2>

            <p>
              Explorá más destinos y encontrá
              el próximo lugar que vas a recordar
              para siempre.
            </p>

            <Link
              to="/viajes"
              className="destino-cierre-boton"
            >
              Descubrir más viajes
              <span aria-hidden="true">↗</span>
            </Link>

          </div>
        </div>
      </section>

    </div>
  );
}

// =========================================
// PÁGINA PRINCIPAL
// =========================================

function PageDestino() {
  const { id } = useParams();

  const [estado, setEstado] = useState({
    id: null,
    destino: null,
    destinosHero: [],
    loading: true,
    sinDatos: false,
  });

  useEffect(() => {
    let activo = true;

    const numericId = Number(id);
    const cacheKey = `destino_${numericId}`;

    async function fetchDestino() {
      if (
        !Number.isSafeInteger(numericId) ||
        numericId <= 0
      ) {
        if (activo) {
          setEstado({
            id,
            destino: null,
            destinosHero: [],
            loading: false,
            sinDatos: true,
          });
        }

        return;
      }

      setEstado({
        id,
        destino: null,
        destinosHero: [],
        loading: true,
        sinDatos: false,
      });

      // Cargamos las imágenes panorámicas
      // de manera independiente para que
      // un fallo del Hero no bloquee el destino.
      const promesaHero = getHeroDestinos()
        .catch((error) => {
          console.warn(
            "No se pudieron cargar los fondos del Hero:",
            error
          );

          return [];
        });

      let destinoEncontrado = null;

      try {
        const { data, error } = await conTimeout(
          supabase
            .from("destinos")
            .select("*")
            .eq("id", numericId)
            .eq("activo", true)
        );

        if (error) throw error;

        if (data && data.length > 0) {
          destinoEncontrado = data[0];

          if (activo) {
            guardarCache(
              cacheKey,
              destinoEncontrado
            );
          }
        }
      } catch (error) {
        console.warn(
          "Supabase no disponible. Intentando recuperar destino.",
          error
        );

        const cache = leerCache(cacheKey);

        const destinoFallback =
          obtenerDestinoFallback(numericId);

        destinoEncontrado =
          (cache?.activo === true && cache) ||
          destinoFallback ||
          null;
      }

      // Mostramos el destino aunque las
      // imágenes del Hero todavía estén cargando.
      if (activo) {
        setEstado({
          id,
          destino: destinoEncontrado,
          destinosHero: [],
          loading: false,
          sinDatos: !destinoEncontrado,
        });
      }

      // Incorporamos los fondos cuando
      // estén disponibles, sin bloquear
      // el resto de la página.
      const destinosHero = await promesaHero;

      if (activo) {
        setEstado((anterior) => {
          if (anterior.id !== id) {
            return anterior;
          }

          return {
            ...anterior,
            destinosHero,
          };
        });
      }
    }

    fetchDestino();

    return () => {
      activo = false;
    };
  }, [id]);

  // =========================================
  // CARGANDO
  // =========================================

  if (estado.id !== id || estado.loading) {
    return (
      <div
        className="destino-estado-page"
        role="status"
      >
        <div className="destino-estado-content">
          <div className="destino-spinner"></div>
          <p>Cargando tu próximo destino...</p>
        </div>
      </div>
    );
  }

  // =========================================
  // SIN DATOS
  // =========================================

  if (estado.sinDatos || !estado.destino) {
    return (
      <div className="destino-estado-page">
        <div className="destino-estado-content">
          <i
            className="bi bi-geo-alt"
            aria-hidden="true"
          ></i>

          <h1>
            No pudimos cargar este destino
          </h1>

          <p>
            Es posible que ya no esté disponible
            o que haya un problema de conexión.
          </p>

          <Link
            to="/viajes"
            className="destino-estado-boton"
          >
            Ver todos los viajes
          </Link>
        </div>
      </div>
    );
  }

  const imagenHero = obtenerImagenHero(
    estado.destino,
    estado.destinosHero
  );

  return (
    <DestinoContenido
      destino={estado.destino}
      imagenHero={imagenHero}
    />
  );
}

export default PageDestino;
