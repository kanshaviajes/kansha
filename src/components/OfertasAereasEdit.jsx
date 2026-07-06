import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "../supabase";
import {
  getImagenesPorSeccion,
  crearImagen,
  subirImagen,
} from "./ImagenesWebService";

function OfertasAereasEdit() {
  const [ofertas, setOfertas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editOferta, setEditOferta] = useState(null);
  
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
    const data = await getImagenesPorSeccion("ofertas_aereas");
    setOfertas(data || []);
  }

  function openNew() {
    setEditOferta(null);
    setForm({ categoria: "", titulo: "", descripcion: "", precio: "", file: null });
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

      if (editOferta?.id) {
        const { error } = await supabase
          .from("imagenes_web")
          .update(payload)
          .eq("id", editOferta.id);
        if (error) throw error;
      } else {
        await crearImagen(payload);
      }
      
      setModalOpen(false);
      await cargar();
      Swal.fire({ icon: "success", title: "Guardado", timer: 1200, showConfirmButton: false });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo guardar la oferta", "error");
    }
  }

  async function eliminar(id) {
    if (!(await Swal.fire({ title: "¿Eliminar esta oferta?", icon: "warning", showCancelButton: true })).isConfirmed) return;
    
    const { error } = await supabase.from("imagenes_web").delete().eq("id", id);
    if (error) {
      Swal.fire("Error", error.message, "error");
      return;
    }
    await cargar();
  }

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header bg-white p-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Ofertas Aéreas</h5>
        <button className="btn btn-success btn-sm" onClick={openNew}>+ Nueva oferta</button>
      </div>
      
      <div className="card-body">
        {ofertas.map((o) => (
          <div key={o.id} className="card p-3 mb-2 d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex gap-3 align-items-center">
              <img src={o.imagen_url} style={{ width: 80, height: 50, objectFit: "cover", borderRadius: 5 }} />
              <div>
                <small className="text-muted d-block">{o.categoria}</small>
                <strong>{o.titulo}</strong>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary btn-sm" onClick={() => openEdit(o)}>Editar</button>
              <button className="btn btn-danger btn-sm" onClick={() => eliminar(o.id)}>Borrar</button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5>{editOferta ? "Editar Oferta" : "Nueva Oferta"}</h5>
              <input className="form-control mb-2" placeholder="Categoría" value={form.categoria} onChange={(e) => setForm({...form, categoria: e.target.value})} />
              <input className="form-control mb-2" placeholder="Título" value={form.titulo} onChange={(e) => setForm({...form, titulo: e.target.value})} />
              <textarea className="form-control mb-2" placeholder="Descripción" value={form.descripcion} onChange={(e) => setForm({...form, descripcion: e.target.value})} />
              <input className="form-control mb-2" placeholder="Precio" value={form.precio} onChange={(e) => setForm({...form, precio: e.target.value})} />
              <input type="file" className="form-control mb-3" onChange={(e) => setForm({...form, file: e.target.files[0]})} />
              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
                <button className="btn btn-success" onClick={save}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OfertasAereasEdit;