'use client';

import dynamic from 'next/dynamic';
import { ExternalLink } from 'lucide-react';
import { Certificate } from '@/lib/types/database';

const CertificateThumbnail = dynamic(
  () => import('./certificatethumbnail'),
  { ssr: false },
);

interface Props {
  certificate: Certificate;
  index: number;
  onClick: () => void;
}

export default function CertificationCard({
  certificate,
  index,
  onClick,
}: Props) {
  const isBlue = index % 2 === 0;
  const translation = certificate.certification_translations?.[0];

  const skills = translation?.skills ?? certificate.skills ?? [];

  return (
    <div className="group rounded-2xl border bg-white shadow transition hover:shadow-xl dark:border-slate-700 dark:bg-slate-950">
      <div
        onClick={onClick}
        className="relative h-48 cursor-pointer overflow-hidden"
      >
        <CertificateThumbnail file={certificate.preview ?? ''} />

        <div className="absolute inset-0 flex items-center justify-center bg-blue-600/20 opacity-0 transition group-hover:opacity-100">
          <ExternalLink className="h-5 w-5 text-blue-600" />
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {certificate.certification_translations?.[0]?.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              {certificate.issuer} • {certificate.year}
            </p>
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
          {certificate.certification_translations?.[0]?.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {skills.slice(0, 2).map((skill, idx) => (
            <span
              key={idx}
              className={`px-2 py-1 rounded-md text-xs font-medium ${isBlue
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
            >
              {skill}
            </span>
          ))}
          {skills.length > 2 && (
            <span className="px-2 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              +{skills.length - 2} more
            </span>
          )}
        </div>

        <button
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer"
          onClick={onClick}
          aria-label="View certificate"
        >
          <ExternalLink className="w-4 h-4" />
          <span className="font-medium text-sm">Lihat Sertifikat</span>
        </button>
      </div>
    </div>
  );
}
