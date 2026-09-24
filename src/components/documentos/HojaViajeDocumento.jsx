import "./HojaViajeDocumento.css";

function formatearFecha(fecha) {
  if (!fecha) return "";

  const [anio, mes, dia] = fecha.split("-");

  return `${dia}/${mes}/${anio}`;
}

function HojaViajeDocumento({ hoja }) {
  if (!hoja) {
    return null;
  }

  const tieneDuracion =
    hoja.dias || hoja.noches;

  const tienePrecio =
    hoja.precio !== "" &&
    hoja.precio !== null &&
    hoja.precio !== undefined;

  const tieneSena =
    hoja.sena !== "" &&
    hoja.sena !== null &&
    hoja.sena !== undefined;

  const incluye =
    Array.isArray(hoja.incluye)
      ? hoja.incluye.filter(
          (item) => item?.trim()
        )
      : [];

  return (
    <article className="hoja-viaje-documento">

      {/* ==========================================
          MEMBRETE
      ========================================== */}

      <header className="hoja-viaje-header">

        <img
          src="/logo.png"
          alt="Kansha Viajes"
          className="hoja-viaje-logo"
        />

        <div className="hoja-viaje-header-linea" />

      </header>

      {/* ==========================================
          TÍTULO
      ========================================== */}

      <section className="hoja-viaje-titulo">

        <h1>
          {hoja.titulo || "Nombre del viaje"}
        </h1>

        {(hoja.modalidad ||
          hoja.temporada) && (
          <div className="hoja-viaje-subtitulo">

            {hoja.modalidad && (
              <span>
                {hoja.modalidad}
              </span>
            )}

            {hoja.modalidad &&
              hoja.temporada && (
                <span className="hoja-viaje-separador">
                  |
                </span>
              )}

            {hoja.temporada && (
              <span>
                {hoja.temporada}
              </span>
            )}

          </div>
        )}

      </section>

      {/* ==========================================
          INFORMACIÓN PRINCIPAL
      ========================================== */}

      <section className="hoja-viaje-resumen">

        {(hoja.fecha_salida ||
          hoja.fecha_regreso) && (
          <div className="hoja-viaje-fechas">

            {hoja.fecha_salida && (
              <div>
                <span className="hoja-viaje-label">
                  SALIDA
                </span>

                <strong>
                  {formatearFecha(
                    hoja.fecha_salida
                  )}
                </strong>
              </div>
            )}

            {hoja.fecha_regreso && (
              <div>
                <span className="hoja-viaje-label">
                  REGRESO
                </span>

                <strong>
                  {formatearFecha(
                    hoja.fecha_regreso
                  )}
                </strong>
              </div>
            )}

          </div>
        )}

        {tieneDuracion && (
          <div className="hoja-viaje-duracion">

            {hoja.dias && (
              <strong>
                {hoja.dias} días
              </strong>
            )}

            {hoja.dias &&
              hoja.noches && (
                <span> + </span>
              )}

            {hoja.noches && (
              <strong>
                {hoja.noches} noches
              </strong>
            )}

          </div>
        )}

        {hoja.recorrido && (
          <div className="hoja-viaje-recorrido">
            📍 {hoja.recorrido}
          </div>
        )}

      </section>

      {/* ==========================================
          PRECIO
      ========================================== */}

      {tienePrecio && (
        <section className="hoja-viaje-precio">

          <span className="hoja-viaje-precio-label">
            PRECIO
          </span>

          <div className="hoja-viaje-precio-valor">
            {hoja.moneda || "USD"}{" "}
            {hoja.precio}
          </div>

          {hoja.detalle_precio && (
            <div className="hoja-viaje-precio-detalle">
              {hoja.detalle_precio}
            </div>
          )}

        </section>
      )}

      {/* ==========================================
          INCLUYE
      ========================================== */}

      {incluye.length > 0 && (
        <section className="hoja-viaje-bloque">

          <h2>
            EL PAQUETE INCLUYE
          </h2>

          <ul className="hoja-viaje-lista">

            {incluye.map(
              (item, index) => (
                <li key={index}>
                  {item}
                </li>
              )
            )}

          </ul>

        </section>
      )}

      {/* ==========================================
          EXCURSIONES
      ========================================== */}

      {(hoja.excursiones ||
        hoja.nota_excursiones) && (
          <section className="hoja-viaje-bloque">

            <h2>
              EXCURSIONES
            </h2>

            {hoja.excursiones && (
              <p>
                {hoja.excursiones}
              </p>
            )}

            {hoja.nota_excursiones && (
              <p className="hoja-viaje-nota">
                📌 {hoja.nota_excursiones}
              </p>
            )}

          </section>
        )}

      {/* ==========================================
          CONDICIONES
      ========================================== */}

      {(hoja.condicion_salida ||
        hoja.cupo_minimo) && (
          <section className="hoja-viaje-bloque">

            <h2>
              CONDICIÓN DE SALIDA
            </h2>

            {hoja.cupo_minimo && (
              <p>
                <strong>
                  Cupo mínimo:{" "}
                  {hoja.cupo_minimo} pasajeros.
                </strong>
              </p>
            )}

            {hoja.condicion_salida && (
              <p>
                {hoja.condicion_salida}
              </p>
            )}

          </section>
        )}

      {/* ==========================================
          SEÑA
      ========================================== */}

      {tieneSena && (
        <section className="hoja-viaje-sena">

          <span>
            SEÑA
          </span>

          <strong>
            {hoja.moneda || "USD"}{" "}
            {hoja.sena}
          </strong>

          {hoja.detalle_sena && (
            <small>
              {hoja.detalle_sena}
            </small>
          )}

        </section>
      )}

      {/* ==========================================
          CIERRE
      ========================================== */}

      {hoja.texto_final && (
        <section className="hoja-viaje-cierre">
          {hoja.texto_final}
        </section>
      )}

      {/* ==========================================
          PIE
      ========================================== */}

      <footer className="hoja-viaje-footer">

        <div className="hoja-viaje-footer-linea" />

        <strong>
          KANSHA VIAJES & TURISMO
        </strong>

      </footer>

    </article>
  );
}

export default HojaViajeDocumento;