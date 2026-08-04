import { useEffect } from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import "./App.css";

// Páginas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import PageDestino from "./pages/PageDestino";
import Testimonios from "./pages/Testimonios";
import Documentos from "./pages/Documentos"; // <-- NUEVO

// Componente para subir el scroll automáticamente al cambiar de ruta
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // Cambiá a "auto" si querés que suba de golpe sin animación
    });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />

          {/* Nuevo módulo Documentos */}
          <Route path="/documentos" element={<Documentos />} />

          {/* Página de testimonios */}
          <Route path="/testimonios" element={<Testimonios />} />

          {/* Ruta dinámica */}
          <Route path="/destino/:id" element={<PageDestino />} />
        </Routes>
      </main>

      <Footer />

      {/* Botón flotante siempre visible */}
      <WhatsAppButton />
    </>
  );
}

export default App;