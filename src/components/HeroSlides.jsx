import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "./HeroSlides.css";
import { getImagenesPorSeccion } from "./ImagenesWebService";

function HeroSlides() {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getImagenesPorSeccion("hero_slides");
      setSlides(data || []);
    }
    fetchData();
  }, []);

  if (slides.length === 0) return null;

  return (
    <section className="hero-slides">
      <Swiper 
        modules={[Autoplay, EffectFade, Pagination]} 
        effect={"fade"} 
        loop={true} 
        autoplay={{ delay: 4500, disableOnInteraction: false }} 
        pagination={{ clickable: true }} 
        className="hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="hero-slide-inner">
              <img src={slide.imagen_url} alt={slide.titulo || "Viaje"} />
              <div className="hero-overlay">
                <div className="container">
                  <h1 className="hero-title">{slide.titulo}</h1>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default HeroSlides;