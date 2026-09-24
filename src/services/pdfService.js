import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// ======================================================
// PDF EXISTENTE - RECIBOS / DOCUMENTOS
// ======================================================

export async function generarPDF(
  elemento,
  numeroRecibo = "RECIBO"
) {
  const canvas = await html2canvas(elemento, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");

  const pdfWidth = 210;

  const pdfHeight =
    (canvas.height * pdfWidth) /
    canvas.width;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [pdfWidth, pdfHeight],
  });

  pdf.addImage(
    imgData,
    "PNG",
    0,
    0,
    pdfWidth,
    pdfHeight
  );

  pdf.save(`${numeroRecibo}.pdf`);
}

// ======================================================
// HOJA DE VIAJE - A4
// ======================================================

export async function generarHojaViajePDF(
  elemento,
  nombre = "HOJA-VIAJE"
) {
  if (!elemento) {
    throw new Error(
      "No se encontró la hoja para generar el PDF."
    );
  }

  const canvas = await html2canvas(elemento, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",

    windowWidth: elemento.scrollWidth,
    windowHeight: elemento.scrollHeight,
  });

  const imgData =
    canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pdfWidth = 210;
  const pdfHeight = 297;

  const imgWidth = pdfWidth;

  const imgHeight =
    (canvas.height * imgWidth) /
    canvas.width;

  // Si entra en una página
  if (imgHeight <= pdfHeight) {
    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      imgWidth,
      imgHeight
    );
  } else {
    // Si el contenido supera A4,
    // generamos las páginas necesarias.

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position =
        heightLeft - imgHeight;

      pdf.addPage();

      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -= pdfHeight;
    }
  }

  const nombreSeguro = nombre
    .trim()
    .replace(/\s+/g, "-")
    .replace(
      /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]/g,
      ""
    );

  pdf.save(
    `${nombreSeguro || "HOJA-VIAJE"}.pdf`
  );
}