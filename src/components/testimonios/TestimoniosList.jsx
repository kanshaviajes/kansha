import TestimonioCard from "./TestimonioCard";

function TestimoniosList({ testimonios, loading }) {

    if (loading) {
        return (
            <div className="text-center py-5">

                <div
                    className="spinner-border text-primary"
                    role="status"
                ></div>

                <p className="mt-3">
                    Cargando testimonios...
                </p>

            </div>
        );
    }

    if (testimonios.length === 0) {
        return (
            <div className="text-center py-5">

                <h4>Aún no hay testimonios</h4>

                <p className="text-muted">
                    ¡Sé el primero en compartir tu experiencia!
                </p>

            </div>
        );
    }

    return (

        <div className="row g-4">

            {testimonios.map((testimonio) => (

                <div
                    className="col-lg-4 col-md-6"
                    key={testimonio.id}
                >

                    <TestimonioCard
                        testimonio={testimonio}
                    />

                </div>

            ))}

        </div>

    );

}

export default TestimoniosList;