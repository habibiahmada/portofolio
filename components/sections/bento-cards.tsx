'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

// ─── Component 1: Web Design Wireframe Visual ─────────────────────────────────

export function LayoutDesignerVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

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
          backgroundImage: 'repeating-linear-gradient(0deg,currentColor 0,currentColor 1px,transparent 1px,transparent 28px),repeating-linear-gradient(90deg,currentColor 0,currentColor 1px,transparent 1px,transparent 28px)',
        }}
      />

      {/* Browser mock */}
      <motion.div
        animate={isInView ? {
          opacity: 1,
          y: 0,
          rotateX: -tilt.y,
          rotateY: tilt.x,
        } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
        style={{ perspective: 700 }}
        className="w-full max-w-xs"
      >
        <div className="rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden">
          {/* Titlebar */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-zinc-100 dark:bg-zinc-900 border-b border-black/5 dark:border-white/5">
            <span className="w-2 h-2 rounded-full bg-red-400/80" />
            <span className="w-2 h-2 rounded-full bg-yellow-400/80" />
            <span className="w-2 h-2 rounded-full bg-green-400/80" />
            <div className="flex-1 mx-3 h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          </div>

          {/* Layout wireframe */}
          <div className="p-3 grid grid-cols-3 gap-2">
            <motion.div
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="col-span-2 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/15 flex items-center px-2 gap-1.5"
            >
              <div className="h-1.5 w-10 rounded-full bg-indigo-400/40" />
              <div className="h-1.5 w-6 rounded-full bg-indigo-400/20" />
            </motion.div>
            <motion.div
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-black/5 dark:border-white/5 flex items-center justify-center"
            >
              <div className="w-4 h-4 rounded-full border-2 border-dashed border-indigo-400/30" />
            </motion.div>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                className="h-6 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-black/5 dark:border-white/5"
              />
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
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  const codeLines = [
    { text: "const Portfolio = () => {", delay: 0 },
    { text: "  const [data, setData]", delay: 0.25 },
    { text: "    = useState(null)", delay: 0.45 },
    { text: "", delay: 0.6 },
    { text: "  return (", delay: 0.7 },
    { text: "    <BentoGrid data={data} />", delay: 0.9 },
    { text: "  )", delay: 1.0 },
    { text: "}", delay: 1.1 },
  ]

  const highlight = (text: string) =>
    text
      .replace(/\b(const|return)\b/g, '<span style="color:#818cf8">$1</span>')
      .replace(/\b(useState)\b/g, '<span style="color:#38bdf8">$1</span>')
      .replace(/<(BentoGrid[^>]*)>/g, '<span style="color:#34d399">&lt;$1&gt;</span>')
      .replace(/\/(BentoGrid)>/g, '<span style="color:#34d399">/&lt;$1&gt;</span>')

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

      {/* Code lines */}
      <div className="flex-1 px-4 py-3 font-mono text-[11px] text-zinc-400 leading-relaxed overflow-hidden">
        {codeLines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            transition={{ delay: line.delay, duration: 0.4, ease: 'easeOut' }}
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
          className="inline-block w-1.5 h-3 bg-indigo-400 ml-12 -mt-1"
        />
      </div>
    </div>
  )
}

// ─── Component 3: Performance Gauge Visual ────────────────────────────────────

export function SpeedometerGaugeVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let current = 0
    const interval = setInterval(() => {
      current += 2
      if (current >= 98) { current = 98; clearInterval(interval) }
      setScore(current)
    }, 18)
    return () => clearInterval(interval)
  }, [isInView])

  const radius = 38
  const circumference = 2 * Math.PI * radius
  // Only draw 270° arc (¾ of circle), so max offset is circumference * 0.75
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
      <div className="relative flex-shrink-0">
        <svg width="88" height="88" viewBox="0 0 88 88">
          {/* Background track — 270° arc starting at 135° */}
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
          {/* Filled arc */}
          <motion.circle
            cx="44" cy="44" r={radius}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            stroke="#10b981"
            strokeDasharray={`${arcLen} ${circumference}`}
            strokeDashoffset={offset}
            transform="rotate(135 44 44)"
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
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
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.45 }}
            className="flex items-center gap-3"
          >
            <span className="text-[9px] font-mono text-muted-foreground/60 w-8">{m.label}</span>
            <div className="flex-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-800 w-20 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={isInView ? { width: '100%' } : { width: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
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
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const [activeNode, setActiveNode] = useState<number | null>(null)

  const nodes = [
    { id: 1, cx: 44,  cy: 75,  label: 'Client',  color: '#818cf8' },
    { id: 2, cx: 124, cy: 34,  label: 'Server',  color: '#38bdf8' },
    { id: 3, cx: 124, cy: 116, label: 'DB',      color: '#34d399' },
    { id: 4, cx: 204, cy: 75,  label: 'Cache',   color: '#f472b6' },
  ]

  const links = [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 4 },
  ]

  return (
    <div
      ref={ref}
      className="w-full h-44 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center overflow-hidden select-none"
    >
      <svg viewBox="0 0 248 150" className="w-full h-full max-w-[260px]">
        {/* Connection lines */}
        {links.map((link, i) => {
          const from = nodes.find(n => n.id === link.from)!
          const to   = nodes.find(n => n.id === link.to)!
          const isActive = activeNode === link.from || activeNode === link.to
          return (
            <motion.line
              key={i}
              x1={from.cx} y1={from.cy}
              x2={to.cx}   y2={to.cy}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.6, ease: 'easeOut' }}
              stroke={isActive ? to.color : 'currentColor'}
              strokeWidth={isActive ? 1.5 : 1}
              strokeOpacity={isActive ? 0.7 : 0.15}
              strokeDasharray={isActive ? undefined : '4 4'}
              className="transition-all duration-300"
            />
          )
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const isHovered = activeNode === node.id
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
              {/* Outer ring glow */}
              {isHovered && (
                <circle
                  cx={node.cx} cy={node.cy} r={18}
                  fill={node.color} fillOpacity={0.08}
                />
              )}
              {/* Main circle */}
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
              {/* Center dot */}
              <circle
                cx={node.cx} cy={node.cy} r={4}
                fill={node.color}
                fillOpacity={isHovered ? 1 : 0.6}
                className="transition-all duration-300"
              />
              {/* Label */}
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
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  const techs = [
    { name: 'Next.js',     bg: 'bg-black dark:bg-white',              text: 'text-white dark:text-black' },
    { name: 'React',       bg: 'bg-sky-500/10 dark:bg-sky-500/15',    text: 'text-sky-500' },
    { name: 'TypeScript',  bg: 'bg-blue-500/10 dark:bg-blue-500/15',  text: 'text-blue-500' },
    { name: 'Tailwind',    bg: 'bg-teal-500/10 dark:bg-teal-500/15',  text: 'text-teal-500' },
    { name: 'GSAP',        bg: 'bg-green-500/10 dark:bg-green-500/15',text: 'text-green-500' },
    { name: 'Framer',      bg: 'bg-pink-500/10 dark:bg-pink-500/15',  text: 'text-pink-500' },
    { name: 'Node.js',     bg: 'bg-emerald-500/10',                   text: 'text-emerald-500' },
    { name: 'Prisma',      bg: 'bg-indigo-500/10',                    text: 'text-indigo-500' },
  ]

  return (
    <div
      ref={ref}
      className="w-full h-44 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center overflow-hidden p-4"
    >
      <div className="flex flex-wrap gap-2 justify-center max-w-xs">
        {techs.map((tech, i) => (
          <motion.span
            key={tech.name}
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={isInView ? {
              opacity: 1,
              scale: 1,
              y: [0, -5, 0],
            } : { opacity: 0, scale: 0.6 }}
            transition={{
              opacity:   { delay: i * 0.07, duration: 0.35 },
              scale:     { delay: i * 0.07, duration: 0.35, ease: [0.175, 0.885, 0.32, 1.275] },
              y: { delay: i * 0.07 + 0.35, duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
            }}
            whileHover={{ scale: 1.1, y: -6 }}
            className={`px-3 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-wide cursor-pointer select-none ${tech.bg} ${tech.text}`}
          >
            {tech.name}
          </motion.span>
        ))}
      </div>
    </div>
  )
}
