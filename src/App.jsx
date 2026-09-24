import { useEffect } from "react";
import {
  useLocation,
  Routes,
  Route,
} from "react-router-dom";

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
// COTIZABLES
// ======================================================

import Cotizables from "./pages/Cotizables";
import NuevoCotizable from "./pages/NuevoCotizable";
import EditarCotizable from "./pages/EditarCotizable";

// ======================================================
// COTIZACIONES
// ======================================================

import NuevaCotizacion from "./pages/NuevaCotizacion";
import MisCotizaciones from "./pages/MisCotizaciones";
import EditarCotizacion from "./pages/EditarCotizacion";
import CotizacionPublica from "./pages/CotizacionPublica";

// ======================================================
// HOJAS DE VIAJE
// ======================================================

import HojasViaje from "./pages/HojasViaje";
import NuevaHojaViaje from "./pages/NuevaHojaViaje";
import EditarHojaViaje from "./pages/EditarHojaViaje";

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
      behavior: "smooth",
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

          {/* ==================================================
              HOME
          ================================================== */}

          <Route
            path="/"
            element={<Home />}
          />

          {/* ==================================================
              LOGIN
          ================================================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          {/* ==================================================
              ADMIN
          ================================================== */}

          <Route
            path="/admin"
            element={<Admin />}
          />

          {/* ==================================================
              COTIZABLES
          ================================================== */}

          <Route
            path="/admin/cotizables"
            element={<Cotizables />}
          />

          <Route
            path="/admin/cotizables/nuevo"
            element={<NuevoCotizable />}
          />

          <Route
            path="/admin/cotizables/:id/editar"
            element={<EditarCotizable />}
          />

          {/* ==================================================
              COTIZACIONES
          ================================================== */}

          <Route
            path="/admin/cotizaciones"
            element={<MisCotizaciones />}
          />

          <Route
            path="/admin/cotizaciones/nueva"
            element={<NuevaCotizacion />}
          />

          <Route
            path="/admin/cotizaciones/:id/editar"
            element={<EditarCotizacion />}
          />

          {/* ==================================================
              COTIZACIÓN PÚBLICA
          ================================================== */}

          <Route
            path="/cotizacion/:token"
            element={<CotizacionPublica />}
          />

          {/* ==================================================
              DOCUMENTOS / RECIBOS
          ================================================== */}

          <Route
            path="/documentos"
            element={<Documentos />}
          />

          {/* ==================================================
              VOUCHER HOTEL
          ================================================== */}

          <Route
            path="/admin/voucher-hotel"
            element={<VoucherHotel />}
          />

          {/* ==================================================
              VOUCHER SERVICIOS OPCIONALES
          ================================================== */}

          <Route
            path="/admin/voucher-opcionales"
            element={<VoucherOpcionales />}
          />

          {/* ==================================================
              HOJAS DE VIAJE
          ================================================== */}

          <Route
            path="/admin/hojas-viaje"
            element={<HojasViaje />}
          />

          <Route
            path="/admin/hojas-viaje/nueva"
            element={<NuevaHojaViaje />}
          />

          <Route
            path="/admin/hojas-viaje/:id/editar"
            element={<EditarHojaViaje />}
          />

          {/* ==================================================
              TESTIMONIOS
          ================================================== */}

          <Route
            path="/testimonios"
            element={<Testimonios />}
          />

          {/* ==================================================
              DESTINO
          ================================================== */}

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