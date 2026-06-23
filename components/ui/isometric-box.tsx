'use client'

import { useId, useRef } from 'react'
import gsap from 'gsap'

/*
  Isometric box — fully theme-aware via currentColor + fill-opacity.

  The SVG inherits `color` from its wrapper div:
    dark mode → color: white  (faces show as dark near-black via low opacity)
    light mode → color: black (faces show as light gray via low opacity)

  This way it reacts to the .dark class toggle instantly (same frame as the
  curtain reveal) without any JS or style injection.

  Face opacity mapping:
    Left wall   fillOpacity 0.06  → very dark on dark, very light on light
    Right wall  fillOpacity 0.08
    Lid rim     fillOpacity 0.09
    Lid top     fillOpacity 0.11
    Inner hole  fillOpacity 0.04  → deepest shadow

  Stroke uses currentColor at 0.18 opacity — subtle edge on both themes.
  Dashes use currentColor at 0.12 opacity.
*/

export function IsometricBox() {
  const clipId = useId()

  const lidRef   = useRef<SVGGElement>(null)
  const leftRef  = useRef<SVGGElement>(null)
  const rightRef = useRef<SVGGElement>(null)

  const handleMouseEnter = () => {
    gsap.to(lidRef.current,   { y: -28, duration: 0.45, ease: 'power2.out' })
    gsap.to(leftRef.current,  { x: -16, y: 9, duration: 0.45, ease: 'power2.out' })
    gsap.to(rightRef.current, { x: 16,  y: 9, duration: 0.45, ease: 'power2.out' })
  }

  const handleMouseLeave = () => {
    gsap.to([lidRef.current, leftRef.current, rightRef.current], {
      x: 0, y: 0, duration: 0.4, ease: 'power2.inOut',
    })
  }

  return (
    <div
      className="flex justify-center md:justify-end cursor-pointer select-none
                 text-black dark:text-white"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="size-72 md:size-96">
        <svg
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <defs>
            <clipPath id={`${clipId}-left`}>
              <path d="M60 112 L160 164 L160 284 L60 232 Z" />
            </clipPath>
            <clipPath id={`${clipId}-right`}>
              <path d="M160 164 L260 112 L260 232 L160 284 Z" />
            </clipPath>
          </defs>

          {/* ── LEFT WALL ── */}
          <g ref={leftRef}>
            <path
              d="M60 112 L160 164 L160 284 L60 232 Z"
              fill="currentColor"
              fillOpacity="0.06"
              stroke="currentColor"
              strokeOpacity="0.18"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <g clipPath={`url(#${clipId}-left)`}>
              {[0.2, 0.4, 0.6, 0.8].map((t) => {
                const x1 = 60 + t * 100
                const y1 = 112 + t * 52
                return (
                  <line
                    key={t}
                    x1={x1} y1={y1}
                    x2={x1} y2={y1 + 120}
                    stroke="currentColor"
                    strokeOpacity="0.12"
                    strokeWidth="1.5"
                    strokeDasharray="7 8"
                    strokeLinecap="round"
                  />
                )
              })}
            </g>
          </g>

          {/* ── RIGHT WALL ── */}
          <g ref={rightRef}>
            <path
              d="M160 164 L260 112 L260 232 L160 284 Z"
              fill="currentColor"
              fillOpacity="0.08"
              stroke="currentColor"
              strokeOpacity="0.18"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <g clipPath={`url(#${clipId}-right)`}>
              {[0.2, 0.4, 0.6, 0.8].map((t) => {
                const x1 = 160 + t * 100
                const y1 = 164 - t * 52
                return (
                  <line
                    key={t}
                    x1={x1} y1={y1}
                    x2={x1} y2={y1 + 120}
                    stroke="currentColor"
                    strokeOpacity="0.12"
                    strokeWidth="1.5"
                    strokeDasharray="7 8"
                    strokeLinecap="round"
                  />
                )
              })}
            </g>
          </g>

          {/* ── LID ── */}
          <g ref={lidRef}>
            {/* Rim thickness */}
            <path
              d="M60 112 L160 164 L260 112 L260 126 L160 178 L60 126 Z"
              fill="currentColor"
              fillOpacity="0.09"
              stroke="currentColor"
              strokeOpacity="0.18"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Top face */}
            <path
              d="M60 112 L160 60 L260 112 L160 164 Z"
              fill="currentColor"
              fillOpacity="0.11"
              stroke="currentColor"
              strokeOpacity="0.18"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Inner hole */}
            <path
              d="M110 112 L160 87 L210 112 L160 137 Z"
              fill="currentColor"
              fillOpacity="0.04"
              stroke="currentColor"
              strokeOpacity="0.14"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
    </div>
  )
}
