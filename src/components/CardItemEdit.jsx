import { useEffect, useState } from "react";
import { getImagenesPorSeccion, subirImagen, crearImagen, eliminarImagen } from "./ImagenesWebService";
import { supabase } from "../supabase"; // Importante: necesitamos acceso a supabase para los destinos
import Swal from "sweetalert2";

function CardItemEdit() {
  const [cards, setCards] = useState([]);
  const [destinos, setDestinos] = useState([]); // Lista de destinos para el select
  const [file, setFile] = useState(null);
  const [selectedLink, setSelectedLink] = useState(""); // ID del destino seleccionado
  const [preview, setPreview] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      cargar();
      cargarDestinos();
    }
  }, [isOpen]);

  async function cargar() {
    const data = await getImagenesPorSeccion("hero_cards");
    setCards(data || []);
  }

  async function cargarDestinos() {
    const { data } = await supabase.from("destinos").select("id, nombre");
    setDestinos(data || []);
  }

  function handleFileSelect(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  }

  async function handleSave() {
    if (!file || !selectedLink) {
      Swal.fire("Error", "Debes seleccionar una imagen y un destino", "warning");
      return;
    }

    try {
      Swal.fire({ title: "Guardando...", didOpen: () => Swal.showLoading() });
      const url = await subirImagen(file);
      await crearImagen({
        seccion: "hero_cards",
        imagen_url: url,
        link: selectedLink, // Guardamos el ID del destino aquí
        orden: cards.length + 1,
        activo: true
      });
      await cargar();
      setFile(null);
      setPreview(null);
      setSelectedLink("");
      Swal.fire({ icon: "success", title: "Tarjeta guardada", timer: 1200, showConfirmButton: false });
    } catch (err) {
      Swal.fire("Error", "No se pudo subir la imagen", "error");
    }
  }

  async function handleDelete(id) {
    if (!(await Swal.fire({ title: "¿Eliminar tarjeta?", icon: "warning", showCancelButton: true })).isConfirmed) return;
    await eliminarImagen(id);
    await cargar();
  }

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header bg-white p-3 d-flex justify-content-between align-items-center" 
           onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
        <h5 className="mb-0">Tarjetas de Destinos (HeroCards)</h5>
        <button className="btn btn-sm btn-outline-primary">{isOpen ? "Ocultar" : "Modificar"}</button>
      </div>
      
      {isOpen && (
        <div className="card-body border-top">
          <div className="mb-4">
            <label className="form-label">Subir nueva tarjeta:</label>
            <div className="row g-2">
              <div className="col-md-5">
                <input type="file" className="form-control" onChange={handleFileSelect} />
              </div>
              <div className="col-md-4">
                <select className="form-select" value={selectedLink} onChange={(e) => setSelectedLink(e.target.value)}>
                  <option value="">Seleccionar destino...</option>
                  {destinos.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                {file && selectedLink && <button className="btn btn-success w-100" onClick={handleSave}>Guardar</button>}
              </div>
            </div>
            {preview && <img src={preview} className="mt-2" style={{ height: '100px', borderRadius: '8px' }} />}
          </div>

          <div className="row">
            {cards.map((c) => (
              <div key={c.id} className="col-md-3 mb-3">
                <div className="position-relative">
                  <img src={c.imagen_url} className="img-fluid rounded" style={{ height: '150px', width: '100%', objectFit: 'cover' }} />
                  <div className="small mt-1 text-truncate">Destino ID: {c.link}</div>
                  <button className="btn btn-danger btn-sm position-absolute top-0 end-0" onClick={() => handleDelete(c.id)}>×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CardItemEdit;