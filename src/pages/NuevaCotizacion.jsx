import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  obtenerPlantillaPorId,
  crearCotizacion,
  crearVueloCotizacion,
  crearHotelCotizacion,
} from "../services/cotizacionesService";

function NuevaCotizacion() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const plantillaId = searchParams.get("plantilla");

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    plantilla_id: null,
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

  const [vuelos, setVuelos] = useState([
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

  const [hoteles, setHoteles] = useState([]);

  useEffect(() => {
    cargarDatosIniciales();
  }, [plantillaId]);

  const cargarDatosIniciales = async () => {
    try {
      setCargando(true);
      setError("");

      if (!plantillaId) {
        setCargando(false);
        return;
      }

      const plantilla = await obtenerPlantillaPorId(plantillaId);

      setForm({
        plantilla_id: plantilla.id,
        cliente: "",
        titulo: plantilla.titulo || "",
        destino: plantilla.destino || "",
        imagen_portada: plantilla.imagen_portada || "",
        incluye: plantilla.incluye || "",
        no_incluye: plantilla.no_incluye || "",
        servicios_exclusivos: plantilla.servicios_exclusivos || "",
        medios_pago: plantilla.medios_pago || "",
        condiciones_generales:
          plantilla.condiciones_generales || "",
        precio_total: "",
        moneda: "USD",
        vigencia_hasta: "",
        activa: true,
      });

      setHoteles(
        (plantilla.plantilla_hoteles || []).map((hotel) => ({
          nombre: hotel.nombre || "",
          estrellas: hotel.estrellas || "",
          regimen: hotel.regimen || "",
          habitacion: hotel.habitacion || "",
          descripcion: hotel.descripcion || "",
          ubicacion: hotel.ubicacion || "",
          imagen_url: hotel.imagen_url || "",
          precio: "",
          moneda: "USD",
        }))
      );
    } catch (err) {
      console.error("Error cargando plantilla:", err);

      setError(
        err?.message ||
          "No se pudo cargar la plantilla seleccionada."
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

  const guardarCotizacion = async (e) => {
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

      const cotizacionCreada = await crearCotizacion({
        plantilla_id: form.plantilla_id,
        cliente: form.cliente,
        titulo: form.titulo,
        destino: form.destino,
        imagen_portada: form.imagen_portada,
        incluye: form.incluye,
        no_incluye: form.no_incluye,
        servicios_exclusivos: form.servicios_exclusivos,
        medios_pago: form.medios_pago,
        condiciones_generales: form.condiciones_generales,
        precio_total: form.precio_total
          ? Number(form.precio_total)
          : null,
        moneda: form.moneda,
        vigencia_hasta: form.vigencia_hasta || null,
        activa: form.activa,
      });

      const vuelosValidos = vuelos.filter(
        (vuelo) =>
          vuelo.aerolinea.trim() ||
          vuelo.origen.trim() ||
          vuelo.destino.trim() ||
          vuelo.fecha
      );

      for (const vuelo of vuelosValidos) {
        await crearVueloCotizacion({
          cotizacion_id: cotizacionCreada.id,
          aerolinea: vuelo.aerolinea,
          numero_vuelo: vuelo.numero_vuelo,
          fecha: vuelo.fecha || null,
          origen: vuelo.origen,
          destino: vuelo.destino,
          hora_salida: vuelo.hora_salida || null,
          hora_llegada: vuelo.hora_llegada || null,
        });
      }

      const hotelesValidos = hoteles.filter((hotel) =>
        hotel.nombre.trim()
      );

      for (const hotel of hotelesValidos) {
        await crearHotelCotizacion({
          cotizacion_id: cotizacionCreada.id,
          nombre: hotel.nombre,
          estrellas: hotel.estrellas
            ? Number(hotel.estrellas)
            : null,
          regimen: hotel.regimen,
          habitacion: hotel.habitacion,
          descripcion: hotel.descripcion,
          ubicacion: hotel.ubicacion,
          imagen_url: hotel.imagen_url,
          precio: hotel.precio
            ? Number(hotel.precio)
            : null,
          moneda: hotel.moneda || "USD",
        });
      }

      navigate("/admin/cotizaciones");
    } catch (err) {
      console.error("Error creando cotización:", err);

      setError(
        err?.message ||
          "Ocurrió un error al crear la cotización."
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
          Nueva cotización
        </h2>

        <p className="text-muted mb-0">
          Creá una propuesta personalizada para un pasajero.
        </p>
      </div>

      {!plantillaId && (
        <div className="alert alert-warning">
          Esta cotización no fue creada desde una plantilla.
          Podés completar todos los datos manualmente.
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={guardarCotizacion}>

        {/* DATOS GENERALES */}

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
                step="0.01"
                min="0"
                className="form-control"
                name="precio_total"
                value={form.precio_total}
                onChange={handleChange}
                placeholder="0.00"
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

          </div>

        </section>

        {/* PORTADA */}

        {form.imagen_portada && (
          <section className="border rounded p-4 mb-4">

            <h4 className="mb-3">
              Portada
            </h4>

            <img
              src={form.imagen_portada}
              alt={form.destino}
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />

          </section>
        )}

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

        {/* VUELOS */}

        <section className="border rounded p-4 mb-4">

          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">

            <div>
              <h4 className="mb-1">
                Vuelos
              </h4>

              <p className="text-muted mb-0">
                Agregá uno o más tramos del itinerario.
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

          {vuelos.map((vuelo, index) => (

            <div
              key={index}
              className="border rounded p-3 mb-4"
            >

              <div className="d-flex justify-content-between align-items-center mb-3">

                <h5 className="mb-0">
                  Vuelo {index + 1}
                </h5>

                {vuelos.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() =>
                      eliminarVuelo(index)
                    }
                  >
                    Eliminar
                  </button>
                )}

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

        {/* HOTELES */}

        <section className="border rounded p-4 mb-4">

          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">

            <div>
              <h4 className="mb-1">
                Hoteles
              </h4>

              <p className="text-muted mb-0">
                Podés usar los hoteles de la plantilla o agregar otros.
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
                <img
                  src={hotel.imagen_url}
                  alt={hotel.nombre}
                  className="mb-3"
                  style={{
                    width: "100%",
                    maxWidth: "350px",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
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
              ? "Generando..."
              : "Generar cotización"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default NuevaCotizacion;