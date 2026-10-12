
import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabase";
import { subirImagen } from "./ImagenesWebService";
import Swal from "sweetalert2";

const FORM_INICIAL = {
  nombre: "",
  descripcion: "",
  precio: "",
  categoria: "",
  noches: "",
  moneda: "USD",
  imagen_url: "",
  hero_imagen_url: "",
  card_imagen_url: "",
  mostrar_en_hero: false,
  orden_hero: "",
  activo: true,
};

function GestionDestinos() {
  const [destinos, setDestinos] = useState([]);
  const [form, setForm] = useState({ ...FORM_INICIAL });
  const [editandoId, setEditandoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cargandoDestinos, setCargandoDestinos] = useState(true);

  const heroInputRef = useRef(null);
  const cardInputRef = useRef(null);
  const formularioRef = useRef(null);

  useEffect(() => {
    cargarDestinos();
  }, []);

  async function cargarDestinos() {
    setCargandoDestinos(true);

    try {
      const { data, error } = await supabase
        .from("destinos")
        .select("*")
        .order("nombre", { ascending: true });

      if (error) throw error;

      setDestinos(data || []);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setCargandoDestinos(false);
    }
  }

  function actualizarCampo(campo, valor) {
    setForm((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  function limpiarArchivos() {
    if (heroInputRef.current) {
      heroInputRef.current.value = "";
    }

    if (cardInputRef.current) {
      cardInputRef.current.value = "";
    }
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setForm({ ...FORM_INICIAL });
    limpiarArchivos();
  }

  function editarDestino(destino) {
    setEditandoId(destino.id);

    setForm({
      nombre: destino.nombre || "",
      descripcion: destino.descripcion || "",
      precio: destino.precio ?? "",
      categoria: destino.categoria || "",
      noches: destino.noches ?? "",
      moneda: destino.moneda || "USD",
      imagen_url: destino.imagen_url || "",
      hero_imagen_url: destino.hero_imagen_url || "",
      card_imagen_url: destino.card_imagen_url || "",
      mostrar_en_hero: destino.mostrar_en_hero === true,
      orden_hero: destino.orden_hero ?? "",
      activo: destino.activo !== false,
    });

    limpiarArchivos();

    formularioRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function validarImagen(archivo) {
    if (!archivo) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(archivo.type)) {
      throw new Error(
        "Las imágenes deben estar en formato JPG, PNG o WebP."
      );
    }

    if (archivo.size > 5 * 1024 * 1024) {
      throw new Error("Cada imagen debe pesar menos de 5 MB.");
    }
  }

  async function guardarDestino(event) {
    event.preventDefault();

    if (loading) return;

    const nombre = form.nombre.trim();
    const precioTexto = String(form.precio).trim();
    const nochesTexto = String(form.noches).trim();

    if (!nombre) {
      Swal.fire("Atención", "Ingresá el nombre del destino.", "warning");
      return;
    }

    if (
      precioTexto !== "" &&
      (!Number.isFinite(Number(precioTexto)) ||
        Number(precioTexto) < 0)
    ) {
      Swal.fire("Atención", "Ingresá un precio válido.", "warning");
      return;
    }

    if (
      nochesTexto !== "" &&
      (!Number.isInteger(Number(nochesTexto)) ||
        Number(nochesTexto) < 0)
    ) {
      Swal.fire("Atención", "Ingresá una cantidad válida de noches.", "warning");
      return;
    }

    const ordenTexto = String(form.orden_hero).trim();

    if (
      ordenTexto !== "" &&
      (!Number.isInteger(Number(ordenTexto)) ||
        Number(ordenTexto) < 1)
    ) {
      Swal.fire("Atención", "El orden debe ser un número entero desde 1.", "warning");
      return;
    }

    setLoading(true);

    try {
      const archivoHero = heroInputRef.current?.files?.[0];
      const archivoCard = cardInputRef.current?.files?.[0];

      validarImagen(archivoHero);
      validarImagen(archivoCard);

      let heroUrl = form.hero_imagen_url;
      let cardUrl = form.card_imagen_url;

      if (archivoHero) {
        heroUrl = await subirImagen(archivoHero);
      }

      if (archivoCard) {
        cardUrl = await subirImagen(archivoCard);
      }

      if (form.mostrar_en_hero && (!heroUrl || !cardUrl)) {
        throw new Error(
          "Para mostrar un destino en el Hero necesitás cargar ambas fotografías."
        );
      }

      const datos = {
        nombre,
        descripcion: form.descripcion.trim(),
        categoria: form.categoria.trim(),
        precio: precioTexto === "" ? null : Number(precioTexto),
        noches: nochesTexto === "" ? null : Number(nochesTexto),
        moneda: form.moneda,
        activo: form.activo,
        mostrar_en_hero: form.mostrar_en_hero,
        orden_hero:
          ordenTexto === "" ? null : Number(ordenTexto),
        hero_imagen_url: heroUrl || null,
        card_imagen_url: cardUrl || null,

        // Conserva la imagen principal que utiliza
        // el resto del sitio. Para destinos nuevos,
        // usa la fotografía panorámica.
        imagen_url: form.imagen_url || heroUrl || null,
      };

      let error;

      if (editandoId !== null) {
        const resultado = await supabase
          .from("destinos")
          .update(datos)
          .eq("id", editandoId);

        error = resultado.error;
      } else {
        const resultado = await supabase
          .from("destinos")
          .insert([datos]);

        error = resultado.error;
      }

      if (error) throw error;

      await Swal.fire(
        "¡Listo!",
        editandoId !== null
          ? "Destino actualizado correctamente."
          : "Destino creado correctamente.",
        "success"
      );

      cancelarEdicion();
      await cargarDestinos();
    } catch (error) {
      Swal.fire(
        "No se pudo guardar",
        error.message || "Ocurrió un error inesperado.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  async function cambiarVisibilidad(destino) {
    if (loading) return;

    const nuevoEstado = !destino.mostrar_en_hero;

    if (
      nuevoEstado &&
      (!destino.hero_imagen_url || !destino.card_imagen_url)
    ) {
      Swal.fire(
        "Faltan fotografías",
        "Editá el destino y cargá las dos imágenes antes de mostrarlo en el Hero.",
        "warning"
      );
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("destinos")
        .update({ mostrar_en_hero: nuevoEstado })
        .eq("id", destino.id);

      if (error) throw error;

      await cargarDestinos();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function borrarDestino(destino) {
    const confirmacion = await Swal.fire({
      title: `¿Eliminar "${destino.nombre}"?`,
      text: "Esta acción es permanente y puede afectar cotizaciones u otras secciones del sitio.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmacion.isConfirmed) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("destinos")
        .delete()
        .eq("id", destino.id);

      if (error) throw error;

      if (editandoId === destino.id) {
        cancelarEdicion();
      }

      await cargarDestinos();

      Swal.fire("Eliminado", "Destino eliminado correctamente.", "success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="d-flex flex-column gap-4">
      <div
        ref={formularioRef}
        className="card border-0 shadow-sm"
      >
        <div className="card-body p-4">
          <h4 className="mb-2">
            {editandoId !== null
              ? "Editar destino"
              : "Crear nuevo destino"}
          </h4>

          <p className="text-muted mb-4">
            Administrá la información del viaje y sus fotografías.
          </p>

          <form onSubmit={guardarDestino}>
            <div className="mb-3">
              <label className="form-label">Nombre del destino *</label>
              <input
                className="form-control"
                value={form.nombre}
                onChange={(e) =>
                  actualizarCampo("nombre", e.target.value)
                }
                placeholder="Ej.: Río de Janeiro"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                rows="3"
                value={form.descripcion}
                onChange={(e) =>
                  actualizarCampo("descripcion", e.target.value)
                }
                placeholder="Describí el destino..."
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label">Precio</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-control"
                  value={form.precio}
                  onChange={(e) =>
                    actualizarCampo("precio", e.target.value)
                  }
                  placeholder="Ej.: 850"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Noches</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="form-control"
                  value={form.noches}
                  onChange={(e) =>
                    actualizarCampo("noches", e.target.value)
                  }
                  placeholder="Ej.: 7"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Moneda</label>
                <select
                  className="form-select"
                  value={form.moneda}
                  onChange={(e) =>
                    actualizarCampo("moneda", e.target.value)
                  }
                >
                  <option value="USD">USD</option>
                  <option value="UYU">UYU</option>
                  <option value="ARS">ARS</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Categoría</label>
              <input
                className="form-control"
                value={form.categoria}
                onChange={(e) =>
                  actualizarCampo("categoria", e.target.value)
                }
                placeholder="Ej.: Brasil, Caribe, Argentina..."
              />
            </div>

            <hr />

            <h5 className="mb-3">Fotografías del Hero</h5>

            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Fondo panorámico
                </label>

                {form.hero_imagen_url && (
                  <img
                    src={form.hero_imagen_url}
                    alt="Fondo actual del destino"
                    className="img-fluid rounded mb-2 w-100"
                    style={{
                      aspectRatio: "2.4 / 1",
                      objectFit: "cover",
                    }}
                  />
                )}

                <input
                  ref={heroInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="form-control"
                />

                <small className="text-muted">
                  Recomendado: 1920 × 800 px. JPG permitido.
                </small>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Tarjeta vertical
                </label>

                {form.card_imagen_url && (
                  <img
                    src={form.card_imagen_url}
                    alt="Tarjeta actual del destino"
                    className="img-fluid rounded mb-2"
                    style={{
                      width: "120px",
                      aspectRatio: "2 / 3",
                      objectFit: "cover",
                    }}
                  />
                )}

                <input
                  ref={cardInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="form-control"
                />

                <small className="text-muted">
                  Recomendado: 600 × 900 px. JPG permitido.
                </small>
              </div>
            </div>

            <div className="border rounded p-3 mb-4 bg-light">
              <h5>Publicación</h5>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="destino-activo"
                  checked={form.activo}
                  onChange={(e) =>
                    actualizarCampo("activo", e.target.checked)
                  }
                />

                <label
                  className="form-check-label"
                  htmlFor="destino-activo"
                >
                  Destino activo en el sitio
                </label>
              </div>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="mostrar-hero"
                  checked={form.mostrar_en_hero}
                  onChange={(e) =>
                    actualizarCampo(
                      "mostrar_en_hero",
                      e.target.checked
                    )
                  }
                />

                <label
                  className="form-check-label"
                  htmlFor="mostrar-hero"
                >
                  Mostrar en el Hero principal
                </label>
              </div>

              <label className="form-label">
                Orden de aparición en el Hero
              </label>

              <input
                type="number"
                min="1"
                step="1"
                className="form-control"
                style={{ maxWidth: "180px" }}
                value={form.orden_hero}
                onChange={(e) =>
                  actualizarCampo("orden_hero", e.target.value)
                }
                placeholder="Ej.: 1"
              />

              <small className="text-muted">
                Los destinos con menor número aparecerán primero.
              </small>
            </div>

            <div className="d-flex gap-2 flex-wrap">
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                {loading
                  ? "Guardando..."
                  : editandoId !== null
                  ? "Guardar cambios"
                  : "Crear destino"}
              </button>

              {editandoId !== null && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={cancelarEdicion}
                  disabled={loading}
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h4 className="mb-3">
            Destinos actuales ({destinos.length})
          </h4>

          {cargandoDestinos ? (
            <p>Cargando destinos...</p>
          ) : destinos.length === 0 ? (
            <p className="text-muted">
              Todavía no hay destinos registrados.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Destino</th>
                    <th>Estado</th>
                    <th>Hero</th>
                    <th>Orden</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {destinos.map((destino) => (
                    <tr key={destino.id}>
                      <td className="fw-semibold">
                        {destino.nombre}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            destino.activo
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {destino.activo
                            ? "Activo"
                            : "Inactivo"}
                        </span>
                      </td>

                      <td>
                        <div className="form-check form-switch">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={
                              destino.mostrar_en_hero === true
                            }
                            onChange={() =>
                              cambiarVisibilidad(destino)
                            }
                            disabled={loading}
                            aria-label={`Mostrar ${destino.nombre} en el Hero`}
                          />
                        </div>
                      </td>

                      <td>{destino.orden_hero ?? "—"}</td>

                      <td>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => editarDestino(destino)}
                            disabled={loading}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => borrarDestino(destino)}
                            disabled={loading}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GestionDestinos;
