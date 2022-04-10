import pdfMake from "pdfmake/build/pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts";
import moment from "moment";

const callpdf = (record) => {
    if (vfsFonts.pdfMake) {
      const { vfs } = vfsFonts.pdfMake;
      pdfMake.vfs = vfs;
    }
    
    const pdfFooter = (currentPage, pageCount) => ({
      margin: [30, 10],
      columns: [
        {
          text: `MedEra receptas`,
          fontSize: 10,
          alignment: "left"
        },
        {
          text: `${moment().format("YYYY--MM-DD")}`,
          fontSize: 10,
          alignment: "center"
        },
        {
          text: `${currentPage.toString() + "/" + pageCount}`,
          fontSize: 10,
          alignment: "right",
        }
      ]
    });

    const pdfSeparator = () => ({
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 0,
          x2: 535,
          y2: 0,
          lineWidth: 1,
          lineColor: "#D9D9D9"
        }
      ]
    });

    const documentConfig = {
      pageMargins: [30, 30, 30, 30]
    };
    const pdfStyles = {
      header: {
        fontSize: 24,
        margin: [0, 8, 0, 10],
        alignment: "center",
        bold: true,
      },
      date: {
        fontSize: 12,
        alignment: "center",
      },
      category: {
        fontSize: 18,
        alignment: "left",
        margin: [0, 45, 0, 8],
        marginLeft: 0,
        bold: true,
      },
      titleFirstRow: {
        bold: true,
        margin: [0, 14, 0, 0],
        fontSize: 14
      },
      textFirstRow: {
        margin: [0, 14, 0, 0],
        fontSize: 14
      },
      text: {
        margin: [0, 0, 0, 8],
        fontSize: 16
      }
    };

    var dd = {
      ...documentConfig,
      content: [
        {
          text: "Įšrašytas receptas",
          style: "header"
        },
        {
          text: `${record.date}`,
          style: "date"
        },
        { text: "Receptas", style: "category" },
        pdfSeparator(),
        {
          columns: [
            { 
              width: "30%", 
              text: `Vaistas`, 
              style: "titleFirstRow" },
            { 
              width: "auto", 
              text: `${record.medicine}`, 
              style: "textFirstRow" },
          ],
        },
        {
          columns: [
            { 
              width: "30%", 
              text: `Kiekis`, 
              style: "titleFirstRow" },
            { 
              width: "auto", 
              text: `${record.quantity}`, 
              style: "textFirstRow" },
          ],
        },
        {
          columns: [
            { 
              width: "30%", 
              text: `Vartojimas`, 
              style: "titleFirstRow" },
            { 
              width: "auto", 
              text: `${record.custom_usage}`, 
              style: "textFirstRow" }
          ],
        },
        { text: "Pacientas", style: "category" },
        pdfSeparator(),
        {
          columns: [
            { 
              width: "30%", 
              text: `Vardas`, 
              style: "titleFirstRow" },
            { 
              width: "auto", 
              text: `${record.patient_name}`, 
              style: "textFirstRow" }
          ]
        },
        {
          columns: [
            { 
              width: "30%", 
              text: `Pavardė`, 
              style: "titleFirstRow" },
            { 
              width: "auto", 
              text: `${record.patient_surname}`, 
              style: "textFirstRow" }
          ]
        },
        {
          columns: [
            { 
              width: "30%", 
              text: `Asmens kodas`, 
              style: "titleFirstRow" },
            { 
              width: "auto", 
              text: `${record.personal_code}`, 
              style: "textFirstRow" }
          ]
        },
        { text: "Gydytojas", style: "category" },
        pdfSeparator(),
        {
          columns: [
            { 
              width: "30%", 
              text: `Vardas`, 
              style: "titleFirstRow" },
            { 
              width: "auto", 
              text: `${record.doctor_name}`, 
              style: "textFirstRow" }
          ]
        },
        {
          columns: [
            { 
              width: "30%", 
              text: `Pavardė`, 
              style: "titleFirstRow" },
            { 
              width: "auto", 
              text: `${record.doctor_surname}`, 
              style: "textFirstRow" }
          ]
        },
      ],
      footer: pdfFooter,
      styles: pdfStyles
    };
    pdfMake.createPdf(dd).open();
  };

export default callpdf;
