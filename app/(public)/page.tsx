import type { Metadata } from 'next'
import { CTA } from '@/components/sections/cta'
import { HeroSection } from '@/components/sections/hero'
import { Projects } from '@/components/sections/projects'
import { Services } from '@/components/sections/services'
import { Companies } from '@/components/sections/companies'
import { getCompanies } from '@/lib/data/companies'
import {
  FEATURED_PROJECT_IDS,
  getFeaturedProjects,
} from '@/lib/data/projects'

export const metadata: Metadata = {
  description:
    'Full-stack web developer from Karawang, Indonesia. High-performance web solutions with Next.js, React, Laravel, and WordPress — built to grow your business online.',
  openGraph: {
    siteName: 'Habibi Ahmad — Web Developer Karawang',
    title: 'Web Developer Karawang — Habibi Ahmad Aziz',
    description:
      'High-performance web solutions built with Next.js, React, Laravel & WordPress. Fast, responsive, built to grow your business.',
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
    title: 'Web Developer Karawang — Habibi Ahmad Aziz',
    description:
      'High-performance web solutions built with Next.js, React, Laravel & WordPress. Fast, responsive, built to grow your business.',
    images: ['/open-graph/og-image.png'],
  },
  alternates: {
    canonical: 'https://www.habibiahmada.dev',
  },
}

export default async function Home() {
  const [companies, featuredProjects] = await Promise.all([
    getCompanies(),
    getFeaturedProjects([...FEATURED_PROJECT_IDS]),
  ])

  return (
    <main className="w-full overflow-x-hidden">
      <HeroSection />
      <Companies initialData={companies} />
      <Projects initialData={featuredProjects} />
      <Services />
      <CTA />
    </main>
  )
}
