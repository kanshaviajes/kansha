import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Importamos Link
import { getImagenesPorSeccion } from "./ImagenesWebService";
import "./SeccionViajes.css";

function SeccionViajes() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function cargar() {
      const data = await getImagenesPorSeccion("seccion_viajes");
      setItems(data || []);
    }
    cargar();
  }, []);

  return (
    <section className="seccion-viajes py-5">
      <div className="container">
        <h2 className="text-center mb-5">Nuestros Viajes</h2>
        <div className="viajes-cinta">
          {items.map((item) => {
            // Verificamos si tiene un destino asignado
            const destinoId = item.link;

            return (
              <div key={item.id} className="viaje-item-wrapper">
                {/* Si tiene destino, lo envolvemos en Link, si no, solo mostramos la imagen */}
                {destinoId ? (
                  <Link to={`/${destinoId}`} className="viaje-item">
                    <img src={item.imagen_url} alt="Viaje" />
                    <div className="overlay">
                      <button className="btn-ver-mas">Ver más</button>
                    </div>
                  </Link>
                ) : (
                  <div className="viaje-item">
                    <img src={item.imagen_url} alt="Viaje" />
                    <div className="overlay">
                      <button className="btn-ver-mas" disabled>Sin destino</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default SeccionViajes;