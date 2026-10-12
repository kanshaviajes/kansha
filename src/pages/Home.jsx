
import Hero from "../components/hero/Hero";
import DestinosDestacados from "../components/destacados/DestinosDestacados";
import OfertasAereas from "../components/OfertasAereas";
import FlorenciaCard from "../components/FlorenciaCard";
import UltimosTestimonios from "../components/testimonios/UltimosTestimonios";

function Home() {
  return (
    <main>
      {/* Hero principal */}
      <Hero />

      {/* Últimos viajes publicados */}
      <DestinosDestacados />

      {/* Asesoramiento personalizado */}
      <FlorenciaCard />

      {/* Experiencias de nuestros viajeros */}
      <UltimosTestimonios />

      {/* Ofertas aéreas */}
      <OfertasAereas />
    </main>
  );
}

export default Home;
