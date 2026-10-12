
import "./FlorenciaCard.css";

function FlorenciaCard() {
  return (
    <section
      className="florencia-section"
      aria-labelledby="florencia-title"
    >
      <div className="container">
        <div className="florencia-layout">

          {/* FOTOGRAFÍA */}
          <div className="florencia-visual">
            <div className="florencia-photo">
              <img
                src="/florencia.png"
                alt="Florencia, creadora de Kansha Viajes"
                loading="lazy"
              />
            </div>

            <div className="florencia-photo-label">
              <span className="florencia-label-icon">
                ✦
              </span>

              <span>
                VIAJES CON IDENTIDAD PROPIA
              </span>
            </div>
          </div>

          {/* PRESENTACIÓN */}
          <div className="florencia-content">
            <div className="florencia-eyebrow">
              <span className="florencia-eyebrow-line" />
              DETRÁS DE KANSHA
            </div>

            <h2
              id="florencia-title"
              className="florencia-title"
            >
              Hola, soy{" "}
              <span>Florencia.</span>
              <span
                className="florencia-greeting"
                aria-hidden="true"
              >
                👋
              </span>
            </h2>

            <p className="florencia-intro">
              Soy una emprendedora uruguaya apasionada
              por crear experiencias de viaje únicas.
            </p>

            <div className="florencia-text">
              <p>
                Me especializo en diseñar viajes pensados
                al detalle, cuidando cada etapa del proceso.
              </p>

              <p>
                Soy madre de dos niños, lo que me enseñó
                a organizar, planificar y cuidar cada
                detalle como si fuera propio.
              </p>

              <p>
                Con muchos años de experiencia en el rubro,
                mi objetivo es simple: que cada persona
                viva el viaje de su vida.
              </p>
            </div>

            <div className="florencia-signature">
              <span className="florencia-signature-line" />

              <div>
                <strong>Florencia</strong>
                <span>Kansha Viajes</span>
              </div>

              <span
                className="florencia-signature-star"
                aria-hidden="true"
              >
                ✳
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default FlorenciaCard;
