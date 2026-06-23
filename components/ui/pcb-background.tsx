'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils'

/*
  PCB trace background.
  viewBox: 0 0 600 500  — large canvas so it fills the right column generously.

  Design rules:
  - Traces radiate outward FROM the center (300, 250) — where the box sits
  - Horizontal / vertical 90° bends only (real PCB style)
  - Sparse: ~10 traces so it reads as circuit board, not noise
  - Via pads at key junctions

  Comet technique identical to cpu-architecture.tsx.
*/

// Center = (300, 250)
// Traces radiate from center area outward in all directions
const TRACES = [
  // ── from center-top outward ──
  'M 300 180  V 80  H 160 V 30',
  'M 300 180  V 80  H 440 V 30',
  'M 260 200  H 120 V 100 H 60  V 160',
  'M 340 200  H 480 V 100 H 540 V 160',

  // ── from center-bottom outward ──
  'M 300 310  V 400 H 160 V 460',
  'M 300 310  V 400 H 440 V 460',
  'M 260 290  H 120 V 380 H 60  V 320',
  'M 340 290  H 480 V 380 H 540 V 320',

  // ── horizontal connectors ──
  'M 60  220  H 200 V 250 H 240',
  'M 540 220  H 400 V 250 H 360',
]

const VIAS = [
  { cx: 300, cy: 180 },
  { cx: 160, cy: 80  },
  { cx: 440, cy: 80  },
  { cx: 120, cy: 100 },
  { cx: 480, cy: 100 },
  { cx: 260, cy: 200 },
  { cx: 340, cy: 200 },
  { cx: 300, cy: 310 },
  { cx: 160, cy: 400 },
  { cx: 440, cy: 400 },
  { cx: 120, cy: 380 },
  { cx: 480, cy: 380 },
  { cx: 260, cy: 290 },
  { cx: 340, cy: 290 },
  { cx: 200, cy: 220 },
  { cx: 400, cy: 220 },
]

const ACCENT = [
  '#60a5fa', '#a78bfa', '#34d399', '#f97316',
  '#38bdf8', '#facc15', '#4ade80', '#818cf8',
  '#f472b6', '#60a5fa',
]

const TIMING = [
  { dur: '6.4s',  delay: '0s'    },
  { dur: '8.1s',  delay: '2.1s'  },
  { dur: '5.8s',  delay: '4.0s'  },
  { dur: '7.6s',  delay: '1.2s'  },
  { dur: '9.2s',  delay: '3.3s'  },
  { dur: '6.9s',  delay: '5.5s'  },
  { dur: '5.3s',  delay: '0.8s'  },
  { dur: '8.7s',  delay: '2.9s'  },
  { dur: '7.1s',  delay: '1.6s'  },
  { dur: '6.0s',  delay: '4.7s'  },
]

const NORM = 100
const FROM = '115'
const TO   = '0'

const LAYERS = [
  { da: '0 90 25 0', w: 2.0,  op: 0.10, filter: 'heavy' },
  { da: '0 94 21 0', w: 1.6,  op: 0.16, filter: 'heavy' },
  { da: '0 98 17 0', w: 1.2,  op: 0.24, filter: 'heavy' },
  { da: '0 102 13 0',w: 0.9,  op: 0.36, filter: 'soft'  },
  { da: '0 106 9 0', w: 0.7,  op: 0.52, filter: 'soft'  },
  { da: '0 109 6 0', w: 0.55, op: 0.68, filter: 'soft'  },
  { da: '0 112 3 0', w: 0.4,  op: 0.85, filter: 'soft'  },
  { da: '0 114 1 0', w: 0.3,  op: 1.0,  filter: null, stroke: 'white' },
]

interface PcbBackgroundProps {
  className?: string
}

export function PcbBackground({ className }: PcbBackgroundProps) {
  const id = useId()

  return (
    <svg
      viewBox="0 0 600 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-full h-full', className)}
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <filter id={`${id}-heavy`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`${id}-soft`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="0.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Static traces */}
      <g
        stroke="currentColor"
        fill="none"
        strokeWidth="0.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.15"
      >
        {TRACES.map((d, i) => <path key={i} d={d} />)}
      </g>

      {/* Via pads */}
      <g fill="currentColor" opacity="0.20">
        {VIAS.map((v, i) => <circle key={i} cx={v.cx} cy={v.cy} r="3" />)}
      </g>
      {/* Via inner ring */}
      <g fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.12">
        {VIAS.map((v, i) => <circle key={i} cx={v.cx} cy={v.cy} r="1.4" />)}
      </g>

      {/* Comets */}
      {TRACES.map((d, i) => {
        const { dur, delay } = TIMING[i % TIMING.length]
        const accent = ACCENT[i % ACCENT.length]

        return (
          <g key={i}>
            {LAYERS.map((layer, li) => (
              <path
                key={li}
                d={d}
                fill="none"
                stroke={layer.stroke ?? accent}
                strokeWidth={layer.w}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={NORM}
                strokeDasharray={layer.da}
                opacity={layer.op}
                filter={layer.filter ? `url(#${id}-${layer.filter})` : undefined}
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
            ))}
          </g>
        )
      })}
    </svg>
  )
}
