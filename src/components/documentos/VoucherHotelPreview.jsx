import { forwardRef } from "react";
import { supabase } from "../../supabase";

const logo = "/logo.png";
const firma = "/firmadigital.png";

const VoucherHotelPreview = forwardRef(({ voucher }, ref) => {

    const incluye = voucher.incluye
        ? voucher.incluye
            .split("\n")
            .filter(item => item.trim() !== "")
        : [];

    const calcularNoches = () => {
        if (!voucher.checkIn || !voucher.checkOut) return "-";

        const ingreso = new Date(voucher.checkIn);
        const salida = new Date(voucher.checkOut);

        const diferencia = salida - ingreso;
        const noches = Math.ceil(diferencia / (1000 * 60 * 60 * 24));

        return noches > 0 ? noches : "-";
    };

    // Función unificada: Guarda en Supabase y descarga el PDF de forma directa en cualquier dispositivo
    const handleGuardarYDescargarPDF = async () => {
        try {
            // 1. Guardar en Supabase
            const { error } = await supabase
                .from("vouchers_hotel")
                .insert([
                    {
                        numero: voucher.numero,
                        fecha_emision: voucher.fechaEmision || null,
                        pasajero: voucher.pasajero || null,
                        cedula: voucher.cedula || null,
                        hotel: voucher.hotel || null,
                        direccion_hotel: voucher.direccionHotel || null,
                        contacto_hotel: voucher.contactoHotel || null,
                        check_in: voucher.checkIn ? voucher.checkIn : null,
                        check_out: voucher.checkOut ? voucher.checkOut : null,
                        incluye: voucher.incluye || null,
                        observaciones: voucher.observaciones || null
                    }
                ]);

            if (error) throw error;

            // 2. Descargar PDF automáticamente (funciona en PC y celulares)
            if (ref && ref.current) {
                // Importación dinámica segura para evitar pantallas en blanco
                const html2pdf = (await import("html2pdf.js")).default;
                const elemento = ref.current;

                const opciones = {
                    margin:       0,
                    filename:     `Voucher_Hotel_${voucher.pasajero ? voucher.pasajero.replace(/\s+/g, '_') : "Pasajero"}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2, useCORS: true, logging: false },
                    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };

                await html2pdf().from(elemento).set(opciones).save();
            }

        } catch (error) {
            console.error("Error al procesar el voucher:", error.message);
            alert("Hubo un error al procesar el voucher: " + error.message);
        }
    };

    return (
        <div className="preview-container">
            
            {/* ================= PANEL DE ACCIONES (No se imprime) ================= */}
            <div className="acciones-voucher no-print" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <button 
                    onClick={handleGuardarYDescargarPDF} 
                    style={{ background: "#2a9d8f", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", fontSize: "16px", width: "100%" }}
                >
                    💾 Guardar y Descargar PDF
                </button>
            </div>

            <div className="a4 voucher-hotel" ref={ref}>

                {/* ================= HEADER ================= */}

                <div className="voucher-header">

                    <img
                        src={logo}
                        alt="Kansha Viajes"
                        className="logo-img"
                    />

                    <div>

                        <h1>HOTEL VOUCHER</h1>

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

                    ESTE VOUCHER ES VÁLIDO PARA LOS SERVICIOS INDICADOS A CONTINUACIÓN.

                </div>

                {/* ================= DATOS ================= */}

                <table className="voucher-table">

                    <tbody>

                        <tr>

                            <td className="titulo-columna">
                                Voucher Nº
                            </td>

                            <td>
                                {String(voucher.numero || 1).padStart(3, "0")}
                            </td>

                        </tr>

                        <tr>

                            <td className="titulo-columna">
                                Fecha de emisión
                            </td>

                            <td>
                                {voucher.fechaEmision}
                            </td>

                        </tr>

                        <tr>

                            <td className="titulo-columna">
                                Nombre del pasajero
                            </td>

                            <td>
                                {voucher.pasajero || "-"}
                            </td>

                        </tr>

                        <tr>

                            <td className="titulo-columna">
                                Cédula de Identidad
                            </td>

                            <td>
                                {voucher.cedula || "-"}
                            </td>

                        </tr>

                        <tr>

                            <td className="titulo-columna">
                                Hotel
                            </td>

                            <td>
                                {voucher.hotel || "-"}
                            </td>

                        </tr>

                        <tr>

                            <td className="titulo-columna">
                                Dirección del hotel
                            </td>

                            <td>
                                {voucher.direccionHotel || "-"}
                            </td>

                        </tr>

                        <tr>

                            <td className="titulo-columna">
                                Contacto del hotel
                            </td>

                            <td>
                                {voucher.contactoHotel || "-"}
                            </td>

                        </tr>

                        <tr>

                            <td className="titulo-columna">
                                Check In
                            </td>

                            <td>
                                {voucher.checkIn || "-"}
                            </td>

                        </tr>

                        <tr>

                            <td className="titulo-columna">
                                Check Out
                            </td>

                            <td>
                                {voucher.checkOut || "-"}
                            </td>

                        </tr>

                        <tr>

                            <td className="titulo-columna">
                                Noches
                            </td>

                            <td>
                                {calcularNoches()}
                            </td>

                        </tr>

                    </tbody>

                </table>

                {/* ================= INCLUYE ================= */}

                <div className="voucher-box">

                    <h3>INCLUYE</h3>

                    {
                        incluye.length > 0 ?

                            <ul>

                                {
                                    incluye.map((item, index) => (

                                        <li key={index}>
                                            ✓ {item}
                                        </li>

                                    ))
                                }

                            </ul>

                            :

                            <p>-</p>

                    }

                </div>

                {/* ================= OBSERVACIONES ================= */}

                <div className="voucher-box">

                    <h3>OBSERVACIONES</h3>

                    <p>

                        {voucher.observaciones || "Sin observaciones."}

                    </p>

                </div>

                {/* ================= FIRMA ================= */}

                <div className="firma">

                    <img
                        src={firma}
                        alt="Firma"
                        className="firma-img"
                    />

                    <div className="linea"></div>

                    <h4>Florencia Bonifacio</h4>

                    <p>Kansha Viajes</p>

                    <small>Registro Mintur Nº 796</small>

                </div>

                {/* ================= FOOTER ================= */}

                <div className="voucher-footer">

                    <strong>KANSHA VIAJES</strong>

                    <p>
                        📍 Uruguay
                    </p>

                    <p>
                        📞 +598 91846311
                    </p>

                    <p>
                        ✉️ info@kansha.com
                    </p>

                </div>

            </div>

        </div>

    );

});

export default VoucherHotelPreview;