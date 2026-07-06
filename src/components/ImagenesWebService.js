import { supabase } from "../supabase";

/* LISTAR POR SECCIÓN */
export async function getImagenesPorSeccion(seccion) {
  const { data, error } = await supabase
    .from("imagenes_web")
    .select("*")
    .eq("seccion", seccion)
    .order("orden", { ascending: true });

  if (error) {
    console.error("Error getImagenesPorSeccion:", error);
    return [];
  }

  return data;
}

/* LISTAR POR DESTINO (SLIDES) */
export async function getImagenesPorDestino(titulo) {
  const { data, error } = await supabase
    .from("imagenes_web")
    .select("*")
    .eq("seccion", "destino_slides")
    .eq("titulo", titulo)
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error) {
    console.error("Error getImagenesPorDestino:", error);
    return [];
  }

  return data;
}

/* LISTAR TODOS LOS SLIDES (SIN REPETIDOS) */
export async function getSlides() {
  const { data, error } = await supabase
    .from("imagenes_web")
    .select("titulo")
    .eq("seccion", "destino_slides")
    .eq("activo", true)
    .order("titulo", { ascending: true });

  if (error) {
    console.error("Error getSlides:", error);
    return [];
  }

  // Devuelve solo títulos únicos
  return [...new Set(data.map((item) => item.titulo))];
}

/* CREAR IMAGEN */
export async function crearImagen(payload) {
  const { data, error } = await supabase
    .from("imagenes_web")
    .insert(payload)
    .select();

  if (error) {
    console.error("Error crearImagen:", error);
    throw error;
  }

  return data;
}

/* ACTUALIZAR IMAGEN */
export async function actualizarImagen(id, payload) {
  const { data, error } = await supabase
    .from("imagenes_web")
    .update(payload)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error actualizarImagen:", error);
    throw error;
  }

  return data;
}

/* ELIMINAR IMAGEN */
export async function eliminarImagen(id) {
  const { error } = await supabase
    .from("imagenes_web")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error eliminarImagen:", error);
    throw error;
  }

  return true;
}

/* SUBIR IMAGEN A STORAGE */
export async function subirImagen(file) {
  const fileName = `${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("imagenes")
    .upload(fileName, file);

  if (uploadError) {
    console.error("Error subirImagen:", uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from("imagenes")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

/* SUBIR VIDEO A STORAGE */
export async function subirVideo(file) {
  const fileName = `${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("videos")
    .upload(fileName, file);

  if (uploadError) {
    console.error("Error subirVideo:", uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from("videos")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

/* OFERTAS AÉREAS */
export async function getOfertasAereas() {
  const { data, error } = await supabase
    .from("imagenes_web")
    .select("*")
    .eq("seccion", "ofertas_aereas")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error) {
    console.error("Error getOfertasAereas:", error);
    return [];
  }

  return data;
}