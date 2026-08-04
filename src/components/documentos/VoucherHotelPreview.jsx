import { forwardRef } from "react";

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

    return (

        <div className="preview-container">

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
                                Hotel
                            </td>

                            <td>
                                {voucher.hotel || "-"}
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

                        📍 Rocha - Uruguay

                    </p>

                    <p>

                        📞 +598 xxx xxx xxx

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