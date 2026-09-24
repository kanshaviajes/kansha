import { supabase } from "../supabase";

// ======================================================
// OBTENER TODAS LAS HOJAS
// ======================================================

export const obtenerHojasViaje = async () => {
  const { data, error } = await supabase
    .from("hojas_viaje")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data;
};

// ======================================================
// OBTENER UNA HOJA
// ======================================================

export const obtenerHojaViajePorId = async (id) => {
  const { data, error } = await supabase
    .from("hojas_viaje")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// ======================================================
// CREAR HOJA
// ======================================================

export const crearHojaViaje = async (hoja) => {
  const { data, error } = await supabase
    .from("hojas_viaje")
    .insert({
      titulo: hoja.titulo,
      modalidad: hoja.modalidad || null,
      temporada: hoja.temporada || null,

      fecha_salida: hoja.fecha_salida || null,
      fecha_regreso: hoja.fecha_regreso || null,

      dias:
        hoja.dias !== "" &&
        hoja.dias !== null &&
        hoja.dias !== undefined
          ? hoja.dias
          : null,

      noches:
        hoja.noches !== "" &&
        hoja.noches !== null &&
        hoja.noches !== undefined
          ? hoja.noches
          : null,

      moneda: hoja.moneda || "USD",

      precio:
        hoja.precio !== "" &&
        hoja.precio !== null &&
        hoja.precio !== undefined
          ? hoja.precio
          : null,

      detalle_precio: hoja.detalle_precio || null,

      recorrido: hoja.recorrido || null,

      incluye: hoja.incluye || [],

      excursiones: hoja.excursiones || null,
      nota_excursiones: hoja.nota_excursiones || null,

      condicion_salida: hoja.condicion_salida || null,

      cupo_minimo:
        hoja.cupo_minimo !== "" &&
        hoja.cupo_minimo !== null &&
        hoja.cupo_minimo !== undefined
          ? hoja.cupo_minimo
          : null,

      sena:
        hoja.sena !== "" &&
        hoja.sena !== null &&
        hoja.sena !== undefined
          ? hoja.sena
          : null,

      detalle_sena: hoja.detalle_sena || null,

      texto_final: hoja.texto_final || null,

      activa: hoja.activa ?? true,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// ======================================================
// ACTUALIZAR HOJA
// ======================================================

export const actualizarHojaViaje = async (
  id,
  hoja
) => {
  const { data, error } = await supabase
    .from("hojas_viaje")
    .update({
      titulo: hoja.titulo,
      modalidad: hoja.modalidad || null,
      temporada: hoja.temporada || null,

      fecha_salida: hoja.fecha_salida || null,
      fecha_regreso: hoja.fecha_regreso || null,

      dias:
        hoja.dias !== "" &&
        hoja.dias !== null &&
        hoja.dias !== undefined
          ? hoja.dias
          : null,

      noches:
        hoja.noches !== "" &&
        hoja.noches !== null &&
        hoja.noches !== undefined
          ? hoja.noches
          : null,

      moneda: hoja.moneda || "USD",

      precio:
        hoja.precio !== "" &&
        hoja.precio !== null &&
        hoja.precio !== undefined
          ? hoja.precio
          : null,

      detalle_precio: hoja.detalle_precio || null,

      recorrido: hoja.recorrido || null,

      incluye: hoja.incluye || [],

      excursiones: hoja.excursiones || null,
      nota_excursiones: hoja.nota_excursiones || null,

      condicion_salida: hoja.condicion_salida || null,

      cupo_minimo:
        hoja.cupo_minimo !== "" &&
        hoja.cupo_minimo !== null &&
        hoja.cupo_minimo !== undefined
          ? hoja.cupo_minimo
          : null,

      sena:
        hoja.sena !== "" &&
        hoja.sena !== null &&
        hoja.sena !== undefined
          ? hoja.sena
          : null,

      detalle_sena: hoja.detalle_sena || null,

      texto_final: hoja.texto_final || null,

      activa: hoja.activa ?? true,

      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// ======================================================
// ELIMINAR HOJA
// ======================================================

export const eliminarHojaViaje = async (id) => {
  const { error } = await supabase
    .from("hojas_viaje")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  return true;
};

// ======================================================
// DUPLICAR HOJA
// ======================================================

export const duplicarHojaViaje = async (id) => {
  const original = await obtenerHojaViajePorId(id);

  return crearHojaViaje({
    ...original,

    titulo: `${original.titulo} - copia`,

    id: undefined,
    created_at: undefined,
    updated_at: undefined,
  });
};