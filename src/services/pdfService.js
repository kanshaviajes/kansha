import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function generarPDF(elemento, numeroRecibo = "RECIBO") {

    const canvas = await html2canvas(elemento, {

        scale: 2,

        useCORS: true,

        backgroundColor: "#ffffff"

    });


    const imgData = canvas.toDataURL("image/png");


    const pdfWidth = 210; // ancho tipo A4

    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;


    const pdf = new jsPDF({

        orientation: "portrait",

        unit: "mm",

        format: [pdfWidth, pdfHeight]

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