import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import TestimonioCard from "./TestimonioCard";
import { Link } from "react-router-dom";


function UltimosTestimonios() {

    const [testimonios, setTestimonios] = useState([]);
    const [loading, setLoading] = useState(true);



    useEffect(() => {

        cargarUltimos();

    }, []);



    async function cargarUltimos() {


        const { data, error } = await supabase
            .from("testimonios")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(3);



        if (error) {

            console.log(error);

        } else {

            setTestimonios(data || []);

        }


        setLoading(false);

    }





    if (loading) {

        return null;

    }



    return (

        <section className="ultimos-testimonios py-5">


            <div className="container">


                <h2 className="text-center mb-5">

                    Lo que dicen nuestros viajeros ✈️

                </h2>




                <div className="row">


                    {testimonios.map((testimonio) => (

                        <div 
                            className="col-md-4 mb-4"
                            key={testimonio.id}
                        >

                            <TestimonioCard 
                                testimonio={testimonio}
                            />

                        </div>

                    ))}


                </div>





                <div className="text-center mt-4">


                    <Link 
                        to="/testimonios"
                        className="btn btn-primary"
                    >

                        Ver más testimonios

                    </Link>


                </div>



            </div>


        </section>

    );

}


export default UltimosTestimonios;