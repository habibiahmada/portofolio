"use client";

import { Document, Page } from "react-pdf";
import { useEffect } from "react";
import { initPdfWorker } from "@/lib/pdfworker";

interface Props {
  file: string;
}

export default function PdfThumbnailClient({ file }: Props) {
  useEffect(() => {
    initPdfWorker();
  }, []);

  if (!file) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        No Preview
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Document file={file} loading={null}>
        <Page
          pageNumber={1}
          width={280}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    </div>
  );
}