import { useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "../../supabase";
import RatingStars from "./RatingStars";

function TestimonioForm({ onNuevoTestimonio }) {

    const [nombre, setNombre] = useState("");
    const [destino, setDestino] = useState("");
    const [comentario, setComentario] = useState("");
    const [rating, setRating] = useState(5);
    const [foto, setFoto] = useState(null);
    const [guardando, setGuardando] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (guardando) return;

        setGuardando(true);


        let fotoUrl = null;


        // Subir imagen si seleccionó una
        if (foto) {

            const nombreArchivo = `${Date.now()}-${foto.name}`;


            const { error: uploadError } = await supabase.storage
                .from("testimonios")
                .upload(nombreArchivo, foto);


            if (uploadError) {

                console.error(uploadError);

                setGuardando(false);

                Swal.fire({
                    icon: "error",
                    title: "Error al subir la foto",
                    text: uploadError.message,
                    confirmButtonColor: "#dc3545"
                });

                return;
            }


            const { data } = supabase.storage
                .from("testimonios")
                .getPublicUrl(nombreArchivo);


            fotoUrl = data.publicUrl;
        }



        const { error } = await supabase
            .from("testimonios")
            .insert([
                {
                    nombre,
                    destino,
                    comentario,
                    rating,
                    foto: fotoUrl
                }
            ]);



        setGuardando(false);



        if (error) {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "No se pudo guardar",
                text: error.message,
                confirmButtonColor: "#dc3545"
            });

            return;
        }



        Swal.fire({
            icon: "success",
            title: "¡Gracias por compartir tu experiencia!",
            text: "Tu testimonio fue publicado correctamente.",
            confirmButtonColor: "#198754"
        });



        // Limpiar formulario

        setNombre("");
        setDestino("");
        setComentario("");
        setRating(5);
        setFoto(null);



        // Recargar lista

        if (onNuevoTestimonio) {
            onNuevoTestimonio();
        }

    };



    return (

        <div className="testimonio-form">


            <h2 className="text-center mb-3">
                Compartí tu experiencia
            </h2>


            <p className="text-center text-muted mb-4">
                Tu opinión ayuda a otros viajeros a elegir su próximo destino.
            </p>



            <RatingStars
                rating={rating}
                setRating={setRating}
            />



            <form onSubmit={handleSubmit}>


                <div className="mb-3">

                    <label className="form-label">
                        Nombre
                    </label>


                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tu nombre"
                        maxLength={60}
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />

                </div>



                <div className="mb-3">

                    <label className="form-label">
                        Tu foto (opcional)
                    </label>


                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setFoto(e.target.files[0])}
                    />

                </div>




                <div className="mb-3">

                    <label className="form-label">
                        Destino
                    </label>


                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ej: Río de Janeiro"
                        maxLength={80}
                        value={destino}
                        onChange={(e) => setDestino(e.target.value)}
                        required
                    />

                </div>




                <div className="mb-2">

                    <label className="form-label">
                        Comentario
                    </label>


                    <textarea
                        className="form-control"
                        rows="5"
                        maxLength={800}
                        placeholder="Contanos cómo fue tu viaje..."
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        required
                    />

                </div>




                <div className="text-end mb-4">

                    <small className="text-muted">
                        {comentario.length} / 800 caracteres
                    </small>

                </div>




                <div className="text-center">

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={guardando}
                    >

                        {guardando
                            ? "Guardando..."
                            : "Compartir experiencia"}

                    </button>

                </div>


            </form>


        </div>

    );

}


export default TestimonioForm;