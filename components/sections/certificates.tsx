"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CertificateCard } from "@/components/ui/certificate-card";
import { CertificateModal } from "@/components/ui/certificate-modal";
import { certificates, type Certificate } from "@/lib/certificates";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Award } from "lucide-react";

// ─── Constants ──────────────────────────────────────────────────────────────
const ITEMS_PER_ROW = 4;

export function Certificates() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_ROW);
  const [openModal, setOpenModal] = useState(false);

  // Separate pinned and non-pinned
  const pinned = certificates.filter((c) => c.isPinned);
  const nonPinned = [...certificates]
    .filter((c) => !c.isPinned)
    .sort((a, b) => a.org.localeCompare(b.org));

  const visibleNonPinned = nonPinned.slice(0, visibleCount);
  const hasMore = visibleCount < nonPinned.length;

  const handleOpen = (id: string) => {
    const cert = certificates.find((c) => c.id === id);
    if (cert) {
      setSelectedCert(cert);
      setOpenModal(true);
    }
  };

  const handleClose = () => {
    setOpenModal(false);
    setTimeout(() => setSelectedCert(null), 300);
  };

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_ROW, nonPinned.length));
  };

  const collapseAll = () => {
    setVisibleCount(ITEMS_PER_ROW);
  };

  const isExpanded = visibleCount > ITEMS_PER_ROW;

  return (
    <>
      <section id="certificates" className="p-24 w-full bg-transparent">
        <div className="w-full mx-auto space-y-12">
          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.215, 0.61, 0.355, 1] }}
            className="max-w-2xl space-y-3"
          >
            <span className="text-xs font-mono tracking-widest text-[#ef4444] dark:text-blue-400 uppercase block">
              // Certificates
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
              Licenses &{" "}
              <span className="text-red-500 dark:text-blue-400">
                Certifications
              </span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground/80 leading-relaxed font-medium max-w-lg">
              Professional certifications and awards that validate my expertise
              in software development, cloud computing, and technology
              innovation.
            </p>
          </motion.div>

          {/* ── Pinned section — always visible ── */}
          {pinned.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/8 dark:bg-blue-400/8 border border-red-500/15 dark:border-blue-400/15">
                  <Award className="w-3 h-3 text-red-500 dark:text-blue-400" />
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-red-500 dark:text-blue-400">
                    Featured
                  </span>
                </div>
                <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {pinned.map((cert, i) => (
                  <CertificateCard
                    key={cert.id}
                    id={cert.id}
                    title={cert.title}
                    org={cert.org}
                    thumb={cert.thumb}
                    isPinned={cert.isPinned}
                    index={i}
                    onOpen={handleOpen}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Other certificates grid — paginated ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
              <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/40">
                All Certificates
              </span>
              <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {visibleNonPinned.map((cert, i) => (
                <CertificateCard
                  key={cert.id}
                  id={cert.id}
                  title={cert.title}
                  org={cert.org}
                  thumb={cert.thumb}
                  isPinned={cert.isPinned}
                  index={i}
                  onOpen={handleOpen}
                />
              ))}
            </div>
          </div>

          {/* ── Load More / Collapse ── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center pt-4"
          >
            <div className="flex items-center gap-3">
              {/* Collapse button — visible only when expanded */}
              {isExpanded && (
                <button
                  onClick={collapseAll}
                  className={cn(
                    "inline-flex items-center gap-2 px-6 py-3.5 rounded-full",
                    "border border-black/10 dark:border-white/10",
                    "hover:border-red-500/30 dark:hover:border-blue-400/30",
                    "bg-black/3 dark:bg-white/3",
                    "hover:bg-red-500/5 dark:hover:bg-blue-400/5",
                    "transition-all duration-300",
                    "text-sm font-semibold text-foreground",
                    "hover:scale-[1.02] active:scale-[0.98]",
                  )}
                >
                  <ChevronUp className="w-4 h-4" />
                  <span>Collapse</span>
                </button>
              )}

              {/* Load More button */}
              {hasMore && (
                <button
                  onClick={loadMore}
                  className={cn(
                    "group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full",
                    "border border-black/10 dark:border-white/10",
                    "hover:border-red-500/30 dark:hover:border-blue-400/30",
                    "bg-black/3 dark:bg-white/3",
                    "hover:bg-red-500/5 dark:hover:bg-blue-400/5",
                    "transition-all duration-300",
                    "text-sm font-semibold text-foreground",
                    "hover:scale-[1.02] active:scale-[0.98]",
                  )}
                >
                  <span>Load More</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
                  <span className="text-[10px] font-mono text-muted-foreground/40 tabular-nums">
                    {visibleCount}/{nonPinned.length}
                  </span>
                </button>
              )}

              {/* All loaded indicator — only if expanded but no more to load */}
              {!hasMore && (
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/30">
                  Showing all {pinned.length + nonPinned.length} certificates
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Modal ── */}
      <CertificateModal
        certificate={selectedCert}
        open={openModal}
        onClose={handleClose}
      />
    </>
  );
}
