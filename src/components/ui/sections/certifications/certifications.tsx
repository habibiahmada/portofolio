"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

import SectionHeader from "../SectionHeader";
import CertificationSkeleton from "./certificationskeleton";
import CertificateModal from "./certificationmodal";
import useCertificates from "@/hooks/api/public/useCertificates";
import { Certificate } from "@/lib/types/database";

const CertificationCard = dynamic(() => import("./certificationcard"), {
  ssr: false,
});

export default function CertificationsSection() {
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);

  const t = useTranslations("certifications");
  const { resolvedTheme } = useTheme();
  const { certificates, loading, error } = useCertificates();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <>
      <section
        className={`relative py-28 sm:py-36 lg:py-40 transition-colors
        ${isDark ? "bg-slate-950" : "bg-slate-50"}`}
      >
        <div className="container mx-auto px-4">
          <SectionHeader
            title={t("titleLine1")}
            description={t("description1")}
            align="center"
          />

          {loading && <CertificationSkeleton />}

          {error && <p className="text-center text-red-500">{t("error")}</p>}

          {!loading && !error && (
            <div className="mt-16 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {certificates.map((certificate, index) => (
                <CertificationCard
                  key={certificate.id}
                  certificate={certificate}
                  index={index}
                  onClick={() => setSelectedCertificate(certificate)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <CertificateModal
        open={Boolean(selectedCertificate)}
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />
    </>
  );
}
