
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

import TestimonioForm from "../components/testimonios/TestimonioForm";
import TestimoniosList from "../components/testimonios/TestimoniosList";

import "../components/testimonios/Testimonios.css";

function Testimonios() {
  const [testimonios, setTestimonios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [esAdmin, setEsAdmin] = useState(false);
  const [error, setError] = useState("");

  // =========================================
  // CARGAR TESTIMONIOS
  // =========================================

  const cargarTestimonios = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: errorConsulta } =
        await supabase
          .from("testimonios")
          .select("*")
          .order("created_at", {
            ascending: false,
          });

      if (errorConsulta) {
        throw errorConsulta;
      }

      setTestimonios(data || []);
    } catch (err) {
      console.error(
        "Error al cargar testimonios:",
        err
      );

      setError(
        "No pudimos cargar las experiencias. Intentá nuevamente."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================
  // SESIÓN ADMINISTRATIVA
  // =========================================

  useEffect(() => {
    let activo = true;

    async function verificarAdmin() {
      const { data, error } =
        await supabase.auth.getSession();

      if (error) {
        console.error(
          "Error verificando sesión:",
          error
        );
      }

      if (activo) {
        setEsAdmin(Boolean(data?.session));
      }
    }

    verificarAdmin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_evento, session) => {
        if (activo) {
          setEsAdmin(Boolean(session));
        }
      }
    );

    return () => {
      activo = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    cargarTestimonios();
  }, [cargarTestimonios]);

  return (
    <div className="testimonios-page">

      {/* =====================================
          HERO
      ===================================== */}

      <header className="testimonios-hero">
        <div className="container">
          <div className="testimonios-hero-content">

            <span className="testimonios-eyebrow">
              KANSHA VIAJES · EXPERIENCIAS REALES
            </span>

            <h1>
              Cada viaje tiene
              <span> una historia.</span>
            </h1>

            <p>
              Detrás de cada destino hay recuerdos,
              emociones y momentos únicos.
              Conocé las experiencias de quienes
              ya viajaron con nosotros.
            </p>

            <a
              href="#experiencias"
              className="testimonios-hero-button"
            >
              Descubrir experiencias
              <span aria-hidden="true">↗</span>
            </a>

          </div>
        </div>
      </header>

      {/* =====================================
          LISTADO DE TESTIMONIOS
      ===================================== */}

      <section
        className="testimonios-list-section"
        id="experiencias"
      >
        <div className="container">

          <div className="testimonios-section-header">
            <span className="testimonios-section-eyebrow">
              HISTORIAS QUE INSPIRAN
            </span>

            <h2>
              Viajes que dejan
              <span> huella.</span>
            </h2>

            <p>
              Cada experiencia es diferente,
              pero todas tienen algo en común:
              las ganas de descubrir el mundo.
            </p>

            <div className="testimonios-acento"></div>
          </div>

          {!loading && !error && (
            <p className="testimonios-contador">
              {testimonios.length}{" "}
              {testimonios.length === 1
                ? "experiencia compartida"
                : "experiencias compartidas"}
            </p>
          )}

          {error ? (
            <div
              className="testimonios-error"
              role="alert"
            >
              <i
                className="bi bi-exclamation-circle"
                aria-hidden="true"
              ></i>

              <p>{error}</p>

              <button
                type="button"
                onClick={cargarTestimonios}
              >
                Volver a intentar
              </button>
            </div>
          ) : (
            <TestimoniosList
              testimonios={testimonios}
              loading={loading}
              esAdmin={esAdmin}
            />
          )}

        </div>
      </section>

      {/* =====================================
          INVITACIÓN A PARTICIPAR
      ===================================== */}

      <section className="testimonios-invitacion">
        <div className="container">
          <div className="testimonios-invitacion-content">

            <span>
              TU HISTORIA TAMBIÉN IMPORTA
            </span>

            <h2>
              Ahora queremos conocer
              <span> tu experiencia.</span>
            </h2>

            <p>
              ¿Ya viajaste con Kansha?
              Compartí tus recuerdos y ayudá
              a otros viajeros a descubrir
              su próximo destino.
            </p>

          </div>
        </div>
      </section>

      {/* =====================================
          FORMULARIO
      ===================================== */}

      <section
        className="testimonios-form-section"
        id="compartir-experiencia"
      >
        <div className="container">
          <TestimonioForm
            onNuevoTestimonio={cargarTestimonios}
          />
        </div>
      </section>

      {/* =====================================
          CIERRE
      ===================================== */}

      <section className="testimonios-cierre">
        <div className="container">
          <div className="testimonios-cierre-content">

            <span>
              TU PRÓXIMA HISTORIA COMIENZA ACÁ
            </span>

            <h2>
              ¿Y si el próximo viaje
              fuera el tuyo?
            </h2>

            <p>
              Descubrí nuestros destinos
              y empezá a imaginar tu
              próxima aventura.
            </p>

            <Link
              to="/viajes"
              className="testimonios-cierre-button"
            >
              Explorar destinos
              <span aria-hidden="true">↗</span>
            </Link>

          </div>
        </div>
      </section>

    </div>
  );
}

export default Testimonios;
