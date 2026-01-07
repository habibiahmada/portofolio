import { pdfjs } from "react-pdf";

export function initPdfWorker() {
  if (typeof window === "undefined") return;

  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc =
      "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.3.93/build/pdf.worker.min.mjs";
  }
}
