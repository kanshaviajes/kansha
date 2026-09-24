import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  obtenerHojasViaje,
  eliminarHojaViaje,
  duplicarHojaViaje,
} from "../services/hojasViajeService";

import {
  generarHojaViajePDF,
} from "../services/pdfService";

import HojaViajeDocumento from "../components/documentos/HojaViajeDocumento";

function HojasViaje() {
  const navigate = useNavigate();

  const documentoRef = useRef(null);

  const [hojas, setHojas] =
    useState([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  const [hojaDescarga, setHojaDescarga] =
    useState(null);

  const [
    descargandoId,
    setDescargandoId,
  ] = useState(null);

  // ======================================================
  // CARGAR HOJAS
  // ======================================================

  const cargarHojas = async () => {
    try {
      setCargando(true);
      setError("");

      const data =
        await obtenerHojasViaje();

      setHojas(data || []);
    } catch (error) {
      console.error(
        "Error cargando hojas de viaje:",
        error
      );

      setError(
        "No se pudieron cargar las hojas de viaje."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarHojas();
  }, []);

  // ======================================================
  // ELIMINAR
  // ======================================================

  const handleEliminar = async (hoja) => {
    const confirmar = window.confirm(
      `¿Seguro que querés eliminar "${hoja.titulo}"?`
    );

    if (!confirmar) {
      return;
    }

    try {
      await eliminarHojaViaje(
        hoja.id
      );

      setHojas((anteriores) =>
        anteriores.filter(
          (item) =>
            item.id !== hoja.id
        )
      );
    } catch (error) {
      console.error(
        "Error eliminando hoja:",
        error
      );

      alert(
        "No se pudo eliminar la hoja de viaje."
      );
    }
  };

  // ======================================================
  // DUPLICAR
  // ======================================================

  const handleDuplicar = async (hoja) => {
    try {
      const copia =
        await duplicarHojaViaje(
          hoja.id
        );

      setHojas((anteriores) => [
        copia,
        ...anteriores,
      ]);
    } catch (error) {
      console.error(
        "Error duplicando hoja:",
        error
      );

      alert(
        "No se pudo duplicar la hoja de viaje."
      );
    }
  };

  // ======================================================
  // DESCARGAR PDF
  // ======================================================

  const handleDescargar = async (hoja) => {
    try {
      setDescargandoId(hoja.id);
      setError("");

      // Renderizamos temporalmente
      // la hoja que queremos descargar.
      setHojaDescarga(hoja);

      // Esperamos a que React termine
      // de renderizar el documento.
      await new Promise((resolve) =>
        setTimeout(resolve, 150)
      );

      if (!documentoRef.current) {
        throw new Error(
          "No se pudo preparar el documento."
        );
      }

      await generarHojaViajePDF(
        documentoRef.current,
        hoja.titulo ||
          "Hoja-de-viaje"
      );
    } catch (error) {
      console.error(
        "Error generando PDF:",
        error
      );

      setError(
        "No se pudo descargar la hoja de viaje."
      );
    } finally {
      setDescargandoId(null);
      setHojaDescarga(null);
    }
  };

  // ======================================================
  // FECHA
  // ======================================================

  const formatearFecha = (fecha) => {
    if (!fecha) {
      return "—";
    }

    const [anio, mes, dia] =
      fecha.split("-");

    return `${dia}/${mes}/${anio}`;
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="container py-5">

      {/* ==================================================
          ENCABEZADO
      ================================================== */}

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

        <div>

          <h2 className="mb-1">
            📑 Hojas de viaje
          </h2>

          <p className="text-muted mb-0">
            Crea, edita y descarga fichas
            informativas de los viajes.
          </p>

        </div>

        <button
          type="button"
          className="btn btn-success"
          onClick={() =>
            navigate(
              "/admin/hojas-viaje/nueva"
            )
          }
        >
          + Nueva hoja de viaje
        </button>

      </div>

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* ==================================================
          CARGANDO
      ================================================== */}

      {cargando && (
        <div className="text-center py-5">

          <p className="text-muted">
            Cargando hojas de viaje...
          </p>

        </div>
      )}

      {/* ==================================================
          SIN HOJAS
      ================================================== */}

      {!cargando &&
        !error &&
        hojas.length === 0 && (
          <div className="border rounded p-5 text-center bg-light">

            <h4>
              Todavía no hay hojas de viaje
            </h4>

            <p className="text-muted">
              Crea la primera ficha
              informativa para comenzar.
            </p>

            <button
              type="button"
              className="btn btn-success"
              onClick={() =>
                navigate(
                  "/admin/hojas-viaje/nueva"
                )
              }
            >
              Crear primera hoja
            </button>

          </div>
        )}

      {/* ==================================================
          LISTADO
      ================================================== */}

      {!cargando &&
        hojas.length > 0 && (
          <div className="card shadow-sm">

            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead className="table-light">

                  <tr>

                    <th>
                      Viaje
                    </th>

                    <th>
                      Salida
                    </th>

                    <th>
                      Precio
                    </th>

                    <th className="text-end">
                      Acciones
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {hojas.map((hoja) => (
                    <tr key={hoja.id}>

                      {/* VIAJE */}

                      <td>

                        <strong>
                          {hoja.titulo}
                        </strong>

                        {hoja.temporada && (
                          <div className="small text-muted">
                            {hoja.temporada}
                          </div>
                        )}

                      </td>

                      {/* SALIDA */}

                      <td>
                        {formatearFecha(
                          hoja.fecha_salida
                        )}
                      </td>

                      {/* PRECIO */}

                      <td>

                        {hoja.precio
                          ? `${
                              hoja.moneda ||
                              "USD"
                            } ${hoja.precio}`
                          : "—"}

                      </td>

                      {/* ACCIONES */}

                      <td>

                        <div className="d-flex justify-content-end gap-2 flex-wrap">

                          {/* EDITAR */}

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              navigate(
                                `/admin/hojas-viaje/${hoja.id}/editar`
                              )
                            }
                          >
                            Editar
                          </button>

                          {/* DUPLICAR */}

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() =>
                              handleDuplicar(
                                hoja
                              )
                            }
                            disabled={
                              descargandoId !==
                              null
                            }
                          >
                            Duplicar
                          </button>

                          {/* DESCARGAR */}

                          <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={() =>
                              handleDescargar(
                                hoja
                              )
                            }
                            disabled={
                              descargandoId !==
                              null
                            }
                          >

                            {descargandoId ===
                            hoja.id
                              ? "Generando..."
                              : "📥 Descargar"}

                          </button>

                          {/* ELIMINAR */}

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              handleEliminar(
                                hoja
                              )
                            }
                            disabled={
                              descargandoId !==
                              null
                            }
                          >
                            Eliminar
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>
        )}

      {/* ==================================================
          VOLVER
      ================================================== */}

      <div className="mt-4">

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() =>
            navigate("/admin")
          }
        >
          ← Volver al panel
        </button>

      </div>

      {/* ==================================================
          DOCUMENTO OCULTO PARA GENERAR PDF

          Tiene que estar renderizado en el DOM para que
          html2canvas pueda capturarlo.

          Lo colocamos fuera de la pantalla en lugar de
          usar display:none.
      ================================================== */}

      {hojaDescarga && (
        <div
          style={{
            position: "fixed",
            left: "-10000px",
            top: "0",
            width: "210mm",
            background: "#ffffff",
            zIndex: -1,
          }}
        >

          <div ref={documentoRef}>

            <HojaViajeDocumento
              hoja={hojaDescarga}
            />

          </div>

        </div>
      )}

    </div>
  );
}

export default HojasViaje;