"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";
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
  width?: number;
  className?: string;
  showAllPages?: boolean;
  initialPage?: number;
  persistPage?: boolean;
  onLoadingChange?: (loading: boolean) => void;
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  file,
  width = 300,
  className = "",
  showAllPages = false,
  initialPage = 1,
  persistPage = true,
  onLoadingChange,
}) => {
  const [mounted, setMounted] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const t = useTranslations("certifications")

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => setMounted(true), []);

      useEffect(() => {
    if (!persistPage) setCurrentPage(initialPage);
  }, [initialPage, persistPage]);

  useEffect(() => {
    // when file changes, assume loading again
    setIsLoading(true);
    onLoadingChange?.(true);
  }, [file]);

  if (!mounted) return null;

  const goToPrevPage = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const goToNextPage = () =>
    setCurrentPage((prev) => (numPages && prev < numPages ? prev + 1 : prev));

  return (
    <div className={`flex flex-col items-center justify-center gap-4`}>
      <Document
        file={file}
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages)
          setIsLoading(false)
          onLoadingChange?.(false)
        }}
        loading={<div className="text-slate-400">Loading preview...</div>}
        className={className}
      >
        <Page
          pageNumber={showAllPages ? currentPage : initialPage}
          width={width}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>

      {showAllPages && numPages && numPages > 1 && (
        <div className="flex items-center gap-4 mt-2">
          <Button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer text-slate-600 dark:text-slate-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <span className="text-sm text-slate-600 dark:text-slate-300">
            {t("page1")} {currentPage} {t("page2")} {numPages}
          </span>

          <Button
            onClick={goToNextPage}
            disabled={currentPage === numPages}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer text-slate-600 dark:text-slate-300"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CertificatePreview;