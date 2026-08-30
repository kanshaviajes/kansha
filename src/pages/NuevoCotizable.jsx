import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  crearPlantilla,
  crearHotelPlantilla,
  subirImagenCotizacion,
} from "../services/cotizacionesService";

function NuevoCotizable() {
  const navigate = useNavigate();

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    titulo: "",
    destino: "",
    incluye: "",
    no_incluye: "",
    servicios_exclusivos: "",
    medios_pago: "",
    condiciones_generales: "",
  });

  const [imagenPortada, setImagenPortada] = useState(null);

  const [hoteles, setHoteles] = useState([
    {
      nombre: "",
      estrellas: "",
      regimen: "",
      habitacion: "",
      descripcion: "",
      ubicacion: "",
      imagen: null,
    },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
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
        imagen: null,
      },
    ]);
  };

  const eliminarHotel = (index) => {
    setHoteles((prev) => prev.filter((_, i) => i !== index));
  };

  const guardarCotizable = async (e) => {
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

      let imagenPortadaUrl = null;

      if (imagenPortada) {
        const subida = await subirImagenCotizacion(
          imagenPortada,
          "plantillas/portadas"
        );

        imagenPortadaUrl = subida.url;
      }

      const plantillaCreada = await crearPlantilla({
        ...form,
        imagen_portada: imagenPortadaUrl,
      });

      const hotelesValidos = hoteles.filter((hotel) =>
        hotel.nombre.trim()
      );

      for (const hotel of hotelesValidos) {
        let imagenHotelUrl = null;

        if (hotel.imagen) {
          const subida = await subirImagenCotizacion(
            hotel.imagen,
            `plantillas/${plantillaCreada.id}/hoteles`
          );

          imagenHotelUrl = subida.url;
        }

        await crearHotelPlantilla({
          plantilla_id: plantillaCreada.id,
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
      console.error("Error guardando cotizable:", err);

      setError(
        err?.message || "Ocurrió un error al guardar el cotizable."
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="mb-1">
          Nuevo cotizable
        </h2>

        <p className="text-muted">
          Creá una plantilla reutilizable para futuras cotizaciones.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={guardarCotizable}>
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
                placeholder="Ej: Punta Cana 2026"
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
                placeholder="Ej: Punta Cana"
              />
            </div>

            <div className="col-12">
              <label className="form-label">
                Imagen de portada
              </label>

              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) =>
                  setImagenPortada(e.target.files?.[0] || null)
                }
              />
            </div>
          </div>
        </section>

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
              placeholder={`Ej:
Pasaje aéreo ida y vuelta
7 noches de alojamiento
Desayuno buffet
Transfers in/out`}
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
              placeholder="Ingresá qué servicios no están incluidos"
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
              placeholder="Beneficios o servicios especiales"
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
              placeholder="Ej: transferencia, efectivo, tarjetas..."
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
              placeholder="Ingresá las condiciones generales de la propuesta"
            />
          </div>
        </section>

        <section className="border rounded p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h4 className="mb-1">
                Hoteles frecuentes
              </h4>

              <p className="text-muted mb-0">
                Estos hoteles quedarán guardados dentro de la plantilla.
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

          {hoteles.map((hotel, index) => (
            <div
              key={index}
              className="border rounded p-3 mb-4"
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                  Hotel {index + 1}
                </h5>

                {hoteles.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => eliminarHotel(index)}
                  >
                    Eliminar
                  </button>
                )}
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
                    placeholder="Ej: Standard doble"
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
                        "imagen",
                        e.target.files?.[0] || null
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        <div className="d-flex gap-2 justify-content-end">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate("/admin/cotizables")}
            disabled={guardando}
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
              : "Guardar cotizable"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NuevoCotizable;