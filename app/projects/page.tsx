import type { Metadata } from 'next'
import { ProjectsPage } from '@/components/sections/projects-page'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Portofolio proyek web development oleh Habibi Ahmad Aziz — dari aplikasi produksi hingga proyek eksperimental. Termasuk aplikasi library, sistem pengaduan sekolah, manajemen parkir, platform THR digital, e-vote, AI pertanian, platform pariwisata budaya, dan manajemen sekolah terpadu.',
  openGraph: {
    title: 'Projects Portfolio | Habibi Ahmad — Web Developer',
    description:
      'Koleksi proyek web development oleh Habibi Ahmad Aziz: Laravel, Next.js, React, AI, dan banyak lagi.',
  },
  alternates: {
    canonical: 'https://habibiahmad.dev/projects',
  },
}

export default function ProjectsPageRoute() {
  return (
    <main className="min-h-screen bg-background">
      <ProjectsPage locale="en" />
    </main>
  )
}
