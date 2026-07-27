import { useEffect, useRef, useState } from "react";

import DocumentoForm from "../components/documentos/DocumentoForm";
import ReciboPreview from "../components/documentos/ReciboPreview";

import { generarPDF } from "../services/pdfService";
import { obtenerProximoNumero } from "../services/recibosService";

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

    const descargarPDF = async () => {

        await generarPDF(
            reciboRef.current,
            `REC-${String(recibo.numero).padStart(3, "0")}`
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
                    onClick={descargarPDF}
                >
                    📄 Descargar PDF
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