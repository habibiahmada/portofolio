'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { GitFork, ExternalLink } from 'lucide-react'
import { ProjectTag } from '@/components/ui/project-tag'
import { ProjectLinks } from '@/components/ui/project-links'
import { EASING, getProjectTitle, getProjectDescription, type Project } from '@/lib/projects'
import { cn } from '@/lib/utils'

// ─── Types ──────────────────────────────────────────────────────────────────

export type CardVariant = 'featured' | 'archive'

export interface ProjectCardProps {
  project: Project
  locale?: string
  index: number
  /** Visual style variant. Default: 'featured' */
  variant?: CardVariant
}

// ─── Variants ───────────────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.08,
      ease: EASING,
    },
  }),
}

// ─── Quick-link button (used in image overlay) ──────────────────────────────

function QuickLink({
  href,
  label,
  children,
  variant,
}: {
  href: string
  label: string
  children: React.ReactNode
  variant: CardVariant
}) {
  if (href === '#') return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        'w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200',
        variant === 'featured'
          ? 'bg-black/40 backdrop-blur-sm border border-white/10 text-white/80 hover:text-white hover:bg-black/60'
          : 'bg-white/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/30',
      )}
    >
      {children}
    </a>
  )
}

// ─── ProjectCard ────────────────────────────────────────────────────────────

export function ProjectCard({
  project,
  locale = 'en',
  index,
  variant = 'featured',
}: ProjectCardProps) {
  const title = getProjectTitle(project, locale)
  const description = getProjectDescription(project, locale)
  const isFeatured = variant === 'featured'

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-500',
        isFeatured
          ? 'border border-black/5 bg-white/80 backdrop-blur-sm hover-glitch-card hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] dark:border-white/[0.08] dark:bg-zinc-900/60 dark:hover:border-white/[0.12] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]'
          : 'border border-black/5 dark:border-white/5 bg-white/60 dark:bg-zinc-950/40 backdrop-blur-sm hover-glitch-card hover:border-black/15 dark:hover:border-white/15 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/40',
      )}
    >
      {/* ── Image Container ── */}
      <div className="relative overflow-hidden aspect-[16/10]">
        <Image
          src={project.image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={index < 2}
        />

        {/* Gradient overlay */}
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            isFeatured
              ? 'bg-linear-to-t from-black/30 via-black/5 to-transparent'
              : 'bg-linear-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100',
          )}
        />

        {/* Ring accent (archive only) */}
        {!isFeatured && (
          <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 group-hover:ring-red-500/20 dark:group-hover:ring-blue-400/20 transition-all duration-500 rounded-2xl" />
        )}

        {/* Index badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-widest text-white/90 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Year — featured: always on image; archive: on hover at top-right */}
        {isFeatured ? (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="text-[9px] font-mono tracking-wider text-white/70 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/5">
              {project.year}
            </span>
          </div>
        ) : (
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-1 group-hover:translate-y-0">
            <span className="text-[10px] font-mono text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
              {project.year}
            </span>
          </div>
        )}

        {/* Quick links */}
        <div
          className={cn(
            'absolute z-10 flex gap-1.5 transition-all duration-400',
            isFeatured
              ? 'top-3 right-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'
              : 'bottom-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0',
          )}
        >
          <QuickLink href={project.github_url} label="GitHub Repository" variant={variant}>
            <GitFork size={12} strokeWidth={1.75} />
          </QuickLink>
          <QuickLink href={project.live_url} label="Live Demo" variant={variant}>
            {isFeatured ? (
              <ExternalLink size={12} strokeWidth={1.75} />
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            )}
          </QuickLink>
        </div>
      </div>

      {/* ── Content ── */}
      <div
        className={cn(
          'flex flex-col flex-1',
          isFeatured ? 'p-4 md:p-5 gap-2.5' : 'p-5 md:p-6 gap-3',
        )}
      >
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <ProjectTag key={tag}>{tag}</ProjectTag>
          ))}
          {project.tags.length > 3 && (
            <span
              className={cn(
                'text-[9px] font-mono self-center',
                isFeatured ? 'text-muted-foreground/50' : 'text-muted-foreground/40',
              )}
            >
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className={cn(
            'font-semibold tracking-tight text-foreground leading-snug line-clamp-2',
            isFeatured ? 'text-sm md:text-[15px]' : 'text-[15px] md:text-lg',
          )}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className={cn(
            'leading-relaxed line-clamp-2 flex-1 text-muted-foreground/70',
            isFeatured ? 'text-[11px] sm:text-xs' : 'text-xs md:text-sm',
          )}
        >
          {description}
        </p>

        {/* Footer */}
        {isFeatured ? (
          <div className="flex items-center justify-end pt-2.5 border-t border-black/[0.04] dark:border-white/[0.06] mt-auto">
            <ProjectLinks githubUrl={project.github_url} liveUrl={project.live_url} />
          </div>
        ) : (
          <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/5 mt-auto">
            <span className="text-[10px] font-mono text-muted-foreground/40 flex items-center gap-1.5">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {project.year}
            </span>
            <ProjectLinks githubUrl={project.github_url} liveUrl={project.live_url} hover />
          </div>
        )}
      </div>
    </motion.article>
  )
}
