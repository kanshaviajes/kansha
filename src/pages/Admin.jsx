import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./Admin.css";
import OfertasAereasAdmin from "../components/OfertasAereasAdmin";

import {
  getImagenesPorSeccion,
  crearImagen,
  subirImagen,
  subirVideo,
  actualizarImagen,
  eliminarImagen,
} from "../components/ImagenesWebService";

function Admin() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [files, setFiles] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [seccion, setSeccion] = useState("hero_cards");
  const [destino, setDestino] = useState("destino_1");

  // VIDEO
  const [video, setVideo] = useState(null);
  const [videoActual, setVideoActual] = useState(null);

  useEffect(() => {
    cargar();
  }, [seccion, destino]);

  async function cargar() {
    try {
      setLoading(true);

      const data = await getImagenesPorSeccion(seccion);

      let filtradas = data || [];

      if (seccion === "destino_slides") {
        filtradas = filtradas.filter((img) => img.titulo === destino);
      }

      setCards(filtradas);

      if (seccion === "hero_cards") {
        const videoHome = await getImagenesPorSeccion("video_home");
        setVideoActual(videoHome?.[0] || null);
      }

    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los datos",
      });

    } finally {
      setLoading(false);
    }
  }

  // =========================
  // GUARDAR
  // =========================

  async function handleSave() {

    if (!files.length && !selectedCard) {
      Swal.fire({
        icon: "warning",
        title: "Falta imagen",
      });
      return;
    }

    try {

      setUploading(true);

      Swal.fire({
        title: "Subiendo...",
        didOpen: () => Swal.showLoading(),
      });

      // EDITAR UNA
      if (selectedCard?.id && files.length === 1) {

        const url = await subirImagen(files[0]);

        await actualizarImagen(selectedCard.id, {
          imagen_url: url,
        });

      }

      // NUEVAS
      if (!selectedCard && files.length > 0) {

        await Promise.all(
          files.map(async (file, index) => {

            const url = await subirImagen(file);

            return crearImagen({
              seccion,
              titulo:
                seccion === "destino_slides"
                  ? destino
                  : null,
              imagen_url: url,
              orden: cards.length + index + 1,
              activo: true,
            });

          })
        );

      }

      setFiles([]);
      setSelectedCard(null);

      await cargar();

      Swal.fire({
        icon: "success",
        title: "Listo",
        timer: 1200,
        showConfirmButton: false,
      });

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });

    } finally {
      setUploading(false);
    }
  }

  // =========================
  // ELIMINAR
  // =========================

  async function handleDelete(card) {

    const confirm = await Swal.fire({
      title: "¿Eliminar imagen?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) return;

    try {

      await eliminarImagen(card.id);

      await cargar();

      Swal.fire({
        icon: "success",
        title: "Imagen eliminada",
        timer: 1200,
        showConfirmButton: false,
      });

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "No se pudo eliminar",
        text: error.message,
      });

    }
  }

  if (loading) {
    return (
      <div className="container py-5">
        <p>Cargando admin...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">

      <h2>Hola Florencia 👋</h2>

      <p className="text-muted mb-4">
        Panel de contenido
      </p>
            {/* SECCIÓN */}

      <div className="mb-3">

        <label>Sección</label>

        <select
          className="form-select"
          value={seccion}
          onChange={(e) => setSeccion(e.target.value)}
        >
          <option value="hero_cards">
            Hero Cards
          </option>

          <option value="destino_slides">
            Destino Slides
          </option>

        </select>

      </div>

      {/* DESTINO */}

      {seccion === "destino_slides" && (

        <div className="mb-4">

          <label>Destino</label>

          <select
            className="form-select"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
          >
            <option value="destino_1">Destino 1</option>
            <option value="destino_2">Destino 2</option>
            <option value="destino_3">Destino 3</option>
            <option value="destino_4">Destino 4</option>
          </select>

        </div>

      )}

      {/* LISTA */}

      <div className="mb-4">

        {cards.map((card, index) => (

          <div
            key={card.id}
            className="card mb-3 shadow-sm"
          >

            <div className="card-body d-flex justify-content-between align-items-center">

              <div className="d-flex align-items-center gap-3">

                <img
                  src={card.imagen_url}
                  style={{
                    width: "120px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />

                <div>

                  <h6>
                    Item {index + 1}
                  </h6>

                  <small>
                    {card.titulo || card.seccion}
                  </small>

                </div>

              </div>

              <div className="d-flex gap-2">

                <label className="btn btn-sm btn-outline-primary rounded-pill">

                  Cambiar

                  <input
                    type="file"
                    hidden
                    onChange={(e) => {

                      setFiles([e.target.files[0]]);
                      setSelectedCard(card);

                    }}
                  />

                </label>

                <button
                  className="btn btn-sm btn-primary rounded-pill"
                  disabled={uploading}
                  onClick={handleSave}
                >
                  Guardar
                </button>

                <button
                  className="btn btn-sm btn-outline-danger rounded-pill"
                  onClick={() => handleDelete(card)}
                >
                  Borrar
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* NUEVA IMAGEN */}

      <div className="border rounded p-4 text-center">

        <h5>
          Nueva imagen (múltiples)
        </h5>

        <input
          type="file"
          multiple
          className="form-control mb-3"
          onChange={(e) => {

            setFiles(Array.from(e.target.files));
            setSelectedCard(null);

          }}
        />

        <button
          className="btn btn-success rounded-pill px-4"
          onClick={handleSave}
          disabled={uploading}
        >
          + Crear / Subir
        </button>

      </div>
            {/* VIDEO HOME */}

      {seccion === "hero_cards" && (

        <div className="card mt-5 p-4 shadow-sm">

          <h5>Video Home</h5>

          {videoActual?.imagen_url && (

            <video
              src={videoActual.imagen_url}
              autoPlay
              loop
              muted
              style={{
                width: "100%",
                borderRadius: "12px",
                marginBottom: "15px",
              }}
            />

          )}

          <input
            type="file"
            accept="video/*"
            className="form-control mb-3"
            onChange={(e) => setVideo(e.target.files[0])}
          />

          <button
            className="btn btn-primary rounded-pill"
            onClick={async () => {

              if (!video) return;

              try {

                const url = await subirVideo(video);

                if (videoActual) {

                  await actualizarImagen(videoActual.id, {
                    imagen_url: url,
                  });

                } else {

                  await crearImagen({
                    seccion: "video_home",
                    titulo: "principal",
                    imagen_url: url,
                    orden: 1,
                    activo: true,
                  });

                }

                await cargar();

                Swal.fire({
                  icon: "success",
                  title: "Video actualizado",
                  timer: 1200,
                  showConfirmButton: false,
                });

              } catch (error) {

                console.error(error);

                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: error.message,
                });

              }

            }}
          >
            Guardar video
          </button>

        </div>

      )}

      <OfertasAereasAdmin />

    </div>
      );
}

export default Admin;