'use client'

import { cn } from "@/lib/utils";
import React from "react";

export interface CpuArchitectureSvgProps {
  className?: string;
  style?: React.CSSProperties;
  width?: string;
  height?: string;
  text?: string;
  showCpuConnections?: boolean;
  animateText?: boolean;
}

// ─── Layout ────────────────────────────────────────────────────────────────
// viewBox 0 0 240 160  /  CPU rect x=96 y=60 w=48 h=36
const STUB = 12;
const TOP_PINS:   number[] = [104, 112, 124, 132];
const BOT_PINS:   number[] = [104, 112, 124, 132];
const LEFT_PINS:  number[] = [66,  72,  82,  90];
const RIGHT_PINS: number[] = [66,  72,  82,  90];
const TOP_ENDS:   number[] = [24,  72, 168, 216];
const BOT_ENDS:   number[] = [24,  72, 168, 216];
const LEFT_ENDS:  number[] = [16,  48,  96, 140];
const RIGHT_ENDS: number[] = [16,  48,  96, 140];

const PATHS: string[] = [
  ...TOP_PINS.map((pin, i)   => `M ${TOP_ENDS[i]}   4   V ${60 - STUB} H ${pin}   V 60`),
  ...BOT_PINS.map((pin, i)   => `M ${BOT_ENDS[i]}   156 V ${96 + STUB} H ${pin}   V 96`),
  ...LEFT_PINS.map((pin, i)  => `M 4   ${LEFT_ENDS[i]}  H ${96 - STUB} V ${pin}   H 96`),
  ...RIGHT_PINS.map((pin, i) => `M 236 ${RIGHT_ENDS[i]} H ${144 + STUB} V ${pin}  H 144`),
];

// ─── Rainbow palette for colorful comet wires ───────────────────
const COMET_COLORS = [
  '#ef4444', '#3b82f6', '#22c55e', '#eab308',
  '#a855f7', '#ec4899', '#06b6d4', '#f97316',
  '#ef4444', '#3b82f6', '#22c55e', '#eab308',
  '#a855f7', '#ec4899', '#06b6d4', '#f97316',
];

const TIMING = [
  { name: "a0", dur: "3.8s", delay: "0s"    },
  { name: "a1", dur: "5.2s", delay: "1.4s"  },
  { name: "a2", dur: "3.2s", delay: "2.8s"  },
  { name: "a3", dur: "6.1s", delay: "0.6s"  },
  { name: "a4", dur: "4.7s", delay: "1.9s"  },
  { name: "a5", dur: "2.9s", delay: "4.3s"  },
  { name: "a6", dur: "4.3s", delay: "0.9s"  },
  { name: "a7", dur: "5.8s", delay: "3.3s"  },
  { name: "a8", dur: "3.4s", delay: "0.4s"  },
  { name: "a9", dur: "4.9s", delay: "2.3s"  },
  { name: "a10", dur: "3.7s", delay: "4.8s"  },
  { name: "a11", dur: "2.8s", delay: "1.1s"  },
  { name: "a12", dur: "5.3s", delay: "0.2s"  },
  { name: "a13", dur: "3.9s", delay: "3.6s"  },
  { name: "a14", dur: "3.3s", delay: "1.8s"  },
  { name: "a15", dur: "5.7s", delay: "4.0s"  },
];

const PIN_RECTS = [
  ...TOP_PINS.map(x   => ({ x: x - 1.5, y: 55,      w: 3, h: 6 })),
  ...BOT_PINS.map(x   => ({ x: x - 1.5, y: 95,      w: 3, h: 6 })),
  ...LEFT_PINS.map(y  => ({ x: 88,      y: y - 1.5, w: 8, h: 3 })),
  ...RIGHT_PINS.map(y => ({ x: 143,     y: y - 1.5, w: 8, h: 3 })),
];

const NORM = 100;

// ─── Build CSS keyframes string for inline <style> ─────────────────────────
function buildCometKeyframes(): string {
  let css = "";
  TIMING.forEach((t) => {
    const dn = `cpu-comet-${t.name}`;
    css += `@keyframes ${dn} { from { stroke-dashoffset: 115; } to { stroke-dashoffset: 0; } }\n`;
    css += `.${dn} { animation: ${dn} ${t.dur} ${t.delay} linear infinite; will-change: stroke-dashoffset; }\n`;
  });
  return css;
}

function buildTextKeyframes(): string {
  return `@keyframes cpu-text-color-cycle {
    0%, 100% { fill: #ef4444; }
    25%      { fill: #fef08a; }
    50%      { fill: #fff; }
    75%      { fill: #60a5fa; }
  }
  @keyframes cpu-text-color-cycle-dark {
    0%, 100% { fill: #fbbf24; }
    25%      { fill: #f472b6; }
    50%      { fill: #fff; }
    75%      { fill: #67e8f9; }
  }
  .cpu-text-color {
    animation: cpu-text-color-cycle 4s ease-in-out infinite;
  }
  .dark .cpu-text-color {
    animation: cpu-text-color-cycle-dark 4s ease-in-out infinite;
  }`;
}

// ─── Component ─────────────────────────────────────────────────────────────

export function CpuArchitecture({
  className,
  style,
  width  = "100%",
  height = "100%",
  text   = "CPU",
  showCpuConnections = true,
  animateText = true,
}: CpuArchitectureSvgProps) {
  // 3 visual layers per path (instead of 8) = 62% fewer paint operations
  // Glow effect via stacked opacity, no SVG filters needed

  return (
    <svg
      className={cn(className)}
      style={style}
      width={width}
      height={height}
      viewBox="0 0 240 160"
    >
      <defs>
        <style dangerouslySetInnerHTML={{ __html: buildCometKeyframes() + (animateText ? buildTextKeyframes() : "") }} />
      </defs>

      {/* ── Static wires ── */}
      <g 
        stroke="currentColor" 
        fill="none" 
        strokeWidth="0.4"
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="opacity-[0.12] text-zinc-400 dark:text-zinc-600"
      >
        {PATHS.map((d, i) => <path key={i} d={d} />)}
      </g>

      {/* ── Border dots ── */}
      <g fill="currentColor" className="opacity-[0.25] text-zinc-400 dark:text-zinc-600">
        {TOP_ENDS.map((x, i)   => <circle key={`t${i}`} cx={x}   cy={4}   r="1.2" />)}
        {BOT_ENDS.map((x, i)   => <circle key={`b${i}`} cx={x}   cy={156} r="1.2" />)}
        {LEFT_ENDS.map((y, i)  => <circle key={`l${i}`} cx={4}   cy={y}   r="1.2" />)}
        {RIGHT_ENDS.map((y, i) => <circle key={`r${i}`} cx={236} cy={y}   r="1.2" />)}
      </g>

      {/* ── Comets — CSS animated, color-coded per wire ── */}
      {PATHS.map((d, i) => {
        const cn = `cpu-comet-${TIMING[i].name}`;
        const color = COMET_COLORS[i];

        return (
          <g key={i}>
            {/* Layer 1: Outer glow — wide, soft */}
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={NORM}
              strokeDasharray="0 90 25 0"
              opacity="0.25"
              className={cn}
            />
            {/* Layer 2: Core — bright, narrow */}
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={NORM}
              strokeDasharray="0 109 6 0"
              opacity="0.65"
              className={cn}
            />
            {/* Layer 3: Head — white hot tip */}
            <path
              d={d}
              fill="none"
              stroke="white"
              strokeWidth="0.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={NORM}
              strokeDasharray="0 114 1 0"
              opacity="0.9"
              className={cn}
            />
          </g>
        );
      })}

      {/* ── CPU chip ── */}
      <g>
        {showCpuConnections && (
          <g className="fill-zinc-300 dark:fill-zinc-800">
            {PIN_RECTS.map((p, i) => (
              <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx="0.5" />
            ))}
          </g>
        )}
        <rect x="96" y="60" width="48" height="36" rx="2" className="fill-white dark:fill-[#0d0d0e] stroke-black/5 dark:stroke-white/5" strokeWidth="0.8" />
        <rect x="99" y="63" width="42" height="30" rx="1" fill="none" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="0.5" />
        <text
          x="120" y="79"
          fontSize="8" fontWeight="700"
          textAnchor="middle" dominantBaseline="middle"
          letterSpacing="0.1em"
          className={`font-mono ${animateText ? "cpu-text-color" : "fill-zinc-600 dark:fill-zinc-100"}`}
        >
          {text}
        </text>
      </g>
    </svg>
  );
}

export default CpuArchitecture;
