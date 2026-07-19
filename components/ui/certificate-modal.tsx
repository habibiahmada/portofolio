"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Certificate } from "@/lib/certificates";

interface CertificateModalProps {
  certificate: Certificate | null;
  open: boolean;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function CertificateModal({
  certificate,
  open,
  onClose,
}: CertificateModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);

  // Reset page + trigger glitch when certificate changes
  useEffect(() => {
    if (!open) return;
    setCurrentPage(0);
    setGlitchActive(true);
    const timer = setTimeout(() => setGlitchActive(false), 700);
    return () => clearTimeout(timer);
  }, [certificate?.id, open]);

  const totalPages = certificate?.pages.length ?? 0;

  const goToPrev = useCallback(() => {
    setCurrentPage((p) => (p > 0 ? p - 1 : totalPages - 1));
  }, [totalPages]);

  const goToNext = useCallback(() => {
    setCurrentPage((p) => (p < totalPages - 1 ? p + 1 : 0));
  }, [totalPages]);

  // ── Keyboard: Esc + arrows ────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
        return;
      }

      // Focus trap
      if (e.key === "Tab" && panelRef.current) {
        const focusable =
          panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [onClose, goToPrev, goToNext],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => closeBtnRef.current?.focus());

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  // ── Backdrop click ────────────────────────────────────────────
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!certificate) return null;

  const orgDisplay = certificate.org
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cert-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label={certificate.title}
          className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            key="cert-modal-panel"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: [0.215, 0.61, 0.355, 1] }}
            className={cn(
              "relative w-full max-w-6xl max-h-[95vh] flex flex-col",
              "rounded-2xl border border-white/10 bg-zinc-950/90 dark:bg-black/90",
              "shadow-2xl shadow-black/50 overflow-hidden",
              glitchActive && "animate-glitch-skew",
            )}
          >
            {/* Glitch chromatic aberration layers */}
            {glitchActive && (
              <>
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none select-none z-10"
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.06)",
                    clipPath: "inset(25% 0 55% 0)",
                    transform: "translate(-4px, 2px)",
                    animation: "glitch-split 0.4s ease-in-out",
                  }}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none select-none z-10"
                  style={{
                    backgroundColor: "rgba(34, 211, 238, 0.06)",
                    clipPath: "inset(55% 0 10% 0)",
                    transform: "translate(4px, -2px)",
                    animation: "glitch-split 0.4s ease-in-out reverse",
                  }}
                  aria-hidden="true"
                />
                <motion.div
                  key="glitch-sweep"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ duration: 0.5, ease: "linear" }}
                  className="absolute inset-0 z-10 bg-linear-to-r from-transparent via-red-500/10 via-40% to-transparent pointer-events-none"
                  aria-hidden="true"
                />
              </>
            )}

            {/* ── Header ── */}
            <div className="relative flex items-center justify-between px-5 py-3 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2.5 text-sm text-zinc-300 min-w-0">
                <Award className="w-4 h-4 text-red-500 dark:text-blue-400 shrink-0" />
                <span className="font-medium tracking-wide truncate">
                  {certificate.title}
                </span>
              </div>

              <button
                ref={closeBtnRef}
                onClick={onClose}
                aria-label="Close"
                className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Body: Description left, Image right ── */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-5 overflow-hidden">
              {/* Description column */}
              <div className="lg:col-span-2 p-5 md:p-6 overflow-y-auto border-r border-white/5 flex flex-col gap-4">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-red-500 dark:text-blue-400 font-semibold">
                    {orgDisplay}
                  </span>
                  <h3 className="text-sm md:text-base font-semibold text-zinc-100 mt-2 leading-snug">
                    {certificate.title}
                  </h3>
                </div>

                <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                  {certificate.description}
                </p>
              </div>

              {/* Image column - larger */}
              <div className="lg:col-span-3 relative flex items-center justify-center bg-zinc-900/50 min-h-100 lg:min-h-[65vh]">
                {/* Image carousel */}
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPage}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="relative w-full h-full max-h-[75vh]"
                    >
                      <Image
                        src={certificate.pages[currentPage]}
                        alt={`${certificate.title} — page ${currentPage + 1}`}
                        fill
                        className="object-contain cursor-pointer"
                        sizes="(max-width: 1024px) 100vw, 75vw"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation arrows (only if > 1 page) */}
                {totalPages > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPrev();
                      }}
                      aria-label="Previous page"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:bg-black/60 transition-all duration-200 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNext();
                      }}
                      aria-label="Next page"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:bg-black/60 transition-all duration-200 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Dots indicator */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentPage(i);
                          }}
                          className={cn(
                            "w-1.5 h-1.5 rounded-full transition-all duration-300",
                            i === currentPage
                              ? "bg-white w-4"
                              : "bg-white/30 hover:bg-white/50",
                          )}
                          aria-label={`Go to page ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="flex items-center justify-between px-5 py-2.5 border-t border-white/5 bg-black/30 shrink-0">
              <span className="text-[11px] text-zinc-500 tracking-wide">
                Use{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 text-[10px] font-mono">
                  Esc
                </kbd>{" "}
                to close
                {totalPages > 1 && (
                  <>
                    {" · "}
                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 text-[10px] font-mono">
                      ←
                    </kbd>{" "}
                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 text-[10px] font-mono">
                      →
                    </kbd>{" "}
                    navigate
                  </>
                )}
              </span>
              <span className="text-[11px] text-zinc-500 tabular-nums">
                {currentPage + 1} / {totalPages}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
