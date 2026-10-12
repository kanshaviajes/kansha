
import Hero from "../components/hero/Hero";
import HeroCards from "../components/HeroCards";
import SeccionViajes from "../components/SeccionViajes";
import OfertasAereas from "../components/OfertasAereas";
import FlorenciaCard from "../components/FlorenciaCard";
import UltimosTestimonios from "../components/testimonios/UltimosTestimonios";

function Home() {
  return (
    <main>
      {/* Nuevo Hero interactivo */}
      <Hero />

      {/* Destinos destacados - temporalmente conservados */}
      <section className="py-5">
        <div className="container">
          <h3 className="mb-4">
            Destinos Destacados
          </h3>
        </div>

        <HeroCards />
      </section>

      {/* Sección viajes */}
      <SeccionViajes />

      {/* Tarjeta Florencia */}
      <FlorenciaCard />

      {/* Últimos testimonios */}
      <UltimosTestimonios />

      {/* Ofertas aéreas */}
      <OfertasAereas />
    </main>
  );
}

export default Home;
