"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";

if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
  ).toString();
}

interface CertificateThumbnailProps {
  file: string;
}

const CertificateThumbnail: React.FC<CertificateThumbnailProps> = ({ file }) => {
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [docReady, setDocReady] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch(file, { signal: controller.signal })
      .then(res => res.arrayBuffer())
      .then(setPdfData)
      .catch(() => { });

    return () => controller.abort();
  }, [file]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 overflow-hidden">
      {pdfData && (
        <Document
          file={pdfData}
          loading={null}
          onLoadSuccess={() => setDocReady(true)}
          onLoadError={() => setDocReady(false)}
        >
          {docReady && (
            <Page
              pageNumber={1}
              width={240}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          )}
        </Document>
      )}
    </div>
  );
};

export default CertificateThumbnail;
