import type { Metadata } from 'next'
import { ProjectsPage } from '@/components/sections/projects-page'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'A curated collection of all projects by Habibi Ahmad — from production applications to experimental side projects.',
}

export default function ProjectsPageRoute() {
  return (
    <main className="min-h-screen bg-background">
      <ProjectsPage locale="en" />
    </main>
  )
}
