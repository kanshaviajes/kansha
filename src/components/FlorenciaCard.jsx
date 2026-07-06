import "./FlorenciaCard.css"; // Vamos a crear este archivo pequeño

function FlorenciaCard() {
  return (
    <section className="py-5">
      <div className="container">
        {/* Agregué la clase florencia-card para el marco */}
        <div className="row align-items-center shadow-lg rounded-4 overflow-hidden bg-white florencia-card">

          {/* IMAGEN */}
          <div className="col-md-5 p-0">
            <img
              src="/florencia.png"
              alt="Florencia"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                minHeight: "420px",
              }}
            />
          </div>

          {/* TEXTO */}
          <div className="col-md-7 p-4 p-md-5">
            <h2 className="mb-3">Hola, soy Florencia 👋</h2>
            <p className="text-muted mb-3">
              Soy una emprendedora uruguaya apasionada por crear experiencias de viaje únicas.
              Me especializo en diseñar viajes pensados al detalle, cuidando cada etapa del proceso.
            </p>
            <p className="text-muted mb-3">
              Soy madre de dos niños, lo que me enseñó a organizar, planificar y cuidar cada detalle
              como si fuera propio.
            </p>
            <p className="text-muted mb-0">
              Con más de años de experiencia en el rubro, mi objetivo es simple:
              que cada persona viva el viaje de su vida.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FlorenciaCard;