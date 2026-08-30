import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  obtenerCotizacionPorId,
  actualizarCotizacion,
  eliminarVuelosCotizacion,
  crearVueloCotizacion,
  eliminarHotelesCotizacion,
  crearHotelCotizacion,
  subirImagenCotizacion,
} from "../services/cotizacionesService";

function EditarCotizacion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    cliente: "",
    titulo: "",
    destino: "",
    imagen_portada: "",
    incluye: "",
    no_incluye: "",
    servicios_exclusivos: "",
    medios_pago: "",
    condiciones_generales: "",
    precio_total: "",
    moneda: "USD",
    vigencia_hasta: "",
    activa: true,
  });

  const [nuevaImagenPortada, setNuevaImagenPortada] =
    useState(null);

  const [vuelos, setVuelos] = useState([]);

  const [hoteles, setHoteles] = useState([]);

  useEffect(() => {
    cargarCotizacion();
  }, [id]);

  const cargarCotizacion = async () => {
    try {
      setCargando(true);
      setError("");

      const data = await obtenerCotizacionPorId(id);

      setForm({
        cliente: data.cliente || "",
        titulo: data.titulo || "",
        destino: data.destino || "",
        imagen_portada: data.imagen_portada || "",
        incluye: data.incluye || "",
        no_incluye: data.no_incluye || "",
        servicios_exclusivos:
          data.servicios_exclusivos || "",
        medios_pago: data.medios_pago || "",
        condiciones_generales:
          data.condiciones_generales || "",
        precio_total:
          data.precio_total !== null &&
          data.precio_total !== undefined
            ? data.precio_total
            : "",
        moneda: data.moneda || "USD",
        vigencia_hasta: data.vigencia_hasta || "",
        activa: data.activa ?? true,
      });

      setVuelos(
        (data.cotizacion_vuelos || []).map((vuelo) => ({
          id: vuelo.id,
          aerolinea: vuelo.aerolinea || "",
          numero_vuelo: vuelo.numero_vuelo || "",
          fecha: vuelo.fecha || "",
          origen: vuelo.origen || "",
          destino: vuelo.destino || "",
          hora_salida: vuelo.hora_salida
            ? vuelo.hora_salida.slice(0, 5)
            : "",
          hora_llegada: vuelo.hora_llegada
            ? vuelo.hora_llegada.slice(0, 5)
            : "",
        }))
      );

      setHoteles(
        (data.cotizacion_hoteles || []).map((hotel) => ({
          id: hotel.id,
          nombre: hotel.nombre || "",
          estrellas: hotel.estrellas || "",
          regimen: hotel.regimen || "",
          habitacion: hotel.habitacion || "",
          descripcion: hotel.descripcion || "",
          ubicacion: hotel.ubicacion || "",
          imagen_url: hotel.imagen_url || "",
          nuevaImagen: null,
          precio:
            hotel.precio !== null &&
            hotel.precio !== undefined
              ? hotel.precio
              : "",
          moneda: hotel.moneda || "USD",
        }))
      );
    } catch (err) {
      console.error("Error cargando cotización:", err);

      setError(
        err?.message ||
          "No se pudo cargar la cotización."
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

  const handleVueloChange = (index, campo, valor) => {
    setVuelos((prev) =>
      prev.map((vuelo, i) =>
        i === index
          ? {
              ...vuelo,
              [campo]: valor,
            }
          : vuelo
      )
    );
  };

  const agregarVuelo = () => {
    setVuelos((prev) => [
      ...prev,
      {
        aerolinea: "",
        numero_vuelo: "",
        fecha: "",
        origen: "",
        destino: "",
        hora_salida: "",
        hora_llegada: "",
      },
    ]);
  };

  const eliminarVuelo = (index) => {
    setVuelos((prev) =>
      prev.filter((_, i) => i !== index)
    );
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
        precio: "",
        moneda: "USD",
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
        throw new Error(
          "Ingresá un título para la cotización."
        );
      }

      if (!form.destino.trim()) {
        throw new Error(
          "Ingresá el destino de la cotización."
        );
      }

      let imagenPortadaUrl = form.imagen_portada;

      if (nuevaImagenPortada) {
        const subida = await subirImagenCotizacion(
          nuevaImagenPortada,
          `cotizaciones/${id}/portada`
        );

        imagenPortadaUrl = subida.url;
      }

      await actualizarCotizacion(id, {
        ...form,
        imagen_portada: imagenPortadaUrl,
        precio_total:
          form.precio_total !== ""
            ? Number(form.precio_total)
            : null,
      });

      // ==================================================
      // VUELOS
      // ==================================================

      await eliminarVuelosCotizacion(id);

      const vuelosValidos = vuelos.filter(
        (vuelo) =>
          vuelo.aerolinea.trim() ||
          vuelo.numero_vuelo.trim() ||
          vuelo.origen.trim() ||
          vuelo.destino.trim() ||
          vuelo.fecha
      );

      for (const vuelo of vuelosValidos) {
        await crearVueloCotizacion({
          cotizacion_id: id,
          aerolinea: vuelo.aerolinea,
          numero_vuelo: vuelo.numero_vuelo,
          fecha: vuelo.fecha || null,
          origen: vuelo.origen,
          destino: vuelo.destino,
          hora_salida: vuelo.hora_salida || null,
          hora_llegada: vuelo.hora_llegada || null,
        });
      }

      // ==================================================
      // HOTELES
      // ==================================================

      await eliminarHotelesCotizacion(id);

      const hotelesValidos = hoteles.filter((hotel) =>
        hotel.nombre.trim()
      );

      for (const hotel of hotelesValidos) {
        let imagenHotelUrl =
          hotel.imagen_url || null;

        if (hotel.nuevaImagen) {
          const subida = await subirImagenCotizacion(
            hotel.nuevaImagen,
            `cotizaciones/${id}/hoteles`
          );

          imagenHotelUrl = subida.url;
        }

        await crearHotelCotizacion({
          cotizacion_id: id,
          nombre: hotel.nombre,
          estrellas: hotel.estrellas
            ? Number(hotel.estrellas)
            : null,
          regimen: hotel.regimen,
          habitacion: hotel.habitacion,
          descripcion: hotel.descripcion,
          ubicacion: hotel.ubicacion,
          imagen_url: imagenHotelUrl,
          precio:
            hotel.precio !== ""
              ? Number(hotel.precio)
              : null,
          moneda: hotel.moneda || "USD",
        });
      }

      navigate("/admin/cotizaciones");
    } catch (err) {
      console.error(
        "Error actualizando cotización:",
        err
      );

      setError(
        err?.message ||
          "Ocurrió un error al actualizar la cotización."
      );
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="container py-5">
        <p>Cargando cotización...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">

      <div className="mb-4">
        <h2 className="mb-1">
          Editar cotización
        </h2>

        <p className="text-muted mb-0">
          Modificá la propuesta antes o después de
          compartirla con el pasajero.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={guardarCambios}>

        {/* =========================================
            DATOS GENERALES
        ========================================= */}

        <section className="border rounded p-4 mb-4 bg-light">

          <h4 className="mb-4">
            Datos de la cotización
          </h4>

          <div className="row g-3">

            <div className="col-12 col-md-6">
              <label className="form-label">
                Cliente
              </label>

              <input
                type="text"
                className="form-control"
                name="cliente"
                value={form.cliente}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez"
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

            <div className="col-12 col-md-4">
              <label className="form-label">
                Precio total
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                name="precio_total"
                value={form.precio_total}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">
                Moneda
              </label>

              <select
                className="form-select"
                name="moneda"
                value={form.moneda}
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

            <div className="col-12 col-md-4">
              <label className="form-label">
                Vigencia hasta
              </label>

              <input
                type="date"
                className="form-control"
                name="vigencia_hasta"
                value={form.vigencia_hasta}
                onChange={handleChange}
              />
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
                  Cotización activa y disponible
                  mediante su link público
                </label>

              </div>

            </div>

          </div>

        </section>


        {/* =========================================
            PORTADA
        ========================================= */}

        <section className="border rounded p-4 mb-4">

          <h4 className="mb-3">
            Imagen de portada
          </h4>

          {form.imagen_portada && (
            <div className="mb-3">

              <img
                src={form.imagen_portada}
                alt={form.destino}
                style={{
                  width: "100%",
                  maxWidth: "650px",
                  height: "300px",
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
            Si no seleccionás una imagen nueva,
            se mantiene la actual.
          </small>

        </section>


        {/* =========================================
            INFORMACIÓN DEL VIAJE
        ========================================= */}

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


        {/* =========================================
            VUELOS
        ========================================= */}

        <section className="border rounded p-4 mb-4">

          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">

            <div>
              <h4 className="mb-1">
                Vuelos
              </h4>

              <p className="text-muted mb-0">
                Editá o agregá tramos del itinerario.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-outline-success"
              onClick={agregarVuelo}
            >
              + Agregar vuelo
            </button>

          </div>

          {vuelos.length === 0 && (
            <div className="alert alert-light border">
              Todavía no hay vuelos agregados.
            </div>
          )}

          {vuelos.map((vuelo, index) => (

            <div
              key={index}
              className="border rounded p-3 mb-4"
            >

              <div className="d-flex justify-content-between align-items-center mb-3">

                <h5 className="mb-0">
                  Vuelo {index + 1}
                </h5>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() =>
                    eliminarVuelo(index)
                  }
                >
                  Eliminar
                </button>

              </div>

              <div className="row g-3">

                <div className="col-12 col-md-4">

                  <label className="form-label">
                    Aerolínea
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={vuelo.aerolinea}
                    onChange={(e) =>
                      handleVueloChange(
                        index,
                        "aerolinea",
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="col-12 col-md-4">

                  <label className="form-label">
                    Número de vuelo
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={vuelo.numero_vuelo}
                    onChange={(e) =>
                      handleVueloChange(
                        index,
                        "numero_vuelo",
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="col-12 col-md-4">

                  <label className="form-label">
                    Fecha
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    value={vuelo.fecha}
                    onChange={(e) =>
                      handleVueloChange(
                        index,
                        "fecha",
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="col-12 col-md-6">

                  <label className="form-label">
                    Origen
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={vuelo.origen}
                    onChange={(e) =>
                      handleVueloChange(
                        index,
                        "origen",
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="col-12 col-md-6">

                  <label className="form-label">
                    Destino
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={vuelo.destino}
                    onChange={(e) =>
                      handleVueloChange(
                        index,
                        "destino",
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="col-12 col-md-6">

                  <label className="form-label">
                    Hora de salida
                  </label>

                  <input
                    type="time"
                    className="form-control"
                    value={vuelo.hora_salida}
                    onChange={(e) =>
                      handleVueloChange(
                        index,
                        "hora_salida",
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="col-12 col-md-6">

                  <label className="form-label">
                    Hora de llegada
                  </label>

                  <input
                    type="time"
                    className="form-control"
                    value={vuelo.hora_llegada}
                    onChange={(e) =>
                      handleVueloChange(
                        index,
                        "hora_llegada",
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>

            </div>
          ))}

        </section>


        {/* =========================================
            HOTELES
        ========================================= */}

        <section className="border rounded p-4 mb-4">

          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">

            <div>

              <h4 className="mb-1">
                Hoteles
              </h4>

              <p className="text-muted mb-0">
                Administrá las opciones de alojamiento
                de esta cotización.
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
              Todavía no hay hoteles agregados.
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
                  onClick={() =>
                    eliminarHotel(index)
                  }
                >
                  Eliminar
                </button>

              </div>

              {hotel.imagen_url && (
                <div className="mb-3">

                  <img
                    src={hotel.imagen_url}
                    alt={hotel.nombre}
                    style={{
                      width: "100%",
                      maxWidth: "400px",
                      height: "210px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />

                </div>
              )}

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

                    <option value="1">
                      1 ⭐
                    </option>

                    <option value="2">
                      2 ⭐
                    </option>

                    <option value="3">
                      3 ⭐
                    </option>

                    <option value="4">
                      4 ⭐
                    </option>

                    <option value="5">
                      5 ⭐
                    </option>

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
                    placeholder="Ej: All Inclusive"
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
                    Si no seleccionás una imagen,
                    se mantiene la actual.
                  </small>

                </div>

                <div className="col-12 col-md-6">

                  <label className="form-label">
                    Precio
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-control"
                    value={hotel.precio}
                    onChange={(e) =>
                      handleHotelChange(
                        index,
                        "precio",
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="col-12 col-md-6">

                  <label className="form-label">
                    Moneda
                  </label>

                  <select
                    className="form-select"
                    value={hotel.moneda}
                    onChange={(e) =>
                      handleHotelChange(
                        index,
                        "moneda",
                        e.target.value
                      )
                    }
                  >

                    <option value="USD">
                      USD
                    </option>

                    <option value="UYU">
                      UYU
                    </option>

                  </select>

                </div>

              </div>

            </div>
          ))}

        </section>


        {/* =========================================
            BOTONES
        ========================================= */}

        <div className="d-flex gap-2 justify-content-end">

          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={guardando}
            onClick={() =>
              navigate("/admin/cotizaciones")
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

export default EditarCotizacion;