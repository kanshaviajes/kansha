import { forwardRef } from "react";
import { supabase } from "../../supabase";

const logo = "/logo.png";
const firma = "/firmadigital.png";

const VoucherOpcionalesPreview = forwardRef(({ voucher }, ref) => {

    const formatearFecha = (fecha) => {
        if (!fecha) return "-";

        const [anio, mes, dia] = fecha.split("-");
        return `${dia}/${mes}/${anio}`;
    };


    const handleGuardarYDescargarPDF = async () => {

        try {

            /* =====================================================
               1. GUARDAR EN SUPABASE
            ===================================================== */

            const { error } = await supabase
                .from("vouchers_opcionales")
                .insert([
                    {
                        numero: voucher.numero,
                        fecha_emision: voucher.fechaEmision || null,
                        pasajeros: voucher.pasajeros || [],
                        check_in: voucher.checkIn || null,
                        check_out: voucher.checkOut || null,
                        servicios: voucher.servicios || [],
                        observaciones: voucher.observaciones || null
                    }
                ]);

            if (error) throw error;


            /* =====================================================
               2. GENERAR PDF
            ===================================================== */

            if (ref && ref.current) {

                const html2pdf = (await import("html2pdf.js")).default;

                const elemento = ref.current;

                const primerPasajero =
                    voucher.pasajeros?.[0]?.nombre || "Pasajero";

                const opciones = {

                    margin: 0,

                    filename:
                        `Voucher_Opcionales_${primerPasajero.replace(/\s+/g, "_")}.pdf`,

                    image: {
                        type: "jpeg",
                        quality: 0.98
                    },

                    html2canvas: {
                        scale: 2,
                        useCORS: true,
                        logging: false
                    },

                    jsPDF: {
                        unit: "mm",
                        format: "a4",
                        orientation: "portrait"
                    }

                };

                await html2pdf()
                    .from(elemento)
                    .set(opciones)
                    .save();

            }

        } catch (error) {

            console.error(
                "Error al procesar el voucher:",
                error.message
            );

            alert(
                "Hubo un error al procesar el voucher: " +
                error.message
            );

        }

    };


    return (

        <div className="preview-container">


            {/* =====================================================
                BOTÓN — NO SE IMPRIME
            ===================================================== */}

            <div
                className="acciones-voucher no-print"
                style={{
                    marginBottom: "20px",
                    display: "flex",
                    gap: "10px"
                }}
            >

                <button
                    onClick={handleGuardarYDescargarPDF}
                    style={{
                        background: "#2a9d8f",
                        color: "#fff",
                        border: "none",
                        padding: "12px 20px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "16px",
                        width: "100%"
                    }}
                >
                    💾 Guardar y Descargar PDF
                </button>

            </div>


            {/* =====================================================
                DOCUMENTO A4
            ===================================================== */}

            <div
                className="a4 voucher-opcionales"
                ref={ref}
            >


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="voucher-header">

                    <img
                        src={logo}
                        alt="Kansha Viajes"
                        className="logo-img"
                    />

                    <div>

                        <h1>SERVICIOS OPCIONALES</h1>

                        <p>
                            Empresa de Viajes y Turismo
                        </p>

                        <small>
                            Registro Mintur Nº 796
                        </small>

                    </div>

                </div>


                <hr />


                <div className="voucher-aviso">

                    ESTE VOUCHER ES VÁLIDO PARA LOS SERVICIOS
                    INDICADOS A CONTINUACIÓN.

                </div>


                {/* =================================================
                    DATOS DEL VOUCHER
                ================================================= */}

                <table className="voucher-table">

                    <tbody>

                        <tr>

                            <td className="titulo-columna">
                                Voucher Nº
                            </td>

                            <td>
                                {String(
                                    voucher.numero || 1
                                ).padStart(3, "0")}
                            </td>

                        </tr>


                        <tr>

                            <td className="titulo-columna">
                                Fecha de emisión
                            </td>

                            <td>
                                {formatearFecha(
                                    voucher.fechaEmision
                                )}
                            </td>

                        </tr>


                        <tr>

                            <td className="titulo-columna">
                                Check In
                            </td>

                            <td>
                                {formatearFecha(
                                    voucher.checkIn
                                )}
                            </td>

                        </tr>


                        <tr>

                            <td className="titulo-columna">
                                Check Out
                            </td>

                            <td>
                                {formatearFecha(
                                    voucher.checkOut
                                )}
                            </td>

                        </tr>

                    </tbody>

                </table>


                {/* =================================================
                    PASAJEROS
                ================================================= */}

                <div className="voucher-box">

                    <h3>DATOS DE LOS PASAJEROS</h3>


                    <table className="voucher-table tabla-opcionales">

                        <thead>

                            <tr>

                                <th>
                                    Pasajero
                                </th>

                                <th>
                                    Documento
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {voucher.pasajeros &&
                            voucher.pasajeros.length > 0 ? (

                                voucher.pasajeros.map(
                                    (pasajero, index) => (

                                        <tr key={index}>

                                            <td>
                                                {pasajero.nombre || "-"}
                                            </td>

                                            <td>
                                                {pasajero.cedula || "-"}
                                            </td>

                                        </tr>

                                    )
                                )

                            ) : (

                                <tr>

                                    <td colSpan="2">
                                        -
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>


                {/* =================================================
                    SERVICIOS
                ================================================= */}

                <div className="voucher-box">

                    <h3>
                        SERVICIOS OPCIONALES CONTRATADOS
                    </h3>


                    <table className="voucher-table tabla-opcionales">

                        <thead>

                            <tr>

                                <th>
                                    Servicio / Excursión
                                </th>

                                <th>
                                    Fecha
                                </th>

                                <th>
                                    Horario
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {voucher.servicios &&
                            voucher.servicios.length > 0 ? (

                                voucher.servicios.map(
                                    (servicio, index) => (

                                        <tr key={index}>

                                            <td>
                                                <strong>
                                                    {servicio.nombre || "-"}
                                                </strong>

                                                {servicio.observaciones && (

                                                    <div
                                                        className="servicio-observacion"
                                                    >
                                                        {servicio.observaciones}
                                                    </div>

                                                )}

                                            </td>

                                            <td>
                                                {formatearFecha(
                                                    servicio.fecha
                                                )}
                                            </td>

                                            <td>
                                                {servicio.horario || "-"}
                                            </td>

                                        </tr>

                                    )
                                )

                            ) : (

                                <tr>

                                    <td colSpan="3">
                                        -
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>


                {/* =================================================
                    OBSERVACIONES GENERALES
                ================================================= */}

                {voucher.observaciones && (

                    <div className="voucher-box">

                        <h3>
                            OBSERVACIONES
                        </h3>

                        <p>
                            {voucher.observaciones}
                        </p>

                    </div>

                )}


                {/* =================================================
                    FIRMA
                ================================================= */}

                <div className="firma">

                    <img
                        src={firma}
                        alt="Firma"
                        className="firma-img"
                    />

                    <div className="linea"></div>

                    <h4>
                        Florencia Bonifacio
                    </h4>

                    <p>
                        Kansha Viajes
                    </p>

                    <small>
                        Registro Mintur Nº 796
                    </small>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="voucher-footer">

                    <strong>
                        KANSHA VIAJES
                    </strong>

                    <p>
                        📍 Uruguay
                    </p>

                    <p>
                        📞 +598 91846311
                    </p>

                    <p>
                        ✉️ info@kanshaviajes.com
                    </p>

                </div>


            </div>

        </div>

    );

});

export default VoucherOpcionalesPreview;