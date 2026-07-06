import { useState, useEffect } from "react";
import "./WhatsAppButton.css";

function WhatsAppButton() {
  const [showAutoBubble, setShowAutoBubble] = useState(false);
  const telefono = "59891846311";
  const mensaje = "¡Hola! ¿Te gustaría mi ayuda?";

  useEffect(() => {
    // 1. Mostrar la burbuja a los 2 segundos
    const timerShow = setTimeout(() => setShowAutoBubble(true), 2000);
    // 2. Esconderla a los 7 segundos
    const timerHide = setTimeout(() => setShowAutoBubble(false), 3500);

    return () => {
      clearTimeout(timerShow);
      clearTimeout(timerHide);
    };
  }, []);

  return (
    <a 
      href={`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`} 
      className="whatsapp-float" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      {/* Usamos una clase 'auto-show' para el saludo inicial */}
      <div className={`chat-bubble ${showAutoBubble ? "auto-show" : ""}`}>
        <span>¡Hola! ¿Te gustaría mi ayuda?</span>
      </div>
      
      <div className="avatar-container">
        <img src="/florencia.png" alt="Florencia" className="avatar-img" />
        <span className="online-dot"></span>
      </div>
    </a>
  );
}

export default WhatsAppButton;