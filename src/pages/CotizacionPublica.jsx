import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { obtenerCotizacionPublica } from "../services/cotizacionesService";

function CotizacionPublica() {
  const { token } = useParams();

  const [cotizacion, setCotizacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarCotizacion();
  }, [token]);

  const cargarCotizacion = async () => {
    try {
      setCargando(true);
      setError("");

      const data = await obtenerCotizacionPublica(token);

      setCotizacion(data);
    } catch (err) {
      console.error("Error cargando cotización pública:", err);

      setError(
        err?.message ||
          "La cotización no se encuentra disponible."
      );
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";

    const [year, month, day] = fecha.split("-");

    return `${day}/${month}/${year}`;
  };

  const formatearPrecio = (precio, moneda = "USD") => {
    if (
      precio === null ||
      precio === undefined ||
      precio === ""
    ) {
      return null;
    }

    const numero = Number(precio);

    if (Number.isNaN(numero)) {
      return `${moneda} ${precio}`;
    }

    return `${moneda} ${numero.toLocaleString("es-UY", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const convertirTextoEnLineas = (texto) => {
    if (!texto) return [];

    return texto
      .split("\n")
      .map((linea) => linea.trim())
      .filter(Boolean);
  };

  if (cargando) {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border text-success mb-3"
          role="status"
        >
          <span className="visually-hidden">
            Cargando...
          </span>
        </div>

        <p className="text-muted">
          Cargando cotización...
        </p>
      </div>
    );
  }

  if (error || !cotizacion) {
    return (
      <div className="container py-5">
        <div
          className="alert alert-warning text-center mx-auto"
          style={{ maxWidth: "700px" }}
        >
          <h4 className="alert-heading">
            Cotización no disponible
          </h4>

          <p className="mb-0">
            {error ||
              "Esta cotización no existe o ya no se encuentra disponible."}
          </p>
        </div>
      </div>
    );
  }

  const precioTotal = formatearPrecio(
    cotizacion.precio_total,
    cotizacion.moneda
  );

  return (
    <div className="bg-light min-vh-100">

      {/* HERO */}

      <section
        className="position-relative d-flex align-items-end"
        style={{
          minHeight: "420px",
          backgroundColor: "#1f2937",
          backgroundImage: cotizacion.imagen_portada
            ? `linear-gradient(
                rgba(0, 0, 0, 0.15),
                rgba(0, 0, 0, 0.7)
              ),
              url("${cotizacion.imagen_portada}")`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container text-white pb-5">

          <p className="text-uppercase mb-2">
            Propuesta de viaje
          </p>

          <h1 className="display-4 fw-bold mb-2">
            {cotizacion.titulo}
          </h1>

          <h4 className="fw-normal mb-3">
            {cotizacion.destino}
          </h4>

          {cotizacion.cliente && (
            <p className="fs-5 mb-0">
              Preparada especialmente para{" "}
              <strong>{cotizacion.cliente}</strong>
            </p>
          )}

        </div>
      </section>


      <div className="container py-5">

        {/* INFORMACIÓN GENERAL */}

        <div className="card border-0 shadow-sm mb-4">

          <div className="card-body p-4">

            <div className="row g-4">

              <div className="col-12 col-md-4">
                <small className="text-muted d-block">
                  Fecha de emisión
                </small>

                <strong>
                  {formatearFecha(
                    cotizacion.fecha_emision
                  )}
                </strong>
              </div>

              <div className="col-12 col-md-4">
                <small className="text-muted d-block">
                  Vigencia
                </small>

                <strong>
                  {cotizacion.vigencia_hasta
                    ? `Hasta el ${formatearFecha(
                        cotizacion.vigencia_hasta
                      )}`
                    : "Sin fecha límite"}
                </strong>
              </div>

              {precioTotal && (
                <div className="col-12 col-md-4">

                  <small className="text-muted d-block">
                    Precio
                  </small>

                  <strong className="fs-4 text-success">
                    {precioTotal}
                  </strong>

                </div>
              )}

            </div>

          </div>

        </div>


        {/* INCLUYE */}

        {cotizacion.incluye && (
          <section className="card border-0 shadow-sm mb-4">

            <div className="card-body p-4">

              <h3 className="mb-4">
                Tu viaje incluye
              </h3>

              <ul className="mb-0">
                {convertirTextoEnLineas(
                  cotizacion.incluye
                ).map((linea, index) => (
                  <li
                    key={index}
                    className="mb-2"
                  >
                    {linea}
                  </li>
                ))}
              </ul>

            </div>

          </section>
        )}


        {/* VUELOS */}

        {cotizacion.vuelos?.length > 0 && (
          <section className="card border-0 shadow-sm mb-4">

            <div className="card-body p-4">

              <h3 className="mb-4">
                ✈️ Vuelos
              </h3>

              <div className="row g-3">

                {cotizacion.vuelos.map(
                  (vuelo, index) => (

                    <div
                      key={vuelo.id || index}
                      className="col-12"
                    >

                      <div className="border rounded p-3">

                        <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">

                          <strong>
                            {vuelo.aerolinea ||
                              "Vuelo"}
                          </strong>

                          {vuelo.numero_vuelo && (
                            <span className="text-muted">
                              {vuelo.numero_vuelo}
                            </span>
                          )}

                        </div>

                        <div className="row g-3">

                          <div className="col-12 col-md-3">
                            <small className="text-muted d-block">
                              Fecha
                            </small>

                            <strong>
                              {formatearFecha(
                                vuelo.fecha
                              )}
                            </strong>
                          </div>

                          <div className="col-6 col-md-3">
                            <small className="text-muted d-block">
                              Salida
                            </small>

                            <strong>
                              {vuelo.origen || "-"}
                            </strong>

                            {vuelo.hora_salida && (
                              <div>
                                {vuelo.hora_salida.slice(
                                  0,
                                  5
                                )}
                              </div>
                            )}
                          </div>

                          <div className="col-6 col-md-3">
                            <small className="text-muted d-block">
                              Llegada
                            </small>

                            <strong>
                              {vuelo.destino || "-"}
                            </strong>

                            {vuelo.hora_llegada && (
                              <div>
                                {vuelo.hora_llegada.slice(
                                  0,
                                  5
                                )}
                              </div>
                            )}
                          </div>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

          </section>
        )}


        {/* HOTELES */}

        {cotizacion.hoteles?.length > 0 && (
          <section className="mb-4">

            <h3 className="mb-4">
              🏨 Opciones de alojamiento
            </h3>

            <div className="row g-4">

              {cotizacion.hoteles.map(
                (hotel, index) => {

                  const precioHotel =
                    formatearPrecio(
                      hotel.precio,
                      hotel.moneda
                    );

                  return (
                    <div
                      key={hotel.id || index}
                      className="col-12 col-lg-6"
                    >

                      <div className="card h-100 border-0 shadow-sm">

                        {hotel.imagen_url && (
                          <img
                            src={hotel.imagen_url}
                            alt={hotel.nombre}
                            className="card-img-top"
                            style={{
                              height: "260px",
                              objectFit: "cover",
                            }}
                          />
                        )}

                        <div className="card-body p-4">

                          <div className="d-flex justify-content-between align-items-start gap-3">

                            <div>
                              <h4 className="mb-1">
                                {hotel.nombre}
                              </h4>

                              {hotel.estrellas && (
                                <div className="text-warning mb-2">
                                  {"★".repeat(
                                    Number(
                                      hotel.estrellas
                                    )
                                  )}
                                </div>
                              )}
                            </div>

                            {precioHotel && (
                              <strong className="text-success fs-5">
                                {precioHotel}
                              </strong>
                            )}

                          </div>

                          {hotel.ubicacion && (
                            <p className="text-muted">
                              📍 {hotel.ubicacion}
                            </p>
                          )}

                          {hotel.regimen && (
                            <p className="mb-2">
                              <strong>
                                Régimen:
                              </strong>{" "}
                              {hotel.regimen}
                            </p>
                          )}

                          {hotel.habitacion && (
                            <p className="mb-2">
                              <strong>
                                Habitación:
                              </strong>{" "}
                              {hotel.habitacion}
                            </p>
                          )}

                          {hotel.descripcion && (
                            <p className="mb-0 mt-3">
                              {hotel.descripcion}
                            </p>
                          )}

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </section>
        )}


        {/* SERVICIOS EXCLUSIVOS */}

        {cotizacion.servicios_exclusivos && (
          <section className="card border-0 shadow-sm mb-4">

            <div className="card-body p-4">

              <h3 className="mb-3">
                ✨ Servicios exclusivos
              </h3>

              <div style={{ whiteSpace: "pre-line" }}>
                {cotizacion.servicios_exclusivos}
              </div>

            </div>

          </section>
        )}


        {/* NO INCLUYE */}

        {cotizacion.no_incluye && (
          <section className="card border-0 shadow-sm mb-4">

            <div className="card-body p-4">

              <h3 className="mb-3">
                No incluye
              </h3>

              <div style={{ whiteSpace: "pre-line" }}>
                {cotizacion.no_incluye}
              </div>

            </div>

          </section>
        )}


        {/* MEDIOS DE PAGO */}

        {cotizacion.medios_pago && (
          <section className="card border-0 shadow-sm mb-4">

            <div className="card-body p-4">

              <h3 className="mb-3">
                💳 Medios de pago
              </h3>

              <div style={{ whiteSpace: "pre-line" }}>
                {cotizacion.medios_pago}
              </div>

            </div>

          </section>
        )}


        {/* CONDICIONES */}

        {cotizacion.condiciones_generales && (
          <section className="card border-0 shadow-sm mb-4">

            <div className="card-body p-4">

              <h3 className="mb-3">
                Condiciones generales
              </h3>

              <div
                className="text-muted"
                style={{
                  whiteSpace: "pre-line",
                }}
              >
                {cotizacion.condiciones_generales}
              </div>

            </div>

          </section>
        )}

      </div>

    </div>
  );
}

export default CotizacionPublica;