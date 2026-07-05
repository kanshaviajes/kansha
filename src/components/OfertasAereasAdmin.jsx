import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "../supabase";
import {
  getImagenesPorSeccion,
  crearImagen,
  subirImagen,
} from "../components/ImagenesWebService";

function OfertasAereasAdmin() {
  const [ofertas, setOfertas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editOferta, setEditOferta] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    categoria: "",
    titulo: "",
    descripcion: "",
    precio: "",
    file: null,
  });

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    setLoading(true);

    const data = await getImagenesPorSeccion("ofertas_aereas");
    setOfertas(data || []);

    setLoading(false);
  }

  function openNew() {
    setEditOferta(null);
    setForm({
      categoria: "",
      titulo: "",
      descripcion: "",
      precio: "",
      file: null,
    });
    setModalOpen(true);
  }

  function openEdit(oferta) {
    setEditOferta(oferta);
    setForm({
      categoria: oferta.categoria || "",
      titulo: oferta.titulo || "",
      descripcion: oferta.descripcion || "",
      precio: oferta.precio || "",
      file: null,
    });
    setModalOpen(true);
  }

  async function save() {
  try {
    let imageUrl = editOferta?.imagen_url || "";

    if (form.file) {
      imageUrl = await subirImagen(form.file);
      console.log("URL:", imageUrl);
    }

    const payload = {
      seccion: "ofertas_aereas",
      categoria: form.categoria,
      titulo: form.titulo,
      descripcion: form.descripcion,
      precio: form.precio,
      imagen_url: imageUrl,
      activo: true,
    };

    console.log(payload);

if (editOferta?.id) {
  const { data, error } = await supabase
    .from("imagenes_web")
    .update(payload)
    .eq("id", editOferta.id)
    .select();

  console.log("UPDATE DATA:", data);
  console.log("UPDATE ERROR:", error);

  if (error) throw error;
} else {
  await crearImagen(payload);
}
      setModalOpen(false);
      await cargar();

      Swal.fire({
        icon: "success",
        title: "Guardado",
        timer: 1200,
        showConfirmButton: false,
      });

    } catch (err) {
      console.error(err);
    }
  }
    async function eliminar(id) {
  const confirm = await Swal.fire({
    title: "¿Eliminar esta oferta?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
  });

  if (!confirm.isConfirmed) return;

  const { data, error } = await supabase
    .from("imagenes_web")
    .delete()
    .eq("id", id)
    .select();

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
    return;
  }

  Swal.fire({
    icon: "success",
    title: "Eliminado",
    timer: 1200,
    showConfirmButton: false,
  });

  await cargar();
}
  return (
    <div className="mt-5">

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Ofertas Aéreas</h4>

        <button className="btn btn-success" onClick={openNew}>
          + Nueva oferta
        </button>
      </div>

      {ofertas.map((o) => (
        <div
          key={o.id}
          className="card p-3 mb-3 d-flex flex-row justify-content-between"
        >

          <div className="d-flex gap-3 align-items-center">

            <img
              src={o.imagen_url}
              style={{
                width: 120,
                height: 80,
                objectFit: "cover",
                borderRadius: 10,
              }}
            />

            <div>
              <small>{o.categoria}</small>
              <h6>{o.titulo}</h6>
              <p className="mb-1">{o.descripcion}</p>
              <b>{o.precio}</b>
            </div>

          </div>

          <div className="d-flex gap-2 align-items-center">

            <button
              className="btn btn-primary btn-sm"
              onClick={() => openEdit(o)}
            >
              Editar
            </button>

           <button
  className="btn btn-danger btn-sm"
  onClick={() => {
    console.log("OFERTA:", o);
    console.log("ID:", o.id);
    eliminar(o.id);
  }}
>
  Borrar
</button>

          </div>

        </div>
      ))}

      {modalOpen && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h5>Oferta Aérea</h5>

              <input
                className="form-control mb-2"
                placeholder="Categoría"
                value={form.categoria}
                onChange={(e) =>
                  setForm({ ...form, categoria: e.target.value })
                }
              />

              <input
                className="form-control mb-2"
                placeholder="Título"
                value={form.titulo}
                onChange={(e) =>
                  setForm({ ...form, titulo: e.target.value })
                }
              />

              <textarea
                className="form-control mb-2"
                placeholder="Descripción"
                value={form.descripcion}
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
              />
                            <input
                className="form-control mb-2"
                placeholder="Precio"
                value={form.precio}
                onChange={(e) =>
                  setForm({ ...form, precio: e.target.value })
                }
              />

              <input
                type="file"
                className="form-control mb-3"
                onChange={(e) =>
                  setForm({
                    ...form,
                    file: e.target.files[0],
                  })
                }
              />

              <div className="d-flex justify-content-end gap-2">

                <button
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>

                <button
                  className="btn btn-success"
                  onClick={save}
                >
                  Guardar
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default OfertasAereasAdmin;