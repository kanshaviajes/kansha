import { useEffect, useState } from "react";
import { getImagenesPorSeccion } from "../components/ImagenesWebService";

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
    <section className="container py-5">

      <h3 className="mb-4">Ofertas Aéreas</h3>

      <div className="row g-4">

        {ofertas.map((oferta) => (
          <div className="col-md-4" key={oferta.id}>

            <div className="card shadow-sm border-0 h-100 overflow-hidden">

              {/* IMAGEN */}
              <img
                src={oferta.imagen_url}
                alt={oferta.titulo}
                style={{
                  height: "220px",
                  objectFit: "cover",
                  width: "100%",
                }}
              />

              <div className="card-body">

                {/* CATEGORIA */}
                {oferta.categoria && (
                  <span className="badge bg-dark mb-2">
                    {oferta.categoria}
                  </span>
                )}

                {/* TITULO */}
                <h5 className="mb-1">
                  {oferta.titulo}
                </h5>

                {/* DESCRIPCION */}
                <p className="text-muted mb-2">
                  {oferta.descripcion}
                </p>

                {/* PRECIO */}
                <h4 className="text-primary fw-bold">
                  {oferta.precio}
                </h4>

              </div>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}

export default OfertasAereas;