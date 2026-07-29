"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type DeviceType = "desktop" | "tablet" | "mobile";

const DEVICES: { key: DeviceType; label: string }[] = [
  { key: "desktop", label: "1440" },
  { key: "tablet", label: "768" },
  { key: "mobile", label: "375" },
];

const FRAME = {
  desktop: { w: "92%", max: 220 },
  tablet: { w: "68%", max: 160 },
  mobile: { w: "42%", max: 110 },
} as const;

export function LayoutDesignerVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [device, setDevice] = useState<DeviceType>("desktop");

  useEffect(() => {
    if (!isInView || reduceMotion) return;
    const order: DeviceType[] = ["desktop", "tablet", "mobile", "desktop"];
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % order.length;
      setDevice(order[i]);
    }, 2800);
    return () => clearInterval(id);
  }, [isInView, reduceMotion]);

  const frame = FRAME[device];

  return (
    <div
      ref={ref}
      className="relative w-full h-44 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 overflow-hidden select-none"
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.25]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 0.6px, transparent 0.6px)",
          backgroundSize: "14px 14px",
          color: "rgb(0 0 0 / 0.08)",
        }}
      />
      <div
        className="absolute inset-0 dark:opacity-100 opacity-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgb(255 255 255 / 0.06) 0.6px, transparent 0.6px)",
          backgroundSize: "14px 14px",
        }}
      />

      {/* Toolbar */}
      <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 rounded-md bg-white/80 dark:bg-zinc-950/80 border border-black/5 dark:border-white/5 px-2 py-1 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] dark:bg-blue-400" />
          <span className="text-[8px] font-mono text-muted-foreground/70 tracking-wide">
            artboard · home
          </span>
        </div>
        <div className="flex items-center gap-0.5 rounded-md bg-white/80 dark:bg-zinc-950/80 border border-black/5 dark:border-white/5 p-0.5 backdrop-blur-sm">
          {DEVICES.map((d) => {
            const active = device === d.key;
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => setDevice(d.key)}
                className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors ${
                  active
                    ? "bg-[#ef4444]/10 text-[#ef4444] dark:bg-blue-400/15 dark:text-blue-400"
                    : "text-muted-foreground/50 hover:text-muted-foreground"
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Frame */}
      <div className="absolute inset-0 flex items-center justify-center pt-6 px-4">
        <motion.div
          layout
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
          }
          className="relative rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 shadow-lg shadow-black/5 dark:shadow-black/40 overflow-hidden"
          style={{ width: frame.w, maxWidth: frame.max }}
        >
          {/* Selection handles */}
          <span className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-[#ef4444] dark:bg-blue-400 rounded-[1px] z-10" />
          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#ef4444] dark:bg-blue-400 rounded-[1px] z-10" />
          <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-[#ef4444] dark:bg-blue-400 rounded-[1px] z-10" />
          <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-[#ef4444] dark:bg-blue-400 rounded-[1px] z-10" />

          <div className="flex items-center gap-1 px-2 py-1.5 border-b border-black/5 dark:border-white/5 bg-zinc-50/80 dark:bg-zinc-900/80">
            <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="ml-1 flex-1 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>

          <div className="p-2 space-y-1.5">
            <div
              className={`rounded-md bg-[#ef4444]/8 dark:bg-blue-500/15 border border-[#ef4444]/15 dark:border-blue-400/20 ${
                device === "mobile" ? "h-5" : "h-6"
              } flex items-center px-2`}
            >
              <div className="h-1 rounded-full bg-[#ef4444]/50 dark:bg-blue-400/50 w-2/5" />
              {device !== "mobile" && (
                <div className="ml-auto flex gap-1">
                  <div className="w-4 h-1 rounded-full bg-zinc-300/80 dark:bg-zinc-600/80" />
                  <div className="w-4 h-1 rounded-full bg-zinc-300/80 dark:bg-zinc-600/80" />
                </div>
              )}
            </div>

            <div
              className={`grid gap-1.5 ${
                device === "desktop"
                  ? "grid-cols-3"
                  : device === "tablet"
                    ? "grid-cols-2"
                    : "grid-cols-1"
              }`}
            >
              {(device === "desktop" ? [0, 1, 2] : device === "tablet" ? [0, 1] : [0]).map(
                (i) => (
                  <div
                    key={i}
                    className={`rounded-md border border-black/5 dark:border-white/5 bg-zinc-100 dark:bg-zinc-800/80 ${
                      device === "mobile" ? "h-10" : "h-8"
                    } ${i === 0 ? "relative overflow-hidden" : ""}`}
                  >
                    {i === 0 && (
                      <div className="absolute inset-0 bg-linear-to-br from-[#ef4444]/10 to-transparent dark:from-blue-400/10" />
                    )}
                  </div>
                ),
              )}
            </div>

            {device !== "mobile" && (
              <div className="flex gap-1">
                <div className="h-1.5 flex-1 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                <div className="h-1.5 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800" />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
