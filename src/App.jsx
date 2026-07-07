import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />

          {/* Página de testimonios */}
          <Route path="/testimonios" element={<Testimonios />} />

          {/* Ruta dinámica con prefijo 'destino'.
              Ahora tus enlaces serán '/destino/1', '/destino/2', etc.
              Esto evita conflictos con futuras páginas.
          */}
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