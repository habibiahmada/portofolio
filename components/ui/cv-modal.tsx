"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  X,
  FileText,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CvModalProps {
  open: boolean;
  onClose: () => void;
  pdfUrl?: string;
}

const CV_PAGES = ["/data/cv/page-1.webp", "/data/cv/page-2.webp"];

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function CvModal({
  open,
  onClose,
  pdfUrl = "/data/cv-habibi.pdf",
}: CvModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [glitchActive, setGlitchActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // ── Glitch trigger on open ────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    setCurrentPage(0);
    setGlitchActive(true);
    const t = setTimeout(() => setGlitchActive(false), 700);
    return () => clearTimeout(t);
  }, [open]);

  // ── Keyboard ──────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentPage((p) => Math.max(0, p - 1));
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentPage((p) => Math.min(CV_PAGES.length - 1, p + 1));
        return;
      }

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
    [onClose],
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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          key="cv-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label="CV Viewer"
          className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 md:p-10"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

          <motion.div
            ref={panelRef}
            key="cv-modal-panel"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: [0.215, 0.61, 0.355, 1] }}
            className={cn(
              "relative w-full max-w-4xl h-[min(85vh,100dvh)] max-h-[85dvh] flex flex-col",
              "rounded-2xl border border-white/10 bg-zinc-950/90 dark:bg-black/90",
              "shadow-2xl shadow-black/50 overflow-hidden",
              glitchActive && "animate-glitch-skew",
            )}
          >
            {/* Glitch layers */}
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
              <div className="flex items-center gap-2.5 text-sm text-zinc-300">
                <FileText className="w-4 h-4 text-[#ef4444]" />
                <span className="font-medium tracking-wide">
                  CV — Habibi Ahmad
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={pdfUrl}
                  download="CV-Habibi-Ahmad.pdf"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download PDF</span>
                </a>
                <button
                  ref={closeBtnRef}
                  onClick={onClose}
                  aria-label="Close CV"
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── WebP Preview ── */}
            <div className="flex-1 min-h-0 relative bg-zinc-900/50 flex items-center justify-center p-4">
              <Image
                src={CV_PAGES[currentPage]}
                alt={`CV Preview — Page ${currentPage + 1}`}
                width={800}
                height={1100}
                className="max-w-full max-h-full object-contain rounded-sm"
                style={{ maxHeight: "calc(85vh - 100px)" }}
              />

              {/* Nav arrows */}
              {currentPage > 0 && (
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  aria-label="Previous page"
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white/80 hover:text-white transition-all cursor-pointer backdrop-blur-sm border border-white/10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {currentPage < CV_PAGES.length - 1 && (
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  aria-label="Next page"
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white/80 hover:text-white transition-all cursor-pointer backdrop-blur-sm border border-white/10"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="flex items-center justify-between px-5 py-2.5 border-t border-white/5 bg-black/30 shrink-0">
              <span className="text-[11px] text-zinc-500 tracking-wide">
                Use{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 text-[10px] font-mono">
                  Esc
                </kbd>{" "}
                to close
                {" · "}
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 text-[10px] font-mono">
                  ←
                </kbd>{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 text-[10px] font-mono">
                  →
                </kbd>{" "}
                pages
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-zinc-500 tabular-nums">
                  {currentPage + 1} / {CV_PAGES.length}
                </span>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Open PDF <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
