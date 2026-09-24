import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  crearHojaViaje,
} from "../services/hojasViajeService";

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

function NuevaHojaViaje() {
  const navigate = useNavigate();

  const [formulario, setFormulario] =
    useState(estadoInicial);

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] =
    useState("");

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
  };

  const agregarIncluye = () => {
    setFormulario((anterior) => ({
      ...anterior,
      incluye: [
        ...anterior.incluye,
        "",
      ],
    }));
  };

  const eliminarIncluye = (index) => {
    setFormulario((anterior) => ({
      ...anterior,
      incluye: anterior.incluye.filter(
        (_, indice) => indice !== index
      ),
    }));
  };

  // ======================================================
  // GUARDAR
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

      const incluyeLimpio =
        formulario.incluye
          .map((item) => item.trim())
          .filter(Boolean);

      await crearHojaViaje({
        ...formulario,
        incluye: incluyeLimpio,
      });

      navigate("/admin/hojas-viaje");
    } catch (error) {
      console.error(
        "Error creando hoja de viaje:",
        error
      );

      setError(
        "No se pudo guardar la hoja de viaje."
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="container py-5">

      {/* ENCABEZADO */}

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
          📑 Nueva hoja de viaje
        </h2>

        <p className="text-muted">
          Completa la información que
          aparecerá en la hoja del viaje.
        </p>

      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

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
                  placeholder="Ej: Norte Argentino"
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
                  placeholder="Ej: Grupal terrestre acompañado"
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
                  placeholder="Ej: Turismo 2027"
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
                  value={formulario.fecha_salida}
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
                  value={formulario.fecha_regreso}
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
                  placeholder="7"
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
                  placeholder="5"
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
                  placeholder="Montevideo → Salta → Montevideo"
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
                  placeholder="660"
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
                  placeholder="Por persona - Base doble/triple"
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
                    placeholder={`Servicio ${
                      index + 1
                    }`}
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
                    title="Eliminar"
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
                value={formulario.excursiones}
                onChange={handleChange}
                placeholder="Ej: Durante la estadía se ofrecerán excursiones opcionales..."
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
                placeholder="Ej: Los precios estarán disponibles a partir de febrero de 2027."
              />

            </div>

          </div>

        </section>

        {/* ==================================================
            CONDICIÓN DE SALIDA
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
                  value={formulario.cupo_minimo}
                  onChange={handleChange}
                  placeholder="30"
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
                  placeholder="Describe las condiciones de confirmación, cancelación y devolución..."
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
                    placeholder="250"
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
                  value={formulario.detalle_sena}
                  onChange={handleChange}
                  placeholder="Por persona"
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
              value={formulario.texto_final}
              onChange={handleChange}
              placeholder="Consultanos para reservar tu lugar."
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
            Cancelar
          </button>

          <button
            type="submit"
            className="btn btn-success px-4"
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : "Guardar hoja de viaje"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default NuevaHojaViaje;