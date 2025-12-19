'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import SectionHeader from "../SectionHeader";
import dynamic from 'next/dynamic';
import CertificateModal from './certificationmodal';
import useCertificates from '@/hooks/api/public/useCertificates';
import { Skeleton } from '@/components/ui/skeleton';
import { Certificate } from '@/lib/types/database';

const CertificationCard = dynamic(
  () => import("@/components/ui/sections/certifications/certificationcard"),
  { ssr: false }
);


const CertificationsSection: React.FC = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const t = useTranslations("certifications");
  const { resolvedTheme } = useTheme();
  const { certificates, loading, error } = useCertificates();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <>
      <section
        className={`relative overflow-hidden py-28 sm:py-36 lg:py-40 pb-0 transition-colors duration-300 
          ${isDark ? "dark:bg-slate-950" : "bg-slate-50"}`}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-16">
            <SectionHeader
              title={t("titleLine1")}
              description={t("description1")}
              align="center"
            />
          </div>

          {/* Loading & Error State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="group relative bg-white dark:bg-slate-950 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                  {/* Preview skeleton */}
                  <div className="h-48 w-full">
                    <Skeleton className="h-full w-full rounded-none" />
                  </div>

                  {/* Content skeleton */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>

                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>

                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20 rounded-md" />
                      <Skeleton className="h-6 w-16 rounded-md" />
                      <Skeleton className="h-6 w-14 rounded-md" />
                    </div>

                    <Skeleton className="h-9 w-full rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {error && (
            <div className="text-center text-red-500">
              {t("error")}
            </div>
          )}

          {/* Grid Cards */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificates.map((certificate, index) => (
                <CertificationCard
                  key={certificate.id}
                  index={index}
                  certificate={certificate}
                  onClick={() => {
                    setSelectedCertificate(certificate);
                    setSelectedIndex(index);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      <CertificateModal
        certificate={selectedCertificate}
        index={selectedIndex}
        onClose={() => {
          setSelectedCertificate(null);
          setSelectedIndex(null);
        }}
      />
    </>
  );
};

export default CertificationsSection;
