import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/* =========================================================
   RUTAS
========================================================= */

const ROOT = path.resolve(__dirname, "..");

const FALLBACK_JSON = path.join(
  ROOT,
  "src",
  "data",
  "kanshaFallback.json"
);

const BACKUP_JSON = path.join(
  ROOT,
  "src",
  "data",
  "kanshaFallback.supabase-backup.json"
);

const PUBLIC_FOLDER = path.join(
  ROOT,
  "public",
  "kansha-fallback"
);


/* =========================================================
   OBTENER EXTENSIÓN
========================================================= */

function obtenerExtension(url) {

  try {

    const pathname = new URL(url).pathname;

    const extension =
      path.extname(pathname).toLowerCase();


    if (
      extension &&
      extension.length <= 6
    ) {
      return extension;
    }

  } catch {
    // ignoramos y usamos jpg
  }


  return ".jpg";
}


/* =========================================================
   CREAR NOMBRE ÚNICO
========================================================= */

function crearNombreArchivo(url) {

  const hash = crypto
    .createHash("md5")
    .update(url)
    .digest("hex")
    .slice(0, 16);


  const extension =
    obtenerExtension(url);


  return `${hash}${extension}`;
}


/* =========================================================
   DESCARGAR IMAGEN
========================================================= */

async function descargarImagen(
  url,
  destino
) {

  const response = await fetch(url);


  if (!response.ok) {

    throw new Error(
      `HTTP ${response.status}`
    );
  }


  const buffer =
    Buffer.from(
      await response.arrayBuffer()
    );


  await fs.writeFile(
    destino,
    buffer
  );
}


/* =========================================================
   PROCESAR URL
========================================================= */

async function procesarUrl(
  url,
  mapaUrls
) {

  if (
    !url ||
    typeof url !== "string"
  ) {
    return url;
  }


  /*
    Si ya es una ruta local,
    no hacemos nada.
  */

  if (
    url.startsWith("/kansha-fallback/")
  ) {
    return url;
  }


  /*
    Solo procesamos imágenes http/https.
  */

  if (
    !url.startsWith("http://") &&
    !url.startsWith("https://")
  ) {
    return url;
  }


  /*
    Si esta URL ya fue descargada,
    reutilizamos el mismo archivo.
  */

  if (mapaUrls.has(url)) {

    return mapaUrls.get(url);
  }


  const nombreArchivo =
    crearNombreArchivo(url);


  const destinoLocal =
    path.join(
      PUBLIC_FOLDER,
      nombreArchivo
    );


  const rutaPublica =
    `/kansha-fallback/${nombreArchivo}`;


  try {

    await descargarImagen(
      url,
      destinoLocal
    );


    mapaUrls.set(
      url,
      rutaPublica
    );


    console.log(
      `✅ ${nombreArchivo}`
    );


    return rutaPublica;

  } catch (error) {

    console.error(
      `❌ No se pudo descargar: ${url}`
    );

    console.error(
      `   ${error.message}`
    );


    /*
      Si una imagen falla,
      dejamos la URL original.

      Así el proceso no se rompe entero.
    */

    return url;
  }
}


/* =========================================================
   EJECUTAR
========================================================= */

async function main() {

  console.log("");
  console.log(
    "🛡️ Creando respaldo local de imágenes de Kansha..."
  );
  console.log("");


  /* -------------------------------------------------------
     Crear carpeta pública
  ------------------------------------------------------- */

  await fs.mkdir(
    PUBLIC_FOLDER,
    {
      recursive: true
    }
  );


  /* -------------------------------------------------------
     Leer JSON
  ------------------------------------------------------- */

  const contenido =
    await fs.readFile(
      FALLBACK_JSON,
      "utf8"
    );


  const fallback =
    JSON.parse(contenido);


  /* -------------------------------------------------------
     Crear backup del JSON original
  ------------------------------------------------------- */

  try {

    await fs.access(
      BACKUP_JSON
    );

    console.log(
      "ℹ️ Ya existe backup del JSON original."
    );

  } catch {

    await fs.copyFile(
      FALLBACK_JSON,
      BACKUP_JSON
    );

    console.log(
      "✅ Backup original creado."
    );

  }


  const mapaUrls =
    new Map();


  let procesadas = 0;


  /* =======================================================
     DESTINOS
  ======================================================= */

  if (
    Array.isArray(fallback.destinos)
  ) {

    for (
      const destino
      of fallback.destinos
    ) {

      if (
        destino.imagen_url
      ) {

        destino.imagen_url =
          await procesarUrl(
            destino.imagen_url,
            mapaUrls
          );


        procesadas++;
      }

    }

  }


  /* =======================================================
     IMÁGENES WEB
  ======================================================= */

  if (
    Array.isArray(
      fallback.imagenes_web
    )
  ) {

    for (
      const imagen
      of fallback.imagenes_web
    ) {

      if (
        imagen.imagen_url
      ) {

        imagen.imagen_url =
          await procesarUrl(
            imagen.imagen_url,
            mapaUrls
          );


        procesadas++;
      }

    }

  }


  /* =======================================================
     GUARDAR JSON ACTUALIZADO
  ======================================================= */

  await fs.writeFile(
    FALLBACK_JSON,
    JSON.stringify(
      fallback,
      null,
      2
    ),
    "utf8"
  );


  console.log("");
  console.log(
    "========================================"
  );

  console.log(
    "✅ RESPALDO TERMINADO"
  );

  console.log(
    `📷 Referencias procesadas: ${procesadas}`
  );

  console.log(
    `📁 Imágenes únicas: ${mapaUrls.size}`
  );

  console.log(
    "📍 Carpeta: public/kansha-fallback"
  );

  console.log(
    "📄 JSON actualizado: src/data/kanshaFallback.json"
  );

  console.log(
    "💾 Backup: src/data/kanshaFallback.supabase-backup.json"
  );

  console.log(
    "========================================"
  );

  console.log("");

}


/* =========================================================
   INICIO
========================================================= */

main().catch(
  (error) => {

    console.error("");
    console.error(
      "❌ Error general:"
    );

    console.error(error);

    process.exit(1);

  }
);