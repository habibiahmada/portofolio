'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import SectionHeader from "../SectionHeader";
import dynamic from 'next/dynamic';
import CertificateModal from './certificationmodal';
import useCertificates from '@/hooks/api/public/useCertificates';
import { Certificate } from '@/lib/types/database';
import CertificationSkeleton from './certificationskeleton';

const CertificationCard = dynamic(
  () => import("./certificationcard"),
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
            <CertificationSkeleton />
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