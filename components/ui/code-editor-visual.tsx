"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// ─── Component ────────────────────────────────────────────────────────────────

export function CodeEditorVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-40px" });

  const codeLines = [
    { text: "const Portfolio = () => {", delay: 0 },
    { text: "  const [data, setData]", delay: 0.22 },
    { text: "    = useState(null)", delay: 0.4 },
    { text: "", delay: 0.55 },
    { text: "  return (", delay: 0.65 },
    { text: "    <BentoGrid data={data} />", delay: 0.82 },
    { text: "  )", delay: 0.96 },
    { text: "}", delay: 1.08 },
  ];

  const highlight = (text: string) =>
    text
      .replace(/\b(const|return)\b/g, '<span style="color:#ef4444">$1</span>')
      .replace(/\b(useState)\b/g, '<span style="color:#38bdf8">$1</span>')
      .replace(
        /<(BentoGrid[^>]*)>/g,
        '<span style="color:#34d399">&lt;$1&gt;</span>',
      );

  return (
    <div
      ref={ref}
      className="w-full h-44 rounded-xl overflow-hidden bg-zinc-950 border border-white/5 flex flex-col select-none"
    >
      {/* Titlebar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5 shrink-0">
        <span className="w-2 h-2 rounded-full bg-red-500/80" />
        <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
        <span className="w-2 h-2 rounded-full bg-green-500/80" />
        <span className="ml-2 text-[9px] font-mono text-zinc-500">
          portfolio.tsx
        </span>
        <div className="ml-auto flex gap-1">
          <div className="h-1.5 w-8 bg-white/5 rounded" />
          <div className="h-1.5 w-4 bg-white/5 rounded" />
        </div>
      </div>

      {/* Code lines */}
      <div className="flex-1 px-4 py-3 font-mono text-[11px] text-zinc-400 leading-relaxed overflow-hidden">
        {codeLines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            transition={{ delay: line.delay, duration: 0.35, ease: "easeOut" }}
            className="flex gap-3 min-h-[1.4em]"
          >
            <span className="text-zinc-700 shrink-0 w-4 text-right">
              {i + 1}
            </span>
            <span
              className="whitespace-pre"
              dangerouslySetInnerHTML={{ __html: highlight(line.text) }}
            />
          </motion.div>
        ))}
        {/* Blinking cursor */}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.1, repeat: Infinity }}
          className="inline-block w-1.5 h-3 bg-red-400 ml-12 -mt-1"
        />
      </div>
    </div>
  );
}
