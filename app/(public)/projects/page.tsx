import type { Metadata } from 'next'
import { ProjectsPage } from '@/components/sections/projects-page'

export const metadata: Metadata = {
  title: 'Projects — Web Developer Portfolio',
  description:
    'Portfolio proyek web development oleh Habibi Ahmad Aziz — aplikasi produksi hingga eksperimental: library, e-vote, AI, manajemen sekolah, dan lainnya.',
  openGraph: {
    siteName: 'Habibi Ahmad — Web Developer Karawang',
    title: 'Portofolio Proyek — Habibi Ahmad Web Developer',
    description:
      'Koleksi proyek web development: Laravel, Next.js, React, AI, dan banyak lagi.',
    images: [
      {
        url: '/open-graph/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Habibi Ahmad Aziz — Full-Stack Web Developer Karawang',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portofolio Proyek — Habibi Ahmad Web Developer',
    description:
      'Koleksi proyek web development: Laravel, Next.js, React, AI, dan banyak lagi.',
    images: ['/open-graph/og-image.png'],
  },
  alternates: {
    canonical: 'https://www.habibiahmada.dev/projects',
  },
}

export default function ProjectsPageRoute() {
  return (
    <main className="min-h-screen bg-background">
      <ProjectsPage locale="en" />
    </main>
  )
}
