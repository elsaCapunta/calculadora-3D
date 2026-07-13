import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

export function usePdfDownload(previewRef, filename) {
  const [descargando, setDescargando] = useState(false);
  const [errorPdf, setErrorPdf] = useState("");

  const handleDownloadPdf = async () => {
    if (!previewRef.current || descargando) return;
    setDescargando(true);
    setErrorPdf("");
    try {
      const canvas = await html2canvas(previewRef.current, { scale: 2, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidthMm = pageWidth;
      const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;

      let heightLeft = imgHeightMm;
      let position = 0;
      pdf.addImage(imgData, "JPEG", 0, position, imgWidthMm, imgHeightMm);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeightMm;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidthMm, imgHeightMm);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
    } catch {
      setErrorPdf("No se pudo generar el PDF. Intenta de nuevo.");
    } finally {
      setDescargando(false);
    }
  };

  return { descargando, errorPdf, handleDownloadPdf };
}
