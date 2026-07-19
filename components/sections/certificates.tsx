"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CertificateCard } from "@/components/ui/certificate-card";
import { CertificateModal } from "@/components/ui/certificate-modal";
import { CertificateGridSkeleton } from "@/components/ui/skeletons";
import { usePinnedCertificates, useNonPinnedCertificates } from "@/lib/hooks/use-api";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Award, Loader2 } from "lucide-react";
import type { CertificateRow as CertType } from "@/lib/supabase/types";

const ITEMS_PER_ROW = 4;

export function Certificates() {
  const [selectedCert, setSelectedCert] = useState<CertType | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [allLoaded, setAllLoaded] = useState<CertType[]>([]);

  const {
    data: pinned,
    loading: pinnedLoading,
  } = usePinnedCertificates();

  const {
    data: nonPinnedPage,
    loading: nonPinnedLoading,
  } = useNonPinnedCertificates(page, ITEMS_PER_ROW);



  // Accumulate loaded pages — via useEffect to avoid state-update-during-render
  useEffect(() => {
    if (!nonPinnedPage || nonPinnedLoading) return;
    setAllLoaded((prev) => {
      const existingIds = new Set(prev.map((c) => c.id));
      const newOnes = nonPinnedPage.filter((c) => !existingIds.has(c.id));
      if (newOnes.length === 0) return prev;
      return page === 1 ? newOnes : [...prev, ...newOnes];
    });
  }, [nonPinnedPage, nonPinnedLoading, page]);

  const visible = allLoaded;
  const hasMore = nonPinnedPage && nonPinnedPage.length === ITEMS_PER_ROW;

  const handleOpen = (id: string) => {
    const found = pinned?.find((c) => c.id === id) || allLoaded.find((c) => c.id === id);
    if (found) {
      setSelectedCert(found);
      setOpenModal(true);
    }
  };

  const handleClose = () => {
    setOpenModal(false);
    setTimeout(() => setSelectedCert(null), 300);
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const collapseAll = () => {
    setPage(1);
    setAllLoaded([]);
  };

  const isExpanded = page > 1;

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
              in software development, cloud computing, and technology innovation.
            </p>
          </motion.div>

          {/* ── Pinned section — always visible ── */}
          {pinned && pinned.length > 0 && (
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
                    isPinned={cert.is_pinned}
                    index={i}
                    onOpen={handleOpen}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Loading skeleton for pinned ── */}
          {pinnedLoading && <CertificateGridSkeleton count={4} />}

          {/* ── All Certificates grid — paginated ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
              <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/40">
                All Certificates
              </span>
              <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
            </div>

            {/* Loading for non-pinned */}
            {nonPinnedLoading && page === 1 && <CertificateGridSkeleton count={4} />}

            {/* Error state */}
            {!nonPinnedLoading && nonPinnedPage === undefined && (
              <p className="text-sm text-red-500 dark:text-red-400 font-mono text-center">
                Failed to load certificates.
              </p>
            )}

            {/* Certificates grid */}
            {!nonPinnedLoading && visible.length > 0 && (
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
                    onOpen={handleOpen}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Load More / Collapse ── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center pt-4"
          >
            <div className="flex items-center gap-3">
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

              {hasMore && !nonPinnedLoading && (
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
                </button>
              )}

              {nonPinnedLoading && page > 1 && (
                <div className="flex items-center gap-2 text-muted-foreground/60">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs font-mono">Loading...</span>
                </div>
              )}

              {!hasMore && visible.length > 0 && (
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/30">
                  Showing all {visible.length + (pinned?.length || 0)} certificates
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
