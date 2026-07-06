import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase";
import "./PageDestino.css";

function PageDestino() {
  const { id } = useParams();
  const [destino, setDestino] = useState(null);

  useEffect(() => {
    async function fetchDestino() {
      // Forzamos el ID a número por si acaso, y quitamos el .single() 
      // para mayor seguridad en la lectura de datos
      const numericId = parseInt(id);
      
      const { data, error } = await supabase
        .from("destinos")
        .select("*")
        .eq("id", numericId);
      
      if (error) {
        console.error("Error en Supabase:", error);
      } else if (data && data.length > 0) {
        setDestino(data[0]);
      }
    }
    fetchDestino();
  }, [id]);

  // Si no hay destino, mostramos el estado de carga
  if (!destino) return <div className="text-center py-5">Cargando detalles...</div>;

  // Lógica para el formato de moneda
  const simboloMoneda = destino.moneda === 'UYU' ? 'UYU $' : '$';
  
  // Mensaje personalizado para WhatsApp
  const mensajeWpp = `Hola! Quiero información sobre el viaje a ${destino.nombre} de ${destino.noches} noches.`;
  const whatsappLink = `https://wa.me/59891846311?text=${encodeURIComponent(mensajeWpp)}`;

  return (
    <div className="page-destino">
      {/* Hero con la imagen dinámica como fondo */}
      <div 
        className="hero-destino" 
        style={{ backgroundImage: `url(${destino.imagen_url})` }}
      >
        <div className="container">
          <h1 className="display-2 fw-bold text-white">{destino.nombre}</h1>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8">
            <h2 className="mb-3">Sobre este destino</h2>
            <p className="lead">{destino.descripcion}</p>
          </div>
          
          <div className="col-lg-4">
            <div className="card p-4 shadow-lg border-0 rounded-4">
              <h4 className="text-muted">Precio desde:</h4>
              
              <h2 className="display-5 text-primary mb-2">
                {simboloMoneda} {destino.precio} 
                <small className="text-muted fs-6"> {destino.moneda}</small>
              </h2>

              <p className="text-muted fw-bold mb-4">
                <i className="bi bi-moon-stars"></i> {destino.noches} Noches de estadía
              </p>

              <a 
                href={whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-success btn-lg w-100"
              >
                <i className="bi bi-whatsapp me-2"></i> Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageDestino;