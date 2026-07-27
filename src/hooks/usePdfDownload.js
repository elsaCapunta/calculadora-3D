import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { PDF_FOOTER_LINES } from "../domain/pdfFooterText";

const PX_TO_PT = 0.75; // 1px = 0.75pt a 96dpi
const PT_TO_MM = 0.3528;
const FOOTER_LINE_HEIGHT_FACTOR = 1.5;
const FOOTER_BLOCK_GAP_MM = 2.5;
const PAGE_BOTTOM_MARGIN_MM = 14;

const hexToRgb = (hex) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export function usePdfDownload(previewRef, filename) {
  const [descargando, setDescargando] = useState(false);
  const [errorPdf, setErrorPdf] = useState("");

  const handleDownloadPdf = async () => {
    if (!previewRef.current || descargando) return;
    setDescargando(true);
    setErrorPdf("");
    try {
      await document.fonts.ready;

      const node = previewRef.current;
      const nodeStyle = getComputedStyle(node);
      const paddingLeftPx = parseFloat(nodeStyle.paddingLeft) || 0;
      const paddingRightPx = parseFloat(nodeStyle.paddingRight) || 0;
      const nodeWidthPx = node.getBoundingClientRect().width;

      const canvas = await html2canvas(node, { scale: 2, backgroundColor: "#ffffff" });
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

      // Footer nativo (no rasterizado): se dibuja como texto vectorial de jsPDF,
      // anclado al pie real de la última página, independiente de cuánto contenido tenga la cotización.
      const mmPerCssPx = imgWidthMm / nodeWidthPx;
      const marginLeftMm = paddingLeftPx * mmPerCssPx;
      const marginRightMm = paddingRightPx * mmPerCssPx;
      const textMaxWidthMm = imgWidthMm - marginLeftMm - marginRightMm;

      const footerBlocks = PDF_FOOTER_LINES.map((line) => {
        const fontSizePt = line.fontSizePx * PX_TO_PT;
        pdf.setFontSize(fontSizePt);
        const wrapped = pdf.splitTextToSize(line.text, textMaxWidthMm);
        const lineHeightMm = fontSizePt * PT_TO_MM * FOOTER_LINE_HEIGHT_FACTOR;
        return { ...line, fontSizePt, wrapped, lineHeightMm, blockHeightMm: wrapped.length * lineHeightMm };
      });
      const footerHeightMm =
        footerBlocks.reduce((sum, b) => sum + b.blockHeightMm, 0) +
        FOOTER_BLOCK_GAP_MM * (footerBlocks.length - 1);

      const lastPageIndex = pdf.internal.getNumberOfPages() - 1;
      const contentOnLastPageMm = imgHeightMm - pageHeight * lastPageIndex;
      const footerTopY = pageHeight - PAGE_BOTTOM_MARGIN_MM - footerHeightMm;

      if (contentOnLastPageMm > footerTopY) {
        pdf.addPage();
      }

      let cursorY = pageHeight - PAGE_BOTTOM_MARGIN_MM - footerHeightMm;
      footerBlocks.forEach((b) => {
        pdf.setFontSize(b.fontSizePt);
        pdf.setTextColor(...hexToRgb(b.color));
        b.wrapped.forEach((line) => {
          pdf.text(line, marginLeftMm, cursorY);
          cursorY += b.lineHeightMm;
        });
        cursorY += FOOTER_BLOCK_GAP_MM;
      });

      pdf.save(filename);
    } catch {
      setErrorPdf("No se pudo generar el PDF. Intenta de nuevo.");
    } finally {
      setDescargando(false);
    }
  };

  return { descargando, errorPdf, handleDownloadPdf };
}
