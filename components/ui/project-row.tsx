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
    <li className="group relative flex min-h-20 items-center gap-4 py-3 transition-colors has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-brand">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-1 ring-black/5 dark:ring-white/10">
        <Image src={project.image} alt={shortTitle} fill className="object-cover" sizes="64px" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <h3 className="font-heading text-base font-bold leading-snug tracking-tight text-foreground">
          {detailHref ? (
            <Link
              href={detailHref}
              transitionTypes={['nav-forward']}
              className="outline-none after:absolute after:inset-0 after:content-[''] group-hover:text-brand"
            >
              {shortTitle}
            </Link>
          ) : (
            shortTitle
          )}
        </h3>
        {subtitle && <p className="text-sm leading-snug text-muted-foreground">{subtitle}</p>}
        <ProjectMeta project={project} maxTags={0} />
      </div>

      <LiveLink url={project.live_url} title={shortTitle} />
    </li>
  )
}
