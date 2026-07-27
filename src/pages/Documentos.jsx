import { useEffect, useRef, useState } from "react";

import DocumentoForm from "../components/documentos/DocumentoForm";
import ReciboPreview from "../components/documentos/ReciboPreview";

import { generarPDF } from "../services/pdfService";
import {
    obtenerProximoNumero,
    guardarRecibo
} from "../services/recibosService";

import "../components/documentos/Documento.css";

function Documentos() {
    const reciboRef = useRef(null);

    const [recibo, setRecibo] = useState({
        numero: 1,
        fechaEmision: new Date().toISOString().split("T")[0],
        fechaSalida: "",
        destino: "",
        pasajero: "",
        moneda: "USD",
        cantidadPasajeros: 1,
        precioPasajero: "",
        precioTotal: 0,
        montoEntregado: "",
        saldo: 0,
        formaPago: "Transferencia",
        observaciones: ""
    });

    useEffect(() => {
        async function cargarNumero() {
            const numero = await obtenerProximoNumero();

            setRecibo(prev => ({
                ...prev,
                numero
            }));
        }

        cargarNumero();
    }, []);

    const generarRecibo = async () => {
        // 1 - Mapear propiedades a snake_case y manejar fecha vacía como null
        const reciboParaSupabase = {
            numero: recibo.numero,
            fecha_emision: recibo.fechaEmision,
            fecha_salida: recibo.fechaSalida ? recibo.fechaSalida : null,
            destino: recibo.destino,
            pasajero: recibo.pasajero,
            moneda: recibo.moneda,
            cantidad_pasajeros: Number(recibo.cantidadPasajeros),
            precio_pasajero: Number(recibo.precioPasajero) || 0,
            precio_total: Number(recibo.precioTotal) || 0,
            monto_entregado: Number(recibo.montoEntregado) || 0,
            saldo: Number(recibo.saldo) || 0,
            forma_pago: recibo.formaPago,
            observaciones: recibo.observaciones,
            estado: "Emitido"
        };

        // 2 - Guardar en Supabase
        const guardado = await guardarRecibo(reciboParaSupabase);

        if (!guardado) {
            alert("❌ No se pudo guardar el recibo");
            return;
        }

        // 3 - Generar PDF
        await generarPDF(
            reciboRef.current,
            `REC-${String(recibo.numero).padStart(3, "0")}`
        );

        alert(
            `✅ Recibo Nº ${String(recibo.numero).padStart(3, "0")} generado correctamente`
        );
    };

    return (
        <div className="documentos-page">
            <div>
                <DocumentoForm
                    recibo={recibo}
                    setRecibo={setRecibo}
                />

                <button
                    className="btn-guardar"
                    style={{ marginTop: 15 }}
                    onClick={generarRecibo}
                >
                    📄 Generar Recibo PDF
                </button>
            </div>

            <ReciboPreview
                ref={reciboRef}
                recibo={recibo}
            />
        </div>
    );
}

export default Documentos;