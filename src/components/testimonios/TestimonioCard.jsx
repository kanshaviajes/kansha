import { supabase } from "../../supabase";
import Swal from "sweetalert2";

function TestimonioCard({ testimonio, onEliminar, esAdmin }) {


    const borrarTestimonio = async () => {

        const resultado = await Swal.fire({

            title: "¿Eliminar testimonio?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, borrar",
            cancelButtonText: "Cancelar"

        });


        if (resultado.isConfirmed) {


            const { error } = await supabase
                .from("testimonios")
                .delete()
                .eq("id", testimonio.id);



            if (error) {

                Swal.fire(
                    "Error",
                    error.message,
                    "error"
                );

                return;
            }


            Swal.fire(
                "Eliminado",
                "El testimonio fue eliminado",
                "success"
            );


            if (onEliminar) {

                onEliminar(testimonio.id);

            }

        }

    };



    return (

        <div className="testimonio-card">


            {testimonio.foto ? (

                <img
                    src={testimonio.foto}
                    alt={testimonio.nombre}
                    className="testimonio-img"
                />

            ) : (

                <div className="testimonio-avatar">

                    {testimonio.nombre.charAt(0).toUpperCase()}

                </div>

            )}



            <div className="testimonio-body">



                <div className="testimonio-stars">

                    {[1, 2, 3, 4, 5].map((star) => (

                        <i
                            key={star}
                            className={`bi ${
                                star <= testimonio.rating
                                    ? "bi-star-fill"
                                    : "bi-star"
                            }`}
                        ></i>

                    ))}

                </div>





                <p className="testimonio-comentario">

                    "{testimonio.comentario}"

                </p>





                <div className="testimonio-footer">


                    <div>

                        <h5 className="mb-0">

                            {testimonio.nombre}

                        </h5>


                        <small className="text-muted">

                            <i className="bi bi-geo-alt-fill"></i>{" "}
                            {testimonio.destino}

                        </small>


                    </div>




                    {esAdmin && (

                        <button
                            className="btn btn-danger btn-sm"
                            onClick={borrarTestimonio}
                        >

                            🗑️

                        </button>

                    )}



                </div>


            </div>


        </div>

    );

}


export default TestimonioCard;