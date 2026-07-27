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

export async function guardarRecibo(recibo) {
    console.log("📤 Datos enviados a Supabase:", recibo);

    const { data, error } = await supabase
        .from("recibos")
        .insert([recibo])
        .select();

    if (error) {
        console.error("❌ Error detallado de Supabase:", error);
        alert(`Error de Supabase [${error.code}]: ${error.message}`);
        return null;
    }

    console.log("✅ Recibo guardado con éxito:", data);
    return data[0];
}