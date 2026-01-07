"use client";

import { Document, Page } from "react-pdf";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { initPdfWorker } from "@/lib/pdfworker";

interface Props {
  fileUrl: string;
}

export default function PdfPreviewClient({ fileUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState(400);
  const [numPages, setNumPages] = useState(1);
  const [page, setPage] = useState(1);

  useEffect(() => {
    initPdfWorker();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const ro = new ResizeObserver(([entry]) => {
      setPageWidth(entry.contentRect.width);
    });

    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col items-center">
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        <Page
          pageNumber={page}
          width={pageWidth}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>

      {numPages > 1 && (
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="disabled:opacity-40"
          >
            <ChevronLeft />
          </button>

          <span className="text-sm">
            {page} / {numPages}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === numPages}
            className="disabled:opacity-40"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
