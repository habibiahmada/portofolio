'use client'

import { motion } from 'framer-motion'
import { GlitchText } from '@/components/ui/glitch-text'
import {
  LayoutDesignerVisual,
  CodeEditorVisual,
  SpeedometerGaugeVisual,
  NodeGraphVisual,
  CICDPipelineVisual,
} from './bento-cards'

// ─── Types ────────────────────────────────────────────────────────────────────

interface BentoCardProps {
  label: string
  title: string
  description: string
  visual: React.ReactNode
  delay?: number
  className?: string
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function BentoCard({ label, title, description, visual, delay = 0, className = '' }: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.215, 0.61, 0.355, 1] as const }}
      className={`flex flex-col gap-5 rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-950 p-5 md:p-6 hover:border-black/10 dark:hover:border-white/10 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30 transition-all duration-500 ${className}`}
    >
      {/* Visual widget */}
      <div className="shrink-0">{visual}</div>

      {/* Text */}
      <div className="space-y-1.5 flex-1">
        <span className="text-[10px] font-mono text-rose-500 dark:text-blue-400 font-semibold uppercase tracking-widest block">
          {label}
        </span>
        <h3 className="text-base font-bold text-foreground leading-snug">{title}</h3>
        <p className="text-xs text-muted-foreground/75 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function Services() {
  return (
    <section id="services" className="py-24 w-full bg-transparent">
      <div className="w-full  mx-auto px-6 md:px-12 lg:px-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.215, 0.61, 0.355, 1] as const }}
          className="max-w-2xl mb-14 space-y-3"
        >
          <span className="text-xs font-mono tracking-widest text-rose-500 dark:text-blue-400 uppercase block">
            // My Services
          </span>
          <GlitchText
            as="h2"
            className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight"
            interval={5000}
            duration={320}
          >
            Comprehensive<br className="sm:hidden" /> Solutions
          </GlitchText>
          <p className="text-sm md:text-base text-muted-foreground/80 leading-relaxed font-medium max-w-lg">
            From wireframe concepts to fully animated frontends and scalable servers. I build performant products that stand out.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Row 1 – Design (wide) + Frontend */}
          <BentoCard
            label="01 / Design"
            title="Web Design & Mobile-First"
            description="Translating ideas into pixel-perfect responsive interfaces. Wireframes to production-ready layouts that feel intuitive on every device."
            visual={<LayoutDesignerVisual />}
            delay={0.05}
            className="sm:col-span-2 lg:col-span-2"
          />

          <BentoCard
            label="02 / Engineering"
            title="Frontend Development"
            description="High-quality UIs with React & Next.js. Clean components, reusable logic, and fluid state management."
            visual={<CodeEditorVisual />}
            delay={0.12}
          />

          {/* Row 2 – Performance + Backend + Deploy (wide) */}
          <BentoCard
            label="03 / Performance"
            title="Web Performance"
            description="Core Web Vitals optimization for instant load. SEO-ready architecture that ranks and converts."
            visual={<SpeedometerGaugeVisual />}
            delay={0.18}
          />

          <BentoCard
            label="04 / Backend"
            title="APIs & Databases"
            description="Robust REST APIs, relational databases, and secure auth systems built to scale with your product."
            visual={<NodeGraphVisual />}
            delay={0.24}
          />

          <BentoCard
            label="05 / DevOps"
            title="CI/CD & Deployment"
            description="Automated pipelines, container-ready apps, serverless hosting, and zero-downtime production deploys."
            visual={<CICDPipelineVisual />}
            delay={0.3}
          />

        </div>
      </div>
    </section>
  )
}
