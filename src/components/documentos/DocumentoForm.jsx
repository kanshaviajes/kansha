function DocumentoForm({ recibo, setRecibo }) {

    const handleChange = (e) => {

        const { name, value } = e.target;

        const nuevoRecibo = {
            ...recibo,
            [name]: value
        };

        const cantidad = Number(nuevoRecibo.cantidadPasajeros || 1);
        const precio = Number(nuevoRecibo.precioPasajero || 0);
        const entrega = Number(nuevoRecibo.montoEntregado || 0);

        nuevoRecibo.precioTotal = cantidad * precio;
        nuevoRecibo.saldo = nuevoRecibo.precioTotal - entrega;

        setRecibo(nuevoRecibo);

    };

    return (

        <div className="panel-documento">

            <h2>Nuevo Recibo</h2>

            <div className="grupo">

                <label>Número de recibo</label>

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
                    Nº {String(recibo.numero || 1).padStart(3, "0")}
                </div>

            </div>

            <div className="grupo">

                <label>Fecha de emisión</label>

                <input
                    type="date"
                    name="fechaEmision"
                    value={recibo.fechaEmision}
                    onChange={handleChange}
                />

            </div>

            <div className="grupo">

                <label>Fecha de salida</label>

                <input
                    type="date"
                    name="fechaSalida"
                    value={recibo.fechaSalida}
                    onChange={handleChange}
                />

            </div>

            <div className="grupo">

                <label>Destino</label>

                <input
                    type="text"
                    name="destino"
                    value={recibo.destino}
                    onChange={handleChange}
                />

            </div>

            <div className="grupo">

                <label>Pasajero</label>

                <input
                    type="text"
                    name="pasajero"
                    value={recibo.pasajero}
                    onChange={handleChange}
                />

            </div>

            <div className="grupo">

                <label>Cantidad de pasajeros</label>

                <input
                    type="number"
                    name="cantidadPasajeros"
                    min="1"
                    value={recibo.cantidadPasajeros}
                    onChange={handleChange}
                />

            </div>

            <div className="grupo">

                <label>Precio por pasajero</label>

                <input
                    type="number"
                    name="precioPasajero"
                    value={recibo.precioPasajero}
                    onChange={handleChange}
                />

            </div>

            <div className="grupo">

                <label>Monto entregado</label>

                <input
                    type="number"
                    name="montoEntregado"
                    value={recibo.montoEntregado}
                    onChange={handleChange}
                />

            </div>

            <div className="grupo">

                <label>Forma de pago</label>

                <select
                    name="formaPago"
                    value={recibo.formaPago}
                    onChange={handleChange}
                >
                    <option>Transferencia</option>
                    <option>Efectivo</option>
                    <option>Tarjeta</option>
                    <option>Débito</option>
                </select>

            </div>

            <div className="grupo">

                <label>Observaciones</label>

                <textarea
                    rows="4"
                    name="observaciones"
                    value={recibo.observaciones}
                    onChange={handleChange}
                />

            </div>

            <div className="resumen-panel">

                <h4>Resumen</h4>

                <p>
                    <strong>Total:</strong> {recibo.moneda} {recibo.precioTotal}
                </p>

                <p>
                    <strong>Saldo:</strong> {recibo.moneda} {recibo.saldo}
                </p>

            </div>

        </div>

    );

}

export default DocumentoForm;