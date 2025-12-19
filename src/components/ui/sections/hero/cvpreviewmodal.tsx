'use client';

import { Download, FileText, X } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CVPreviewModal({ isOpen, onClose, cvUrl, isDark }: {
  isOpen: boolean;
  onClose: () => void;
  cvUrl: string;
  isDark: boolean;
}) {
  const t = useTranslations("hero.cv.modal");

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-white'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'
          }`}>
          <div className="flex items-center gap-3">
            <FileText className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'
              }`}>
              {t('title')}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={cvUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${isDark
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
            >
              <Download size={16} />
              {t('download')}
            </a>

            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-all ${isDark
                ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-y-auto">
          <iframe
            src={`${cvUrl}#zoom=100`}
            className="w-full min-h-[1000px]"
            title={t('title')}
          />
        </div>
      </div>
    </div>
  );
};
