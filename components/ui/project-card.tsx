'use client'

import Image from 'next/image'
import { ViewTransition } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getProjectTitle, hasPublicProjectUrl, type Project } from '@/lib/projects'
import { getCaseStudySlugByProjectId } from '@/lib/data/case-studies'
import { getProjectTaxonomy, ORIGIN_LABEL } from '@/lib/data/project-taxonomy'
import { getCardSubtitle } from '@/lib/data/card-subtitle'
import { cn } from '@/lib/utils'
import { projectMediaTransitionName } from '@/lib/view-transitions'

export type CardVariant = 'featured' | 'archive'

export interface ProjectCardProps {
  project: Project & { outcome?: string | null }
  locale?: string
  index: number
  /** Featured cards load their image eagerly; the layout is the same. */
  variant?: CardVariant
}

/** Shared by cards and rows: detail page href for a project, if any. */
export function projectDetailHref(projectId: string): string | null {
  const slug = getCaseStudySlugByProjectId(projectId) ?? getProjectTaxonomy(projectId)?.slug ?? null
  return slug ? `/projects/${slug}` : null
}

/** One line of meta: origin, year, then tags, never wrapping. */
export function ProjectMeta({ project, maxTags }: { project: Project; maxTags: number }) {
  const taxonomy = getProjectTaxonomy(project.id)
  const origin = taxonomy ? ORIGIN_LABEL[taxonomy.origin] : null
  const tags = project.tags.slice(0, maxTags)
  const rest = project.tags.length - tags.length
  return (
    <p className="truncate font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
      {[origin, project.year, ...tags].filter(Boolean).join(' · ')}
      {rest > 0 ? ` +${rest}` : ''}
    </p>
  )
}

/** Live link with a 44px hit area; sits above the card's stretched link. */
export function LiveLink({ url, title }: { url: string; title: string }) {
  if (!hasPublicProjectUrl(url)) return null
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${title} live site`}
      className="relative z-10 inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-full px-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-brand transition-colors hover:bg-brand/10"
    >
      Live
      <ArrowUpRight size={12} strokeWidth={1.75} aria-hidden />
    </a>
  )
}

/**
 * Image card for featured work and web applications. Horizontal under 640px
 * (96px thumbnail beside the text) so a phone does not scroll through one
 * full-width image per project; a 16:10 image card from 640px up.
 */
export function ProjectCard({ project, locale = 'en', index, variant = 'archive' }: ProjectCardProps) {
  const title = getProjectTitle(project, locale)
  const shortTitle = title.includes(':') ? title.split(':')[0].trim() : title
  const subtitle = getCardSubtitle(project)
  const detailHref = projectDetailHref(project.id)
  const outcome = project.outcome?.trim()

  return (
    <article
      className={cn(
        'group relative flex flex-row gap-4 overflow-hidden rounded-2xl p-3 sm:flex-col sm:gap-0 sm:p-0',
        'border border-black/10 bg-white dark:border-white/10 dark:bg-zinc-950',
        // Glitch hover is the site motif; the border shift is the only other state change.
        'hover-glitch-card transition-colors duration-300 hover:border-brand/40',
        'has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-brand has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-background',
      )}
    >
      <ViewTransition name={projectMediaTransitionName(project.id)} share="morph" default="none">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/5 dark:ring-white/10 sm:h-auto sm:w-full sm:rounded-none sm:ring-0 sm:aspect-16/10">
          <Image
            src={project.image}
            alt={shortTitle}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 96px, (max-width: 1024px) 50vw, 33vw"
            priority={variant === 'featured' && index < 2}
          />
        </div>
      </ViewTransition>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:gap-2 sm:p-5">
        <div className="sm:hidden">
          <ProjectMeta project={project} maxTags={1} />
        </div>
        <div className="hidden sm:block">
          <ProjectMeta project={project} maxTags={2} />
        </div>

        <h3 className="font-heading text-base font-bold leading-snug tracking-tight text-foreground sm:text-lg">
          {detailHref ? (
            <Link
              href={detailHref}
              transitionTypes={['nav-forward']}
              className="outline-none after:absolute after:inset-0 after:content-[''] hover:text-brand"
            >
              {shortTitle}
            </Link>
          ) : (
            shortTitle
          )}
        </h3>

        {subtitle && <p className="text-sm leading-relaxed text-muted-foreground">{subtitle}</p>}

        {(outcome || hasPublicProjectUrl(project.live_url)) && (
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
            {outcome ? (
              <span className="rounded-full border border-brand/40 bg-brand/10 px-2.5 py-1 text-[11px] font-medium text-foreground">
                {outcome}
              </span>
            ) : (
              <span />
            )}
            <LiveLink url={project.live_url} title={shortTitle} />
          </div>
        )}
      </div>
    </article>
  )
}
