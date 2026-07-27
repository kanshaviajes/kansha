import { useNavigate } from "react-router-dom";

import HeroEdit from "../components/HeroEdit";
import CardItemEdit from "../components/CardItemEdit";
import SeccionViajesEdit from "../components/SeccionViajesEdit";
import OfertasAereasEdit from "../components/OfertasAereasEdit";
import GestionDestinos from "../components/GestionDestinos";

function Admin() {

  const navigate = useNavigate();

  return (
    <div className="container py-5">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="mb-1">Panel de Administración 🛠️</h2>
          <p className="text-muted mb-0">
            Utiliza este panel para gestionar todo el contenido de la web.
          </p>
        </div>

        <button
          className="btn btn-success"
          onClick={() => navigate("/documentos")}
        >
          📄 Módulo Documentos
        </button>

      </div>

      {/* NUEVA SECCIÓN MAESTRA */}
      <section className="mb-5 border p-4 bg-light rounded">
        <h3 className="text-primary">Gestión de Destinos (Nuevo)</h3>
        <GestionDestinos />
      </section>

      <hr className="my-5" />

      {/* SECCIONES EXISTENTES */}
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