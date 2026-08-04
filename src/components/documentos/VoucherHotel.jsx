import { useRef, useState } from "react";

import VoucherHotelForm from "../components/documentos/VoucherHotelForm";
import VoucherHotelPreview from "../components/documentos/VoucherHotelPreview";

import "../components/documentos/Documento.css";

function VoucherHotel() {

    const voucherRef = useRef(null);

    const [voucher, setVoucher] = useState({

        numero: 1,

        fechaEmision: new Date().toISOString().split("T")[0],

        pasajero: "",

        hotel: "",

        checkIn: "",

        checkOut: "",

        incluye: "",

        observaciones: ""

    });

    return (

        <div className="documentos-page">

            <div className="panel-formulario">

                <VoucherHotelForm
                    voucher={voucher}
                    setVoucher={setVoucher}
                />

            </div>

            <div className="panel-preview">

                <VoucherHotelPreview
                    ref={voucherRef}
                    voucher={voucher}
                />

            </div>

        </div>

    );

}

export default VoucherHotel;