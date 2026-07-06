import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import { getImagenesPorSeccion } from "./ImagenesWebService";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "./HeroSlides.css";

function HeroSlides() {
  const [slides, setSlides] = useState([]);
  const [destinos, setDestinos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const dataSlides = await getImagenesPorSeccion("hero_slides");
      setSlides(dataSlides || []);
      const { data } = await supabase.from("destinos").select("id, nombre");
      setDestinos(data || []);
    }
    fetchData();
  }, []);

  if (slides.length === 0) return null;

  return (
    <section className="hero-slides">
      <Swiper modules={[Autoplay, EffectFade, Pagination]} effect={"fade"} loop={true} autoplay={{ delay: 4500 }} pagination={{ clickable: true }} className="hero-swiper">
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="hero-slide-inner">
              <img src={slide.imagen_url} alt={slide.titulo} />
              <div className="hero-overlay">
                <div className="container">
                  <h1 className="hero-title">{slide.titulo}</h1>
                  <button className="btn btn-outline-light btn-lg rounded-pill px-5" onClick={() => setIsOpen(!isOpen)}>
                    Explorar ahora
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* MENÚ FLOTANTE (Fixed para que no se corte nunca) */}
      {isOpen && (
        <>
          <div className="dropdown-backdrop" onClick={() => setIsOpen(false)}></div>
          <div className="dropdown-menu-fixed">
            {destinos.map(d => (
              <Link key={d.id} to={`/${d.id}`} className="dropdown-item" onClick={() => setIsOpen(false)}>
                {d.nombre}
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default HeroSlides;