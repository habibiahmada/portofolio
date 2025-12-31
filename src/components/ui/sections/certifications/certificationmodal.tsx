import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";

const CertificatePreview = dynamic(
  () => import("./certificatepreview"),
  { ssr: false }
);

import { Certificate } from "@/lib/types/database";

const CertificateModal: React.FC<{ certificate: Certificate | null; index: number | null; onClose: () => void }> = ({
  certificate,
  index,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("certifications");
  const [previewLoading, setPreviewLoading] = useState(true);

  // Close with ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!certificate) return null;

  const skills =
    certificate.certification_translations?.[0]?.skills ??
    certificate.skills ??
    [];

  const isBlue = typeof index === "number" ? index % 2 === 0 : false;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        // Close if clicking backdrop only
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-slate-950 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {certificate.certification_translations?.[0]?.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {certificate.issuer} • {certificate.year}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6">
            <div className="relative">
              {previewLoading && (
                <div className="flex items-center justify-center">
                  <Skeleton className="w-[500px] h-[350px] rounded-md" />
                </div>
              )}
              <div className={previewLoading ? "invisible" : "visible"}>
                <CertificatePreview
                  fileUrl={certificate.preview || ""}
                  className="mx-auto"
                  active={true}
                  onClose={onClose}
                  onLoadingChange={setPreviewLoading}
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                {t("certificate1")}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {certificate.certification_translations?.[0]?.description}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                {t("certificate2")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 2).map((skill, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${isBlue
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;