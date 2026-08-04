import { useRef, useState } from "react";
import VoucherHotelForm from "./VoucherHotelForm";
import VoucherHotelPreview from "./VoucherHotelPreview";
import "./Documento.css";

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
        <div className="documentos-page" style={{ display: "flex", gap: "20px", padding: "20px", justifyContent: "center", flexWrap: "wrap" }}>
            <div className="panel-formulario" style={{ flex: "1", minWidth: "300px", maxWidth: "500px" }}>
                <VoucherHotelForm
                    voucher={voucher}
                    setVoucher={setVoucher}
                />
            </div>
            <div className="panel-preview" style={{ flex: "1", minWidth: "350px" }}>
                <VoucherHotelPreview
                    ref={voucherRef}
                    voucher={voucher}
                />
            </div>
        </div>
    );
}

export default VoucherHotel;