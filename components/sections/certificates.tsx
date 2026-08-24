"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CertificateCard } from "@/components/ui/certificate-card";
import { CertificateModal } from "@/components/ui/certificate-modal";
import { PageShell } from "@/components/ui/page-shell";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Award } from "lucide-react";
import type { CertificateRow as CertType } from "@/lib/supabase/types";

const ITEMS_PER_ROW = 4;

export function Certificates({
  initialPinned = [],
  initialNonPinned = [],
}: {
  initialPinned?: CertType[];
  initialNonPinned?: CertType[];
}) {
  const [selectedCert, setSelectedCert] = useState<CertType | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_ROW);

  const visible = initialNonPinned.slice(0, visibleCount);
  const hasMore = visibleCount < initialNonPinned.length;
  const isExpanded = visibleCount > ITEMS_PER_ROW;

  const handleOpen = (cert: CertType) => {
    setSelectedCert(cert);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setTimeout(() => setSelectedCert(null), 300);
  };

  return (
    <>
      <section
        id="certificates"
        className="py-16 md:py-24 w-full bg-transparent"
      >
        <PageShell wide className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.215, 0.61, 0.355, 1] }}
            className="max-w-2xl space-y-3"
          >
            <span className="text-xs font-mono tracking-widest text-brand uppercase block">
              Certificates
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
              Licenses &{" "}
              <span className="text-brand">
                Certifications
              </span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground/80 leading-relaxed font-medium max-w-lg">
              Professional certifications and awards that validate my expertise
              in software development, cloud computing, and technology innovation.
            </p>
          </motion.div>

          {initialPinned.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand/8 border border-brand/15">
                  <Award className="w-3 h-3 text-brand" />
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-brand">
                    Featured
                  </span>
                </div>
                <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {initialPinned.map((cert, i) => (
                  <CertificateCard
                    key={cert.id}
                    id={cert.id}
                    title={cert.title}
                    org={cert.org}
                    thumb={cert.thumb}
                    isPinned={cert.is_pinned}
                    index={i}
                    onOpen={() => handleOpen(cert)}
                  />
                ))}
              </div>
            </div>
          )}

          {initialNonPinned.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/40">
                  All Certificates
                </span>
                <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {visible.map((cert, i) => (
                  <CertificateCard
                    key={cert.id}
                    id={cert.id}
                    title={cert.title}
                    org={cert.org}
                    thumb={cert.thumb}
                    isPinned={cert.is_pinned}
                    index={i}
                    onOpen={() => handleOpen(cert)}
                  />
                ))}
              </div>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center pt-4"
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              {isExpanded && (
                <button
                  type="button"
                  onClick={() => setVisibleCount(ITEMS_PER_ROW)}
                  className={cn(
                    "inline-flex items-center gap-2 px-6 py-3.5 rounded-full",
                    "border border-black/10 dark:border-white/10",
                    "hover:border-brand/30",
                    "bg-black/3 dark:bg-white/3",
                    "hover:bg-brand/5",
                    "transition-all duration-300",
                    "text-sm font-semibold text-foreground",
                    "hover:scale-[1.02] active:scale-[0.98]",
                  )}
                >
                  <ChevronUp className="w-4 h-4" />
                  <span>Collapse</span>
                </button>
              )}

              {hasMore && (
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((n) =>
                      Math.min(n + ITEMS_PER_ROW, initialNonPinned.length),
                    )
                  }
                  className={cn(
                    "group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full",
                    "border border-black/10 dark:border-white/10",
                    "hover:border-brand/30",
                    "bg-black/3 dark:bg-white/3",
                    "hover:bg-brand/5",
                    "transition-all duration-300",
                    "text-sm font-semibold text-foreground",
                    "hover:scale-[1.02] active:scale-[0.98] cursor-pointer",
                  )}
                >
                  <span>Load More</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
                </button>
              )}

              {!hasMore && initialNonPinned.length > 0 && (
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/30">
                  Showing all {initialPinned.length + initialNonPinned.length}{" "}
                  certificates
                </span>
              )}
            </div>
          </motion.div>
        </PageShell>
      </section>

      <CertificateModal
        certificate={selectedCert}
        open={openModal}
        onClose={handleClose}
      />
    </>
  );
}
