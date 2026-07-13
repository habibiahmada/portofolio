"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type RequestStep =
  | "idle"
  | "client_to_api"
  | "api_to_cache"
  | "cache_hit"
  | "cache_miss"
  | "api_to_db"
  | "db_response"
  | "api_to_cache_write"
  | "api_to_client"
  | "done";

type VisualPacket = {
  id: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  color: string;
  duration: number;
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
  { id: 1, cx: 30, cy: 75, label: "Client", color: "#ef4444", icon: NODE_ICONS.client, scale: 1 },
  { id: 2, cx: 100, cy: 75, label: "API Gateway", color: "#38bdf8", icon: NODE_ICONS.api, scale: 1 },
  { id: 3, cx: 180, cy: 110, label: "PostgreSQL", color: "#34d399", icon: NODE_ICONS.database, scale: 1.1 },
  { id: 4, cx: 180, cy: 40, label: "Redis Cache", color: "#f472b6", icon: NODE_ICONS.cache, scale: 1 },
];

const LINKS_DATA = [
  { from: 1, to: 2 }, // Client <-> API
  { from: 2, to: 4 }, // API <-> Cache
  { from: 2, to: 3 }, // API <-> DB
];

const REQUEST_TEMPLATES = [
  {
    endpoint: "GET /api/v1/products",
    cacheKey: "products:all",
    sql: "SELECT * FROM products WHERE active = true",
    dbWrite: "products:all",
  },
  {
    endpoint: "GET /api/v1/users/12",
    cacheKey: "user:12",
    sql: "SELECT * FROM users WHERE id = 12 LIMIT 1",
    dbWrite: "user:12",
  },
  {
    endpoint: "GET /api/v1/settings",
    cacheKey: "system:settings",
    sql: "SELECT * FROM settings WHERE env = 'production'",
    dbWrite: "system:settings",
  },
  {
    endpoint: "GET /api/v1/posts/hello-world",
    cacheKey: "post:hello-world",
    sql: "SELECT * FROM posts WHERE slug = 'hello-world'",
    dbWrite: "post:hello-world",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function NodeGraphVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-40px" });
  
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [packets, setPackets] = useState<VisualPacket[]>([]);
  const [activeStep, setActiveStep] = useState<RequestStep>("idle");
  const [queryText, setQueryText] = useState("awaiting request...");
  const [throughput, setThroughput] = useState(0);
  const [lastRequestWasHit, setLastRequestWasHit] = useState(true);

  // --- Real-time request-response loop ---
  useEffect(() => {
    if (!isInView) {
      setActiveStep("idle");
      setPackets([]);
      setQueryText("awaiting request...");
      return;
    }

    let isCancelled = false;
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const runLoop = async () => {
      while (!isCancelled) {
        // --- Step 1: Idle state ---
        setActiveStep("idle");
        setQueryText("awaiting request...");
        await sleep(1500);
        if (isCancelled) break;

        // Choose Hit or Miss & select a random template
        const isHit = Math.random() < 0.4;
        setLastRequestWasHit(isHit);
        const template = REQUEST_TEMPLATES[Math.floor(Math.random() * REQUEST_TEMPLATES.length)];
        
        const clientNode = NODES_DATA[0];
        const apiNode = NODES_DATA[1];
        const cacheNode = NODES_DATA[4 - 1]; // Cache node is index 3
        const dbNode = NODES_DATA[3 - 1];    // DB node is index 2

        // --- Step 2: Client -> API Request ---
        setActiveStep("client_to_api");
        setQueryText(`${template.endpoint}`);
        setPackets([
          {
            id: `p-req-${Date.now()}`,
            fromX: clientNode.cx,
            fromY: clientNode.cy,
            toX: apiNode.cx,
            toY: apiNode.cy,
            color: apiNode.color,
            duration: 0.5,
          },
        ]);
        await sleep(550);
        if (isCancelled) break;

        // --- Step 3: API -> Cache Check ---
        setActiveStep("api_to_cache");
        setQueryText(`${template.endpoint} | CACHE check: ${template.cacheKey}`);
        setPackets([
          {
            id: `p-cache-check-${Date.now()}`,
            fromX: apiNode.cx,
            fromY: apiNode.cy,
            toX: cacheNode.cx,
            toY: cacheNode.cy,
            color: cacheNode.color,
            duration: 0.4,
          },
        ]);
        await sleep(450);
        if (isCancelled) break;

        if (isHit) {
          // --- Cache Hit Path ---
          setActiveStep("cache_hit");
          setQueryText(`CACHE HIT: found ${template.cacheKey}`);
          await sleep(350);
          if (isCancelled) break;

          // Return packet: Cache -> API
          setPackets([
            {
              id: `p-cache-resp-${Date.now()}`,
              fromX: cacheNode.cx,
              fromY: cacheNode.cy,
              toX: apiNode.cx,
              toY: apiNode.cy,
              color: apiNode.color,
              duration: 0.4,
            },
          ]);
          await sleep(450);
          if (isCancelled) break;
        } else {
          // --- Cache Miss Path ---
          setActiveStep("cache_miss");
          setQueryText(`CACHE MISS: key ${template.cacheKey} not found`);
          await sleep(350);
          if (isCancelled) break;

          // Return packet: Cache -> API (miss report)
          setPackets([
            {
              id: `p-cache-miss-resp-${Date.now()}`,
              fromX: cacheNode.cx,
              fromY: cacheNode.cy,
              toX: apiNode.cx,
              toY: apiNode.cy,
              color: "#f59e0b", // amber packet for cache miss return
              duration: 0.4,
            },
          ]);
          await sleep(450);
          if (isCancelled) break;

          // --- Step 4: API -> DB Query ---
          setActiveStep("api_to_db");
          setQueryText(`DB Query: ${template.sql}`);
          setPackets([
            {
              id: `p-db-req-${Date.now()}`,
              fromX: apiNode.cx,
              fromY: apiNode.cy,
              toX: dbNode.cx,
              toY: dbNode.cy,
              color: dbNode.color,
              duration: 0.5,
            },
          ]);
          await sleep(550);
          if (isCancelled) break;

          // --- Step 5: DB Processing & Response ---
          setActiveStep("db_response");
          await sleep(350);
          if (isCancelled) break;

          setPackets([
            {
              id: `p-db-resp-${Date.now()}`,
              fromX: dbNode.cx,
              fromY: dbNode.cy,
              toX: apiNode.cx,
              toY: apiNode.cy,
              color: apiNode.color,
              duration: 0.5,
            },
          ]);
          await sleep(550);
          if (isCancelled) break;

          // --- Step 6: API -> Cache Write ---
          setActiveStep("api_to_cache_write");
          setQueryText(`CACHE write: updating key ${template.cacheKey}`);
          setPackets([
            {
              id: `p-cache-write-${Date.now()}`,
              fromX: apiNode.cx,
              fromY: apiNode.cy,
              toX: cacheNode.cx,
              toY: cacheNode.cy,
              color: cacheNode.color,
              duration: 0.4,
            },
          ]);
          await sleep(450);
          if (isCancelled) break;
        }

        // --- Step 7: API -> Client Response ---
        setActiveStep("api_to_client");
        const latency = isHit ? "3ms" : "42ms";
        setQueryText(`200 OK | Latency: ${latency}`);
        setPackets([
          {
            id: `p-client-resp-${Date.now()}`,
            fromX: apiNode.cx,
            fromY: apiNode.cy,
            toX: clientNode.cx,
            toY: clientNode.cy,
            color: "#10b981", // green for success response
            duration: 0.5,
          },
        ]);
        await sleep(550);
        if (isCancelled) break;

        // Visual completion glow on client
        setActiveStep("done");
        await sleep(1200);
      }
    };

    runLoop();

    return () => {
      isCancelled = true;
    };
  }, [isInView]);

  // --- Throughput cycling ---
  useEffect(() => {
    if (!isInView) {
      setThroughput(0);
      return;
    }

    let rafId: number;
    let startTime = performance.now();

    const animateThroughput = (now: number) => {
      if (now - startTime > 300) {
        startTime = now;
        // Cache hits enable higher throughput (150-220 req/s), DB queries limit it (40-70 req/s)
        const base = lastRequestWasHit ? 160 : 45;
        const randomFactor = lastRequestWasHit ? 50 : 20;
        setThroughput(Math.floor(base + Math.random() * randomFactor));
      }
      rafId = requestAnimationFrame(animateThroughput);
    };
    rafId = requestAnimationFrame(animateThroughput);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [isInView, lastRequestWasHit]);

  const getNode = (id: number) => NODES_DATA.find((n) => n.id === id)!;

  // Interactivity console log
  const getConsoleContent = () => {
    if (activeNode === 1) return "CLIENT: IP 192.168.1.48 | Status: Connected";
    if (activeNode === 2) return "API GATEWAY: Express.js | CPU: 1.2% | Ports: 80, 443";
    if (activeNode === 3) return "POSTGRESQL: Active Connections: 8 | Pool Size: 20";
    if (activeNode === 4) return "REDIS: Status: Active | Hits: 79.4% | Memory: 154 MB";
    return queryText;
  };

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
          key={getConsoleContent()}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="text-[7px] font-mono text-emerald-500/70 dark:text-emerald-400/60 whitespace-nowrap"
        >
          $ {getConsoleContent()}
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
          
          const activePacket = packets.find(
            (p) =>
              (p.fromX === from.cx && p.toX === to.cx) ||
              (p.fromX === to.cx && p.toX === from.cx)
          );
          const hasPacket = !!activePacket;
          const strokeColor = activePacket ? activePacket.color : to.color;

          return (
            <g key={`link-${i}`}>
              <line
                x1={from.cx}
                y1={from.cy}
                x2={to.cx}
                y2={to.cy}
                stroke="currentColor"
                strokeWidth={isHoverActive ? 1.5 : 1}
                strokeOpacity={isHoverActive ? 0.25 : 0.08}
                strokeDasharray={isHoverActive ? undefined : "3 3"}
                className="transition-all duration-300"
              />
              {(isHoverActive || hasPacket) && (
                <line
                  x1={from.cx}
                  y1={from.cy}
                  x2={to.cx}
                  y2={to.cy}
                  stroke={strokeColor}
                  strokeWidth={2}
                  strokeOpacity={0.6}
                  strokeLinecap="round"
                  filter="url(#glow)"
                />
              )}
            </g>
          );
        })}

        {/* Data packets */}
        {packets.map((packet) => {
          return (
            <motion.circle
              key={packet.id}
              r={3}
              fill={packet.color}
              initial={{ cx: packet.fromX, cy: packet.fromY, opacity: 0 }}
              animate={{
                cx: packet.toX,
                cy: packet.toY,
                opacity: [0, 1, 1, 0],
                scale: [0.6, 1.1, 1.1, 0.6],
              }}
              transition={{ duration: packet.duration, ease: "easeInOut" }}
              filter="url(#glow)"
            />
          );
        })}

        {/* Status badges for Cache and DB */}
        <AnimatePresence>
          {activeStep === "cache_hit" && (
            <motion.text
              x={180}
              y={20}
              textAnchor="middle"
              fontSize="7"
              fontWeight="bold"
              fill="#10b981"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 20 }}
              exit={{ opacity: 0 }}
              className="font-mono"
            >
              HIT
            </motion.text>
          )}
          {activeStep === "cache_miss" && (
            <motion.text
              x={180}
              y={20}
              textAnchor="middle"
              fontSize="7"
              fontWeight="bold"
              fill="#f59e0b"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 20 }}
              exit={{ opacity: 0 }}
              className="font-mono"
            >
              MISS
            </motion.text>
          )}
          {(activeStep === "api_to_db" || activeStep === "db_response") && (
            <motion.text
              x={180}
              y={90}
              textAnchor="middle"
              fontSize="7"
              fontWeight="bold"
              fill="#34d399"
              initial={{ opacity: 0, y: 94 }}
              animate={{ opacity: 1, y: 90 }}
              exit={{ opacity: 0 }}
              className="font-mono"
            >
              QUERY
            </motion.text>
          )}
        </AnimatePresence>

        {/* Nodes */}
        {NODES_DATA.map((node, i) => {
          const isHovered = activeNode === node.id;
          
          let isActive = false;
          let activeColor = node.color;
          
          if (node.id === 1) { // Client
            isActive = activeStep === "client_to_api" || activeStep === "api_to_client" || activeStep === "done";
            if (activeStep === "done") activeColor = "#10b981"; // success response glow
          } else if (node.id === 2) { // API
            isActive = activeStep !== "idle" && activeStep !== "done";
          } else if (node.id === 4) { // Cache
            isActive = activeStep === "api_to_cache" || activeStep === "cache_hit" || activeStep === "cache_miss" || activeStep === "api_to_cache_write";
            if (activeStep === "cache_hit") activeColor = "#10b981";
            if (activeStep === "cache_miss") activeColor = "#f59e0b";
          } else if (node.id === 3) { // DB
            isActive = activeStep === "api_to_db" || activeStep === "db_response";
          }

          const showPulse = isHovered || isActive;

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
              {showPulse && (
                <motion.circle
                  cx={node.cx}
                  cy={node.cy}
                  r={14}
                  fill="none"
                  stroke={activeColor}
                  strokeWidth={1.5}
                  initial={{ r: 12, opacity: 0.6 }}
                  animate={{ r: 24, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
                />
              )}

              {/* Hover glow background */}
              {isHovered && (
                <circle cx={node.cx} cy={node.cy} r={20} fill={activeColor} fillOpacity={0.1} />
              )}

              {/* Node outer ring */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={isHovered ? 13 : 11}
                fill={isHovered ? activeColor : "white"}
                fillOpacity={isHovered ? 1 : 0}
                stroke={activeColor}
                strokeWidth={isHovered ? 2.5 : 1.5}
                strokeOpacity={showPulse ? 1 : 0.5}
                className="transition-all duration-300 dark:fill-zinc-950"
              />

              {/* Node SVG icon (scaled wrapper) */}
              <g
                transform={`translate(${node.cx}, ${node.cy}) scale(${node.scale * 0.85})`}
                opacity={showPulse ? 1 : 0.5}
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
                fill={isHovered ? activeColor : "currentColor"}
                fillOpacity={showPulse ? 1 : 0.35}
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
