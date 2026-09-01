import projectsData from '@/public/data/projects.json'

export type Project = {
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
  role?: string
  outcome?: string
}

/** Shared cubic-bezier easing used across project cards */
export const EASING = [0.215, 0.61, 0.355, 1] as any

export const projects: Project[] = projectsData as Project[]

export function getProjectTitle(project: Project, locale: string): string {
  return locale === 'id' ? project.title_id : project.title_en
}

export function getProjectDescription(project: Project, locale: string): string {
  return locale === 'id' ? project.description_id : project.description_en
}

/** True for a real http(s) URL. Empty strings and `#` placeholders stay hidden. */
export function hasPublicProjectUrl(url?: string | null): url is string {
  if (!url) return false
  const trimmed = url.trim()
  return trimmed.length > 0 && trimmed !== '#'
}
