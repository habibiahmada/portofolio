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

// Accent colour for each comet (saturated base, head will be white)
const ACCENT = [
  "#f97316","#60a5fa","#a78bfa","#facc15",
  "#34d399","#f472b6","#38bdf8","#fb923c",
  "#818cf8","#fbbf24","#4ade80","#e879f9",
  "#f87171","#67e8f9","#a3e635","#c084fc",
];

const TIMING = [
  { dur: "3.8s", delay: "0s"    },
  { dur: "5.2s", delay: "1.4s"  },
  { dur: "3.2s", delay: "2.8s"  },
  { dur: "6.1s", delay: "0.6s"  },
  { dur: "4.7s", delay: "1.9s"  },
  { dur: "2.9s", delay: "4.3s"  },
  { dur: "4.3s", delay: "0.9s"  },
  { dur: "5.8s", delay: "3.3s"  },
  { dur: "3.4s", delay: "0.4s"  },
  { dur: "4.9s", delay: "2.3s"  },
  { dur: "3.7s", delay: "4.8s"  },
  { dur: "2.8s", delay: "1.1s"  },
  { dur: "5.3s", delay: "0.2s"  },
  { dur: "3.9s", delay: "3.6s"  },
  { dur: "3.3s", delay: "1.8s"  },
  { dur: "5.7s", delay: "4.0s"  },
];

const PIN_RECTS = [
  ...TOP_PINS.map(x   => ({ x: x - 1.5, y: 55,      w: 3, h: 6 })),
  ...BOT_PINS.map(x   => ({ x: x - 1.5, y: 95,      w: 3, h: 6 })),
  ...LEFT_PINS.map(y  => ({ x: 88,      y: y - 1.5, w: 8, h: 3 })),
  ...RIGHT_PINS.map(y => ({ x: 143,     y: y - 1.5, w: 8, h: 3 })),
];

// ─── Comet technique ───────────────────────────────────────────────────────
// pathLength="100" normalises every path.
// CRITICAL: both from/to must stay same-sign to avoid browser interpolation bugs.
// We use from="110" to="0" — comet enters from start, exits cleanly at end.
// dasharray: [HEAD_LEN, GAP, TAIL_LEN, BIG_GAP]
//   HEAD = white spark at front
//   GAP  = space between head and tail
//   TAIL = coloured streak behind
//   BIG_GAP = rest of path (empty)
//
// For the tail fade effect we use two passes:
//   Pass A (tail): TAIL_LEN dash, colour, thinner
//   Pass B (head): HEAD_LEN dash, white, thicker — offset by -TAIL_LEN so it leads
//
// Both animate dashoffset from 110 → 0 (all positive, no sign flip = no stutter)
const TAIL_LEN  = 12;   // colour tail length
const HEAD_LEN  = 1.8;  // white spark length
const NORM      = 100;  // pathLength normalisation

export function CpuArchitecture({
  className,
  style,
  width  = "100%",
  height = "100%",
  text   = "DEV",
  showCpuConnections = true,
  animateText = true,
}: CpuArchitectureSvgProps) {
  return (
    <svg
      className={cn(className)}
      style={style}
      width={width}
      height={height}
      viewBox="0 0 240 160"
    >
      {/* ── Static wires ─────────────────────────────────────────────── */}
      <g stroke="currentColor" fill="none" strokeWidth="0.5"
         strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
        {PATHS.map((d, i) => <path key={i} d={d} />)}
      </g>

      {/* ── Border dots ──────────────────────────────────────────────── */}
      <g fill="currentColor" opacity="0.4">
        {TOP_ENDS.map((x, i)   => <circle key={`t${i}`} cx={x}   cy={4}   r="1.8" />)}
        {BOT_ENDS.map((x, i)   => <circle key={`b${i}`} cx={x}   cy={156} r="1.8" />)}
        {LEFT_ENDS.map((y, i)  => <circle key={`l${i}`} cx={4}   cy={y}   r="1.8" />)}
        {RIGHT_ENDS.map((y, i) => <circle key={`r${i}`} cx={236} cy={y}   r="1.8" />)}
      </g>

      {/* ── Comets ───────────────────────────────────────────────────────
          Eight stacked layers per path to construct a delicate, razor-sharp gradient.
          All layers end at the leading edge (115) and animate with the exact
          same stroke-dashoffset range (from="115" to="0") so they move in perfect
          unison, fixing the jiggle bug.
          Using ultra-thin widths (from 0.4px to 2.2px) makes the flashes look like
          real electrical sparks rather than thick glowing worms.
      ── */}
      {PATHS.map((d, i) => {
        const { dur, delay } = TIMING[i];
        
        // Exact synchronization parameters (total period = 115)
        const FROM = "115";
        const TO = "0";
        
        const outerGlowDashArray = "0 90 25 0";  // covers [90, 115] (widest soft glow, length 25)
        const midGlow1DashArray = "0 94 21 0";   // covers [94, 115] (medium outer glow, length 21)
        const midGlow2DashArray = "0 98 17 0";   // covers [98, 115] (medium inner glow, length 17)
        const tail1DashArray = "0 102 13 0";     // covers [102, 115] (outer tail, length 13)
        const tail2DashArray = "0 106 9 0";      // covers [106, 115] (main tail, length 9)
        const core1DashArray = "0 109 6 0";      // covers [109, 115] (outer core, length 6)
        const core2DashArray = "0 112 3 0";      // covers [112, 115] (intense core, length 3)
        const headDashArray = "0 114 1 0";       // covers [114, 115] (white hot head, length 1)

        return (
          <g key={i}>
            {/* Layer 1: Very Wide Outer Glow (Low opacity, heavy blur) */}
            <path
              d={d}
              fill="none"
              stroke={ACCENT[i]}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={NORM}
              strokeDasharray={outerGlowDashArray}
              opacity="0.12"
              filter="url(#cpu-glow-heavy)"
            >
              <animate
                attributeName="stroke-dashoffset"
                from={FROM}
                to={TO}
                dur={dur}
                begin={delay}
                repeatCount="indefinite"
                calcMode="linear"
              />
            </path>

            {/* Layer 2: Wide Glow (Low opacity, heavy blur) */}
            <path
              d={d}
              fill="none"
              stroke={ACCENT[i]}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={NORM}
              strokeDasharray={midGlow1DashArray}
              opacity="0.18"
              filter="url(#cpu-glow-heavy)"
            >
              <animate
                attributeName="stroke-dashoffset"
                from={FROM}
                to={TO}
                dur={dur}
                begin={delay}
                repeatCount="indefinite"
                calcMode="linear"
              />
            </path>

            {/* Layer 3: Medium Glow (Heavy blur) */}
            <path
              d={d}
              fill="none"
              stroke={ACCENT[i]}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={NORM}
              strokeDasharray={midGlow2DashArray}
              opacity="0.26"
              filter="url(#cpu-glow-heavy)"
            >
              <animate
                attributeName="stroke-dashoffset"
                from={FROM}
                to={TO}
                dur={dur}
                begin={delay}
                repeatCount="indefinite"
                calcMode="linear"
              />
            </path>

            {/* Layer 4: Soft Outer Tail (Soft blur) */}
            <path
              d={d}
              fill="none"
              stroke={ACCENT[i]}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={NORM}
              strokeDasharray={tail1DashArray}
              opacity="0.38"
              filter="url(#cpu-glow-soft)"
            >
              <animate
                attributeName="stroke-dashoffset"
                from={FROM}
                to={TO}
                dur={dur}
                begin={delay}
                repeatCount="indefinite"
                calcMode="linear"
              />
            </path>

            {/* Layer 5: Main Tail (Soft blur) */}
            <path
              d={d}
              fill="none"
              stroke={ACCENT[i]}
              strokeWidth="1.0"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={NORM}
              strokeDasharray={tail2DashArray}
              opacity="0.52"
              filter="url(#cpu-glow-soft)"
            >
              <animate
                attributeName="stroke-dashoffset"
                from={FROM}
                to={TO}
                dur={dur}
                begin={delay}
                repeatCount="indefinite"
                calcMode="linear"
              />
            </path>

            {/* Layer 6: Outer Core (Soft blur) */}
            <path
              d={d}
              fill="none"
              stroke={ACCENT[i]}
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={NORM}
              strokeDasharray={core1DashArray}
              opacity="0.68"
              filter="url(#cpu-glow-soft)"
            >
              <animate
                attributeName="stroke-dashoffset"
                from={FROM}
                to={TO}
                dur={dur}
                begin={delay}
                repeatCount="indefinite"
                calcMode="linear"
              />
            </path>

            {/* Layer 7: Intense Core (Soft blur) */}
            <path
              d={d}
              fill="none"
              stroke={ACCENT[i]}
              strokeWidth="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={NORM}
              strokeDasharray={core2DashArray}
              opacity="0.85"
              filter="url(#cpu-glow-soft)"
            >
              <animate
                attributeName="stroke-dashoffset"
                from={FROM}
                to={TO}
                dur={dur}
                begin={delay}
                repeatCount="indefinite"
                calcMode="linear"
              />
            </path>

            {/* Layer 8: White Hot Head (Sharp leading spark, no blur) */}
            <path
              d={d}
              fill="none"
              stroke="white"
              strokeWidth="0.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={NORM}
              strokeDasharray={headDashArray}
              opacity="1.0"
            >
              <animate
                attributeName="stroke-dashoffset"
                from={FROM}
                to={TO}
                dur={dur}
                begin={delay}
                repeatCount="indefinite"
                calcMode="linear"
              />
            </path>
          </g>
        );
      })}

      {/* ── CPU chip ──────────────────────────────────────────────────── */}
      <g>
        {showCpuConnections && (
          <g fill="#2a4a85">
            {PIN_RECTS.map((p, i) => (
              <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx="0.8" />
            ))}
          </g>
        )}
        <rect x="96" y="60" width="48" height="36" rx="3" fill="#15233e" />
        <rect x="99" y="63" width="42" height="30" rx="1.5" fill="none" stroke="#2a4a85" strokeWidth="0.6" />
          <text
            x="120" y="79"
            fontSize="9" fontWeight="700"
            textAnchor="middle" dominantBaseline="middle"
            letterSpacing="0.12em"
            fill={animateText ? "url(#cpu-text-gradient)" : "#a8c4f0"}
            style={{ userSelect: "none" }}
          >
          {text}
        </text>
      </g>

      <defs>
        {/* Heavy glow for the wide outer volumetric light */}
        <filter id="cpu-glow-heavy" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Soft glow to blend the tail segments and prevent blocky/sharp cuts */}
        <filter id="cpu-glow-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.25" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="cpu-text-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a72b8">
            <animate attributeName="offset" values="-2;-1;0" dur="5s" repeatCount="indefinite"
              calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
          </stop>
          <stop offset="40%" stopColor="#ffffff">
            <animate attributeName="offset" values="-1;0;1" dur="5s" repeatCount="indefinite"
              calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
          </stop>
          <stop offset="80%" stopColor="#4a72b8">
            <animate attributeName="offset" values="0;1;2" dur="5s" repeatCount="indefinite"
              calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
          </stop>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default CpuArchitecture;
