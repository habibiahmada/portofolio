'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface GlitchTextProps {
  children?: React.ReactNode
  words?: string[]
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p' | 'div'
  /** Interval in ms between glitch triggers (default 4000) */
  interval?: number
  /** Duration of each glitch burst in ms (default 300) */
  duration?: number
  /** Disable automatic periodic glitch */
  noAuto?: boolean
}

export function GlitchText({
  children,
  words,
  className,
  as: Tag = 'span',
  interval = 4000,
  duration = 300,
  noAuto = false,
}: GlitchTextProps) {
  const [active, setActive] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const trigger = () => {
    setActive(true)
    
    if (words && words.length > 0) {
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length)
      }, duration / 2)
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setActive(false), duration)
  }

  useEffect(() => {
    if (noAuto) return
    timerRef.current = setInterval(trigger, interval)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [interval, duration, noAuto, words])

  const displayedContent = words && words.length > 0 ? words[wordIndex] : children

  return (
    <Tag
      className={cn(
        'relative inline-block',
        active && 'animate-glitch-skew',
        className,
      )}
      onMouseEnter={trigger}
      data-glitch={typeof displayedContent === 'string' ? displayedContent : undefined}
    >
      {/* Red offset layer */}
      {active && (
        <span
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            color: '#ef4444',
            clipPath: 'inset(20% 0 60% 0)',
            transform: 'translate(-3px, 1px)',
            animation: 'glitch-split 0.3s ease-in-out',
          }}
          aria-hidden="true"
        >
          {displayedContent}
        </span>
      )}
      {/* Cyan offset layer */}
      {active && (
        <span
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            color: '#3b82f6',
            clipPath: 'inset(60% 0 10% 0)',
            transform: 'translate(1px, -1px)',
            animation: 'glitch-split 0.3s ease-in-out reverse',
          }}
          aria-hidden="true"
        >
          {displayedContent}
        </span>
      )}
      {/* Main text with flicker */}
      <span
        className={cn('relative', active && 'animate-glitch-flicker')}
      >
        {displayedContent}
      </span>
    </Tag>
  )
}
