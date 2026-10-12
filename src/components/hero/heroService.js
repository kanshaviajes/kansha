
import { supabase } from "../../supabase";

const CACHE_KEY = "kansha_hero_destinos_v1";
const TIMEOUT_MS = 7000;

function leerCache() {
  try {
    const guardado = localStorage.getItem(CACHE_KEY);
    if (!guardado) return null;

    const destinos = JSON.parse(guardado);

    return Array.isArray(destinos) && destinos.length > 0
      ? destinos
      : null;
  } catch (error) {
    console.warn("No se pudo leer la caché del Hero:", error);
    return null;
  }
}

function guardarCache(destinos) {
  try {
    if (destinos.length > 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(destinos));
    }
  } catch (error) {
    console.warn("No se pudo guardar la caché del Hero:", error);
  }
}

function prepararDestinos(data) {
  return (data || [])
    .filter(
      (destino) =>
        destino.hero_imagen_url &&
        destino.card_imagen_url
    )
    .map((destino) => ({
      ...destino,
      cardId: destino.id,
      cardImagen: destino.card_imagen_url,
      fondoImagen: destino.hero_imagen_url,
      orden: destino.orden_hero ?? 999,
    }));
}

async function consultarSupabase() {
  const consulta = supabase
    .from("destinos")
    .select(`
      id,
      nombre,
      descripcion,
      precio,
      noches,
      moneda,
      hero_imagen_url,
      card_imagen_url,
      mostrar_en_hero,
      orden_hero,
      activo
    `)
    .eq("activo", true)
    .eq("mostrar_en_hero", true)
    .order("orden_hero", {
      ascending: true,
      nullsFirst: false,
    });

  let timeoutId;

  try {
    const timeout = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error("Tiempo de espera agotado"));
      }, TIMEOUT_MS);
    });

    const { data, error } = await Promise.race([
      consulta,
      timeout,
    ]);

    if (error) throw error;

    return prepararDestinos(data);
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function getHeroDestinos() {
  try {
    const destinos = await consultarSupabase();

    guardarCache(destinos);

    return destinos;
  } catch (error) {
    console.warn(
      "Supabase no disponible. Buscando caché del Hero:",
      error
    );

    const cache = leerCache();

    if (cache) {
      return cache;
    }

    throw new Error(
      "No se pudieron cargar los destinos y no hay datos guardados."
    );
  }
}
