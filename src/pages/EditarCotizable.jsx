import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  obtenerPlantillaPorId,
  actualizarPlantilla,
  eliminarHotelesPlantilla,
  crearHotelPlantilla,
  subirImagenCotizacion,
} from "../services/cotizacionesService";

function EditarCotizable() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    titulo: "",
    destino: "",
    imagen_portada: "",
    incluye: "",
    no_incluye: "",
    servicios_exclusivos: "",
    medios_pago: "",
    condiciones_generales: "",
    activa: true,
  });

  const [nuevaImagenPortada, setNuevaImagenPortada] = useState(null);

  const [hoteles, setHoteles] = useState([]);

  useEffect(() => {
    cargarPlantilla();
  }, [id]);

  const cargarPlantilla = async () => {
    try {
      setCargando(true);
      setError("");

      const data = await obtenerPlantillaPorId(id);

      setForm({
        titulo: data.titulo || "",
        destino: data.destino || "",
        imagen_portada: data.imagen_portada || "",
        incluye: data.incluye || "",
        no_incluye: data.no_incluye || "",
        servicios_exclusivos: data.servicios_exclusivos || "",
        medios_pago: data.medios_pago || "",
        condiciones_generales: data.condiciones_generales || "",
        activa: data.activa ?? true,
      });

      setHoteles(
        (data.plantilla_hoteles || []).map((hotel) => ({
          id: hotel.id,
          nombre: hotel.nombre || "",
          estrellas: hotel.estrellas || "",
          regimen: hotel.regimen || "",
          habitacion: hotel.habitacion || "",
          descripcion: hotel.descripcion || "",
          ubicacion: hotel.ubicacion || "",
          imagen_url: hotel.imagen_url || "",
          nuevaImagen: null,
        }))
      );
    } catch (err) {
      console.error("Error cargando cotizable:", err);
      setError(
        err?.message || "No se pudo cargar el cotizable."
      );
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleHotelChange = (index, campo, valor) => {
    setHoteles((prev) =>
      prev.map((hotel, i) =>
        i === index
          ? {
              ...hotel,
              [campo]: valor,
            }
          : hotel
      )
    );
  };

  const agregarHotel = () => {
    setHoteles((prev) => [
      ...prev,
      {
        nombre: "",
        estrellas: "",
        regimen: "",
        habitacion: "",
        descripcion: "",
        ubicacion: "",
        imagen_url: "",
        nuevaImagen: null,
      },
    ]);
  };

  const eliminarHotel = (index) => {
    setHoteles((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const guardarCambios = async (e) => {
    e.preventDefault();

    try {
      setGuardando(true);
      setError("");

      if (!form.titulo.trim()) {
        throw new Error("Ingresá un título.");
      }

      if (!form.destino.trim()) {
        throw new Error("Ingresá un destino.");
      }

      let imagenPortadaUrl = form.imagen_portada;

      if (nuevaImagenPortada) {
        const subida = await subirImagenCotizacion(
          nuevaImagenPortada,
          `plantillas/${id}/portada`
        );

        imagenPortadaUrl = subida.url;
      }

      await actualizarPlantilla(id, {
        ...form,
        imagen_portada: imagenPortadaUrl,
      });

      /*
        Para mantener el sistema simple y consistente:
        eliminamos las filas de hoteles de esta plantilla
        y las volvemos a crear con el estado actual del formulario.

        Esto NO elimina las imágenes del Storage.
      */
      await eliminarHotelesPlantilla(id);

      const hotelesValidos = hoteles.filter((hotel) =>
        hotel.nombre.trim()
      );

      for (const hotel of hotelesValidos) {
        let imagenHotelUrl = hotel.imagen_url || null;

        if (hotel.nuevaImagen) {
          const subida = await subirImagenCotizacion(
            hotel.nuevaImagen,
            `plantillas/${id}/hoteles`
          );

          imagenHotelUrl = subida.url;
        }

        await crearHotelPlantilla({
          plantilla_id: id,
          nombre: hotel.nombre,
          estrellas: hotel.estrellas
            ? Number(hotel.estrellas)
            : null,
          regimen: hotel.regimen,
          habitacion: hotel.habitacion,
          descripcion: hotel.descripcion,
          ubicacion: hotel.ubicacion,
          imagen_url: imagenHotelUrl,
        });
      }

      navigate("/admin/cotizables");
    } catch (err) {
      console.error("Error actualizando cotizable:", err);

      setError(
        err?.message ||
          "Ocurrió un error al actualizar el cotizable."
      );
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="container py-5">
        <p>Cargando cotizable...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="mb-1">
          Editar cotizable
        </h2>

        <p className="text-muted">
          Modificá la plantilla que después podrás usar para crear
          nuevas cotizaciones.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={guardarCambios}>

        {/* INFORMACIÓN GENERAL */}

        <section className="border rounded p-4 mb-4 bg-light">
          <h4 className="mb-4">
            Información general
          </h4>

          <div className="row g-3">

            <div className="col-12 col-md-6">
              <label className="form-label">
                Título
              </label>

              <input
                type="text"
                className="form-control"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">
                Destino
              </label>

              <input
                type="text"
                className="form-control"
                name="destino"
                value={form.destino}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">
                Imagen de portada
              </label>

              {form.imagen_portada && (
                <div className="mb-3">
                  <img
                    src={form.imagen_portada}
                    alt={form.destino}
                    style={{
                      width: "100%",
                      maxWidth: "500px",
                      height: "250px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              )}

              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) =>
                  setNuevaImagenPortada(
                    e.target.files?.[0] || null
                  )
                }
              />

              <small className="text-muted">
                Si no elegís otra imagen, se mantiene la actual.
              </small>
            </div>

            <div className="col-12">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="activa"
                  name="activa"
                  checked={form.activa}
                  onChange={handleChange}
                />

                <label
                  className="form-check-label"
                  htmlFor="activa"
                >
                  Plantilla activa
                </label>
              </div>
            </div>

          </div>
        </section>

        {/* INFORMACIÓN DEL VIAJE */}

        <section className="border rounded p-4 mb-4">
          <h4 className="mb-4">
            Información del viaje
          </h4>

          <div className="mb-3">
            <label className="form-label">
              ¿Qué incluye?
            </label>

            <textarea
              className="form-control"
              rows="5"
              name="incluye"
              value={form.incluye}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              No incluye
            </label>

            <textarea
              className="form-control"
              rows="4"
              name="no_incluye"
              value={form.no_incluye}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Servicios exclusivos
            </label>

            <textarea
              className="form-control"
              rows="4"
              name="servicios_exclusivos"
              value={form.servicios_exclusivos}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Medios de pago
            </label>

            <textarea
              className="form-control"
              rows="4"
              name="medios_pago"
              value={form.medios_pago}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">
              Condiciones generales
            </label>

            <textarea
              className="form-control"
              rows="6"
              name="condiciones_generales"
              value={form.condiciones_generales}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* HOTELES */}

        <section className="border rounded p-4 mb-4">

          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">

            <div>
              <h4 className="mb-1">
                Hoteles
              </h4>

              <p className="text-muted mb-0">
                Administrá los hoteles guardados para este destino.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-outline-success"
              onClick={agregarHotel}
            >
              + Agregar hotel
            </button>

          </div>

          {hoteles.length === 0 && (
            <div className="alert alert-light border">
              Esta plantilla todavía no tiene hoteles.
            </div>
          )}

          {hoteles.map((hotel, index) => (

            <div
              key={index}
              className="border rounded p-3 mb-4"
            >

              <div className="d-flex justify-content-between align-items-center mb-3">

                <h5 className="mb-0">
                  Hotel {index + 1}
                </h5>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => eliminarHotel(index)}
                >
                  Eliminar
                </button>

              </div>

              <div className="row g-3">

                <div className="col-12 col-md-6">
                  <label className="form-label">
                    Nombre
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={hotel.nombre}
                    onChange={(e) =>
                      handleHotelChange(
                        index,
                        "nombre",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label">
                    Estrellas
                  </label>

                  <select
                    className="form-select"
                    value={hotel.estrellas}
                    onChange={(e) =>
                      handleHotelChange(
                        index,
                        "estrellas",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Seleccionar
                    </option>

                    <option value="1">1 ⭐</option>
                    <option value="2">2 ⭐</option>
                    <option value="3">3 ⭐</option>
                    <option value="4">4 ⭐</option>
                    <option value="5">5 ⭐</option>
                  </select>
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label">
                    Régimen
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={hotel.regimen}
                    onChange={(e) =>
                      handleHotelChange(
                        index,
                        "regimen",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">
                    Habitación
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={hotel.habitacion}
                    onChange={(e) =>
                      handleHotelChange(
                        index,
                        "habitacion",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">
                    Ubicación
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={hotel.ubicacion}
                    onChange={(e) =>
                      handleHotelChange(
                        index,
                        "ubicacion",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">
                    Descripción
                  </label>

                  <textarea
                    className="form-control"
                    rows="3"
                    value={hotel.descripcion}
                    onChange={(e) =>
                      handleHotelChange(
                        index,
                        "descripcion",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="col-12">

                  <label className="form-label">
                    Imagen
                  </label>

                  {hotel.imagen_url && (
                    <div className="mb-3">
                      <img
                        src={hotel.imagen_url}
                        alt={hotel.nombre}
                        style={{
                          width: "100%",
                          maxWidth: "350px",
                          height: "180px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) =>
                      handleHotelChange(
                        index,
                        "nuevaImagen",
                        e.target.files?.[0] || null
                      )
                    }
                  />

                  <small className="text-muted">
                    Si no elegís otra imagen, se mantiene la actual.
                  </small>

                </div>

              </div>
            </div>
          ))}

        </section>

        {/* BOTONES */}

        <div className="d-flex gap-2 justify-content-end">

          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={guardando}
            onClick={() =>
              navigate("/admin/cotizables")
            }
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn btn-success"
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : "Guardar cambios"}
          </button>

        </div>

      </form>
    </div>
  );
}

export default EditarCotizable;