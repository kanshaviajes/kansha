import { useRef, useState } from "react";
import VoucherOpcionalesForm from "./VoucherOpcionalesForm";
import VoucherOpcionalesPreview from "./VoucherOpcionalesPreview";
import "./Documento.css";

function VoucherOpcionales() {

    const voucherRef = useRef(null);

    const [voucher, setVoucher] = useState({

        numero: 1,

        fechaEmision: new Date().toISOString().split("T")[0],

        pasajeros: [
            {
                nombre: "",
                cedula: ""
            }
        ],

        checkIn: "",
        checkOut: "",

        servicios: [
            {
                nombre: "",
                fecha: "",
                horario: "",
                observaciones: ""
            }
        ],

        observaciones: ""

    });


    return (

        <div
            className="documentos-page"
            style={{
                display: "flex",
                gap: "20px",
                padding: "20px",
                justifyContent: "center",
                flexWrap: "wrap"
            }}
        >

            {/* FORMULARIO */}

            <div
                className="panel-formulario"
                style={{
                    flex: "1",
                    minWidth: "300px",
                    maxWidth: "500px"
                }}
            >

                <VoucherOpcionalesForm
                    voucher={voucher}
                    setVoucher={setVoucher}
                />

            </div>


            {/* PREVIEW */}

            <div
                className="panel-preview"
                style={{
                    flex: "1",
                    minWidth: "350px"
                }}
            >

                <VoucherOpcionalesPreview
                    ref={voucherRef}
                    voucher={voucher}
                />

            </div>

        </div>

    );
}

export default VoucherOpcionales;