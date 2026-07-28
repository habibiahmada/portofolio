"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type Step = "idle" | "req" | "cache" | "db" | "ok";

const NODES = [
  { id: "client", x: 28, y: 58, label: "Client", color: "#ef4444" },
  { id: "api", x: 112, y: 58, label: "API", color: "#38bdf8" },
  { id: "cache", x: 196, y: 28, label: "Cache", color: "#f472b6" },
  { id: "db", x: 196, y: 88, label: "Postgres", color: "#34d399" },
] as const;

type NodeId = (typeof NODES)[number]["id"];

const NODE_MAP = Object.fromEntries(NODES.map((n) => [n.id, n])) as Record<
  NodeId,
  (typeof NODES)[number]
>;

const EDGES: [NodeId, NodeId][] = [
  ["client", "api"],
  ["api", "cache"],
  ["api", "db"],
];

const FLOW: { step: Step; from: (typeof NODES)[number]["id"]; to: (typeof NODES)[number]["id"]; msg: string; ms: number }[] = [
  { step: "req", from: "client", to: "api", msg: "GET /api/v1/projects", ms: 700 },
  { step: "cache", from: "api", to: "cache", msg: "CACHE MISS · projects:list", ms: 650 },
  { step: "db", from: "api", to: "db", msg: "SELECT * FROM projects …", ms: 800 },
  { step: "ok", from: "api", to: "client", msg: "200 OK · 38ms", ms: 700 },
];

export function NodeGraphVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState<Step>("idle");
  const [msg, setMsg] = useState("awaiting request…");
  const [packet, setPacket] = useState<{
    key: number;
    from: (typeof NODES)[number];
    to: (typeof NODES)[number];
    color: string;
  } | null>(null);

  useEffect(() => {
    if (!isInView) return;
    if (reduceMotion) {
      setStep("ok");
      setMsg("200 OK · 38ms");
      return;
    }

    let cancelled = false;
    let key = 0;

    const sleep = (ms: number) =>
      new Promise((r) => setTimeout(r, ms));

    const loop = async () => {
      while (!cancelled) {
        setStep("idle");
        setPacket(null);
        setMsg("awaiting request…");
        await sleep(1200);
        if (cancelled) break;

        for (const f of FLOW) {
          if (cancelled) break;
          const from = NODE_MAP[f.from];
          const to = NODE_MAP[f.to];
          key += 1;
          setStep(f.step);
          setMsg(f.msg);
          setPacket({
            key,
            from,
            to,
            color: f.step === "ok" ? "#10b981" : to.color,
          });
          await sleep(f.ms);
        }
        await sleep(900);
      }
    };

    loop();
    return () => {
      cancelled = true;
    };
  }, [isInView, reduceMotion]);

  const activeIds = new Set<string>();
  if (step === "req") {
    activeIds.add("client");
    activeIds.add("api");
  } else if (step === "cache") {
    activeIds.add("api");
    activeIds.add("cache");
  } else if (step === "db") {
    activeIds.add("api");
    activeIds.add("db");
  } else if (step === "ok") {
    activeIds.add("api");
    activeIds.add("client");
  }

  return (
    <div
      ref={ref}
      className="relative w-full h-44 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 overflow-hidden select-none"
    >
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,currentColor 0,currentColor 1px,transparent 1px,transparent 16px),repeating-linear-gradient(90deg,currentColor 0,currentColor 1px,transparent 1px,transparent 16px)",
        }}
      />

      <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[8px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
          live
        </span>
      </div>

      <div className="absolute bottom-2 left-2 right-2 overflow-hidden">
        <motion.span
          key={msg}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="block text-[7px] font-mono text-emerald-600/80 dark:text-emerald-400/70 truncate"
        >
          $ {msg}
        </motion.span>
      </div>

      <svg viewBox="0 0 224 130" className="w-full h-full" aria-hidden>
        <defs>
          <filter id="ng-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {EDGES.map(([a, b]) => {
          const from = NODE_MAP[a];
          const to = NODE_MAP[b];
          const lit = activeIds.has(a) && activeIds.has(b);
          return (
            <line
              key={`${a}-${b}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={lit ? to.color : "currentColor"}
              strokeWidth={lit ? 1.6 : 1}
              strokeOpacity={lit ? 0.55 : 0.12}
              strokeDasharray={lit ? undefined : "3 3"}
              className="transition-all duration-300"
            />
          );
        })}

        {packet && !reduceMotion && (
          <motion.circle
            key={packet.key}
            r={3}
            fill={packet.color}
            filter="url(#ng-glow)"
            initial={{
              cx: packet.from.x,
              cy: packet.from.y,
              opacity: 0,
            }}
            animate={{
              cx: packet.to.x,
              cy: packet.to.y,
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
          />
        )}

        {NODES.map((node, i) => {
          const on = activeIds.has(node.id) || step === "idle";
          return (
            <motion.g
              key={node.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.05 + i * 0.06, duration: 0.35 }}
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            >
              {activeIds.has(node.id) && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={16}
                  fill={node.color}
                  fillOpacity={0.12}
                />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={10}
                fill="white"
                stroke={node.color}
                strokeWidth={activeIds.has(node.id) ? 2 : 1.25}
                strokeOpacity={on ? 1 : 0.45}
                className="dark:fill-zinc-950"
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={3.5}
                fill={node.color}
                fillOpacity={activeIds.has(node.id) ? 1 : 0.55}
              />
              <text
                x={node.x}
                y={node.y + 22}
                textAnchor="middle"
                fontSize="7.5"
                fontFamily="ui-monospace, monospace"
                fontWeight={600}
                fill="currentColor"
                fillOpacity={activeIds.has(node.id) ? 0.7 : 0.35}
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
