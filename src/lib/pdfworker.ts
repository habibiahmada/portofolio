import { pdfjs } from "react-pdf";

export function initPdfWorker() {
  if (typeof window === "undefined") return;

  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc =
      "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs";
  }
  
  // Suppress PDF.js internal warnings
  const originalConsoleWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    const message = String(args[0]);
    // Filter out PDF.js TrueType font warnings
    if (message.includes('TT: undefined function')) {
      return;
    }
    originalConsoleWarn.apply(console, args);
  };
}
