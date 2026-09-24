import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  obtenerHojaViajePorId,
  actualizarHojaViaje,
} from "../services/hojasViajeService";

import {
  generarHojaViajePDF,
} from "../services/pdfService";

import HojaViajeDocumento from "../components/documentos/HojaViajeDocumento";

// ======================================================
// ESTADO INICIAL
// ======================================================

const estadoInicial = {
  titulo: "",
  modalidad: "",
  temporada: "",

  fecha_salida: "",
  fecha_regreso: "",

  dias: "",
  noches: "",

  moneda: "USD",
  precio: "",
  detalle_precio: "",

  recorrido: "",

  incluye: [""],

  excursiones: "",
  nota_excursiones: "",

  condicion_salida: "",
  cupo_minimo: "",

  sena: "",
  detalle_sena: "",

  texto_final: "",
};

// ======================================================
// COMPONENTE
// ======================================================

function EditarHojaViaje() {
  const navigate = useNavigate();
  const { id } = useParams();

  const documentoRef = useRef(null);

  const [formulario, setFormulario] =
    useState(estadoInicial);

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [descargando, setDescargando] =
    useState(false);

  const [error, setError] =
    useState("");

  const [mensaje, setMensaje] =
    useState("");

  // ======================================================
  // CARGAR HOJA
  // ======================================================

  useEffect(() => {
    const cargarHoja = async () => {
      try {
        setCargando(true);
        setError("");

        const hoja =
          await obtenerHojaViajePorId(id);

        setFormulario({
          titulo: hoja.titulo || "",
          modalidad: hoja.modalidad || "",
          temporada: hoja.temporada || "",

          fecha_salida:
            hoja.fecha_salida || "",

          fecha_regreso:
            hoja.fecha_regreso || "",

          dias:
            hoja.dias ?? "",

          noches:
            hoja.noches ?? "",

          moneda:
            hoja.moneda || "USD",

          precio:
            hoja.precio ?? "",

          detalle_precio:
            hoja.detalle_precio || "",

          recorrido:
            hoja.recorrido || "",

          incluye:
            Array.isArray(hoja.incluye) &&
            hoja.incluye.length > 0
              ? hoja.incluye
              : [""],

          excursiones:
            hoja.excursiones || "",

          nota_excursiones:
            hoja.nota_excursiones || "",

          condicion_salida:
            hoja.condicion_salida || "",

          cupo_minimo:
            hoja.cupo_minimo ?? "",

          sena:
            hoja.sena ?? "",

          detalle_sena:
            hoja.detalle_sena || "",

          texto_final:
            hoja.texto_final || "",
        });
      } catch (error) {
        console.error(
          "Error cargando hoja de viaje:",
          error
        );

        setError(
          "No se pudo cargar la hoja de viaje."
        );
      } finally {
        setCargando(false);
      }
    };

    cargarHoja();
  }, [id]);

  // ======================================================
  // CAMPOS NORMALES
  // ======================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setMensaje("");
  };

  // ======================================================
  // INCLUYE
  // ======================================================

  const handleIncluyeChange = (
    index,
    value
  ) => {
    setFormulario((anterior) => {
      const nuevosItems = [
        ...anterior.incluye,
      ];

      nuevosItems[index] = value;

      return {
        ...anterior,
        incluye: nuevosItems,
      };
    });

    setMensaje("");
  };

  const agregarIncluye = () => {
    setFormulario((anterior) => ({
      ...anterior,

      incluye: [
        ...anterior.incluye,
        "",
      ],
    }));

    setMensaje("");
  };

  const eliminarIncluye = (index) => {
    setFormulario((anterior) => ({
      ...anterior,

      incluye:
        anterior.incluye.filter(
          (_, indice) =>
            indice !== index
        ),
    }));

    setMensaje("");
  };

  // ======================================================
  // GUARDAR CAMBIOS
  // ======================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formulario.titulo.trim()) {
      setError(
        "Ingresá el nombre del viaje."
      );

      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      const incluyeLimpio =
        formulario.incluye
          .map((item) => item.trim())
          .filter(Boolean);

      await actualizarHojaViaje(
        id,
        {
          ...formulario,
          incluye: incluyeLimpio,
        }
      );

      setFormulario((anterior) => ({
        ...anterior,
        incluye:
          incluyeLimpio.length > 0
            ? incluyeLimpio
            : [""],
      }));

      setMensaje(
        "Los cambios se guardaron correctamente."
      );
    } catch (error) {
      console.error(
        "Error actualizando hoja de viaje:",
        error
      );

      setError(
        "No se pudieron guardar los cambios."
      );
    } finally {
      setGuardando(false);
    }
  };

  // ======================================================
  // DESCARGAR PDF
  // ======================================================

  const handleDescargarPDF = async () => {
    try {
      if (!documentoRef.current) {
        throw new Error(
          "No se encontró la vista previa."
        );
      }

      setDescargando(true);
      setError("");

      await generarHojaViajePDF(
        documentoRef.current,
        formulario.titulo ||
          "Hoja-de-viaje"
      );
    } catch (error) {
      console.error(
        "Error generando PDF:",
        error
      );

      setError(
        "No se pudo generar el PDF."
      );
    } finally {
      setDescargando(false);
    }
  };

  // ======================================================
  // CARGANDO
  // ======================================================

  if (cargando) {
    return (
      <div className="container py-5">

        <div className="text-center py-5">

          <p className="text-muted">
            Cargando hoja de viaje...
          </p>

        </div>

      </div>
    );
  }

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="container py-5">

      {/* ==================================================
          ENCABEZADO
      ================================================== */}

      <div className="mb-4">

        <button
          type="button"
          className="btn btn-link px-0 text-decoration-none mb-2"
          onClick={() =>
            navigate("/admin/hojas-viaje")
          }
        >
          ← Volver a hojas de viaje
        </button>

        <h2 className="mb-1">
          ✏️ Editar hoja de viaje
        </h2>

        <p className="text-muted mb-0">
          Modifica la información, guarda
          los cambios y descarga la hoja
          para el pasajero.
        </p>

      </div>

      {/* ==================================================
          MENSAJES
      ================================================== */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="alert alert-success">
          {mensaje}
        </div>
      )}

      {/* ==================================================
          FORMULARIO
      ================================================== */}

      <form onSubmit={handleSubmit}>

        {/* ==================================================
            INFORMACIÓN PRINCIPAL
        ================================================== */}

        <section className="card shadow-sm mb-4">

          <div className="card-body p-4">

            <h4 className="mb-4">
              ✈️ Información del viaje
            </h4>

            <div className="row g-3">

              <div className="col-12">

                <label className="form-label">
                  Nombre del viaje *
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="titulo"
                  value={formulario.titulo}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-12 col-md-6">

                <label className="form-label">
                  Modalidad
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="modalidad"
                  value={formulario.modalidad}
                  onChange={handleChange}
                />

              </div>

              <div className="col-12 col-md-6">

                <label className="form-label">
                  Temporada
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="temporada"
                  value={formulario.temporada}
                  onChange={handleChange}
                />

              </div>

              <div className="col-12 col-md-6">

                <label className="form-label">
                  Fecha de salida
                </label>

                <input
                  type="date"
                  className="form-control"
                  name="fecha_salida"
                  value={
                    formulario.fecha_salida
                  }
                  onChange={handleChange}
                />

              </div>

              <div className="col-12 col-md-6">

                <label className="form-label">
                  Fecha de regreso
                </label>

                <input
                  type="date"
                  className="form-control"
                  name="fecha_regreso"
                  value={
                    formulario.fecha_regreso
                  }
                  onChange={handleChange}
                />

              </div>

              <div className="col-6 col-md-3">

                <label className="form-label">
                  Días
                </label>

                <input
                  type="number"
                  min="0"
                  className="form-control"
                  name="dias"
                  value={formulario.dias}
                  onChange={handleChange}
                />

              </div>

              <div className="col-6 col-md-3">

                <label className="form-label">
                  Noches
                </label>

                <input
                  type="number"
                  min="0"
                  className="form-control"
                  name="noches"
                  value={formulario.noches}
                  onChange={handleChange}
                />

              </div>

              <div className="col-12 col-md-6">

                <label className="form-label">
                  Recorrido
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="recorrido"
                  value={formulario.recorrido}
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>

        </section>

        {/* ==================================================
            PRECIO
        ================================================== */}

        <section className="card shadow-sm mb-4">

          <div className="card-body p-4">

            <h4 className="mb-4">
              💰 Precio
            </h4>

            <div className="row g-3">

              <div className="col-4 col-md-2">

                <label className="form-label">
                  Moneda
                </label>

                <select
                  className="form-select"
                  name="moneda"
                  value={formulario.moneda}
                  onChange={handleChange}
                >
                  <option value="USD">
                    USD
                  </option>

                  <option value="UYU">
                    UYU
                  </option>
                </select>

              </div>

              <div className="col-8 col-md-4">

                <label className="form-label">
                  Precio
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-control"
                  name="precio"
                  value={formulario.precio}
                  onChange={handleChange}
                />

              </div>

              <div className="col-12 col-md-6">

                <label className="form-label">
                  Detalle del precio
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="detalle_precio"
                  value={
                    formulario.detalle_precio
                  }
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>

        </section>

        {/* ==================================================
            INCLUYE
        ================================================== */}

        <section className="card shadow-sm mb-4">

          <div className="card-body p-4">

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">

              <h4 className="mb-0">
                ✨ El paquete incluye
              </h4>

              <button
                type="button"
                className="btn btn-sm btn-outline-success"
                onClick={agregarIncluye}
              >
                + Agregar
              </button>

            </div>

            {formulario.incluye.map(
              (item, index) => (
                <div
                  key={index}
                  className="d-flex gap-2 mb-2"
                >

                  <input
                    type="text"
                    className="form-control"
                    value={item}
                    onChange={(event) =>
                      handleIncluyeChange(
                        index,
                        event.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() =>
                      eliminarIncluye(index)
                    }
                    disabled={
                      formulario.incluye
                        .length === 1
                    }
                  >
                    ×
                  </button>

                </div>
              )
            )}

          </div>

        </section>

        {/* ==================================================
            EXCURSIONES
        ================================================== */}

        <section className="card shadow-sm mb-4">

          <div className="card-body p-4">

            <h4 className="mb-4">
              🏜️ Excursiones
            </h4>

            <div className="mb-3">

              <label className="form-label">
                Información de excursiones
              </label>

              <textarea
                className="form-control"
                rows="4"
                name="excursiones"
                value={
                  formulario.excursiones
                }
                onChange={handleChange}
              />

            </div>

            <div>

              <label className="form-label">
                Nota adicional
              </label>

              <textarea
                className="form-control"
                rows="2"
                name="nota_excursiones"
                value={
                  formulario.nota_excursiones
                }
                onChange={handleChange}
              />

            </div>

          </div>

        </section>

        {/* ==================================================
            CONDICIONES
        ================================================== */}

        <section className="card shadow-sm mb-4">

          <div className="card-body p-4">

            <h4 className="mb-4">
              🚌 Condición de salida
            </h4>

            <div className="row g-3">

              <div className="col-12 col-md-3">

                <label className="form-label">
                  Cupo mínimo
                </label>

                <input
                  type="number"
                  min="0"
                  className="form-control"
                  name="cupo_minimo"
                  value={
                    formulario.cupo_minimo
                  }
                  onChange={handleChange}
                />

              </div>

              <div className="col-12 col-md-9">

                <label className="form-label">
                  Condiciones
                </label>

                <textarea
                  className="form-control"
                  rows="5"
                  name="condicion_salida"
                  value={
                    formulario.condicion_salida
                  }
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>

        </section>

        {/* ==================================================
            SEÑA
        ================================================== */}

        <section className="card shadow-sm mb-4">

          <div className="card-body p-4">

            <h4 className="mb-4">
              💳 Seña
            </h4>

            <div className="row g-3">

              <div className="col-12 col-md-4">

                <label className="form-label">
                  Importe
                </label>

                <div className="input-group">

                  <span className="input-group-text">
                    {formulario.moneda}
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-control"
                    name="sena"
                    value={formulario.sena}
                    onChange={handleChange}
                  />

                </div>

              </div>

              <div className="col-12 col-md-8">

                <label className="form-label">
                  Detalle de la seña
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="detalle_sena"
                  value={
                    formulario.detalle_sena
                  }
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>

        </section>

        {/* ==================================================
            TEXTO FINAL
        ================================================== */}

        <section className="card shadow-sm mb-4">

          <div className="card-body p-4">

            <h4 className="mb-3">
              📲 Texto final
            </h4>

            <label className="form-label">
              Mensaje de cierre
            </label>

            <input
              type="text"
              className="form-control"
              name="texto_final"
              value={
                formulario.texto_final
              }
              onChange={handleChange}
            />

          </div>

        </section>

        {/* ==================================================
            ACCIONES
        ================================================== */}

        <div className="d-flex justify-content-end gap-2 flex-wrap">

          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={guardando}
            onClick={() =>
              navigate("/admin/hojas-viaje")
            }
          >
            Volver
          </button>

          <button
            type="submit"
            className="btn btn-success px-4"
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : "Guardar cambios"}
          </button>

        </div>

      </form>

      {/* ==================================================
          VISTA PREVIA
      ================================================== */}

      <section className="mt-5">

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

          <div>

            <h3 className="mb-1">
              📄 Vista previa
            </h3>

            <p className="text-muted mb-0">
              Así se verá la hoja que
              recibirá el pasajero.
            </p>

          </div>

          <button
            type="button"
            className="btn btn-success"
            onClick={handleDescargarPDF}
            disabled={descargando}
          >
            {descargando
              ? "Generando PDF..."
              : "📥 Descargar PDF"}
          </button>

        </div>

        {/* CONTENEDOR GRIS DE LA PREVISUALIZACIÓN */}

        <div
          style={{
            overflowX: "auto",
            background: "#e9ecef",
            padding: "30px",
            borderRadius: "10px",
          }}
        >

          {/* HOJA A4 */}

          <div
            ref={documentoRef}
            style={{
              width: "210mm",
              margin: "0 auto",
              boxShadow:
                "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >

            <HojaViajeDocumento
              hoja={formulario}
            />

          </div>

        </div>

      </section>

    </div>
  );
}

export default EditarHojaViaje;