'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import CertificatePreview from './certificatepreview';
import { Certificate } from '@/lib/types/database';

interface Props {
  open: boolean;
  certificate: Certificate | null;
  onClose: () => void;
}

export default function CertificateModal({
  open,
  certificate,
  onClose,
}: Props) {
  const t = useTranslations('certifications');

  if (!open || !certificate) return null;

  const translation = certificate.certification_translations?.[0];

  const skills =
    translation?.skills ??
    certificate.skills ??
    [];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-xl bg-white p-6 dark:bg-slate-900"
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {translation?.title}
            </h2>
            <p className="text-sm text-slate-500">
              {certificate.issuer} • {certificate.year}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-md p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* PDF Preview */}
        <CertificatePreview
          active
          fileUrl={certificate.preview ?? ''}
        />

        {/* Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Description */}
          <div>
            <h4 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t('certificate1')}
            </h4>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              {translation?.description}
            </p>
          </div>

          {/* Skills */}
          <div>
            <h4 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t('certificate2')}
            </h4>

            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium
                      text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                {t('noSkills')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}