import { supabase } from "../supabase";

export async function obtenerProximoNumero() {

    const { data, error } = await supabase
        .from("recibos")
        .select("numero")
        .order("numero", { ascending: false })
        .limit(1);

    if (error) {
        console.error("Error obteniendo número de recibo:", error);
        return 1;
    }

    if (!data || data.length === 0) {
        return 1;
    }

    return Number(data[0].numero) + 1;
}