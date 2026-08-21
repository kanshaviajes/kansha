import { useEffect } from "react";
import { useLocation, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

import "./App.css";


// ======================================================
// PÁGINAS
// ======================================================

import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import PageDestino from "./pages/PageDestino";
import Testimonios from "./pages/Testimonios";
import Documentos from "./pages/Documentos";


// ======================================================
// COMPONENTES / MÓDULOS INTERNOS
// ======================================================

import VoucherHotel from "./components/documentos/VoucherHotel";
import VoucherOpcionales from "./components/documentos/VoucherOpcionales";


// ======================================================
// SCROLL AUTOMÁTICO AL CAMBIAR DE RUTA
// ======================================================

function ScrollToTop() {

  const { pathname } = useLocation();

  useEffect(() => {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }, [pathname]);

  return null;
}


// ======================================================
// APP
// ======================================================

function App() {

  return (
    <>

      <ScrollToTop />

      <Navbar />


      <main>

        <Routes>

          {/* HOME */}
          <Route
            path="/"
            element={<Home />}
          />


          {/* LOGIN */}
          <Route
            path="/login"
            element={<Login />}
          />


          {/* ADMIN */}
          <Route
            path="/admin"
            element={<Admin />}
          />


          {/* DOCUMENTOS / RECIBOS */}
          <Route
            path="/documentos"
            element={<Documentos />}
          />


          {/* VOUCHER HOTEL */}
          <Route
            path="/admin/voucher-hotel"
            element={<VoucherHotel />}
          />


          {/* VOUCHER SERVICIOS OPCIONALES */}
          <Route
            path="/admin/voucher-opcionales"
            element={<VoucherOpcionales />}
          />


          {/* TESTIMONIOS */}
          <Route
            path="/testimonios"
            element={<Testimonios />}
          />


          {/* DESTINO */}
          <Route
            path="/destino/:id"
            element={<PageDestino />}
          />

        </Routes>

      </main>


      <Footer />


      {/* BOTÓN FLOTANTE */}
      <WhatsAppButton />

    </>
  );
}

export default App;