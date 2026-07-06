import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./HeroCards.css";
import CardItem from "./CardItem"; 
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
        </div>
      </section>
    );
  }

  if (cards.length === 0) return null;

  return (
    <section className="hero-cards">
      <div className="container">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          grabCursor={true}
          spaceBetween={25}
          breakpoints={{
            0: { slidesPerView: 1.15, spaceBetween: 15 },
            576: { slidesPerView: 1.6, spaceBetween: 18 },
            768: { slidesPerView: 2.2, spaceBetween: 20 },
            992: { slidesPerView: 3, spaceBetween: 22 },
            1200: { slidesPerView: 4, spaceBetween: 25 },
            1600: { slidesPerView: 4.5, spaceBetween: 25 },
          }}
        >
          {cards.map((card) => (
            <SwiperSlide key={card.id}>
              {/* Pasamos la tarjeta completa al componente hijo */}
              <CardItem card={card} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default HeroCards;