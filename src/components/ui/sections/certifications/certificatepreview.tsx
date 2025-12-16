"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "../../button";

if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
  ).toString();
}

interface CertificatePreviewProps {
  file: string;
  className?: string;
  initialPage?: number;
  onLoadingChange?: (loading: boolean) => void;
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  file,
  className = "",
  initialPage = 1,
  onLoadingChange,
}) => {
  const t = useTranslations("certifications");

  const containerRef = useRef<HTMLDivElement>(null);

  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageWidth, setPageWidth] = useState(300);

  const [pdfLoading, setPdfLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const MAX_PDF_WIDTH = 420;

  /* ---------- fetch PDF ONCE ---------- */
  useEffect(() => {
    let active = true;

    setPdfLoading(true);
    onLoadingChange?.(true);

    fetch(file)
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        if (!active) return;
        setPdfData(buffer);
        setPdfLoading(false);
        onLoadingChange?.(false);
      });

    return () => {
      active = false;
    };
  }, [file, onLoadingChange]);

  /* ---------- responsive width ---------- */
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(entries => {
      const containerWidth = entries[0].contentRect.width;
      setPageWidth(Math.min(containerWidth, MAX_PDF_WIDTH));
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const goPrev = () =>
    setCurrentPage((p) => (p > 1 ? p - 1 : p));
  const goNext = () =>
    setCurrentPage((p) => (p < numPages ? p + 1 : p));

  return (
    <div
      className={`w-full max-w-3xl h-[40vh] flex flex-col ${className}`}
    >
      {/* PDF AREA */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-auto flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-lg"
      >
        {(pdfLoading || pageLoading) && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-black/40">
            <span className="text-sm text-slate-500">
              Loading preview…
            </span>
          </div>
        )}

        {pdfData && (
          <Document
            file={pdfData}
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
              setCurrentPage(initialPage);
            }}
            loading={null}
          >
            <Page
              pageNumber={currentPage}
              width={pageWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              onLoadSuccess={() => setPageLoading(false)}
              onLoadStart={() => setPageLoading(true)}
            />
          </Document>
        )}
      </div>

      {/* PAGINATION */}
      {numPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <Button
            onClick={goPrev}
            disabled={currentPage === 1}
            className="p-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <span className="text-sm text-slate-600 dark:text-slate-300">
            {t("page1")} {currentPage} {t("page2")} {numPages}
          </span>

          <Button
            onClick={goNext}
            disabled={currentPage === numPages}
            className="p-2"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CertificatePreview;