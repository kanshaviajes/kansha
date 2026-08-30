import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { obtenerPlantillas } from "../services/cotizacionesService";

function Cotizables() {
  const navigate = useNavigate();

  const [plantillas, setPlantillas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarPlantillas();
  }, []);

  const cargarPlantillas = async () => {
    try {
      setCargando(true);
      setError("");

      const data = await obtenerPlantillas();

      setPlantillas(data || []);
    } catch (err) {
      console.error("Error cargando cotizables:", err);

      setError(
        err?.message ||
          "No se pudieron cargar los cotizables."
      );
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="container py-5">
        <p>Cargando cotizables...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

        <div>
          <h2 className="mb-1">
            Cotizables
          </h2>

          <p className="text-muted mb-0">
            Plantillas reutilizables para crear futuras cotizaciones.
          </p>
        </div>

        <div className="d-flex gap-2 flex-wrap">

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() =>
              navigate("/admin/cotizaciones")
            }
          >
            Ver cotizaciones
          </button>

          <button
            type="button"
            className="btn btn-success"
            onClick={() =>
              navigate("/admin/cotizables/nuevo")
            }
          >
            + Nuevo cotizable
          </button>

        </div>

      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {plantillas.length === 0 ? (

        <div className="border rounded p-5 text-center bg-light">

          <h4>
            Todavía no hay cotizables
          </h4>

          <p className="text-muted mb-3">
            Cuando crees tu primera plantilla aparecerá acá.
          </p>

          <button
            type="button"
            className="btn btn-success"
            onClick={() =>
              navigate("/admin/cotizables/nuevo")
            }
          >
            Crear primer cotizable
          </button>

        </div>

      ) : (

        <div className="row g-4">

          {plantillas.map((plantilla) => (

            <div
              className="col-12 col-md-6 col-lg-4"
              key={plantilla.id}
            >

              <div className="card h-100 shadow-sm">

                {plantilla.imagen_portada ? (

                  <img
                    src={plantilla.imagen_portada}
                    className="card-img-top"
                    alt={plantilla.destino}
                    style={{
                      height: "220px",
                      objectFit: "cover",
                    }}
                  />

                ) : (

                  <div
                    className="bg-light d-flex align-items-center justify-content-center text-muted"
                    style={{
                      height: "220px",
                    }}
                  >
                    Sin imagen
                  </div>

                )}

                <div className="card-body d-flex flex-column">

                  <div className="d-flex justify-content-between gap-2 mb-2">

                    <h5 className="card-title mb-0">
                      {plantilla.titulo}
                    </h5>

                    <span
                      className={
                        plantilla.activa
                          ? "badge text-bg-success"
                          : "badge text-bg-secondary"
                      }
                    >
                      {plantilla.activa
                        ? "Activa"
                        : "Inactiva"}
                    </span>

                  </div>

                  <p className="text-muted mb-2">
                    {plantilla.destino}
                  </p>

                  <p className="small mb-4">
                    Hoteles guardados:{" "}
                    {plantilla.plantilla_hoteles?.length || 0}
                  </p>

                  <div className="mt-auto d-flex gap-2 flex-wrap">

                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() =>
                        navigate(
                          `/admin/cotizables/${plantilla.id}/editar`
                        )
                      }
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      disabled={!plantilla.activa}
                      onClick={() =>
                        navigate(
                          `/admin/cotizaciones/nueva?plantilla=${plantilla.id}`
                        )
                      }
                    >
                      Crear cotización
                    </button>

                  </div>

                  {!plantilla.activa && (
                    <small className="text-muted mt-2">
                      Activá esta plantilla para poder crear nuevas cotizaciones.
                    </small>
                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Cotizables;