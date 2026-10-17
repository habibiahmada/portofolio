import type { Metadata } from 'next'
import { ProjectsPage } from '@/components/sections/projects-page'
import { getProjects } from '@/lib/data/projects'
import { pageMetadata, SITE_COPY } from '@/lib/site-metadata'
import { PageTransition } from '@/components/page-transition'

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Projects by Habibi Ahmad Aziz',
    description: SITE_COPY.projectsDescription,
    path: '/projects',
    absoluteTitle: true,
    keywords: [
      'Habibi Ahmad Aziz projects',
      'portfolio case studies',
      'Webekspres',
      'JepangKu',
      'Terraju',
      'E-Vote',
      'Agrify',
      'CultureConnect',
      'BagiBerkah',
      'Aksara Pustaka',
    ],
  }),
}

export default async function ProjectsPageRoute() {
  const { items: projects } = await getProjects({ page: 1, pageSize: 100 })

  return (
    <PageTransition>
    <main className="min-h-screen bg-background">
      <ProjectsPage locale="en" initialData={projects} />
    </main>
    </PageTransition>
  )
}
