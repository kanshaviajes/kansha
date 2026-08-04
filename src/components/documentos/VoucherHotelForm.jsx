function VoucherHotelForm({ voucher, setVoucher }) {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVoucher({
            ...voucher,
            [name]: value
        });
    };

    return (
        <div className="panel-documento">

            <h2>Nuevo Voucher Hotel</h2>

            {/* Número */}
            <div className="grupo">
                <label>Número de Voucher</label>
                <div
                    style={{
                        padding: "12px",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        background: "#f8f9fa",
                        fontWeight: "700",
                        fontSize: "18px",
                        color: "#1d3557"
                    }}
                >
                    Nº {String(voucher.numero || 1).padStart(3, "0")}
                </div>
            </div>

            {/* Fecha */}
            <div className="grupo">
                <label>Fecha de emisión</label>
                <input
                    type="date"
                    name="fechaEmision"
                    value={voucher.fechaEmision}
                    onChange={handleChange}
                />
            </div>

            {/* Pasajero */}
            <div className="grupo">
                <label>Nombre del pasajero</label>
                <input
                    type="text"
                    name="pasajero"
                    value={voucher.pasajero}
                    onChange={handleChange}
                    placeholder="Ej: Juan Pérez"
                />
            </div>

            {/* Cédula de Identidad */}
            <div className="grupo">
                <label>Cédula de Identidad</label>
                <input
                    type="text"
                    name="cedula"
                    value={voucher.cedula || ""}
                    onChange={handleChange}
                    placeholder="Ej: 1.234.567-8"
                />
            </div>

            {/* Hotel */}
            <div className="grupo">
                <label>Hotel</label>
                <input
                    type="text"
                    name="hotel"
                    value={voucher.hotel}
                    onChange={handleChange}
                    placeholder="Ej: Hotel Impala"
                />
            </div>

            {/* Dirección del Hotel */}
            <div className="grupo">
                <label>Dirección del Hotel</label>
                <input
                    type="text"
                    name="direccionHotel"
                    value={voucher.direccionHotel || ""}
                    onChange={handleChange}
                    placeholder="Ej: Av. Principal 123, Punta del Este"
                />
            </div>

            {/* Contacto del Hotel */}
            <div className="grupo">
                <label>Contacto del Hotel (Tel / Email)</label>
                <input
                    type="text"
                    name="contactoHotel"
                    value={voucher.contactoHotel || ""}
                    onChange={handleChange}
                    placeholder="Ej: +598 42 000 000"
                />
            </div>

            {/* Check In */}
            <div className="grupo">
                <label>Check In</label>
                <input
                    type="date"
                    name="checkIn"
                    value={voucher.checkIn}
                    onChange={handleChange}
                />
            </div>

            {/* Check Out */}
            <div className="grupo">
                <label>Check Out</label>
                <input
                    type="date"
                    name="checkOut"
                    value={voucher.checkOut}
                    onChange={handleChange}
                />
            </div>

            {/* Incluye */}
            <div className="grupo">
                <label>Incluye</label>
                <textarea
                    rows="6"
                    name="incluye"
                    value={voucher.incluye}
                    onChange={handleChange}
                    placeholder={`Ejemplo:

01 Habitación Doble Matrimonial
Régimen Desayuno
Piscina
Wifi
Estacionamiento`}
                />
            </div>

            {/* Observaciones */}
            <div className="grupo">
                <label>Observaciones</label>
                <textarea
                    rows="4"
                    name="observaciones"
                    value={voucher.observaciones}
                    onChange={handleChange}
                    placeholder="Información adicional (opcional)"
                />
            </div>

        </div>
    );

}

export default VoucherHotelForm;