import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css"
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import PageDestino from "./pages/PageDestino"; // Importamos la nueva página dinámica

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        {/* Ruta dinámica que captura el ID del destino */}
        <Route path="/:id" element={<PageDestino />} /> 
      </Routes>

      <Footer />
    </>
  );
}

export default App;