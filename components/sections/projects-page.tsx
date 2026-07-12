'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { GlitchText } from '@/components/ui/glitch-text'
import { NodeNetwork } from '@/components/ui/node-network'
import { CpuArchitecture } from '@/components/ui/cpu-architecture'
import { ProjectTag } from '@/components/ui/project-tag'
import { ProjectLinks } from '@/components/ui/project-links'
import { projects, EASING, getProjectTitle, getProjectDescription, type Project } from '@/lib/projects'

interface ProjectsPageProps {
  locale?: string
}

// ─── Animation Variants ─────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.25,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: EASING,
    },
  },
}

// ─── Project Card ────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  locale,
  index,
}: {
  project: Project
  locale: string
  index: number
}) {
  const title = getProjectTitle(project, locale)
  const description = getProjectDescription(project, locale)

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/5 dark:border-white/5 bg-white/60 dark:bg-zinc-950/40 backdrop-blur-sm transition-all duration-500 hover:border-black/15 dark:hover:border-white/15 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/40 hover:-translate-y-1"
    >
      {/* ── Image Container ── */}
      <div className="relative overflow-hidden aspect-16/10">
        <Image
          src={project.image}
          alt={title}
          fill
          className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
          loading={index < 4 ? 'eager' : 'lazy'}
        />

        {/* Gradient overlay — appears on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Image border accent — subtle inner glow on hover */}
        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 group-hover:ring-rose-500/20 dark:group-hover:ring-blue-400/20 transition-all duration-500 rounded-2xl" />

        {/* Index badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[10px] font-mono font-bold tracking-widest text-white bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Year — visible on hover */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-1 group-hover:translate-y-0">
          <span className="text-[10px] font-mono text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
            {project.year}
          </span>
        </div>

        {/* Quick links — visible on hover */}
        <div className="absolute bottom-3 right-3 z-10 flex gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
          {project.live_url !== '#' && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Live Demo"
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 transition-all duration-200"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          )}
          {project.github_url !== '#' && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 transition-all duration-200"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 p-5 md:p-6 gap-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <ProjectTag key={tag}>{tag}</ProjectTag>
          ))}
          {project.tags.length > 3 && (
            <span className="text-[9px] font-mono text-muted-foreground/40 self-center">
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-[15px] md:text-lg tracking-tight text-foreground leading-snug line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs md:text-sm text-muted-foreground/70 leading-relaxed line-clamp-2 flex-1">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/5 mt-auto">
          <span className="text-[10px] font-mono text-muted-foreground/40 flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {project.year}
          </span>
          <ProjectLinks
            githubUrl={project.github_url}
            liveUrl={project.live_url}
            hover
          />
        </div>
      </div>
    </motion.article>
  )
}

// ─── Page Section ─────────────────────────────────────────────────────────────

export function ProjectsPage({ locale = 'en' }: ProjectsPageProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const nodeMouseRef = useRef<{ x: number; y: number; active: boolean } | null>({
    x: 0,
    y: 0,
    active: false,
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = sectionRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (nodeMouseRef.current) {
      nodeMouseRef.current.x = e.clientX - rect.left
      nodeMouseRef.current.y = e.clientY - rect.top
      nodeMouseRef.current.active = true
    }
  }

  const handleMouseLeave = () => {
    if (nodeMouseRef.current) {
      nodeMouseRef.current.active = false
    }
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-16 md:py-24 w-full bg-transparent min-h-screen"
    >
      {/* Node Network — full-section background, interaktif via externalMouseRef */}
      <NodeNetwork externalMouseRef={nodeMouseRef} densityBias="topRight" />

      {/* Ambient background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-rose-500/3 dark:bg-blue-500/3 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500/3 dark:bg-rose-500/3 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-purple-500/2 dark:bg-purple-500/2 blur-3xl" />
      </div>

      <div className="relative w-full mx-auto px-6 md:px-12 lg:px-16">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASING }}
          className="mb-14 md:mb-18"
        >
          <div className="relative z-10 space-y-3">
            <span className="text-xs font-mono tracking-widest text-rose-500 dark:text-blue-400 uppercase block">
              // Archive
            </span>
            <GlitchText
              as="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-tight"
              interval={6000}
              duration={350}
            >
              All Projects
            </GlitchText>
            <p className="text-base text-muted-foreground/60 max-w-xl leading-relaxed">
              A curated collection of everything I&apos;ve built — from
              production applications to experimental side projects.
            </p>
          </div>
        </motion.div>

        {/* ── Projects Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              locale={locale}
              index={i}
            />
          ))}
        </motion.div>

        {/* ── Spacer before footer ── */}
        <div className="h-24 md:h-32" />
      </div>

      {/* ── CPU Architecture — full-width background element ── */}
      <div className="absolute bottom-0 left-0 right-0 h-72 md:h-96 lg:h-128 pointer-events-none overflow-hidden">
        {/* Gradual fade from content to CPU */}
        <div className="absolute inset-0 bg-linear-to-t from-black/10 dark:from-black/30 via-transparent to-transparent z-10" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASING, delay: 0.4 }}
          className="absolute bottom-[-50%] left-1/2 -translate-x-1/2 w-full max-w-4xl md:max-w-5xl lg:max-w-6xl h-full opacity-40 dark:opacity-35"
        >
          <CpuArchitecture
            text="DEV"
            animateText
            showCpuConnections
            className="w-full h-full text-zinc-600 dark:text-zinc-300"
          />
        </motion.div>
      </div>
    </section>
  )
}
