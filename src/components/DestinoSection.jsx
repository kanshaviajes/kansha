import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

function DestinoSection({ titulo, imagenes }) {
  if (!imagenes?.length) return null;

  return (
    <section className="py-4">

      <div className="container">

        <Splide
          options={{
            type: "loop",
            autoplay: true,
            interval: 3500,
            pauseOnHover: true,
            arrows: false,
            pagination: false,
            perPage: 1,
          }}
        >

          {imagenes.map((img) => (
            <SplideSlide key={img.id}>
              <div
                style={{
                  height: "450px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >

                {/* IMAGEN */}
                <img
                  src={img.imagen_url}
                  alt={titulo}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                {/* OVERLAY GRADIENTE */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.05))",
                  }}
                />

                {/* TEXTO */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 70,
                    left: 20,
                    color: "white",
                    zIndex: 2,
                    fontSize: "18px",
                    fontWeight: "500",
                  }}
                >
                  {titulo}
                </div>

          
                <div
                  style={{
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    zIndex: 2,
                  }}
                >
                  <button className="btn btn-light btn-sm rounded-pill px-4">
                    Ver más
                  </button>
                </div>

              </div>
            </SplideSlide>
          ))}

        </Splide>

      </div>

    </section>
  );
}

export default DestinoSection;