import { forwardRef } from "react";

const logo = "/logo.png";
const firma = "/firmadigital.png";

const ReciboPreview = forwardRef(({ recibo }, ref) => {

    return (

        <div className="preview-container">

            <div className="a4" ref={ref}>

                {/* HEADER */}

                <div className="recibo-header">

                    <div className="empresa">

                        <h2>KANSHA VIAJES</h2>

                        <span>Recibo de Pago</span>

                    </div>

                    <div className="logo">

                        <img
                            src={logo}
                            alt="Logo Kansha"
                            className="logo-img"
                        />

                    </div>

                </div>

                <hr />

                {/* TITULO */}

                <div className="titulo">

                    <h1>RECIBO</h1>

                    <div className="numero">

                        Nº {recibo.numero || "REC-000001"}

                    </div>

                </div>

                {/* INFORMACIÓN */}

                <div className="info">

                    <div>

                        <strong>Fecha emisión</strong>

                        <p>{recibo.fechaEmision}</p>

                    </div>

                    <div>

                        <strong>Fecha salida</strong>

                        <p>{recibo.fechaSalida || "--/--/----"}</p>

                    </div>

                </div>

                <div className="info">

                    <div>

                        <strong>Pasajero</strong>

                        <p>{recibo.pasajero || "Nombre del pasajero"}</p>

                    </div>

                </div>

                <div className="info">

                    <div>

                        <strong>Destino</strong>

                        <p>{recibo.destino || "Destino del viaje"}</p>

                    </div>

                </div>

                {/* CUERPO */}

                <div className="detalle">

                    <p>
                        Recibimos de nuestro pasajero la suma de:
                    </p>

                    <h2>

                        {recibo.moneda} {recibo.montoEntregado || "0.00"}

                    </h2>

                    <p>
                        correspondiente al pago parcial del viaje.
                    </p>

                </div>

                {/* RESUMEN */}

                <div className="resumen">

                    <div>

                        <span>Precio por pasajero</span>

                        <strong>

                            {recibo.moneda} {recibo.precioPasajero || "0.00"}

                        </strong>

                    </div>

                    <div>

                        <span>Total viaje</span>

                        <strong>

                            {recibo.moneda} {recibo.precioTotal || "0.00"}

                        </strong>

                    </div>

                    <div>

                        <span>Saldo pendiente</span>

                        <strong>

                            {recibo.moneda} {recibo.saldo || "0.00"}

                        </strong>

                    </div>

                </div>

                {/* OBSERVACIONES */}

                <div className="observaciones">

                    <strong>Observaciones</strong>

                    <p>

                        {recibo.observaciones || "-"}

                    </p>

                </div>

                {/* FIRMA */}

                <div className="firma">

                    <img
                        src={firma}
                        alt="Firma Digital"
                        className="firma-img"
                    />

                    <div className="linea"></div>

                    <h4>Kansha Viajes</h4>

                    <p>Florencia Bonifacio</p>

                    <small>Registro Mintur Nº 796</small>

                </div>

            </div>

        </div>

    );

});

export default ReciboPreview;