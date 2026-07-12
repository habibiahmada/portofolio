"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ─── Component ────────────────────────────────────────────────────────────────

export function CICDPipelineVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-40px" });
  const [activeStage, setActiveStage] = useState<number>(0);

  const stages = [
    {
      id: 0,
      label: "Commit",
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
          <line
            x1="7"
            y1="4"
            x2="7"
            y2="0"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="7"
            y1="10"
            x2="7"
            y2="14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
      color: "text-[#ef4444]",
      bgActive: "bg-red-500/10 ring-red-500/50",
      desc: "push",
    },
    {
      id: 1,
      label: "Build",
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect
            x="2"
            y="2"
            width="10"
            height="10"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <line
            x1="4"
            y1="7"
            x2="10"
            y2="7"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <line
            x1="7"
            y1="4"
            x2="7"
            y2="10"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      ),
      color: "text-amber-500",
      bgActive: "bg-amber-500/10 ring-amber-500/50",
      desc: "bundle",
    },
    {
      id: 2,
      label: "Test",
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 7.5L6 10.5L11 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      color: "text-sky-500",
      bgActive: "bg-sky-500/10 ring-sky-500/50",
      desc: "verify",
    },
    {
      id: 3,
      label: "Deploy",
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M7 1L7 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M11 6L7 1L3 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="1"
            y1="12"
            x2="13"
            y2="12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
      color: "text-emerald-500",
      bgActive: "bg-emerald-500/10 ring-emerald-500/50",
      desc: "release",
    },
  ];

  // Pipeline runner — loops through stages
  useEffect(() => {
    if (!isInView) return;
    let idx = 0;
    const stageInterval = setInterval(() => {
      idx++;
      setActiveStage(idx % stages.length);
    }, 2200);
    return () => {
      clearInterval(stageInterval);
      setActiveStage(0);
    };
  }, [isInView]);

  return (
    <div
      ref={ref}
      className="w-full h-44 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center overflow-hidden px-6 py-4 select-none"
    >
      <div className="flex items-center w-full max-w-70">
        {stages.map((stage, i) => {
          const isActive = activeStage === i;
          const isPast = i < activeStage;

          return (
            <div
              key={stage.id}
              className="flex items-center flex-1 last:flex-none"
            >
              {/* Stage node + label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                }
                transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center gap-1.5 shrink-0"
              >
                {/* Node circle */}
                <motion.div
                  animate={{
                    scale: isActive ? [1, 1.15, 1] : 1,
                  }}
                  transition={{
                    scale: isActive
                      ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0.3 },
                  }}
                  className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isActive
                      ? `${stage.color} ${stage.bgActive} ring-2`
                      : isPast
                        ? "bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/30"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 ring-1 ring-black/5 dark:ring-white/5"
                  }`}
                >
                  <span className={isActive || isPast ? "" : "opacity-50"}>
                    {isPast ? (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M3 7.5L6 10.5L11 3.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      stage.icon
                    )}
                  </span>

                  {/* Pulse ring */}
                  {isActive && (
                    <motion.span
                      className="absolute inset-0 rounded-full border-2 border-current"
                      animate={{
                        scale: [1, 1.6],
                        opacity: [0.4, 0],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  )}
                </motion.div>

                {/* Label */}
                <div className="flex flex-col items-center">
                  <span
                    className={`text-[9px] font-mono font-bold tracking-wide transition-colors duration-300 ${
                      isActive
                        ? stage.color
                        : isPast
                          ? "text-emerald-500/70"
                          : "text-muted-foreground/30"
                    }`}
                  >
                    {stage.label}
                  </span>
                  <span
                    className={`text-[7px] font-mono tracking-widest uppercase transition-colors duration-300 ${
                      isActive
                        ? "text-muted-foreground/60"
                        : "text-muted-foreground/20"
                    }`}
                  >
                    {isPast ? "done" : isActive ? stage.desc : "wait"}
                  </span>
                </div>
              </motion.div>

              {/* Connector line between stages */}
              {i < stages.length - 1 && (
                <div className="flex-1 flex items-center justify-center px-1 -mt-6">
                  <div className="relative w-full h-0.5">
                    <div className="absolute inset-0 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
                      initial={{ width: "0%" }}
                      animate={{
                        width: isPast ? "100%" : "0%",
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
