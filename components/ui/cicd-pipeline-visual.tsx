"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const STAGES = [
  { label: "Commit", desc: "push", color: "text-[#ef4444] dark:text-blue-400", ring: "ring-[#ef4444]/40 dark:ring-blue-400/40", bg: "bg-[#ef4444]/10 dark:bg-blue-400/10" },
  { label: "Build", desc: "bundle", color: "text-amber-500", ring: "ring-amber-500/40", bg: "bg-amber-500/10" },
  { label: "Test", desc: "verify", color: "text-sky-500", ring: "ring-sky-500/40", bg: "bg-sky-500/10" },
  { label: "Deploy", desc: "live", color: "text-emerald-500", ring: "ring-emerald-500/40", bg: "bg-emerald-500/10" },
] as const;

const LOGS = [
  "$ git push origin main",
  "✓ build · 12.4s",
  "✓ 48 tests passed",
  "▲ deployed · prod",
];

export function CICDPipelineVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(reduceMotion ? 3 : 0);

  useEffect(() => {
    if (!isInView || reduceMotion) return;
    let idx = 0;
    const id = setInterval(() => {
      idx = (idx + 1) % STAGES.length;
      setActive(idx);
    }, 2000);
    return () => clearInterval(id);
  }, [isInView, reduceMotion]);

  return (
    <div
      ref={ref}
      className="w-full h-44 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 overflow-hidden select-none flex flex-col"
    >
      {/* Pipeline */}
      <div className="flex-1 flex items-center px-4 pt-3 pb-1">
        <div className="flex items-center w-full">
          {STAGES.map((stage, i) => {
            const isActive = active === i;
            const isPast = i < active;

            return (
              <div key={stage.label} className="flex items-center flex-1 last:flex-none">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.08, duration: 0.35 }}
                  className="flex flex-col items-center gap-1 shrink-0"
                >
                  <div
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-400 ${
                      isActive
                        ? `${stage.color} ${stage.bg} ring-2 ${stage.ring}`
                        : isPast
                          ? "bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/25"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 ring-1 ring-black/5 dark:ring-white/5"
                    }`}
                  >
                    {isPast ? (
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
                        <path
                          d="M3 7.5L6 10.5L11 3.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <span className="text-[9px] font-mono font-bold">{i + 1}</span>
                    )}
                    {isActive && !reduceMotion && (
                      <motion.span
                        className="absolute inset-0 rounded-full border border-current"
                        animate={{ scale: [1, 1.55], opacity: [0.45, 0] }}
                        transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                  </div>
                  <span
                    className={`text-[8px] font-mono font-semibold transition-colors ${
                      isActive
                        ? stage.color
                        : isPast
                          ? "text-emerald-500/70"
                          : "text-muted-foreground/30"
                    }`}
                  >
                    {stage.label}
                  </span>
                </motion.div>

                {i < STAGES.length - 1 && (
                  <div className="flex-1 px-1 -mt-3.5">
                    <div className="relative h-0.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full"
                        animate={{ width: isPast ? "100%" : "0%" }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal log */}
      <div className="mx-3 mb-3 rounded-lg border border-black/5 dark:border-white/5 bg-zinc-950 px-2.5 py-2 font-mono">
        <div className="flex items-center gap-1 mb-1.5">
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
          <span className="ml-1 text-[7px] text-zinc-500">pipeline · main</span>
        </div>
        <div className="space-y-0.5 min-h-[2.8rem]">
          {LOGS.map((line, i) => {
            const visible = reduceMotion ? true : i <= active;
            return (
              <motion.div
                key={line}
                initial={false}
                animate={{ opacity: visible ? 1 : 0.15 }}
                className={`text-[8px] truncate ${
                  i === active
                    ? "text-emerald-400"
                    : i < active
                      ? "text-zinc-400"
                      : "text-zinc-600"
                }`}
              >
                {line}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
