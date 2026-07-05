import { useEffect, useState } from "react";

import HeroCards from "../components/HeroCards";
import DestinoSection from "../components/DestinoSection";
import FlorenciaCard from "../components/FlorenciaCard";
import VideoPromo from "../components/VideoPromo";
import OfertasAereas from "../components/OfertasAereas";

import { getImagenesPorSeccion } from "../components/ImagenesWebService";

function Home() {
  const [imagenes, setImagenes] = useState([]);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    const data = await getImagenesPorSeccion("destino_slides");
    setImagenes(data || []);
  }

  // Agrupar por destino
  const destinos = {
    destino_1: [],
    destino_2: [],
    destino_3: [],
    destino_4: [],
  };

  imagenes.forEach((img) => {
    if (destinos[img.titulo]) {
      destinos[img.titulo].push(img);
    }
  });

  return (
    <main>

      {/* HERO */}
      <HeroCards />

      {/* DESTINOS */}
      <DestinoSection
        titulo="Destino 1"
        imagenes={destinos.destino_1}
      />

      <DestinoSection
        titulo="Destino 2"
        imagenes={destinos.destino_2}
      />

      <DestinoSection
        titulo="Destino 3"
        imagenes={destinos.destino_3}
      />

      <DestinoSection
        titulo="Destino 4"
        imagenes={destinos.destino_4}
      />

      {/* PRESENTACIÓN */}
      <FlorenciaCard />

      {/* VIDEO PROMO */}
      <VideoPromo />

      {/* OFERTAS AÉREAS */}
      <OfertasAereas />

    </main>
  );
}

export default Home;