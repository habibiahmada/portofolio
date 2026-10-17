'use client'

import { ViewTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import {
  getProjectTitle,
  getProjectDescription,
  hasPublicProjectUrl,
  type Project,
} from '@/lib/projects'
import { getCaseStudySlugByProjectId } from '@/lib/data/case-studies'
import { getProjectTaxonomy, ORIGIN_LABEL } from '@/lib/data/project-taxonomy'
import { projectMediaTransitionName } from '@/lib/view-transitions'
import { cn } from '@/lib/utils'

export interface FeaturedProjectCardProps {
  project: Project & { outcome?: string | null }
  locale?: string
  index: number
  className?: string
}

/**
 * Homepage-only featured card. Compact horizontal layout: a 4:3 thumbnail
 * beside the text, so six cards read as a tidy two-column list instead of a
 * wall of large images. The archive keeps using `ProjectCard`.
 */
export function FeaturedProjectCard({
  project,
  locale = 'en',
  index,
  className,
}: FeaturedProjectCardProps) {
  const title = getProjectTitle(project, locale)
  const shortTitle = title.includes(':') ? title.split(':')[0].trim() : title
  const description = getProjectDescription(project, locale)
  const taxonomy = getProjectTaxonomy(project.id)
  const originLabel = taxonomy ? ORIGIN_LABEL[taxonomy.origin] : null
  const detailSlug = getCaseStudySlugByProjectId(project.id) ?? taxonomy?.slug ?? null
  const detailHref = detailSlug ? `/projects/${detailSlug}` : null
  const outcome = project.outcome?.trim()
  const showLive = hasPublicProjectUrl(project.live_url)
  const tags = project.tags.slice(0, 3)

  return (
    <article
      style={{ animationDelay: `${index * 70}ms` }}
      className={cn(
        'group relative grid grid-cols-1 gap-4 overflow-hidden rounded-2xl p-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-5',
        // Follows the theme: white card in light mode, near-black in dark mode.
        'border border-black/10 bg-white dark:border-white/10 dark:bg-zinc-950',
        'animate-fade-in-up transition-colors duration-300',
        'hover:border-brand/40',
        // The title link is stretched over the card, so the card shows its focus ring.
        'has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-brand has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-background',
        className,
      )}
    >
      {/* Thumbnail: morphs into the case study hero on navigation. */}
      <ViewTransition name={projectMediaTransitionName(project.id)} share="morph" default="none">
        <div className="relative aspect-video sm:aspect-4/3 overflow-hidden rounded-xl ring-1 ring-black/5 dark:ring-white/10 self-start">
          <Image
            src={project.image}
            alt={shortTitle}
            fill
            priority={index < 2}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 240px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>
      </ViewTransition>

      <div className="relative z-10 flex min-w-0 flex-col gap-2.5 pb-1 pr-1 sm:py-1">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <span className="text-foreground">{String(index + 1).padStart(2, '0')}</span>
            <span>{project.year}</span>
            {originLabel && <span className="truncate text-brand">{originLabel}</span>}
          </div>

          {showLive && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${shortTitle} live site`}
              className="relative z-20 inline-flex min-h-8 shrink-0 items-center gap-1 rounded-full border border-black/15 dark:border-white/15 px-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground transition-colors hover:border-brand/60"
            >
              Live
              {/* External link cue: this one leaves the site. */}
              <ArrowUpRight size={11} strokeWidth={1.8} aria-hidden />
            </a>
          )}
        </div>

        <h3 className="font-heading text-xl font-black leading-tight tracking-tight text-foreground text-balance sm:text-2xl">
          {detailHref ? (
            <Link
              href={detailHref}
              transitionTypes={['nav-forward']}
              className="outline-none after:absolute after:inset-0 after:z-0 after:content-['']"
            >
              {shortTitle}
            </Link>
          ) : (
            shortTitle
          )}
        </h3>

        {outcome && (
          <span className="w-fit max-w-full truncate rounded-full border border-brand/40 bg-brand/10 px-2.5 py-1 text-[11px] font-medium text-foreground">
            {outcome}
          </span>
        )}

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{description}</p>

        <div className="mt-auto flex min-w-0 items-center justify-between gap-3 pt-1">
          <span className="truncate font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {tags.join(' · ')}
          </span>
          {detailHref && (
            <span
              aria-hidden
              className="inline-flex shrink-0 items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground"
            >
              <span className="h-px w-5 bg-brand transition-all duration-500 group-hover:w-9" />
              Case study
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
