import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { subirImagen } from "./ImagenesWebService";
import Swal from "sweetalert2";

function GestionDestinos() {
  const [loading, setLoading] = useState(false);
  const [destinos, setDestinos] = useState([]);
  const [form, setForm] = useState({ 
    nombre: "", 
    descripcion: "", 
    precio: "", 
    categoria: "", 
    noches: "", 
    moneda: "USD",
    imagen_url: "" 
  });

  useEffect(() => {
    fetchDestinos();
  }, []);

  async function fetchDestinos() {
    const { data } = await supabase.from("destinos").select("id, nombre");
    setDestinos(data || []);
  }

  async function crearNuevoDestino() {
    setLoading(true);
    try {
      const fileInput = document.getElementById("file-input");
      let url = "";

      if (fileInput && fileInput.files[0]) {
        url = await subirImagen(fileInput.files[0]);
      } else {
        throw new Error("Por favor, selecciona una imagen.");
      }

      const { error } = await supabase.from("destinos").insert([{
        ...form, 
        imagen_url: url
      }]);

      if (error) throw error;

      Swal.fire("¡Éxito!", "Destino creado correctamente", "success");
      // Resetear formulario
      setForm({ nombre: "", descripcion: "", precio: "", categoria: "", noches: "", moneda: "USD", imagen_url: "" });
      fileInput.value = "";
      fetchDestinos();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function borrarDestino(id, nombre) {
    const result = await Swal.fire({
      title: `¿Borrar "${nombre}"?`,
      text: "¡Esta acción no se puede deshacer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar"
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from("destinos").delete().eq("id", id);
      if (error) {
        Swal.fire("Error", error.message, "error");
      } else {
        Swal.fire("Eliminado", "El destino ha sido borrado", "success");
        fetchDestinos();
      }
    }
  }

  return (
    <div className="card p-4 shadow-sm">
      <h4 className="mb-4">Gestión de Destinos</h4>
      
      <div className="mb-5 border-bottom pb-4">
        <h5>Crear nuevo destino</h5>
        <input className="form-control mb-2" placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
        <textarea className="form-control mb-2" placeholder="Descripción" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
        
        <div className="row">
          <div className="col-md-4">
            <input className="form-control mb-2" placeholder="Precio" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} />
          </div>
          <div className="col-md-4">
            <input type="number" className="form-control mb-2" placeholder="Noches" value={form.noches} onChange={e => setForm({...form, noches: e.target.value})} />
          </div>
          <div className="col-md-4">
            <select className="form-select mb-2" value={form.moneda} onChange={e => setForm({...form, moneda: e.target.value})}>
              <option value="USD">USD ($)</option>
              <option value="ARS">ARS ($)</option>
              <option value="UYU">UYU ($)</option>
            </select>
          </div>
        </div>

        <input className="form-control mb-2" placeholder="Categoría" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} />
        <input type="file" id="file-input" className="form-control mb-3" />
        
        <button className="btn btn-primary w-100" onClick={crearNuevoDestino} disabled={loading}>
          {loading ? "Creando..." : "Guardar Destino"}
        </button>
      </div>

      <div>
        <h5>Destinos actuales</h5>
        <ul className="list-group">
          {destinos.map((d) => (
            <li key={d.id} className="list-group-item d-flex justify-content-between align-items-center">
              {d.nombre}
              <button className="btn btn-sm btn-outline-danger" onClick={() => borrarDestino(d.id, d.nombre)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GestionDestinos;