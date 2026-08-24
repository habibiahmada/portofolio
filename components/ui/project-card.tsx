'use client'

import Image from 'next/image'
import Link from 'next/link'
import { GitFork, ExternalLink } from 'lucide-react'
import { ProjectTag } from '@/components/ui/project-tag'
import { ProjectLinks } from '@/components/ui/project-links'
import { getProjectTitle, getProjectDescription, type Project } from '@/lib/projects'
import { getProjectMeta } from '@/lib/data/project-meta'
import { getCaseStudySlugByProjectId } from '@/lib/data/case-studies'
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
  const shortTitle = title.includes(':') ? title.split(':')[0].trim() : title
  const meta = getProjectMeta(project.id)
  const caseStudySlug = getCaseStudySlugByProjectId(project.id)
  const description =
    (locale === 'id' ? meta?.description_id : meta?.description_en) ??
    getProjectDescription(project, locale)
  const isFeatured = variant === 'featured'
  const detailHref = caseStudySlug ? `/projects/${caseStudySlug}` : null
  const tags = project.tags.slice(0, isFeatured ? 2 : 3)

  return (
    <article
      style={{ animationDelay: `${index * 80}ms` }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-500',
        'animate-fade-in-up',
        isFeatured
          ? 'border border-black/5 bg-white/80 backdrop-blur-sm hover-glitch-card hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] dark:border-white/8 dark:bg-zinc-900/60 dark:hover:border-white/12 dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]'
          : 'border border-black/5 dark:border-white/5 bg-white/60 dark:bg-zinc-950/40 backdrop-blur-sm hover-glitch-card hover:border-black/15 dark:hover:border-white/15 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/40',
      )}
    >
      {/* ── Image Container ── */}
      <div className="relative overflow-hidden aspect-16/10">
        <Image
          src={project.image}
          alt={shortTitle}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={index < 2}
        />

        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            isFeatured
              ? 'bg-linear-to-t from-black/30 via-black/5 to-transparent'
              : 'bg-linear-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100',
          )}
        />

        {!isFeatured && (
          <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 group-hover:ring-brand/20 transition-all duration-500 rounded-2xl" />
        )}

        <div className="absolute top-3 left-3 z-10">
          <span className="text-[10px] font-mono font-bold tracking-widest text-white/90 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {isFeatured ? (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="text-[10px] font-mono tracking-wider text-white/80 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
              {project.year}
            </span>
          </div>
        ) : (
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-1 group-hover:translate-y-0">
            <span className="text-[10px] font-mono text-white/80 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
              {project.year}
            </span>
          </div>
        )}

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

      {/* Content: title + one line blurb + footer. Role/outcome live on /projects/[slug]. */}
      <div className={cn('flex flex-col flex-1', isFeatured ? 'p-5 gap-3' : 'p-5 md:p-6 gap-3')}>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <ProjectTag key={tag}>{tag}</ProjectTag>
            ))}
            {project.tags.length > tags.length && (
              <span className="text-[10px] font-mono self-center text-muted-foreground/50">
                +{project.tags.length - tags.length}
              </span>
            )}
          </div>
        )}

        <h3
          className={cn(
            'font-bold tracking-tight text-foreground leading-snug line-clamp-2',
            isFeatured ? 'text-base md:text-lg' : 'text-base md:text-lg',
          )}
        >
          {detailHref ? (
            <Link href={detailHref} className="hover:text-brand transition-colors">
              {shortTitle}
            </Link>
          ) : (
            shortTitle
          )}
        </h3>

        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2 flex-1">
          {description}
        </p>

        <div
          className={cn(
            'flex items-center justify-between gap-3 mt-auto pt-3',
            'border-t border-black/5 dark:border-white/5',
          )}
        >
          {detailHref ? (
            <Link
              href={detailHref}
              className="text-xs font-mono font-semibold uppercase tracking-wider text-brand hover:underline underline-offset-2"
            >
              Details
            </Link>
          ) : (
            <span className="text-xs font-mono text-muted-foreground/50">{project.year}</span>
          )}
          <ProjectLinks githubUrl={project.github_url} liveUrl={project.live_url} hover={!isFeatured} />
        </div>
      </div>
    </article>
  )
}
