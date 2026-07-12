"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ─── Component 1: Web Design Wireframe Visual ─────────────────────────────────

export function LayoutDesignerVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-40px" });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // ── Trigger mount animation once ──
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (isInView) setMounted(true);
  }, [isInView]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 10;
    const y = (e.clientY - rect.top - rect.height / 2) / 10;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-44 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 overflow-hidden flex items-center justify-center p-5 cursor-pointer select-none"
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,currentColor 0,currentColor 1px,transparent 1px,transparent 28px),repeating-linear-gradient(90deg,currentColor 0,currentColor 1px,transparent 1px,transparent 28px)",
        }}
      />

      {/* Browser mock — no key={cycle}, uses repeat animation */}
      <motion.div
        animate={
          mounted
            ? { opacity: 1, y: 0, rotateX: -tilt.y, rotateY: tilt.x }
            : { opacity: 0, y: 20 }
        }
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
        style={{ perspective: 700 }}
        className="w-full items-center justify-center flex flex-col gap-3"
      >
        <div className="rounded-xl border min-w-3xl border-black/8 dark:border-white/8 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden">
          {/* Titlebar */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-zinc-100 dark:bg-zinc-900 border-b border-black/5 dark:border-white/5">
            <span className="w-2 h-2 rounded-full bg-red-400/80" />
            <span className="w-2 h-2 rounded-full bg-yellow-400/80" />
            <span className="w-2 h-2 rounded-full bg-green-400/80" />
            {/* URL bar — infinite pulse animation */}
            <motion.div
              initial={{ width: "20%" }}
              animate={{ width: "80%" }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeOut",
              }}
              className="mx-3 h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-full"
            />
          </div>

          {/* Layout wireframe — single mount, continuous shimmer */}
          <div className="p-3 grid grid-cols-3 gap-2">
            <motion.div
              animate={mounted ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              initial={{ opacity: 0, x: -10 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="col-span-2 h-10 rounded-lg bg-rose-500/10 border border-rose-500/15 flex items-center px-2 gap-1.5"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 40 }}
                transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                className="h-1.5 rounded-full bg-rose-400/40"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 24 }}
                transition={{ delay: 0.55, duration: 0.4, ease: "easeOut" }}
                className="h-1.5 rounded-full bg-rose-400/20"
              />
            </motion.div>

            <motion.div
              animate={mounted ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
              initial={{ opacity: 0, x: 10 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-black/5 dark:border-white/5 flex items-center justify-center"
            >
              {/* Spinning icon — uses repeat: Infinity instead of key cycle */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  delay: 0.5,
                  duration: 2,
                  ease: "linear",
                  repeat: Infinity,
                }}
                className="w-4 h-4 rounded-full border-2 border-dashed border-rose-400/50"
              />
            </motion.div>

            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                initial={{ opacity: 0, y: 8 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                className="h-6 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-black/5 dark:border-white/5 overflow-hidden"
              >
                {/* Shimmer sweep — continuous loop */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{
                    delay: 0.6 + i * 0.15,
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 2.5,
                  }}
                  className="h-full w-1/2 bg-linear-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Component 2: Code Editor Visual ─────────────────────────────────────────

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
      .replace(/\b(const|return)\b/g, '<span style="color:#f43f5e">$1</span>')
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

      {/* Code lines — typed once, no key={cycle} */}
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
          className="inline-block w-1.5 h-3 bg-rose-400 ml-12 -mt-1"
        />
      </div>
    </div>
  );
}

// ─── Component 3: Performance Gauge Visual ────────────────────────────────────

export function SpeedometerGaugeVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-40px" });
  const [score, setScore] = useState(0);
  const [metricsVisible, setMetricsVisible] = useState(false);

  // Use requestAnimationFrame-based animation instead of 18ms setInterval
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
      {/* Single flex row — flexbox centers both as a group */}
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

        {/* Metrics — in normal flow so flex centers the whole group */}
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

// ─── Component 4: Node Graph Visual ──────────────────────────────────────────

export function NodeGraphVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-40px" });
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const pulseRef = useRef<{ from: number; to: number } | null>(null);
  const [, forceRender] = useState(0);

  const nodes = [
    { id: 1, cx: 44, cy: 75, label: "Client", color: "#f43f5e" },
    { id: 2, cx: 124, cy: 34, label: "Server", color: "#38bdf8" },
    { id: 3, cx: 124, cy: 116, label: "DB", color: "#34d399" },
    { id: 4, cx: 204, cy: 75, label: "Cache", color: "#f472b6" },
  ];

  const links = [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 4 },
  ];

  // Looping data pulse — use refs to avoid re-render every 1.2s
  useEffect(() => {
    if (!isInView) return;
    let idx = 0;
    const step = () => {
      const link = links[idx % links.length];
      pulseRef.current = link;
      forceRender((c) => c + 1); // only re-render when pulse changes
      idx++;
    };
    step();
    const id = setInterval(step, 1200);
    return () => {
      clearInterval(id);
      pulseRef.current = null;
    };
  }, [isInView]);

  const pulse = pulseRef.current;

  return (
    <div
      ref={ref}
      className="w-full h-44 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center overflow-hidden select-none"
    >
      <svg viewBox="0 0 248 150" className="w-full h-full max-w-65">
        {links.map((link, i) => {
          const from = nodes.find((n) => n.id === link.from)!;
          const to = nodes.find((n) => n.id === link.to)!;
          const isHoverActive =
            activeNode === link.from || activeNode === link.to;
          const isPulsing = pulse?.from === link.from && pulse?.to === link.to;
          return (
            <g key={i}>
              <motion.line
                x1={from.cx}
                y1={from.cy}
                x2={to.cx}
                y2={to.cy}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{
                  delay: 0.2 + i * 0.12,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                stroke={isHoverActive ? to.color : "currentColor"}
                strokeWidth={isHoverActive ? 1.5 : 1}
                strokeOpacity={isHoverActive ? 0.7 : 0.15}
                strokeDasharray={isHoverActive ? undefined : "4 4"}
                className="transition-all duration-300"
              />
              {isPulsing && isInView && (
                <motion.circle
                  r={3}
                  fill={to.color}
                  initial={{ cx: from.cx, cy: from.cy, opacity: 1 }}
                  animate={{ cx: to.cx, cy: to.cy, opacity: [1, 1, 0] }}
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                />
              )}
            </g>
          );
        })}

        {nodes.map((node, i) => {
          const isHovered = activeNode === node.id;
          const isPulseNode = pulse?.from === node.id || pulse?.to === node.id;
          return (
            <motion.g
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{
                delay: 0.1 + i * 0.1,
                duration: 0.5,
                ease: [0.175, 0.885, 0.32, 1.275],
              }}
              style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => setActiveNode(null)}
              className="cursor-pointer"
            >
              {isPulseNode && (
                <motion.circle
                  cx={node.cx}
                  cy={node.cy}
                  r={14}
                  fill="none"
                  stroke={node.color}
                  strokeWidth={1.5}
                  initial={{ r: 11, opacity: 0.8 }}
                  animate={{ r: 22, opacity: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                />
              )}
              {isHovered && (
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={18}
                  fill={node.color}
                  fillOpacity={0.08}
                />
              )}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={isHovered ? 13 : 11}
                fill={isHovered ? node.color : "white"}
                fillOpacity={isHovered ? 1 : 0}
                stroke={node.color}
                strokeWidth={isHovered ? 2 : 1.5}
                strokeOpacity={isHovered ? 1 : 0.5}
                className="transition-all duration-300 dark:fill-zinc-900"
              />
              <circle
                cx={node.cx}
                cy={node.cy}
                r={4}
                fill={node.color}
                fillOpacity={isPulseNode ? 1 : isHovered ? 1 : 0.6}
                className="transition-all duration-300"
              />
              <text
                x={node.cx}
                y={node.cy + 26}
                textAnchor="middle"
                fontSize="8"
                fontFamily="ui-monospace, monospace"
                fontWeight={isHovered ? 700 : 500}
                fill={isHovered ? node.color : "currentColor"}
                fillOpacity={isHovered ? 1 : 0.4}
                className="transition-all duration-300"
              >
                {node.label}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Component 5: CI/CD Pipeline Visual ───────────────────────────────────────

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
          <line x1="7" y1="4" x2="7" y2="0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="7" y1="10" x2="7" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      color: "text-rose-500",
      bgActive: "bg-rose-500/10 ring-rose-500/50",
      desc: "push",
    },
    {
      id: 1,
      label: "Build",
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="2" y="2" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <line x1="4" y1="7" x2="10" y2="7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="7" y1="4" x2="7" y2="10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
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
          <path d="M3 7.5L6 10.5L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
          <path d="M7 1L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M11 6L7 1L3 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="1" y1="12" x2="13" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
            <div key={stage.id} className="flex items-center flex-1 last:flex-none">
              {/* Stage node + label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
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
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7.5L6 10.5L11 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                    {/* Background track */}
                    <div className="absolute inset-0 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                    {/* Active fill */}
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
