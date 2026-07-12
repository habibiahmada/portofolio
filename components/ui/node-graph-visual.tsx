"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type PulsePacket = {
  from: number;
  to: number;
  id: number;
};

// ─── Node Data with SVG Icons ─────────────────────────────────────────────────

const NODE_ICONS = {
  client: (
    <g>
      <rect x="-6" y="-5" width="12" height="10" rx="1.5" fill="currentColor" />
      <line x1="-3" y1="5" x2="3" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="0" y1="-5" x2="0" y2="-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  ),
  api: (
    <g>
      <path d="M-4,-4 L4,-4 L4,4 L-4,4 Z" fill="currentColor" fillOpacity="0.3" />
      <path d="M-2,-6 L2,-6 L2,-2 L-2,-2 Z" fill="currentColor" />
      <path d="M-2,2 L2,2 L2,6 L-2,6 Z" fill="currentColor" />
      <circle cx="0" cy="-4" r="1" fill="white" />
      <circle cx="0" cy="4" r="1" fill="white" />
    </g>
  ),
  database: (
    <g>
      <ellipse cx="0" cy="-4" rx="5" ry="2.5" fill="currentColor" fillOpacity="0.3" />
      <path d="M-5,-4 L-5,4 A5 2.5 0 0 0 5,4 L5,-4" fill="currentColor" fillOpacity="0.15" />
      <ellipse cx="0" cy="-4" rx="5" ry="2.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="0" cy="4" rx="5" ry="2.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <line x1="-5" y1="0" x2="5" y2="0" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
    </g>
  ),
  cache: (
    <g>
      <path d="M-2,-5 L3,-1 L1,-1 L2,5 L-3,1 L-1,1 L-2,-5 Z" fill="currentColor" />
    </g>
  ),
} as const;

const NODES_DATA = [
  { id: 1, cx: 36, cy: 75, label: "Client", color: "#ef4444", icon: NODE_ICONS.client, scale: 1 },
  { id: 2, cx: 112, cy: 34, label: "API", color: "#38bdf8", icon: NODE_ICONS.api, scale: 1 },
  { id: 3, cx: 112, cy: 116, label: "DB", color: "#34d399", icon: NODE_ICONS.database, scale: 1.1 },
  { id: 4, cx: 188, cy: 75, label: "Cache", color: "#f472b6", icon: NODE_ICONS.cache, scale: 1 },
];

const LINKS_DATA = [
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 4 },
  { from: 3, to: 4 },
  { from: 2, to: 3 },
];

const DB_QUERIES = [
  "SELECT * FROM users",
  "INSERT INTO sessions",
  "UPDATE cache SET",
  "DELETE expired",
  "JOIN orders ON",
];

// ─── Component ────────────────────────────────────────────────────────────────

export function NodeGraphVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-40px" });
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [packets, setPackets] = useState<PulsePacket[]>([]);
  const [queryText, setQueryText] = useState("");
  const [throughput, setThroughput] = useState(0);
  const packetIdRef = useRef(0);

  // --- Continuous data packet flow ---
  useEffect(() => {
    if (!isInView) {
      setPackets([]);
      return;
    }

    const spawnPacket = () => {
      const link = LINKS_DATA[Math.floor(Math.random() * LINKS_DATA.length)];
      const id = packetIdRef.current++;
      setPackets((prev) => [...prev.slice(-4), { ...link, id }]);

      setTimeout(() => {
        setPackets((prev) => prev.filter((p) => p.id !== id));
      }, 900);
    };

    const intervals = [400, 550, 700, 850].map((delay) =>
      setInterval(spawnPacket, delay + Math.random() * 200)
    );

    return () => intervals.forEach(clearInterval);
  }, [isInView]);

  // --- Database queries & throughput cycling ---
  useEffect(() => {
    if (!isInView) {
      setQueryText("");
      setThroughput(0);
      return;
    }

    let idx = 0;
    let rafId: number;
    let startTime = performance.now();

    const animateThroughput = (now: number) => {
      if (now - startTime > 200) {
        startTime = now;
        setThroughput(Math.floor(40 + Math.random() * 60));
      }
      rafId = requestAnimationFrame(animateThroughput);
    };
    rafId = requestAnimationFrame(animateThroughput);

    const queryInterval = setInterval(() => {
      idx = (idx + 1) % DB_QUERIES.length;
      setQueryText(DB_QUERIES[idx]);
    }, 1800);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(queryInterval);
    };
  }, [isInView]);

  const getNode = (id: number) => NODES_DATA.find((n) => n.id === id)!;

  return (
    <div
      ref={ref}
      className="relative w-full h-44 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 overflow-hidden select-none"
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,currentColor 0,currentColor 1px,transparent 1px,transparent 18px),repeating-linear-gradient(90deg,currentColor 0,currentColor 1px,transparent 1px,transparent 18px)",
        }}
      />

      {/* Top-right: throughput badge */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20"
      >
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full bg-emerald-500"
        />
        <span className="text-[8px] font-mono text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">
          {throughput} req/s
        </span>
      </motion.div>

      {/* Bottom-left: current query */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="absolute bottom-2 left-2 max-w-[90%] overflow-hidden"
      >
        <motion.span
          key={queryText}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="text-[7px] font-mono text-emerald-500/70 dark:text-emerald-400/60 whitespace-nowrap"
        >
          $ {queryText}
        </motion.span>
      </motion.div>

      {/* SVG graph */}
      <svg viewBox="0 0 224 150" className="w-full h-full">
        {/* Glow filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Links */}
        {LINKS_DATA.map((link, i) => {
          const from = getNode(link.from);
          const to = getNode(link.to);
          const isHoverActive = activeNode === link.from || activeNode === link.to;
          const hasPacket = packets.some((p) => p.from === link.from && p.to === link.to);
          return (
            <g key={`link-${i}`}>
              <line
                x1={from.cx}
                y1={from.cy}
                x2={to.cx}
                y2={to.cy}
                stroke="currentColor"
                strokeWidth={isHoverActive ? 1.5 : 1}
                strokeOpacity={isHoverActive ? 0.2 : 0.08}
                strokeDasharray={isHoverActive ? undefined : "3 3"}
                className="transition-all duration-300"
              />
              {(isHoverActive || hasPacket) && (
                <line
                  x1={from.cx}
                  y1={from.cy}
                  x2={to.cx}
                  y2={to.cy}
                  stroke={to.color}
                  strokeWidth={2}
                  strokeOpacity={0.5}
                  strokeLinecap="round"
                  filter="url(#glow)"
                />
              )}
            </g>
          );
        })}

        {/* Data packets */}
        {packets.map((packet) => {
          const from = getNode(packet.from);
          const to = getNode(packet.to);
          return (
            <motion.circle
              key={packet.id}
              r={3.5}
              fill={to.color}
              initial={{ cx: from.cx, cy: from.cy, opacity: 0 }}
              animate={{
                cx: [from.cx, (from.cx + to.cx) / 2, to.cx],
                cy: [from.cy, (from.cy + to.cy) / 2 - 6, to.cy],
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.2, 1, 0.5],
              }}
              transition={{ duration: 0.85, ease: "easeInOut" }}
              filter="url(#glow)"
            />
          );
        })}

        {/* Nodes */}
        {NODES_DATA.map((node, i) => {
          const isHovered = activeNode === node.id;
          const hasPacket = packets.some((p) => p.from === node.id || p.to === node.id);

          return (
            <motion.g
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{
                delay: 0.1 + i * 0.08,
                duration: 0.45,
                ease: [0.175, 0.885, 0.32, 1.275],
              }}
              style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => setActiveNode(null)}
              className="cursor-pointer"
            >
              {/* Pulse ring when active */}
              {(isHovered || hasPacket) && (
                <motion.circle
                  cx={node.cx}
                  cy={node.cy}
                  r={14}
                  fill="none"
                  stroke={node.color}
                  strokeWidth={1.5}
                  initial={{ r: 12, opacity: 0.6 }}
                  animate={{ r: 24, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
                />
              )}

              {/* Hover glow background */}
              {isHovered && (
                <circle cx={node.cx} cy={node.cy} r={20} fill={node.color} fillOpacity={0.1} />
              )}

              {/* Node outer ring */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={isHovered ? 13 : 11}
                fill={isHovered ? node.color : "white"}
                fillOpacity={isHovered ? 1 : 0}
                stroke={node.color}
                strokeWidth={isHovered ? 2.5 : 1.5}
                strokeOpacity={isHovered || hasPacket ? 1 : 0.5}
                className="transition-all duration-300 dark:fill-zinc-950"
              />

              {/* Node SVG icon (scaled wrapper) */}
              <g
                transform={`translate(${node.cx}, ${node.cy}) scale(${node.scale * 0.85})`}
                opacity={isHovered || hasPacket ? 1 : 0.5}
                className="transition-all duration-300"
              >
                {node.icon}
              </g>

              {/* Node label */}
              <text
                x={node.cx}
                y={node.cy + 26}
                textAnchor="middle"
                fontSize="8"
                fontFamily="ui-monospace, monospace"
                fontWeight={isHovered ? 700 : 500}
                fill={isHovered ? node.color : "currentColor"}
                fillOpacity={isHovered || hasPacket ? 1 : 0.35}
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
