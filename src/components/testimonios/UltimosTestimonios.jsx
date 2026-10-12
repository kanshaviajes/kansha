
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase";
import TestimonioCard from "./TestimonioCard";
import "./UltimosTestimonios.css";

function UltimosTestimonios() {
  const [testimonios, setTestimonios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let activo = true;

    async function cargarUltimos() {
      try {
        const { data, error } = await supabase
          .from("testimonios")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) throw error;

        if (activo) {
          setTestimonios(data || []);
        }
      } catch (error) {
        console.error(
          "Error cargando testimonios:",
          error
        );
      } finally {
        if (activo) {
          setLoading(false);
        }
      }
    }

    cargarUltimos();

    return () => {
      activo = false;
    };
  }, []);

  if (loading || testimonios.length === 0) {
    return null;
  }

  return (
    <section
      className="ultimos-testimonios"
      aria-labelledby="ultimos-testimonios-title"
    >
      <div className="container">
        <div className="ultimos-testimonios-header">
          <span className="ultimos-testimonios-eyebrow">
            EXPERIENCIAS REALES
          </span>

          <h2 id="ultimos-testimonios-title">
            Viajes que dejan{" "}
            <span>huella.</span>
          </h2>

          <p>
            Cada viaje tiene una historia.
            Estas son algunas de las experiencias
            que nuestros viajeros quisieron compartir.
          </p>
        </div>

        <div className="ultimos-testimonios-grid">
          {testimonios.map((testimonio) => (
            <div
              className="ultimos-testimonios-item"
              key={testimonio.id}
            >
              <TestimonioCard
                testimonio={testimonio}
              />
            </div>
          ))}
        </div>

        <div className="ultimos-testimonios-footer">
          <Link
            to="/testimonios"
            className="ultimos-testimonios-button"
          >
            Ver más testimonios
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default UltimosTestimonios;
