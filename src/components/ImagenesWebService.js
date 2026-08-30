import { supabase } from "../supabase";
import {
  guardarCache,
  leerCache
} from "../services/kanshaCache";


const TIMEOUT_MS = 7000;


/* =========================================================
   TIMEOUT DE SEGURIDAD
========================================================= */

function conTimeout(promesa, ms = TIMEOUT_MS) {
  return Promise.race([
    promesa,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Supabase demoró demasiado en responder")),
        ms
      )
    ),
  ]);
}


/* =========================================================
   LISTAR POR SECCIÓN
========================================================= */

export async function getImagenesPorSeccion(seccion) {

  const cacheKey = `imagenes_web_${seccion}`;

  try {

    const resultado = await conTimeout(
      supabase
        .from("imagenes_web")
        .select("*")
        .eq("seccion", seccion)
        .order("orden", { ascending: true })
    );


    const { data, error } = resultado;


    if (error) {
      throw error;
    }


    /*
      Supabase respondió correctamente.

      Si tenemos datos, actualizamos el respaldo local.
    */
    if (data && data.length > 0) {
      guardarCache(cacheKey, data);
    }


    return data || [];


  } catch (error) {

    console.warn(
      `Supabase no disponible para ${seccion}. Intentando caché local.`,
      error
    );


    const cache = leerCache(cacheKey);


    if (cache) {
      console.info(`Usando caché local para ${seccion}`);
      return cache;
    }


    console.warn(
      `No existe caché disponible para ${seccion}`
    );


    return [];
  }
}


/* =========================================================
   LISTAR POR DESTINO
========================================================= */

export async function getImagenesPorDestino(titulo) {

  const cacheKey = `destino_slides_${titulo}`;

  try {

    const resultado = await conTimeout(
      supabase
        .from("imagenes_web")
        .select("*")
        .eq("seccion", "destino_slides")
        .eq("titulo", titulo)
        .eq("activo", true)
        .order("orden", { ascending: true })
    );


    const { data, error } = resultado;


    if (error) {
      throw error;
    }


    if (data && data.length > 0) {
      guardarCache(cacheKey, data);
    }


    return data || [];


  } catch (error) {

    console.warn(
      `Supabase no disponible para slides de ${titulo}.`,
      error
    );


    const cache = leerCache(cacheKey);


    if (cache) {
      console.info(
        `Usando caché local para slides de ${titulo}`
      );

      return cache;
    }


    return [];
  }
}


/* =========================================================
   LISTAR TODOS LOS SLIDES
========================================================= */

export async function getSlides() {

  const cacheKey = "destino_slides_titulos";

  try {

    const resultado = await conTimeout(
      supabase
        .from("imagenes_web")
        .select("titulo")
        .eq("seccion", "destino_slides")
        .eq("activo", true)
        .order("titulo", { ascending: true })
    );


    const { data, error } = resultado;


    if (error) {
      throw error;
    }


    const titulos = [
      ...new Set(
        (data || []).map((item) => item.titulo)
      )
    ];


    if (titulos.length > 0) {
      guardarCache(cacheKey, titulos);
    }


    return titulos;


  } catch (error) {

    console.warn(
      "Supabase no disponible para listado de slides.",
      error
    );


    const cache = leerCache(cacheKey);


    if (cache) {
      return cache;
    }


    return [];
  }
}


/* =========================================================
   CREAR IMAGEN
========================================================= */

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


/* =========================================================
   ACTUALIZAR IMAGEN
========================================================= */

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


/* =========================================================
   ELIMINAR IMAGEN
========================================================= */

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


/* =========================================================
   SUBIR IMAGEN A STORAGE
========================================================= */

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


/* =========================================================
   SUBIR VIDEO A STORAGE
========================================================= */

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


/* =========================================================
   OFERTAS AÉREAS
========================================================= */

export async function getOfertasAereas() {

  /*
    La dejamos usando el mismo sistema centralizado.

    Así no tenemos dos implementaciones diferentes
    para exactamente la misma sección.
  */

  return getImagenesPorSeccion("ofertas_aereas");
}