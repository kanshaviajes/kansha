import HeroSlides from "../components/HeroSlides";
import HeroCards from "../components/HeroCards";
import SeccionViajes from "../components/SeccionViajes";
import OfertasAereas from "../components/OfertasAereas"; // Importamos el nuevo componente
import FlorenciaCard from "../components/FlorenciaCard";

function Home() {
  return (
    <main>
      {/* El slider principal arriba */}
      <HeroSlides />
      
      <div className="py-5">
        <div className="container">
          <h3 className="mb-4">Destinos Destacados</h3>
        </div>
        <HeroCards />
      </div>

     
      <SeccionViajes />

      <FlorenciaCard />


      <OfertasAereas />

      
    </main>
  );
}

export default Home;