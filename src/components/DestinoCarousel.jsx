import { useEffect, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

import { getImagenesPorDestino } from "./ImagenesWebService";

function DestinoCarousel({ titulo, nombre }) {
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    try {
      setLoading(true);

      const data = await getImagenesPorDestino(nombre);
      setImagenes(data || []);

    } catch (error) {
      console.error("Error cargando destino:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container py-5">
        <p>Cargando {titulo}...</p>
      </div>
    );
  }

  if (!imagenes.length) return null;

  return (
    <section className="py-4">

      {/* HEADER */}
      <div className="container mb-3 d-flex justify-content-between align-items-center">

        <h3 className="mb-0">{titulo}</h3>

        <button className="btn btn-outline-dark btn-sm rounded-pill">
          Ver más
        </button>

      </div>

      {/* SLIDER */}
      <div className="container">

        <Splide
          options={{
            type: "loop",
            autoplay: true,
            interval: 3000,
            pauseOnHover: true,
            arrows: false,
            pagination: false,
            perPage: 1,
          }}
        >

          {imagenes
            .sort((a, b) => a.orden - b.orden)
            .map((img) => (
              <SplideSlide key={img.id}>

                <div
                  style={{
                    height: "420px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >

                  <img
                    src={img.imagen_url}
                    alt={titulo}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  {/* overlay */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 20,
                      left: 20,
                      color: "white",
                      background: "rgba(0,0,0,0.4)",
                      padding: "10px 15px",
                      borderRadius: "10px",
                    }}
                  >
                    {titulo}
                  </div>

                </div>

              </SplideSlide>
            ))}

        </Splide>

      </div>

    </section>
  );
}

export default DestinoCarousel;