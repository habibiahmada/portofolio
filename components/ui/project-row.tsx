'use client'

import Image from 'next/image'
import Link from 'next/link'
import { getProjectTitle, type Project } from '@/lib/projects'
import { getCardSubtitle } from '@/lib/data/card-subtitle'
import { LiveLink, ProjectMeta, projectDetailHref } from '@/components/ui/project-card'

/**
 * Compact row for business websites and catalogs: many similar client
 * sites, so each takes one line of the list instead of a full card.
 * Render inside a <ul>.
 */
export function ProjectRow({ project, locale = 'en' }: { project: Project; locale?: string }) {
  const title = getProjectTitle(project, locale)
  const shortTitle = title.includes(':') ? title.split(':')[0].trim() : title
  const subtitle = getCardSubtitle(project)
  const detailHref = projectDetailHref(project.id)

  return (
    <li className="group relative flex items-center gap-4 py-4 transition-colors sm:gap-5 sm:py-5 has-[a[data-stretched]:focus-visible]:outline-2 has-[a[data-stretched]:focus-visible]:outline-brand">
      {/* Landscape thumbnail: these are website screenshots, so a square crop hid most of them. */}
      <div className="relative aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-lg ring-1 ring-black/5 sm:w-44 dark:ring-white/10">
        <Image
          src={project.image}
          alt={shortTitle}
          fill
          className="object-cover object-top transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
          sizes="(min-width: 640px) 176px, 112px"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="font-heading text-lg font-bold leading-snug tracking-tight text-foreground sm:text-xl">
          {detailHref ? (
            <Link
              href={detailHref}
              transitionTypes={['nav-forward']}
              data-stretched
              className="outline-none after:absolute after:inset-0 after:content-[''] group-hover:text-brand"
            >
              {shortTitle}
            </Link>
          ) : (
            shortTitle
          )}
        </h3>
        {subtitle && <p className="text-sm leading-snug text-muted-foreground sm:text-base">{subtitle}</p>}
        <div className="hidden sm:block">
          <ProjectMeta project={project} maxTags={0} />
        </div>
      </div>

      <LiveLink url={project.live_url} title={shortTitle} />
    </li>
  )
}
