import { useState } from "react";
import "./BuscadorViajes.css";

function BuscadorViajes() {
  const [destino, setDestino] = useState("");

  const handleBuscar = (e) => {
    e.preventDefault();
    console.log("Buscando destino:", destino);
    // Aquí iría la lógica de redirección a resultados o WhatsApp
  };

  return (
    <div className="buscador-container">
      <div className="container">
        <form className="buscador-box shadow-lg" onSubmit={handleBuscar}>
          <div className="input-group">
            <span className="input-group-text bg-white border-0"><i className="bi bi-geo-alt-fill"></i></span>
            <input 
              type="text" 
              className="form-control border-0" 
              placeholder="¿A dónde quieres viajar?" 
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
            />
          </div>
          <div className="vr mx-3"></div>
          <button type="submit" className="btn btn-primary px-4 rounded-pill">
            Buscar
          </button>
        </form>
      </div>
    </div>
  );
}

export default BuscadorViajes;