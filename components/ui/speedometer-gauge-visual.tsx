"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const METRICS = [
  { label: "LCP", val: "1.1s", pct: 92 },
  { label: "INP", val: "48ms", pct: 96 },
  { label: "CLS", val: "0.01", pct: 100 },
] as const;

export function SpeedometerGaugeVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [score, setScore] = useState(reduceMotion ? 98 : 0);
  const [ready, setReady] = useState(!!reduceMotion);

  useEffect(() => {
    if (!isInView) return;
    if (reduceMotion) {
      setScore(98);
      setReady(true);
      return;
    }

    let raf = 0;
    let current = 0;
    let alive = true;

    const tick = () => {
      if (!alive) return;
      current += 2;
      if (current >= 98) {
        setScore(98);
        setReady(true);
        return;
      }
      setScore(current);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [isInView, reduceMotion]);

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const arcLen = circumference * 0.75;
  const offset = arcLen - arcLen * (score / 100);

  return (
    <div
      ref={containerRef}
      className="w-full h-44 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center px-4 overflow-hidden select-none"
    >
      <div className="flex items-center gap-4 w-full max-w-70">
        <div className="relative shrink-0">
          <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden>
            <circle
              cx="42"
              cy="42"
              r={radius}
              fill="none"
              strokeWidth="5"
              strokeLinecap="round"
              className="text-zinc-200 dark:text-zinc-800"
              stroke="currentColor"
              strokeDasharray={`${arcLen} ${circumference}`}
              transform="rotate(135 42 42)"
            />
            <circle
              cx="42"
              cy="42"
              r={radius}
              fill="none"
              strokeWidth="5"
              strokeLinecap="round"
              stroke="#10b981"
              strokeDasharray={`${arcLen} ${circumference}`}
              strokeDashoffset={offset}
              transform="rotate(135 42 42)"
              style={{
                transition: reduceMotion
                  ? undefined
                  : "stroke-dashoffset 0.05s linear",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
            <span className="text-2xl font-black text-emerald-500 font-mono leading-none tabular-nums">
              {score}
            </span>
            <span className="text-[7px] text-muted-foreground/55 font-mono uppercase tracking-widest mt-0.5">
              Perf
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-2.5">
          <div className="text-[8px] font-mono text-muted-foreground/50 uppercase tracking-widest">
            Core Web Vitals
          </div>
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={reduceMotion ? false : { opacity: 0, x: 8 }}
              animate={
                ready ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }
              }
              transition={{ delay: i * 0.1, duration: 0.35 }}
              className="flex items-center gap-2"
            >
              <span className="text-[9px] font-mono text-muted-foreground/65 w-7 shrink-0">
                {m.label}
              </span>
              <div className="h-1 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={ready ? { width: `${m.pct}%` } : { width: 0 }}
                  transition={{
                    delay: reduceMotion ? 0 : i * 0.1 + 0.15,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                />
              </div>
              <span className="text-[9px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums shrink-0 w-8 text-right">
                {m.val}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
