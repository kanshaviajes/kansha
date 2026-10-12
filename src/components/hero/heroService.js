
import { supabase } from "../../supabase";

export async function getHeroDestinos() {
  const { data, error } = await supabase
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

  if (error) {
    console.error("Error al cargar destinos del Hero:", error);
    throw error;
  }

  return (data || [])
    .filter(
      (destino) =>
        destino.hero_imagen_url &&
        destino.card_imagen_url
    )
    .map((destino) => ({
      ...destino,

      // Propiedades utilizadas por Hero.jsx
      cardId: destino.id,
      cardImagen: destino.card_imagen_url,
      fondoImagen: destino.hero_imagen_url,
      orden: destino.orden_hero ?? 999,
    }));
}
