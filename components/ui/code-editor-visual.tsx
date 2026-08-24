"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const LINES = [
  { n: 1, parts: [
    { t: "export ", c: "kw" },
    { t: "function ", c: "kw" },
    { t: "App", c: "fn" },
    { t: "() {", c: "plain" },
  ]},
  { n: 2, parts: [
    { t: "  ", c: "plain" },
    { t: "return", c: "kw" },
    { t: " (", c: "plain" },
  ]},
  { n: 3, parts: [
    { t: "    <", c: "plain" },
    { t: "Shell", c: "tag" },
    { t: ">", c: "plain" },
  ]},
  { n: 4, parts: [
    { t: "      <", c: "plain" },
    { t: "Hero", c: "tag" },
    { t: " ", c: "plain" },
    { t: "priority", c: "attr" },
    { t: " />", c: "plain" },
  ]},
  { n: 5, parts: [
    { t: "      <", c: "plain" },
    { t: "Projects", c: "tag" },
    { t: " ", c: "plain" },
    { t: "data", c: "attr" },
    { t: "={", c: "plain" },
    { t: "items", c: "var" },
    { t: "} />", c: "plain" },
  ]},
  { n: 6, parts: [
    { t: "    </", c: "plain" },
    { t: "Shell", c: "tag" },
    { t: ">", c: "plain" },
  ]},
  { n: 7, parts: [
    { t: "  )", c: "plain" },
  ]},
  { n: 8, parts: [
    { t: "}", c: "plain" },
  ]},
];

const COLOR = {
  kw: "text-brand dark:text-sky-400",
  fn: "text-amber-600 dark:text-amber-300",
  tag: "text-emerald-600 dark:text-emerald-400",
  attr: "text-sky-600 dark:text-violet-300",
  var: "text-zinc-600 dark:text-zinc-300",
  plain: "text-zinc-500 dark:text-zinc-400",
} as const;

export function CodeEditorVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className="w-full h-44 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-black/5 dark:border-white/5 flex flex-col select-none"
    >
      {/* Titlebar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-black/5 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900/80 shrink-0">
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400/80" />
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
        </div>
        <div className="flex items-center gap-1.5 ml-1">
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-brand/10 text-brand border border-brand/15">
            app/page.tsx
          </span>
          <span className="text-[8px] font-mono text-muted-foreground/40 hidden sm:inline">
            TSX
          </span>
        </div>
        <div className="ml-auto text-[8px] font-mono text-muted-foreground/40">
          Next.js
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Gutter strip */}
        <div className="w-7 shrink-0 border-r border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/40 py-2.5 flex flex-col items-end pr-1.5 gap-[0.15rem]">
          {LINES.map((line) => (
            <span
              key={line.n}
              className="text-[9px] font-mono leading-[1.35] text-zinc-400/60 dark:text-zinc-600"
            >
              {line.n}
            </span>
          ))}
        </div>

        {/* Code */}
        <div className="flex-1 px-3 py-2.5 font-mono text-[10px] leading-[1.35] overflow-hidden">
          {LINES.map((line, i) => (
            <motion.div
              key={line.n}
              initial={reduceMotion ? false : { opacity: 0, x: -6 }}
              animate={
                isInView
                  ? { opacity: 1, x: 0 }
                  : reduceMotion
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: -6 }
              }
              transition={{
                delay: reduceMotion ? 0 : i * 0.08,
                duration: 0.3,
                ease: "easeOut",
              }}
              className="whitespace-pre"
            >
              {line.parts.map((p, j) => (
                <span key={j} className={COLOR[p.c as keyof typeof COLOR]}>
                  {p.t}
                </span>
              ))}
            </motion.div>
          ))}
          <motion.span
            animate={
              reduceMotion || !isInView
                ? { opacity: 1 }
                : { opacity: [1, 0, 1] }
            }
            transition={{ duration: 1, repeat: Infinity }}
            className="inline-block w-1.5 h-3 bg-brand ml-0.5 align-middle"
          />
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-2 px-3 py-1 border-t border-black/5 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900/60 text-[8px] font-mono text-muted-foreground/50">
        <span className="text-emerald-600 dark:text-emerald-400">●</span>
        <span>main</span>
        <span className="ml-auto">React 19</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}
