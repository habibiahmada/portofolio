'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import {
  getProjectTitle,
  getProjectDescription,
  hasPublicProjectUrl,
  type Project,
} from '@/lib/projects'
import { getCaseStudySlugByProjectId } from '@/lib/data/case-studies'
import { getProjectTaxonomy, ORIGIN_LABEL } from '@/lib/data/project-taxonomy'
import { cn } from '@/lib/utils'

export interface FeaturedProjectCardProps {
  project: Project & { outcome?: string | null }
  locale?: string
  index: number
  /** `hero` is the large 2x2 bento tile on desktop. */
  size?: 'hero' | 'default'
  className?: string
}

/**
 * Homepage-only featured card: framed project image over an ambient glow taken
 * from the same image, then title, outcome badge, and blurb on a dark panel.
 * The archive keeps using `ProjectCard`, so changes here never touch /projects.
 */
export function FeaturedProjectCard({
  project,
  locale = 'en',
  index,
  size = 'default',
  className,
}: FeaturedProjectCardProps) {
  const isHero = size === 'hero'
  const title = getProjectTitle(project, locale)
  const shortTitle = title.includes(':') ? title.split(':')[0].trim() : title
  const description = getProjectDescription(project, locale)
  const taxonomy = getProjectTaxonomy(project.id)
  const originLabel = taxonomy ? ORIGIN_LABEL[taxonomy.origin] : null
  const detailSlug = getCaseStudySlugByProjectId(project.id) ?? taxonomy?.slug ?? null
  const detailHref = detailSlug ? `/projects/${detailSlug}` : null
  const outcome = project.outcome?.trim()
  const showLive = hasPublicProjectUrl(project.live_url)
  const tags = project.tags.slice(0, isHero ? 4 : 3)

  return (
    <article
      style={{ animationDelay: `${index * 90}ms` }}
      className={cn(
        'group relative isolate flex h-full flex-col overflow-hidden rounded-3xl',
        'border border-black/10 bg-zinc-950 dark:border-white/10',
        'animate-fade-in-up transition-all duration-500 ease-out',
        'hover:-translate-y-1 hover:border-brand/40 hover:shadow-2xl hover:shadow-brand/15',
        'focus-within:border-brand/50',
        className,
      )}
    >
      {/* Ambient glow: the project image, blurred, tints the whole card. */}
      <div aria-hidden className="-z-20 absolute inset-0 overflow-hidden">
        <Image
          src={project.image}
          alt=""
          fill
          sizes="40vw"
          className="scale-125 object-cover opacity-45 blur-3xl saturate-150 transition-opacity duration-700 group-hover:opacity-70"
        />
      </div>
      <div
        aria-hidden
        className="-z-10 absolute inset-0 bg-linear-to-b from-zinc-950/40 via-zinc-950/80 to-zinc-950"
      />

      {/* Framed project image */}
      <div className={cn('relative p-3', isHero && 'md:p-4')}>
        <div className="relative aspect-[1200/630] overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]">
          <Image
            src={project.image}
            alt={shortTitle}
            fill
            priority={index < 2}
            sizes={
              isHero
                ? '(max-width: 1024px) 100vw, 60vw'
                : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw'
            }
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />

          <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between p-3">
            <span className="rounded-full border border-white/15 bg-black/50 px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.2em] text-white/90 backdrop-blur-md">
              {String(index + 1).padStart(2, '0')}
              <span className="ml-2 font-normal text-white/55">{project.year}</span>
            </span>

            {showLive && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${shortTitle} live site`}
                className="relative z-20 inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/90 backdrop-blur-md transition-colors hover:border-brand/60 hover:text-white"
              >
                Live
                <ArrowUpRight size={11} strokeWidth={1.8} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className={cn(
          'relative z-10 flex flex-1 flex-col gap-3 px-5 pb-5 pt-2 md:px-6 md:pb-6',
          isHero && 'lg:gap-4 lg:px-8 lg:pb-8',
        )}
      >
        <div className="flex min-w-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
          {originLabel && <span className="shrink-0 text-brand">{originLabel}</span>}
          {originLabel && tags.length > 0 && (
            <span aria-hidden className="text-white/25">
              /
            </span>
          )}
          <span className="truncate">{tags.join(' · ')}</span>
        </div>

        <h3
          className={cn(
            'font-heading font-black leading-[0.95] tracking-tight text-white text-balance',
            isHero ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-2xl',
          )}
        >
          {detailHref ? (
            <Link
              href={detailHref}
              className="outline-none after:absolute after:inset-0 after:z-0 after:content-['']"
            >
              {shortTitle}
            </Link>
          ) : (
            shortTitle
          )}
        </h3>

        {outcome && (
          <span className="inline-flex w-fit max-w-full items-center gap-1.5 rounded-full border border-brand/40 bg-brand/15 px-2.5 py-1 text-[11px] font-medium text-white">
            <Sparkles size={11} strokeWidth={2} className="shrink-0 text-brand" />
            <span className="truncate">{outcome}</span>
          </span>
        )}

        <p
          className={cn(
            'text-sm leading-relaxed text-white/70',
            isHero ? 'max-w-2xl line-clamp-3 lg:text-base' : 'line-clamp-2',
          )}
        >
          {description}
        </p>

        {detailHref && (
          <span
            aria-hidden
            className="mt-auto inline-flex items-center gap-2 pt-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90"
          >
            <span className="h-px w-6 bg-brand transition-all duration-500 group-hover:w-10" />
            View case study
            <ArrowUpRight
              size={13}
              strokeWidth={1.8}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        )}
      </div>
    </article>
  )
}
