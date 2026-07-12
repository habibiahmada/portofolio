"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ─── Component ────────────────────────────────────────────────────────────────

export function SpeedometerGaugeVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-40px" });
  const [score, setScore] = useState(0);
  const [metricsVisible, setMetricsVisible] = useState(false);

  useEffect(() => {
    if (!isInView) {
      setScore(0);
      setMetricsVisible(false);
      return;
    }

    let rafId: number;
    let timeoutId: ReturnType<typeof setTimeout>;
    let current = 0;
    let animating = true;

    const animate = () => {
      if (!animating) return;
      current += 1;
      if (current >= 98) {
        current = 98;
        setScore(current);
        setMetricsVisible(true);
        animating = false;
        timeoutId = setTimeout(startCycle, 3000);
        return;
      }
      setScore(current);
      rafId = requestAnimationFrame(animate);
    };

    const startCycle = () => {
      current = 0;
      setScore(0);
      setMetricsVisible(false);
      animating = true;
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      animating = false;
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [isInView]);

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const arcLen = circumference * 0.75;
  const filled = arcLen * (score / 100);
  const offset = arcLen - filled;

  const metrics = [
    { label: "FCP", val: "0.8s", color: "text-emerald-500" },
    { label: "LCP", val: "1.2s", color: "text-emerald-500" },
    { label: "CLS", val: "0.02", color: "text-emerald-500" },
  ];

  return (
    <div
      ref={containerRef}
      className="w-full h-44 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center px-5 overflow-hidden"
    >
      <div className="flex items-center gap-5">
        {/* Gauge */}
        <div className="relative shrink-0">
          <svg width="88" height="88" viewBox="0 0 88 88">
            <circle
              cx="44"
              cy="44"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              className="text-zinc-200 dark:text-zinc-800"
              strokeDasharray={`${arcLen} ${circumference}`}
              strokeDashoffset={0}
              transform="rotate(135 44 44)"
            />
            <motion.circle
              cx="44"
              cy="44"
              r={radius}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              stroke="#10b981"
              strokeDasharray={`${arcLen} ${circumference}`}
              strokeDashoffset={offset}
              transform="rotate(135 44 44)"
              style={{ transition: "stroke-dashoffset 0.04s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-emerald-500 font-mono leading-none">
              {score}
            </span>
            <span className="text-[8px] text-muted-foreground/60 font-mono uppercase tracking-widest mt-0.5">
              Score
            </span>
          </div>
        </div>

        {/* Metrics */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={
            metricsVisible
              ? { width: "auto", opacity: 1 }
              : { width: 0, opacity: 0 }
          }
          transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
          className="overflow-hidden shrink-0"
        >
          <div className="flex flex-col gap-2.5 min-w-max">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, x: 8 }}
                animate={
                  metricsVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }
                }
                transition={{ delay: i * 0.12 + 0.1, duration: 0.45 }}
                className="flex items-center gap-2"
              >
                <span className="text-[9px] font-mono text-muted-foreground/60 w-6 shrink-0">
                  {m.label}
                </span>
                <div className="h-1 rounded-full bg-zinc-200 dark:bg-zinc-800 w-14 overflow-hidden shrink-0">
                  <motion.div
                    className="h-full rounded-full bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={metricsVisible ? { width: "100%" } : { width: 0 }}
                    transition={{
                      delay: i * 0.12 + 0.2,
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                  />
                </div>
                <span className={`text-[10px] font-mono font-bold ${m.color} shrink-0`}>
                  {m.val}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
