import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  obtenerCotizaciones,
  actualizarCotizacion,
} from "../services/cotizacionesService";

function MisCotizaciones() {
  const navigate = useNavigate();

  const [cotizaciones, setCotizaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [copiadoId, setCopiadoId] = useState(null);
  const [actualizandoId, setActualizandoId] = useState(null);

  useEffect(() => {
    cargarCotizaciones();
  }, []);

  const cargarCotizaciones = async () => {
    try {
      setCargando(true);
      setError("");

      const data = await obtenerCotizaciones();

      setCotizaciones(data || []);
    } catch (err) {
      console.error("Error cargando cotizaciones:", err);

      setError(
        err?.message ||
          "No se pudieron cargar las cotizaciones."
      );
    } finally {
      setCargando(false);
    }
  };

  const copiarLink = async (cotizacion) => {
    try {
      const url = `${window.location.origin}/cotizacion/${cotizacion.public_token}`;

      await navigator.clipboard.writeText(url);

      setCopiadoId(cotizacion.id);

      setTimeout(() => {
        setCopiadoId(null);
      }, 2000);
    } catch (err) {
      console.error("Error copiando link:", err);

      setError("No se pudo copiar el link.");
    }
  };

  const cambiarEstado = async (cotizacion) => {
    try {
      setActualizandoId(cotizacion.id);
      setError("");

      const nuevoEstado = !cotizacion.activa;

      await actualizarCotizacion(cotizacion.id, {
        ...cotizacion,
        activa: nuevoEstado,
      });

      setCotizaciones((prev) =>
        prev.map((item) =>
          item.id === cotizacion.id
            ? {
                ...item,
                activa: nuevoEstado,
              }
            : item
        )
      );
    } catch (err) {
      console.error("Error cambiando estado:", err);

      setError(
        err?.message ||
          "No se pudo actualizar el estado de la cotización."
      );
    } finally {
      setActualizandoId(null);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) {
      return "-";
    }

    const [year, month, day] = fecha.split("-");

    return `${day}/${month}/${year}`;
  };

  const formatearPrecio = (precio, moneda) => {
    if (
      precio === null ||
      precio === undefined ||
      precio === ""
    ) {
      return "Sin precio";
    }

    const numero = Number(precio);

    if (Number.isNaN(numero)) {
      return `${moneda || "USD"} ${precio}`;
    }

    return `${moneda || "USD"} ${numero.toLocaleString("es-UY", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (cargando) {
    return (
      <div className="container py-5">
        <p>Cargando cotizaciones...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

        <div>
          <h2 className="mb-1">
            Cotizaciones generadas
          </h2>

          <p className="text-muted mb-0">
            Historial de propuestas creadas para pasajeros.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() =>
            navigate("/admin/cotizables")
          }
        >
          Ver cotizables
        </button>

      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {cotizaciones.length === 0 ? (

        <div className="border rounded p-5 text-center bg-light">

          <h4>
            Todavía no hay cotizaciones
          </h4>

          <p className="text-muted mb-3">
            Cuando generes una cotización desde un cotizable,
            aparecerá acá.
          </p>

          <button
            type="button"
            className="btn btn-success"
            onClick={() =>
              navigate("/admin/cotizables")
            }
          >
            Ir a cotizables
          </button>

        </div>

      ) : (

        <div className="row g-4">

          {cotizaciones.map((cotizacion) => (

            <div
              key={cotizacion.id}
              className="col-12 col-md-6 col-xl-4"
            >

              <div className="card h-100 shadow-sm">

                {cotizacion.imagen_portada ? (

                  <img
                    src={cotizacion.imagen_portada}
                    className="card-img-top"
                    alt={cotizacion.destino}
                    style={{
                      height: "220px",
                      objectFit: "cover",
                    }}
                  />

                ) : (

                  <div
                    className="bg-light d-flex justify-content-center align-items-center text-muted"
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
                      {cotizacion.titulo}
                    </h5>

                    <span
                      className={
                        cotizacion.activa
                          ? "badge text-bg-success"
                          : "badge text-bg-secondary"
                      }
                    >
                      {cotizacion.activa
                        ? "Activa"
                        : "Inactiva"}
                    </span>

                  </div>

                  <p className="text-muted mb-2">
                    {cotizacion.destino}
                  </p>

                  <div className="small mb-3">

                    <p className="mb-1">
                      <strong>Cliente:</strong>{" "}
                      {cotizacion.cliente || "Sin asignar"}
                    </p>

                    <p className="mb-1">
                      <strong>Precio:</strong>{" "}
                      {formatearPrecio(
                        cotizacion.precio_total,
                        cotizacion.moneda
                      )}
                    </p>

                    <p className="mb-1">
                      <strong>Emitida:</strong>{" "}
                      {formatearFecha(
                        cotizacion.fecha_emision
                      )}
                    </p>

                    <p className="mb-1">
                      <strong>Vigencia:</strong>{" "}
                      {cotizacion.vigencia_hasta
                        ? formatearFecha(
                            cotizacion.vigencia_hasta
                          )
                        : "Sin fecha límite"}
                    </p>

                    <p className="mb-1">
                      <strong>Vuelos:</strong>{" "}
                      {cotizacion.cotizacion_vuelos?.length || 0}
                    </p>

                    <p className="mb-0">
                      <strong>Hoteles:</strong>{" "}
                      {cotizacion.cotizacion_hoteles?.length || 0}
                    </p>

                  </div>

                  <div className="mt-auto d-flex gap-2 flex-wrap">

                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      onClick={() =>
                        navigate(
                          `/cotizacion/${cotizacion.public_token}`
                        )
                      }
                    >
                      Ver
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() =>
                        navigate(
                          `/admin/cotizaciones/${cotizacion.id}/editar`
                        )
                      }
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() =>
                        copiarLink(cotizacion)
                      }
                    >
                      {copiadoId === cotizacion.id
                        ? "Link copiado"
                        : "Copiar link"}
                    </button>

                    <button
                      type="button"
                      className={
                        cotizacion.activa
                          ? "btn btn-outline-danger btn-sm"
                          : "btn btn-outline-success btn-sm"
                      }
                      disabled={
                        actualizandoId === cotizacion.id
                      }
                      onClick={() =>
                        cambiarEstado(cotizacion)
                      }
                    >
                      {actualizandoId === cotizacion.id
                        ? "Guardando..."
                        : cotizacion.activa
                        ? "Desactivar"
                        : "Activar"}
                    </button>

                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>

      )}

    </div>
  );
}

export default MisCotizaciones;