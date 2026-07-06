import { useEffect, useState } from "react";
import { getImagenesPorSeccion } from "../components/ImagenesWebService";
import "./OfertasAereas.css"; // Para estilos personalizados

function OfertasAereas() {
  const [ofertas, setOfertas] = useState([]);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    const data = await getImagenesPorSeccion("ofertas_aereas");
    setOfertas(data || []);
  }

  return (
    <section className="py-5">
      <div className="container">
        <h3 className="mb-4 text-center">Septiembre Increíble</h3>
        <div className="row g-4">
          {ofertas.map((oferta) => (
            <div className="col-md-4" key={oferta.id}>
              <div className="card h-100 border-0 shadow-sm rounded-4 oferta-card">
                <div className="overflow-hidden rounded-top-4">
                  <img
                    src={oferta.imagen_url}
                    alt={oferta.titulo}
                    className="card-img-top oferta-img"
                  />
                </div>
                <div className="card-body d-flex flex-column">
                  {oferta.categoria && (
                    <span className="badge bg-light text-dark mb-2 align-self-start">
                      {oferta.categoria}
                    </span>
                  )}
                  <h5 className="card-title">{oferta.titulo}</h5>
                  <p className="card-text text-muted small flex-grow-1">
                    {oferta.descripcion}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <h4 className="mb-0 text-primary fw-bold">{oferta.precio}</h4>
                    <button className="btn btn-outline-dark btn-sm rounded-pill">
                      Reservar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OfertasAereas;