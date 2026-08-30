import { supabase } from "../supabase";

// ==========================================
// PLANTILLAS / COTIZABLES
// ==========================================

export const obtenerPlantillas = async () => {
  const { data, error } = await supabase
    .from("plantillas_cotizacion")
    .select(`
      *,
      plantilla_hoteles (*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};

export const obtenerPlantillaPorId = async (id) => {
  const { data, error } = await supabase
    .from("plantillas_cotizacion")
    .select(`
      *,
      plantilla_hoteles (*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const crearPlantilla = async (plantilla) => {
  const { data, error } = await supabase
    .from("plantillas_cotizacion")
    .insert({
      titulo: plantilla.titulo,
      destino: plantilla.destino,
      imagen_portada: plantilla.imagen_portada || null,
      incluye: plantilla.incluye || null,
      no_incluye: plantilla.no_incluye || null,
      servicios_exclusivos: plantilla.servicios_exclusivos || null,
      medios_pago: plantilla.medios_pago || null,
      condiciones_generales: plantilla.condiciones_generales || null,
      activa: plantilla.activa ?? true,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const actualizarPlantilla = async (id, plantilla) => {
  const { data, error } = await supabase
    .from("plantillas_cotizacion")
    .update({
      titulo: plantilla.titulo,
      destino: plantilla.destino,
      imagen_portada: plantilla.imagen_portada || null,
      incluye: plantilla.incluye || null,
      no_incluye: plantilla.no_incluye || null,
      servicios_exclusivos: plantilla.servicios_exclusivos || null,
      medios_pago: plantilla.medios_pago || null,
      condiciones_generales: plantilla.condiciones_generales || null,
      activa: plantilla.activa ?? true,
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

export const eliminarPlantilla = async (id) => {
  const { error } = await supabase
    .from("plantillas_cotizacion")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  return true;
};

// ==========================================
// HOTELES DE PLANTILLA
// ==========================================

export const crearHotelPlantilla = async (hotel) => {
  const { data, error } = await supabase
    .from("plantilla_hoteles")
    .insert({
      plantilla_id: hotel.plantilla_id,
      nombre: hotel.nombre,
      estrellas: hotel.estrellas || null,
      regimen: hotel.regimen || null,
      habitacion: hotel.habitacion || null,
      descripcion: hotel.descripcion || null,
      ubicacion: hotel.ubicacion || null,
      imagen_url: hotel.imagen_url || null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const eliminarHotelesPlantilla = async (plantillaId) => {
  const { error } = await supabase
    .from("plantilla_hoteles")
    .delete()
    .eq("plantilla_id", plantillaId);

  if (error) {
    throw error;
  }

  return true;
};

// ==========================================
// COTIZACIONES
// ==========================================

export const obtenerCotizaciones = async () => {
  const { data, error } = await supabase
    .from("cotizaciones")
    .select(`
      *,
      cotizacion_vuelos (*),
      cotizacion_hoteles (*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};

export const obtenerCotizacionPorId = async (id) => {
  const { data, error } = await supabase
    .from("cotizaciones")
    .select(`
      *,
      cotizacion_vuelos (*),
      cotizacion_hoteles (*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const crearCotizacion = async (cotizacion) => {
  const { data, error } = await supabase
    .from("cotizaciones")
    .insert({
      plantilla_id: cotizacion.plantilla_id || null,
      cliente: cotizacion.cliente || null,
      titulo: cotizacion.titulo,
      destino: cotizacion.destino,
      imagen_portada: cotizacion.imagen_portada || null,
      incluye: cotizacion.incluye || null,
      no_incluye: cotizacion.no_incluye || null,
      servicios_exclusivos: cotizacion.servicios_exclusivos || null,
      medios_pago: cotizacion.medios_pago || null,
      condiciones_generales: cotizacion.condiciones_generales || null,
      precio_total:
        cotizacion.precio_total !== "" &&
        cotizacion.precio_total !== null &&
        cotizacion.precio_total !== undefined
          ? cotizacion.precio_total
          : null,
      moneda: cotizacion.moneda || "USD",
      vigencia_hasta: cotizacion.vigencia_hasta || null,
      activa: cotizacion.activa ?? true,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const actualizarCotizacion = async (id, cotizacion) => {
  const { data, error } = await supabase
    .from("cotizaciones")
    .update({
      cliente: cotizacion.cliente || null,
      titulo: cotizacion.titulo,
      destino: cotizacion.destino,
      imagen_portada: cotizacion.imagen_portada || null,
      incluye: cotizacion.incluye || null,
      no_incluye: cotizacion.no_incluye || null,
      servicios_exclusivos: cotizacion.servicios_exclusivos || null,
      medios_pago: cotizacion.medios_pago || null,
      condiciones_generales: cotizacion.condiciones_generales || null,
      precio_total:
        cotizacion.precio_total !== "" &&
        cotizacion.precio_total !== null &&
        cotizacion.precio_total !== undefined
          ? cotizacion.precio_total
          : null,
      moneda: cotizacion.moneda || "USD",
      vigencia_hasta: cotizacion.vigencia_hasta || null,
      activa: cotizacion.activa ?? true,
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

export const eliminarCotizacion = async (id) => {
  const { error } = await supabase
    .from("cotizaciones")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  return true;
};

// ==========================================
// COTIZACIÓN PÚBLICA
// ==========================================

export const obtenerCotizacionPublica = async (token) => {
  if (!token) {
    throw new Error("Token de cotización inválido.");
  }

  const { data, error } = await supabase.rpc(
    "obtener_cotizacion_publica",
    {
      token_cotizacion: token,
    }
  );

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(
      "La cotización no existe o ya no se encuentra disponible."
    );
  }

  return data;
};

// ==========================================
// VUELOS
// ==========================================

export const crearVueloCotizacion = async (vuelo) => {
  const { data, error } = await supabase
    .from("cotizacion_vuelos")
    .insert({
      cotizacion_id: vuelo.cotizacion_id,
      aerolinea: vuelo.aerolinea || null,
      numero_vuelo: vuelo.numero_vuelo || null,
      fecha: vuelo.fecha || null,
      origen: vuelo.origen || null,
      destino: vuelo.destino || null,
      hora_salida: vuelo.hora_salida || null,
      hora_llegada: vuelo.hora_llegada || null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const eliminarVuelosCotizacion = async (cotizacionId) => {
  const { error } = await supabase
    .from("cotizacion_vuelos")
    .delete()
    .eq("cotizacion_id", cotizacionId);

  if (error) {
    throw error;
  }

  return true;
};

// ==========================================
// HOTELES DE COTIZACIÓN
// ==========================================

export const crearHotelCotizacion = async (hotel) => {
  const { data, error } = await supabase
    .from("cotizacion_hoteles")
    .insert({
      cotizacion_id: hotel.cotizacion_id,
      nombre: hotel.nombre,
      estrellas: hotel.estrellas || null,
      regimen: hotel.regimen || null,
      habitacion: hotel.habitacion || null,
      descripcion: hotel.descripcion || null,
      ubicacion: hotel.ubicacion || null,
      imagen_url: hotel.imagen_url || null,
      precio:
        hotel.precio !== "" &&
        hotel.precio !== null &&
        hotel.precio !== undefined
          ? hotel.precio
          : null,
      moneda: hotel.moneda || "USD",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const eliminarHotelesCotizacion = async (cotizacionId) => {
  const { error } = await supabase
    .from("cotizacion_hoteles")
    .delete()
    .eq("cotizacion_id", cotizacionId);

  if (error) {
    throw error;
  }

  return true;
};

// ==========================================
// STORAGE
// ==========================================

export const subirImagenCotizacion = async (
  archivo,
  carpeta = "general"
) => {
  if (!archivo) {
    throw new Error("No se seleccionó ninguna imagen.");
  }

  const partesNombre = archivo.name.split(".");
  const extension =
    partesNombre.length > 1
      ? partesNombre.pop().toLowerCase()
      : "jpg";

  const nombreArchivo = `${crypto.randomUUID()}.${extension}`;

  const ruta = `${carpeta}/${nombreArchivo}`;

  const { error: uploadError } = await supabase.storage
    .from("cotizaciones")
    .upload(ruta, archivo, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from("cotizaciones")
    .getPublicUrl(ruta);

  if (!data?.publicUrl) {
    throw new Error(
      "La imagen se subió, pero no se pudo obtener su URL pública."
    );
  }

  return {
    ruta,
    url: data.publicUrl,
  };
};

export const eliminarImagenCotizacion = async (ruta) => {
  if (!ruta) {
    return true;
  }

  const { error } = await supabase.storage
    .from("cotizaciones")
    .remove([ruta]);

  if (error) {
    throw error;
  }

  return true;
};