import HeroSlides from "../components/HeroSlides";
import HeroCards from "../components/HeroCards";
import SeccionViajes from "../components/SeccionViajes";
import OfertasAereas from "../components/OfertasAereas";
import FlorenciaCard from "../components/FlorenciaCard";
import UltimosTestimonios from "../components/testimonios/UltimosTestimonios";


function Home() {

  return (

    <main>

      {/* Slider principal */}
      <HeroSlides />



      {/* Destinos destacados */}
      <div className="py-5">

        <div className="container">

          <h3 className="mb-4">
            Destinos Destacados
          </h3>

        </div>


        <HeroCards />

      </div>




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