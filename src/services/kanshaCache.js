const PREFIX = "kansha_cache_v1_";


export function guardarCache(clave, data) {
  try {
    if (data === null || data === undefined) return;

    if (Array.isArray(data) && data.length === 0) {
      return;
    }

    const payload = {
      data,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      `${PREFIX}${clave}`,
      JSON.stringify(payload)
    );
  } catch (error) {
    console.warn("No se pudo guardar la caché:", error);
  }
}


/**
 * Lee información previamente guardada.
 */
export function leerCache(clave) {
  try {
    const raw = localStorage.getItem(`${PREFIX}${clave}`);

    if (!raw) return null;

    const parsed = JSON.parse(raw);

    return parsed?.data ?? null;
  } catch (error) {
    console.warn("No se pudo leer la caché:", error);
    return null;
  }
}


/**
 * Devuelve también la fecha en que se guardó.
 * Nos puede servir después para diagnóstico.
 */
export function leerCacheCompleta(clave) {
  try {
    const raw = localStorage.getItem(`${PREFIX}${clave}`);

    if (!raw) return null;

    return JSON.parse(raw);
  } catch (error) {
    console.warn("No se pudo leer la caché completa:", error);
    return null;
  }
}