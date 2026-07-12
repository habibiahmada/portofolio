'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

// ─── Component 1: Web Design Wireframe Visual ─────────────────────────────────

export function LayoutDesignerVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-40px' })
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  // ── Trigger mount animation once ──
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    if (isInView) setMounted(true)
  }, [isInView])

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / 10
    const y = (e.clientY - rect.top - rect.height / 2) / 10
    setTilt({ x, y })
  }

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 })

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
            'repeating-linear-gradient(0deg,currentColor 0,currentColor 1px,transparent 1px,transparent 28px),repeating-linear-gradient(90deg,currentColor 0,currentColor 1px,transparent 1px,transparent 28px)',
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
        className="w-full s"
      >
        <div className="rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden">
          {/* Titlebar */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-zinc-100 dark:bg-zinc-900 border-b border-black/5 dark:border-white/5">
            <span className="w-2 h-2 rounded-full bg-red-400/80" />
            <span className="w-2 h-2 rounded-full bg-yellow-400/80" />
            <span className="w-2 h-2 rounded-full bg-green-400/80" />
            {/* URL bar — infinite pulse animation */}
            <motion.div
              initial={{ width: '20%' }}
              animate={{ width: '80%' }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: 'easeOut',
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
                transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
                className="h-1.5 rounded-full bg-rose-400/40"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 24 }}
                transition={{ delay: 0.55, duration: 0.4, ease: 'easeOut' }}
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
                  ease: 'linear',
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
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{
                    delay: 0.6 + i * 0.15,
                    duration: 1.5,
                    ease: 'easeInOut',
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
  )
}

// ─── Component 2: Code Editor Visual ─────────────────────────────────────────

export function CodeEditorVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-40px' })

  const codeLines = [
    { text: "const Portfolio = () => {", delay: 0 },
    { text: "  const [data, setData]", delay: 0.22 },
    { text: "    = useState(null)", delay: 0.40 },
    { text: "", delay: 0.55 },
    { text: "  return (", delay: 0.65 },
    { text: "    <BentoGrid data={data} />", delay: 0.82 },
    { text: "  )", delay: 0.96 },
    { text: "}", delay: 1.08 },
  ]

  const highlight = (text: string) =>
    text
      .replace(/\b(const|return)\b/g, '<span style="color:#f43f5e">$1</span>')
      .replace(/\b(useState)\b/g, '<span style="color:#38bdf8">$1</span>')
      .replace(/<(BentoGrid[^>]*)>/g, '<span style="color:#34d399">&lt;$1&gt;</span>')

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
        <span className="ml-2 text-[9px] font-mono text-zinc-500">portfolio.tsx</span>
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
            transition={{ delay: line.delay, duration: 0.35, ease: 'easeOut' }}
            className="flex gap-3 min-h-[1.4em]"
          >
            <span className="text-zinc-700 shrink-0 w-4 text-right">{i + 1}</span>
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
  )
}

// ─── Component 3: Performance Gauge Visual ────────────────────────────────────

export function SpeedometerGaugeVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-40px' })
  const [score, setScore] = useState(0)
  const [metricsVisible, setMetricsVisible] = useState(false)

  // Use requestAnimationFrame-based animation instead of 18ms setInterval
  useEffect(() => {
    if (!isInView) {
      setScore(0)
      setMetricsVisible(false)
      return
    }

    let rafId: number
    let timeoutId: ReturnType<typeof setTimeout>
    let current = 0
    let animating = true

    const animate = () => {
      if (!animating) return
      current += 1
      if (current >= 98) {
        current = 98
        setScore(current)
        setMetricsVisible(true)
        animating = false
        timeoutId = setTimeout(startCycle, 3000)
        return
      }
      setScore(current)
      rafId = requestAnimationFrame(animate)
    }

    const startCycle = () => {
      current = 0
      setScore(0)
      setMetricsVisible(false)
      animating = true
      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      animating = false
      cancelAnimationFrame(rafId)
      clearTimeout(timeoutId)
    }
  }, [isInView])

  const radius = 38
  const circumference = 2 * Math.PI * radius
  const arcLen = circumference * 0.75
  const filled = arcLen * (score / 100)
  const offset = arcLen - filled

  const metrics = [
    { label: 'FCP', val: '0.8s', color: 'text-emerald-500' },
    { label: 'LCP', val: '1.2s', color: 'text-emerald-500' },
    { label: 'CLS', val: '0.02', color: 'text-emerald-500' },
  ]

  return (
    <div
      ref={ref}
      className="w-full h-44 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-between px-6"
    >
      {/* Gauge */}
      <div className="relative shrink-0">
        <svg width="88" height="88" viewBox="0 0 88 88">
          <circle
            cx="44" cy="44" r={radius}
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
            cx="44" cy="44" r={radius}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            stroke="#10b981"
            strokeDasharray={`${arcLen} ${circumference}`}
            strokeDashoffset={offset}
            transform="rotate(135 44 44)"
            style={{ transition: 'stroke-dashoffset 0.04s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-emerald-500 font-mono leading-none">{score}</span>
          <span className="text-[8px] text-muted-foreground/60 font-mono uppercase tracking-widest mt-0.5">Score</span>
        </div>
      </div>

      {/* Metrics list */}
      <div className="flex flex-col gap-2">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, x: 12 }}
            animate={metricsVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
            transition={{ delay: i * 0.12, duration: 0.45 }}
            className="flex items-center gap-3"
          >
            <span className="text-[9px] font-mono text-muted-foreground/60 w-8">{m.label}</span>
            <div className="flex-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-800 w-20 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={metricsVisible ? { width: '100%' } : { width: 0 }}
                transition={{ delay: i * 0.12 + 0.1, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <span className={`text-[10px] font-mono font-bold ${m.color}`}>{m.val}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Component 4: Node Graph Visual ──────────────────────────────────────────

export function NodeGraphVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-40px' })
  const [activeNode, setActiveNode] = useState<number | null>(null)
  const pulseRef = useRef<{ from: number; to: number } | null>(null)
  const [, forceRender] = useState(0)

  const nodes = [
    { id: 1, cx: 44, cy: 75, label: 'Client', color: '#f43f5e' },
    { id: 2, cx: 124, cy: 34, label: 'Server', color: '#38bdf8' },
    { id: 3, cx: 124, cy: 116, label: 'DB', color: '#34d399' },
    { id: 4, cx: 204, cy: 75, label: 'Cache', color: '#f472b6' },
  ]

  const links = [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 4 },
  ]

  // Looping data pulse — use refs to avoid re-render every 1.2s
  useEffect(() => {
    if (!isInView) return
    let idx = 0
    const step = () => {
      const link = links[idx % links.length]
      pulseRef.current = link
      forceRender((c) => c + 1) // only re-render when pulse changes
      idx++
    }
    step()
    const id = setInterval(step, 1200)
    return () => {
      clearInterval(id)
      pulseRef.current = null
    }
  }, [isInView])

  const pulse = pulseRef.current

  return (
    <div
      ref={ref}
      className="w-full h-44 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center overflow-hidden select-none"
    >
      <svg viewBox="0 0 248 150" className="w-full h-full max-w-65">
        {links.map((link, i) => {
          const from = nodes.find(n => n.id === link.from)!
          const to = nodes.find(n => n.id === link.to)!
          const isHoverActive = activeNode === link.from || activeNode === link.to
          const isPulsing = pulse?.from === link.from && pulse?.to === link.to
          return (
            <g key={i}>
              <motion.line
                x1={from.cx} y1={from.cy}
                x2={to.cx} y2={to.cy}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.6, ease: 'easeOut' }}
                stroke={isHoverActive ? to.color : 'currentColor'}
                strokeWidth={isHoverActive ? 1.5 : 1}
                strokeOpacity={isHoverActive ? 0.7 : 0.15}
                strokeDasharray={isHoverActive ? undefined : '4 4'}
                className="transition-all duration-300"
              />
              {isPulsing && isInView && (
                <motion.circle
                  r={3}
                  fill={to.color}
                  initial={{ cx: from.cx, cy: from.cy, opacity: 1 }}
                  animate={{ cx: to.cx, cy: to.cy, opacity: [1, 1, 0] }}
                  transition={{ duration: 0.9, ease: 'easeInOut' }}
                />
              )}
            </g>
          )
        })}

        {nodes.map((node, i) => {
          const isHovered = activeNode === node.id
          const isPulseNode = pulse?.from === node.id || pulse?.to === node.id
          return (
            <motion.g
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
              style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => setActiveNode(null)}
              className="cursor-pointer"
            >
              {isPulseNode && (
                <motion.circle
                  cx={node.cx} cy={node.cy}
                  r={14}
                  fill="none"
                  stroke={node.color}
                  strokeWidth={1.5}
                  initial={{ r: 11, opacity: 0.8 }}
                  animate={{ r: 22, opacity: 0 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />
              )}
              {isHovered && (
                <circle cx={node.cx} cy={node.cy} r={18} fill={node.color} fillOpacity={0.08} />
              )}
              <circle
                cx={node.cx} cy={node.cy}
                r={isHovered ? 13 : 11}
                fill={isHovered ? node.color : 'white'}
                fillOpacity={isHovered ? 1 : 0}
                stroke={node.color}
                strokeWidth={isHovered ? 2 : 1.5}
                strokeOpacity={isHovered ? 1 : 0.5}
                className="transition-all duration-300 dark:fill-zinc-900"
              />
              <circle
                cx={node.cx} cy={node.cy} r={4}
                fill={node.color}
                fillOpacity={isPulseNode ? 1 : isHovered ? 1 : 0.6}
                className="transition-all duration-300"
              />
              <text
                x={node.cx} y={node.cy + 26}
                textAnchor="middle"
                fontSize="8"
                fontFamily="ui-monospace, monospace"
                fontWeight={isHovered ? 700 : 500}
                fill={isHovered ? node.color : 'currentColor'}
                fillOpacity={isHovered ? 1 : 0.4}
                className="transition-all duration-300"
              >
                {node.label}
              </text>
            </motion.g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── Component 5: Tech Stack Visual ──────────────────────────────────────────

export function TechCarouselVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-40px' })
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null)

  const techs = [
    { name: 'Next.js', bg: 'bg-black dark:bg-white', text: 'text-white dark:text-black' },
    { name: 'React', bg: 'bg-sky-500/10 dark:bg-sky-500/15', text: 'text-sky-500' },
    { name: 'TypeScript', bg: 'bg-blue-500/10 dark:bg-blue-500/15', text: 'text-blue-500' },
    { name: 'Tailwind', bg: 'bg-teal-500/10 dark:bg-teal-500/15', text: 'text-teal-500' },
    { name: 'GSAP', bg: 'bg-green-500/10 dark:bg-green-500/15', text: 'text-green-500' },
    { name: 'Framer', bg: 'bg-pink-500/10 dark:bg-pink-500/15', text: 'text-pink-500' },
    { name: 'Node.js', bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
    { name: 'Prisma', bg: 'bg-rose-500/10', text: 'text-rose-500' },
  ]

  // Loop: spotlight each badge in sequence
  useEffect(() => {
    if (!isInView) return
    let idx = 0
    const id = setInterval(() => {
      setHighlightIdx(idx % techs.length)
      idx++
    }, 600)
    return () => {
      clearInterval(id)
      setHighlightIdx(null)
    }
  }, [isInView])

  const isHighlighted = (i: number) => highlightIdx === i

  return (
    <div
      ref={ref}
      className="w-full h-44 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center overflow-hidden p-4"
    >
      <div className="flex flex-wrap gap-2 justify-center s">
        {techs.map((tech, i) => (
          <motion.span
            key={tech.name}
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={
              isInView
                ? {
                  opacity: 1,
                  scale: isHighlighted(i) ? 1.15 : 1,
                  y: isHighlighted(i) ? -6 : 0,
                }
                : { opacity: 0, scale: 0.6 }
            }
            transition={{
              opacity: { delay: i * 0.07, duration: 0.35 },
              scale: { duration: 0.3, ease: [0.175, 0.885, 0.32, 1.275] },
              y: isHighlighted(i)
                ? { duration: 0.25, ease: 'easeOut' }
                : { duration: 0.3 },
            }}
            whileHover={{ scale: 1.1, y: -6 }}
            className={`px-3 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-wide cursor-pointer select-none transition-shadow duration-300 ${tech.bg} ${tech.text} ${isHighlighted(i) ? 'ring-1 ring-current shadow-lg shadow-current/20' : ''
              }`}
          >
            {tech.name}
          </motion.span>
        ))}
      </div>
    </div>
  )
}
