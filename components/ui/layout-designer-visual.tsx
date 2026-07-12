"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type DeviceType = "desktop" | "tablet" | "mobile";

// ─── Device Icons ─────────────────────────────────────────────────────────────

const DEVICES: { key: DeviceType; icon: React.ReactNode }[] = [
  {
    key: "desktop",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    key: "tablet",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="12" y1="18" x2="12" y2="18.01" />
      </svg>
    ),
  },
  {
    key: "mobile",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="12" y1="18" x2="12" y2="18.01" />
      </svg>
    ),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function LayoutDesignerVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-40px" });
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isInView) setMounted(true);
  }, [isInView]);

  return (
    <div
      ref={ref}
      className="relative w-full h-44 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 overflow-hidden flex flex-col items-center justify-center p-4 select-none"
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,currentColor 0,currentColor 1px,transparent 1px,transparent 28px),repeating-linear-gradient(90deg,currentColor 0,currentColor 1px,transparent 1px,transparent 28px)",
        }}
      />

      {/* Device toggle — top-right, icons only */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          mounted ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
        }
        transition={{ duration: 0.3, delay: 0.15 }}
        className="absolute top-2 right-2 z-10 flex items-center gap-0.5 rounded-lg bg-zinc-200/70 dark:bg-zinc-800/70 backdrop-blur-sm border border-black/5 dark:border-white/5 p-0.5"
      >
        {DEVICES.map((d) => {
          const active = device === d.key;
          return (
            <button
              key={d.key}
              onClick={() => setDevice(d.key)}
              className={`p-1.5 rounded-md transition-all duration-300 ${
                active
                  ? "text-[#ef4444] dark:text-blue-400 bg-white dark:bg-zinc-700 shadow-xs"
                  : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              {d.icon}
            </button>
          );
        })}
      </motion.div>

      {/* Browser mock */}
      <motion.div
        animate={{
          opacity: mounted ? 1 : 0,
          y: mounted ? 0 : 20,
        }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
        className="flex items-center justify-center"
      >
        <motion.div
          layout
          transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
          className="rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden"
          style={{
            width:
              device === "desktop"
                ? "100%"
                : device === "tablet"
                  ? "75%"
                  : "55%",
            minWidth: device === "mobile" ? "100px" : "140px",
          }}
        >
          {/* Titlebar */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-100 dark:bg-zinc-900 border-b border-black/5 dark:border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400/80" />
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/80" />
            <span className="w-1.5 h-1.5 rounded-full bg-green-400/80" />
            <motion.div
              animate={{ width: device === "mobile" ? "60%" : "80%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mx-2 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full"
            />
            {device === "mobile" && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-0.5"
              >
                <span className="block w-3 h-0.5 rounded bg-zinc-400" />
                <span className="block w-3 h-0.5 rounded bg-zinc-400" />
                <span className="block w-3 h-0.5 rounded bg-zinc-400" />
              </motion.div>
            )}
          </div>

          {/* Responsive content area */}
          <div className="p-2">
            {device === "desktop" && (
              <motion.div
                key="desktop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-3 gap-1.5"
              >
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05, duration: 0.3 }}
                  className="col-span-2 h-8 rounded-lg bg-red-500/10 border border-red-500/15 flex items-center px-2 gap-1"
                >
                  <div
                    className="h-1 rounded-full bg-red-400/40"
                    style={{ width: 28 }}
                  />
                  <div
                    className="h-1 rounded-full bg-red-400/20"
                    style={{ width: 16 }}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08, duration: 0.3 }}
                  className="h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-black/5 dark:border-white/5 flex items-center justify-center"
                >
                  <div className="w-3 h-3 rounded-full border-2 border-dashed border-red-400/50" />
                </motion.div>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.25 }}
                    className="h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-black/5 dark:border-white/5"
                  />
                ))}
              </motion.div>
            )}

            {device === "tablet" && (
              <motion.div
                key="tablet"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 gap-1.5"
              >
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05, duration: 0.3 }}
                  className="col-span-2 h-7 rounded-lg bg-sky-500/10 border border-sky-500/15 flex items-center px-2 gap-1"
                >
                  <div
                    className="h-1 rounded-full bg-sky-400/40"
                    style={{ width: 32 }}
                  />
                  <div
                    className="h-1 rounded-full bg-sky-400/20"
                    style={{ width: 20 }}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.25 }}
                  className="h-8 rounded-lg bg-sky-500/10 border border-sky-500/15 flex items-center justify-center"
                >
                  <div className="w-3 h-3 rounded-full border-2 border-dashed border-sky-400/50" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.13, duration: 0.25 }}
                  className="h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-black/5 dark:border-white/5"
                />
                {[0, 1].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.16 + i * 0.05, duration: 0.25 }}
                    className="h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-black/5 dark:border-white/5"
                  />
                ))}
              </motion.div>
            )}

            {device === "mobile" && (
              <motion.div
                key="mobile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-1.5"
              >
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, duration: 0.3 }}
                  className="h-6 rounded-lg bg-violet-500/10 border border-violet-500/15 flex items-center px-2"
                >
                  <div
                    className="h-1 rounded-full bg-violet-400/40"
                    style={{ width: 40 }}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="h-12 rounded-lg bg-violet-500/10 border border-violet-500/15 flex items-center justify-center"
                >
                  <div className="w-4 h-4 rounded-full border-2 border-dashed border-violet-400/50" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                  className="h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-black/5 dark:border-white/5"
                />
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.3 }}
                  className="h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-black/5 dark:border-white/5"
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
