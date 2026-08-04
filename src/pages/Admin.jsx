import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import HeroEdit from "../components/HeroEdit";
import CardItemEdit from "../components/CardItemEdit";
import SeccionViajesEdit from "../components/SeccionViajesEdit";
import OfertasAereasEdit from "../components/OfertasAereasEdit";
import GestionDestinos from "../components/GestionDestinos";

function Admin() {

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, []);

  return (
    <div className="container py-5">

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

        <div>
          <h2 className="mb-1">Panel de Administración 🛠️</h2>

          <p className="text-muted mb-0">
            Utiliza este panel para gestionar todo el contenido de la web.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-success"
            onClick={() => navigate("/documentos")}
          >
            📄 Crear recibos
          </button>

          {/* 🏨 NUEVO BOTÓN PARA VOUCHER HOTEL */}
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/voucher-hotel")}
          >
            🏨 Voucher Hotel
          </button>
        </div>

      </div>

      {/* GESTIÓN DE DESTINOS */}

      <section className="mb-5 border p-4 bg-light rounded">

        <h3 className="text-primary">
          Gestión de Destinos
        </h3>

        <GestionDestinos />

      </section>

      <hr className="my-5" />

      {/* RESTO DEL PANEL */}

      <div className="row">

        <div className="col-12">

          <HeroEdit />

          <CardItemEdit />

          <SeccionViajesEdit />

          <OfertasAereasEdit />

        </div>

      </div>

    </div>
  );
}

export default Admin;