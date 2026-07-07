import { useEffect, useState } from "react";
import { supabase } from "../supabase";

import TestimonioForm from "../components/testimonios/TestimonioForm";
import TestimoniosList from "../components/testimonios/TestimoniosList";
import "../components/testimonios/Testimonios.css";

function Testimonios() {

    const [testimonios, setTestimonios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [esAdmin, setEsAdmin] = useState(false);



    useEffect(() => {

        cargarTestimonios();

    }, []);



    useEffect(() => {

        verificarAdmin();

    }, []);




    async function verificarAdmin() {

        const { data } = await supabase.auth.getSession();


        if (data.session) {

            setEsAdmin(true);

        } else {

            setEsAdmin(false);

        }

    }





    async function cargarTestimonios() {

        setLoading(true);


        const { data, error } = await supabase
            .from("testimonios")
            .select("*")
            .order("created_at", { ascending: false });



        if (error) {

            console.error("Error al cargar testimonios:", error);

        } else {

            setTestimonios(data || []);

        }


        setLoading(false);

    }





    return (

        <div className="testimonios-page">



            {/* Hero */}

            <section className="testimonios-hero">

                <div className="container">


                    <div className="hero-content">


                        <h1>
                            Compartí tu experiencia ✈️
                        </h1>



                        <p>

                            Cada viaje deja una historia.
                            Contanos cómo fue tu experiencia y ayudá a otros viajeros
                            a elegir su próxima aventura.

                        </p>


                    </div>


                </div>


            </section>






            {/* Formulario */}

            <section className="testimonios-form-section">


                <div className="container">


                    <TestimonioForm
                        onNuevoTestimonio={cargarTestimonios}
                    />


                </div>


            </section>







            {/* Listado */}

            <section className="testimonios-list-section">


                <div className="container">



                    <h2 className="text-center mb-5">

                        Lo que dicen nuestros viajeros

                    </h2>





                    <TestimoniosList

                        testimonios={testimonios}

                        loading={loading}

                        esAdmin={esAdmin}

                    />



                </div>



            </section>



        </div>

    );

}


export default Testimonios;