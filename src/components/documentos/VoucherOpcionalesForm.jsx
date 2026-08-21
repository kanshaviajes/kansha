function VoucherOpcionalesForm({ voucher, setVoucher }) {

    const handleChange = (e) => {
        const { name, value } = e.target;

        setVoucher({
            ...voucher,
            [name]: value
        });
    };


    /* =====================================================
       PASAJEROS
    ===================================================== */

    const handlePasajeroChange = (index, campo, value) => {

        const nuevosPasajeros = [...voucher.pasajeros];

        nuevosPasajeros[index] = {
            ...nuevosPasajeros[index],
            [campo]: value
        };

        setVoucher({
            ...voucher,
            pasajeros: nuevosPasajeros
        });
    };


    const agregarPasajero = () => {

        setVoucher({
            ...voucher,
            pasajeros: [
                ...voucher.pasajeros,
                {
                    nombre: "",
                    cedula: ""
                }
            ]
        });
    };


    const eliminarPasajero = (index) => {

        if (voucher.pasajeros.length === 1) return;

        const nuevosPasajeros =
            voucher.pasajeros.filter((_, i) => i !== index);

        setVoucher({
            ...voucher,
            pasajeros: nuevosPasajeros
        });
    };


    /* =====================================================
       SERVICIOS
    ===================================================== */

    const handleServicioChange = (index, campo, value) => {

        const nuevosServicios = [...voucher.servicios];

        nuevosServicios[index] = {
            ...nuevosServicios[index],
            [campo]: value
        };

        setVoucher({
            ...voucher,
            servicios: nuevosServicios
        });
    };


    const agregarServicio = () => {

        setVoucher({
            ...voucher,
            servicios: [
                ...voucher.servicios,
                {
                    nombre: "",
                    fecha: "",
                    horario: "",
                    observaciones: ""
                }
            ]
        });
    };


    const eliminarServicio = (index) => {

        if (voucher.servicios.length === 1) return;

        const nuevosServicios =
            voucher.servicios.filter((_, i) => i !== index);

        setVoucher({
            ...voucher,
            servicios: nuevosServicios
        });
    };


    return (

        <div className="panel-documento">

            <h2>Nuevo Voucher de Servicios Opcionales</h2>


            {/* =====================================================
                NÚMERO
            ===================================================== */}

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


            {/* =====================================================
                FECHA EMISIÓN
            ===================================================== */}

            <div className="grupo">

                <label>Fecha de emisión</label>

                <input
                    type="date"
                    name="fechaEmision"
                    value={voucher.fechaEmision || ""}
                    onChange={handleChange}
                />

            </div>


            {/* =====================================================
                PASAJEROS
            ===================================================== */}

            <div
                style={{
                    marginTop: "30px",
                    marginBottom: "20px"
                }}
            >

                <h3
                    style={{
                        color: "#1d3557",
                        marginBottom: "15px"
                    }}
                >
                    Pasajeros
                </h3>


                {voucher.pasajeros.map((pasajero, index) => (

                    <div
                        key={index}
                        style={{
                            padding: "18px",
                            border: "1px solid #e1e5ea",
                            borderRadius: "12px",
                            marginBottom: "15px",
                            background: "#fafbfc"
                        }}
                    >

                        <div
                            style={{
                                fontWeight: "700",
                                marginBottom: "15px",
                                color: "#555"
                            }}
                        >
                            Pasajero {index + 1}
                        </div>


                        <div className="grupo">

                            <label>Nombre completo</label>

                            <input
                                type="text"
                                value={pasajero.nombre}
                                onChange={(e) =>
                                    handlePasajeroChange(
                                        index,
                                        "nombre",
                                        e.target.value
                                    )
                                }
                                placeholder="Ej: Juan Pérez"
                            />

                        </div>


                        <div className="grupo">

                            <label>Cédula / Documento</label>

                            <input
                                type="text"
                                value={pasajero.cedula}
                                onChange={(e) =>
                                    handlePasajeroChange(
                                        index,
                                        "cedula",
                                        e.target.value
                                    )
                                }
                                placeholder="Ej: 1.234.567-8"
                            />

                        </div>


                        {voucher.pasajeros.length > 1 && (

                            <button
                                type="button"
                                onClick={() => eliminarPasajero(index)}
                                style={{
                                    border: "none",
                                    background: "#dc3545",
                                    color: "white",
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: "600"
                                }}
                            >
                                Eliminar pasajero
                            </button>

                        )}

                    </div>

                ))}


                <button
                    type="button"
                    onClick={agregarPasajero}
                    style={{
                        width: "100%",
                        border: "1px dashed #1d3557",
                        background: "#f8f9fa",
                        color: "#1d3557",
                        padding: "12px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "700"
                    }}
                >
                    + Agregar pasajero
                </button>

            </div>


            {/* =====================================================
                CHECK IN
            ===================================================== */}

            <div className="grupo">

                <label>Check In</label>

                <input
                    type="date"
                    name="checkIn"
                    value={voucher.checkIn || ""}
                    onChange={handleChange}
                />

            </div>


            {/* =====================================================
                CHECK OUT
            ===================================================== */}

            <div className="grupo">

                <label>Check Out</label>

                <input
                    type="date"
                    name="checkOut"
                    value={voucher.checkOut || ""}
                    onChange={handleChange}
                />

            </div>


            {/* =====================================================
                SERVICIOS OPCIONALES
            ===================================================== */}

            <div
                style={{
                    marginTop: "35px",
                    marginBottom: "20px"
                }}
            >

                <h3
                    style={{
                        color: "#1d3557",
                        marginBottom: "15px"
                    }}
                >
                    Servicios Opcionales
                </h3>


                {voucher.servicios.map((servicio, index) => (

                    <div
                        key={index}
                        style={{
                            padding: "18px",
                            border: "1px solid #e1e5ea",
                            borderRadius: "12px",
                            marginBottom: "15px",
                            background: "#fafbfc"
                        }}
                    >

                        <div
                            style={{
                                fontWeight: "700",
                                marginBottom: "15px",
                                color: "#555"
                            }}
                        >
                            Servicio {index + 1}
                        </div>


                        <div className="grupo">

                            <label>Servicio / Excursión</label>

                            <input
                                type="text"
                                value={servicio.nombre}
                                onChange={(e) =>
                                    handleServicioChange(
                                        index,
                                        "nombre",
                                        e.target.value
                                    )
                                }
                                placeholder="Ej: Tren del Fin del Mundo"
                            />

                        </div>


                        <div className="grupo">

                            <label>Fecha</label>

                            <input
                                type="date"
                                value={servicio.fecha}
                                onChange={(e) =>
                                    handleServicioChange(
                                        index,
                                        "fecha",
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="grupo">

                            <label>Horario</label>

                            <input
                                type="time"
                                value={servicio.horario}
                                onChange={(e) =>
                                    handleServicioChange(
                                        index,
                                        "horario",
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="grupo">

                            <label>Observaciones del servicio</label>

                            <textarea
                                rows="3"
                                value={servicio.observaciones}
                                onChange={(e) =>
                                    handleServicioChange(
                                        index,
                                        "observaciones",
                                        e.target.value
                                    )
                                }
                                placeholder="Ej: Presentarse 20 minutos antes"
                            />

                        </div>


                        {voucher.servicios.length > 1 && (

                            <button
                                type="button"
                                onClick={() => eliminarServicio(index)}
                                style={{
                                    border: "none",
                                    background: "#dc3545",
                                    color: "white",
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: "600"
                                }}
                            >
                                Eliminar servicio
                            </button>

                        )}

                    </div>

                ))}


                <button
                    type="button"
                    onClick={agregarServicio}
                    style={{
                        width: "100%",
                        border: "1px dashed #1d3557",
                        background: "#f8f9fa",
                        color: "#1d3557",
                        padding: "12px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "700"
                    }}
                >
                    + Agregar servicio
                </button>

            </div>


            {/* =====================================================
                OBSERVACIONES GENERALES
            ===================================================== */}

            <div className="grupo">

                <label>Observaciones generales</label>

                <textarea
                    rows="4"
                    name="observaciones"
                    value={voucher.observaciones || ""}
                    onChange={handleChange}
                    placeholder="Información adicional (opcional)"
                />

            </div>

        </div>
    );
}

export default VoucherOpcionalesForm;