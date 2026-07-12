"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  Download,
  ExternalLink,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CvModalProps {
  open: boolean;
  onClose: () => void;
  pdfUrl?: string;
}

// ── Focusable element selector ────────────────────────────────
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

// ── Shared fallback UI (used inside <object> for native fallback) ──
function PdfFallback({ pdfUrl }: { pdfUrl: string }) {
  return (
    <div className="flex items-center justify-center h-full min-h-[65vh] sm:min-h-[70vh] md:min-h-[75vh] px-6">
      <div className="flex flex-col items-center text-center max-w-sm gap-5">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <ShieldAlert className="w-7 h-7 text-rose-400" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-zinc-200 mb-1">
            PDF viewer blocked
          </h3>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Your browser&apos;s privacy settings prevented the PDF from loading
            inline. You can still download or open it in a new tab.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-zinc-300 font-medium text-sm transition-all duration-200"
          >
            <ExternalLink className="w-4 h-4" />
            Open in Tab
          </a>
        </div>
      </div>
    </div>
  );
}

export function CvModal({
  open,
  onClose,
  pdfUrl = "/data/cv-habibi.pdf",
}: CvModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [showContent, setShowContent] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  // ── Animate entrance + reveal PDF ───────────────────────────
  useEffect(() => {
    if (!open) return;
    setGlitchActive(true);
    setShowContent(false);

    const glitchTimer = setTimeout(() => setGlitchActive(false), 700);
    const contentTimer = setTimeout(() => setShowContent(true), 400);

    return () => {
      clearTimeout(glitchTimer);
      clearTimeout(contentTimer);
      setGlitchActive(false);
      setShowContent(false);
    };
  }, [open]);

  // ── Escape key + Focus trap ─────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          FOCUSABLE_SELECTOR,
        );
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

  // ── Backdrop click ──────────────────────────────────────────
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Cek apakah klik terjadi di luar panel (overlay / backdrop)
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
          {/* ── Backdrop ── */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

          {/* ── Modal panel ── */}
          <motion.div
            ref={panelRef}
            key="cv-modal-panel"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: [0.215, 0.61, 0.355, 1] }}
            className={cn(
              "relative w-full max-w-5xl max-h-[90vh] flex flex-col",
              "rounded-2xl border border-white/10 bg-zinc-950/90 dark:bg-black/90",
              "shadow-2xl shadow-black/50 overflow-hidden",
              glitchActive && "animate-glitch-skew",
            )}
          >
            {/* ── Glitch chromatic aberration layers ── */}
            {glitchActive && (
              <>
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none select-none z-10"
                  style={{
                    backgroundColor: "rgba(244, 63, 94, 0.06)",
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
                  className="absolute inset-0 z-10 bg-linear-to-r from-transparent via-rose-500/10 via-40% to-transparent pointer-events-none"
                  aria-hidden="true"
                />
              </>
            )}

            {/* ── Header ── */}
            <div className="relative flex items-center justify-between px-5 py-3 border-b border-white/5">
              <div className="flex items-center gap-2.5 text-sm text-zinc-300">
                <FileText className="w-4 h-4 text-rose-400" />
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
                  <span className="hidden sm:inline">Download</span>
                </a>
                <button
                  ref={closeBtnRef}
                  onClick={onClose}
                  aria-label="Close CV"
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── PDF Viewer ── */}
            <div className="flex-1 min-h-0 bg-zinc-900/50 relative">
              {/* Loading state (before entrance animation settles) */}
              {!showContent && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="flex flex-col items-center gap-3 text-zinc-500">
                    <Loader2 className="w-8 h-8 animate-spin text-rose-400/60" />
                    <span className="text-xs font-mono tracking-wider">
                      Loading PDF...
                    </span>
                  </div>
                </div>
              )}

              {/* Native PDF viewer — uses <object> with automatic child fallback */}
              {showContent && (
                <object
                  data={pdfUrl}
                  type="application/pdf"
                  className="w-full h-full min-h-[65vh] sm:min-h-[70vh] md:min-h-[75vh]"
                  aria-label="CV Document"
                >
                  {/*
                    Native HTML fallback: browsers automatically display
                    this content when the PDF cannot render inline
                    (e.g. Brave Shields, Firefox without PDF.js, etc.)
                  */}
                  <PdfFallback pdfUrl={pdfUrl} />
                </object>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="flex items-center justify-between px-5 py-2.5 border-t border-white/5 bg-black/30">
              <span className="text-[11px] text-zinc-500 tracking-wide">
                Use{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 text-[10px] font-mono">
                  Esc
                </kbd>{" "}
                to close
              </span>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Open in new tab <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
