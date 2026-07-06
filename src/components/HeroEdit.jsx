import { useEffect, useState } from "react";
import { getImagenesPorSeccion, subirImagen, crearImagen, eliminarImagen } from "./ImagenesWebService";
import Swal from "sweetalert2";

function HeroEdit() {
  const [slides, setSlides] = useState([]);
  const [file, setFile] = useState(null); // Estado para la imagen pendiente
  const [preview, setPreview] = useState(null); // Para mostrar la vista previa
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) cargar();
  }, [isOpen]);

  async function cargar() {
    const data = await getImagenesPorSeccion("hero_slides");
    setSlides(data || []);
  }

  function handleFileSelect(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Crear vista previa local
    }
  }

  async function handleSave() {
    if (!file) return;

    try {
      Swal.fire({ title: "Guardando...", didOpen: () => Swal.showLoading() });
      
      const url = await subirImagen(file);
      await crearImagen({
        seccion: "hero_slides",
        imagen_url: url,
        orden: slides.length + 1,
        activo: true
      });
      
      await cargar();
      setFile(null);
      setPreview(null);
      Swal.fire({ icon: "success", title: "Imagen guardada correctamente", timer: 1200, showConfirmButton: false });
    } catch (err) {
      Swal.fire("Error", "No se pudo subir la imagen", "error");
    }
  }

  async function handleDelete(id) {
    if (!(await Swal.fire({ title: "¿Eliminar imagen?", icon: "warning", showCancelButton: true })).isConfirmed) return;
    await eliminarImagen(id);
    await cargar();
  }

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header bg-white p-3 d-flex justify-content-between align-items-center" 
           onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
        <h5 className="mb-0">Hero Slider</h5>
        <button className="btn btn-sm btn-outline-primary">{isOpen ? "Ocultar" : "Modificar"}</button>
      </div>
      
      {isOpen && (
        <div className="card-body border-top">
          <div className="mb-4">
            <label className="form-label">Seleccionar nueva imagen:</label>
            <div className="input-group">
              <input type="file" className="form-control" onChange={handleFileSelect} />
              {file && (
                <button className="btn btn-success" onClick={handleSave}>Guardar Imagen</button>
              )}
            </div>
            {preview && (
              <div className="mt-2">
                <small className="text-muted">Vista previa:</small>
                <img src={preview} className="d-block mt-1" style={{ height: '80px', borderRadius: '5px' }} />
              </div>
            )}
          </div>

          <div className="row">
            {slides.length === 0 ? <p className="text-muted text-center">No hay imágenes cargadas.</p> : null}
            {slides.map((s, index) => (
              <div key={s.id} className="col-md-2 mb-3">
                <div className="position-relative">
                  <img src={s.imagen_url} className="img-fluid rounded" style={{ height: '100px', width: '100%', objectFit: 'cover' }} />
                  <button className="btn btn-danger btn-sm position-absolute top-0 end-0" onClick={() => handleDelete(s.id)}>×</button>
                </div>
                <small>Orden: {index + 1}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default HeroEdit;