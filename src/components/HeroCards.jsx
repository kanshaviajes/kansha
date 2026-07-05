import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import "./HeroCards.css";

import DestinationCard from "./DestinationCard";
import { getImagenesPorSeccion } from "./ImagenesWebService";

function HeroCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCards();
  }, []);

  async function cargarCards() {
    try {
      const data = await getImagenesPorSeccion("hero_cards");
      setCards(data || []);
    } catch (error) {
      console.error("Error cargando Hero Cards:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="hero-cards">
        <div className="container text-center py-5">
          <p>Cargando destinos...</p>
        </div>
      </section>
    );
  }

  if (cards.length === 0) {
    return (
      <section className="hero-cards">
        <div className="container text-center py-5">
          <h4>No hay tarjetas cargadas.</h4>
          <p>Agregá imágenes en la sección <strong>hero_cards</strong> de Supabase.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="hero-cards">
      <div className="container">

        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={25}
          grabCursor={true}
          breakpoints={{
            0: {
              slidesPerView: 1.15,
            },
            768: {
              slidesPerView: 2,
            },
            1200: {
              slidesPerView: 2.3,
            },
          }}
        >
          {cards.map((card) => (
            <SwiperSlide key={card.id}>
              <DestinationCard imagen={card} />
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}

export default HeroCards;