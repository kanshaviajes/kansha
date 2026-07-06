import HeroEdit from "../components/HeroEdit";
import CardItemEdit from "../components/CardItemEdit";
import SeccionViajesEdit from "../components/SeccionViajesEdit";
import OfertasAereasEdit from "../components/OfertasAereasEdit";
import GestionDestinos from "../components/GestionDestinos"; // Importamos el nuevo editor maestro

function Admin() {
  return (
    <div className="container py-5">
      <h2 className="mb-4">Panel de Administración 🛠️</h2>
      <p className="text-muted">
        Utiliza este panel para gestionar todo el contenido de la web.
      </p>

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