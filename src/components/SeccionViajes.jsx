import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
            const destinoId = item.link;

            return (
              <div key={item.id} className="viaje-item-wrapper">
                {destinoId ? (
                  // CAMBIO REALIZADO: Agregamos '/destino/' al path
                  <Link to={`/destino/${destinoId}`} className="viaje-item">
                    <img src={item.imagen_url} alt="Viaje" />
                    <div className="overlay"></div> 
                  </Link>
                ) : (
                  <div className="viaje-item">
                    <img src={item.imagen_url} alt="Viaje" />
                    <div className="overlay"></div>
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