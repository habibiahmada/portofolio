'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { ArrowUpRight, GitFork } from 'lucide-react'
import { motion } from 'framer-motion'
import projectsData from '@/public/data/projects.json'

type Project = {
  id: string
  title_en: string
  title_id: string
  description_en: string
  description_id: string
  image: string
  tags: string[]
  live_url: string
  github_url: string
  year: number
}

const projects: Project[] = projectsData as Project[]

interface ProjectsProps {
  locale?: string
}

// ─── Card Variants ──────────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.215, 0.61, 0.355, 1] as any,
    },
  }),
}

// ─── Project Card ───────────────────────────────────────────────────────────

function ProjectCard({
  project,
  locale,
  index,
  featured = false,
}: {
  project: Project
  locale: string
  index: number
  featured?: boolean
}) {
  const title = locale === 'id' ? project.title_id : project.title_en
  const description = locale === 'id' ? project.description_id : project.description_en

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-950 hover:border-black/10 dark:hover:border-white/10 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/30 transition-all duration-500 ${featured ? 'sm:col-span-2' : ''
        }`}
    >
      {/* ── Image ── */}
      <div className={`relative overflow-hidden ${featured ? 'aspect-16/7' : 'aspect-4/3'}`}>
        <Image
          src={project.image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          sizes={featured ? '(max-width: 640px) 100vw, 66vw' : '(max-width: 640px) 100vw, 33vw'}
          priority={index < 2}
        />
        {/* Subtle bottom vignette for readability */}
        <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent" />

        {/* Index badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="text-[10px] font-mono font-bold tracking-widest text-white bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Quick-access links */}
        <div className="absolute top-4 right-4 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {project.github_url !== '#' && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/80 hover:text-white hover:bg-black/70 transition-all duration-200"
            >
              <GitFork size={13} strokeWidth={1.75} />
            </a>
          )}
          {project.live_url !== '#' && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Live Demo"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/80 hover:text-white hover:bg-black/70 transition-all duration-200"
            >
              <ArrowUpRight size={14} strokeWidth={1.75} />
            </a>
          )}
        </div>
      </div>

      {/* ── Content (Always Visible) ── */}
      <div className="flex flex-col flex-1 p-5 md:p-6 gap-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border border-black/5 dark:border-white/5 bg-black/2 dark:bg-white/2 text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className={`font-bold tracking-tight text-foreground leading-snug ${featured ? 'text-xl md:text-2xl' : 'text-base md:text-lg'
          }`}>
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed flex-1 line-clamp-2">
          {description}
        </p>

        {/* Footer: Year + Link */}
        <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/5 mt-auto">
          <span className="text-[10px] font-mono text-muted-foreground/50 tracking-wider">
            {project.year}
          </span>
          <div className="flex gap-2">
            {project.github_url !== '#' && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Source"
                className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                <GitFork size={11} strokeWidth={1.5} />
                Source
              </a>
            )}
            {project.live_url !== '#' && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Live"
                className="flex items-center gap-1 text-[10px] font-mono text-rose-500 hover:text-rose-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-semibold"
              >
                Live
                <ArrowUpRight size={11} strokeWidth={1.75} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function Projects({ locale = 'en' }: ProjectsProps) {
  const [featured, ...rest] = projects

  return (
    <section
      id="projects"
      className="relative py-24 w-full bg-transparent"
    >
      <div className="w-full  mx-auto px-6 md:px-12 lg:px-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6"
        >
          <div className="space-y-3">
            <span className="text-xs font-mono tracking-widest text-rose-500 dark:text-blue-400 uppercase block">
              // Selected Works
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
              Featured Projects
            </h2>
          </div>
          <span className="text-xs font-mono text-muted-foreground/70 bg-black/3 dark:bg-white/3 px-3.5 py-1.5 rounded-full border border-black/5 dark:border-white/5 self-start sm:self-auto shrink-0">
            {projects.length} Case Studies
          </span>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {/* Featured spans 2 cols on ≥sm */}
          {featured && (
            <ProjectCard
              project={featured}
              locale={locale}
              index={0}
              featured
            />
          )}

          {/* Remaining cards */}
          {rest.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              locale={locale}
              index={i + 1}
            />
          ))}
        </div>

      </div>
    </section>
  )
}