import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase";

import {
  guardarCache,
  leerCache
} from "../services/kanshaCache";

import fallback from "../data/kanshaFallback.json";

import "./PageDestino.css";


const TIMEOUT_MS = 7000;


/* =========================================================
   TIMEOUT DE SEGURIDAD
========================================================= */

function conTimeout(promesa, ms = TIMEOUT_MS) {

  return Promise.race([
    promesa,

    new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              "Supabase demoró demasiado en responder"
            )
          ),
        ms
      )
    ),
  ]);
}


/* =========================================================
   BUSCAR DESTINO EN FALLBACK ESTÁTICO
========================================================= */

function obtenerDestinoFallback(id) {

  return (fallback.destinos || []).find(
    (item) =>
      Number(item.id) === Number(id) &&
      item.activo === true
  );
}


/* =========================================================
   COMPONENTE
========================================================= */

function PageDestino() {

  const { id } = useParams();

  const [destino, setDestino] = useState(null);

  const [loading, setLoading] = useState(true);

  const [sinDatos, setSinDatos] = useState(false);


  useEffect(() => {

    async function fetchDestino() {

      const numericId = parseInt(id, 10);

      const cacheKey = `destino_${numericId}`;


      try {

        const resultado = await conTimeout(

          supabase
            .from("destinos")
            .select("*")
            .eq("id", numericId)
            .eq("activo", true)

        );


        const { data, error } = resultado;


        if (error) {
          throw error;
        }


        /* =================================================
           1. SUPABASE RESPONDIÓ CON DATOS
        ================================================= */

        if (data && data.length > 0) {

          const destinoEncontrado =
            data[0];


          /*
            Guardamos la última versión válida
            recibida desde Supabase.
          */

          guardarCache(
            cacheKey,
            destinoEncontrado
          );


          setDestino(
            destinoEncontrado
          );


          setSinDatos(false);


          return;
        }


        /* =================================================
           2. SUPABASE RESPONDIÓ VACÍO
           BUSCAMOS CACHÉ LOCAL
        ================================================= */

        const cache =
          leerCache(cacheKey);


        if (cache) {

          console.info(
            `Supabase respondió vacío. Usando caché del destino ${numericId}`
          );


          setDestino(cache);

          setSinDatos(false);


          return;
        }


        /* =================================================
           3. FALLBACK ESTÁTICO
        ================================================= */

        const destinoFallback =
          obtenerDestinoFallback(
            numericId
          );


        if (destinoFallback) {

          console.info(
            `Usando fallback estático del destino ${numericId}`
          );


          setDestino(
            destinoFallback
          );


          setSinDatos(false);


          return;
        }


        /* =================================================
           NO EXISTE NINGÚN RESPALDO
        ================================================= */

        setSinDatos(true);


      } catch (error) {

        console.warn(
          "Supabase no disponible. Intentando recuperar destino.",
          error
        );


        /* =================================================
           1ª DEFENSA:
           LOCALSTORAGE
        ================================================= */

        const cache =
          leerCache(cacheKey);


        if (cache) {

          console.info(
            `Usando caché local del destino ${numericId}`
          );


          setDestino(cache);

          setSinDatos(false);


          return;
        }


        /* =================================================
           2ª DEFENSA:
           JSON ESTÁTICO
        ================================================= */

        const destinoFallback =
          obtenerDestinoFallback(
            numericId
          );


        if (destinoFallback) {

          console.info(
            `Usando fallback estático del destino ${numericId}`
          );


          setDestino(
            destinoFallback
          );


          setSinDatos(false);


          return;
        }


        /* =================================================
           NO HAY NADA DISPONIBLE
        ================================================= */

        console.warn(
          `No existe caché ni fallback para el destino ${numericId}`
        );


        setSinDatos(true);


      } finally {

        setLoading(false);

      }

    }


    fetchDestino();

  }, [id]);


/* =========================================================
   ESTADO DE CARGA
========================================================= */

  if (loading) {

    return (

      <div className="text-center py-5">

        Cargando detalles...

      </div>

    );

  }


/* =========================================================
   SIN DATOS
========================================================= */

  if (sinDatos || !destino) {

    return (

      <div className="container py-5 text-center">

        <h3>
          No pudimos cargar este destino
        </h3>

        <p className="text-muted">
          Intentá nuevamente en unos minutos.
        </p>

      </div>

    );

  }


/* =========================================================
   DATOS DEL DESTINO
========================================================= */

  const simboloMoneda =
    destino.moneda === "UYU"
      ? "UYU $"
      : "$";


  const mensajeWpp =
    `Hola! Quiero información sobre el viaje a ${destino.nombre} de ${destino.noches} noches.`;


  const whatsappLink =
    `https://wa.me/59891846311?text=${encodeURIComponent(
      mensajeWpp
    )}`;


/* =========================================================
   RENDER
========================================================= */

  return (

    <div className="page-destino">


      <div
        className="hero-destino"
        style={{
          backgroundImage:
            `url(${destino.imagen_url})`
        }}
      >

        <div className="container">

          <h1 className="display-2 fw-bold text-white">

            {destino.nombre}

          </h1>

        </div>

      </div>


      <div className="container py-5">

        <div className="row">


          <div className="col-lg-8">

            <h2 className="mb-3">
              Sobre este destino
            </h2>

            <p className="lead">
              {destino.descripcion}
            </p>

          </div>


          <div className="col-lg-4">

            <div className="card p-4 shadow-lg border-0 rounded-4">

              <h4 className="text-muted">
                Precio desde:
              </h4>


              <h2 className="display-5 text-primary mb-2">

                {simboloMoneda}{" "}
                {destino.precio}

                <small className="text-muted fs-6">

                  {" "}
                  {destino.moneda}

                </small>

              </h2>


              <p className="text-muted fw-bold mb-4">

                <i className="bi bi-moon-stars"></i>

                {" "}

                {destino.noches} Noches de estadía

              </p>


              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success btn-lg w-100"
              >

                <i className="bi bi-whatsapp me-2"></i>

                Consultar por WhatsApp

              </a>

            </div>

          </div>


        </div>

      </div>

    </div>

  );

}


export default PageDestino;