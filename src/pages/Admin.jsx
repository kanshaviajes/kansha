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
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="container py-5">

      {/* ==================================================
          ENCABEZADO
      ================================================== */}

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

        <div>
          <h2 className="mb-1">
            Panel de Administración 🛠️
          </h2>

          <p className="text-muted mb-0">
            Utiliza este panel para gestionar todo el contenido de la web.
          </p>
        </div>

      </div>


      {/* ==================================================
          COTIZACIONES
      ================================================== */}

      <section className="mb-5 border p-4 rounded">

        <div className="mb-4">

          <h3 className="mb-1">
            ✈️ Cotizaciones
          </h3>

          <p className="text-muted mb-0">
            Crea plantillas de viajes y genera propuestas personalizadas
            para cada pasajero.
          </p>

        </div>

        <div className="row g-3">

          {/* COTIZABLES */}

          <div className="col-12 col-md-6">

            <div className="card h-100 shadow-sm">

              <div className="card-body p-4">

                <h4 className="card-title">
                  📋 Mis cotizables
                </h4>

                <p className="card-text text-muted">
                  Administra las plantillas reutilizables de destinos,
                  hoteles y servicios.
                </p>

                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() =>
                    navigate("/admin/cotizables")
                  }
                >
                  Ver cotizables
                </button>

              </div>

            </div>

          </div>


          {/* COTIZACIONES GENERADAS */}

          <div className="col-12 col-md-6">

            <div className="card h-100 shadow-sm">

              <div className="card-body p-4">

                <h4 className="card-title">
                  🧳 Cotizaciones generadas
                </h4>

                <p className="card-text text-muted">
                  Consulta, edita y comparte las propuestas creadas
                  para tus pasajeros.
                </p>

                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={() =>
                    navigate("/admin/cotizaciones")
                  }
                >
                  Ver cotizaciones
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          DOCUMENTOS
      ================================================== */}

      <section className="mb-5 border p-4 bg-light rounded">

        <div className="mb-4">

          <h3 className="mb-1">
            📄 Documentos
          </h3>

          <p className="text-muted mb-0">
            Genera recibos, vouchers y hojas informativas
            para los pasajeros.
          </p>

        </div>

        <div className="d-flex gap-2 flex-wrap">

          {/* RECIBOS */}

          <button
            type="button"
            className="btn btn-success"
            onClick={() =>
              navigate("/documentos")
            }
          >
            📄 Crear recibos
          </button>


          {/* VOUCHER HOTEL */}

          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              navigate("/admin/voucher-hotel")
            }
          >
            🏨 Voucher Hotel
          </button>


          {/* VOUCHER OPCIONALES */}

          <button
            type="button"
            className="btn btn-warning"
            onClick={() =>
              navigate("/admin/voucher-opcionales")
            }
          >
            🎟️ Voucher Opcionales
          </button>


          {/* HOJAS DE VIAJE */}

          <button
            type="button"
            className="btn btn-dark"
            onClick={() =>
              navigate("/admin/hojas-viaje")
            }
          >
            📑 Hojas de viaje
          </button>

        </div>

      </section>


      {/* ==================================================
          GESTIÓN DE DESTINOS
      ================================================== */}

      <section className="mb-5 border p-4 bg-light rounded">

        <h3 className="text-primary">
          Gestión de Destinos
        </h3>

        <GestionDestinos />

      </section>


      <hr className="my-5" />


      {/* ==================================================
          CONTENIDO DE LA WEB
      ================================================== */}

      <section>

        <div className="mb-4">

          <h3 className="mb-1">
            🌐 Contenido del sitio
          </h3>

          <p className="text-muted mb-0">
            Administra las distintas secciones visibles
            en la página principal.
          </p>

        </div>

        <div className="row">

          <div className="col-12">

            <HeroEdit />

            <CardItemEdit />

            <SeccionViajesEdit />

            <OfertasAereasEdit />

          </div>

        </div>

      </section>

    </div>
  );
}

export default Admin;