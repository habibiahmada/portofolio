import type { Metadata } from 'next'
import { ProjectsPage } from '@/components/sections/projects-page'
import { getProjects } from '@/lib/data/projects'
import { pageMetadata, SITE_COPY } from '@/lib/site-metadata'

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Projects',
    description: SITE_COPY.projectsDescriptionId,
    path: '/projects',
  }),
}

export default async function ProjectsPageRoute() {
  const { items: projects } = await getProjects({ page: 1, pageSize: 100 })

  return (
    <main className="min-h-screen bg-background">
      <ProjectsPage locale="en" initialData={projects} />
    </main>
  )
}
