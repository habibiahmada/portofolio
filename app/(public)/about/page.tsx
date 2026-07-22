import type { Metadata } from 'next'
import { AboutHero } from '@/components/sections/about-hero'
import { AboutIntro } from '@/components/sections/about-intro'
import { AboutTechStack } from '@/components/sections/about-tech-stack'
import { AboutTimeline } from '@/components/sections/about-timeline'
import { Certificates } from '@/components/sections/certificates'
import { CTA } from '@/components/sections/cta'

export const metadata: Metadata = {
  title: 'About — Web Developer from Karawang',
  description:
    'Kenali Habibi Ahmad Aziz — full-stack web developer dari Karawang, lulusan SMKN 1 Karawang jurusan RPL. Spesialis Next.js, React, Laravel, WordPress, dan CMS development.',
  openGraph: {
    siteName: 'Habibi Ahmad — Web Developer Karawang',
    title: 'Habibi Ahmad Aziz — Web Developer from Karawang',
    description:
      'Full-stack web developer dari Karawang dengan pengalaman di Next.js, React, Laravel, dan WordPress.',
    images: [
      {
        url: '/images/habibiahmada.webp',
        width: 600,
        height: 600,
        alt: 'Habibi Ahmad Aziz — Web Developer Karawang',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Habibi Ahmad Aziz — Web Developer from Karawang',
    description:
      'Full-stack web developer dari Karawang dengan pengalaman di Next.js, React, Laravel, dan WordPress.',
    images: ['/images/habibiahmada.webp'],
  },
  alternates: {
    canonical: 'https://www.habibiahmada.dev/about',
  },
}

export default function Page() {
  return (
    <main className="w-full overflow-x-hidden">
      <AboutHero />
      <AboutIntro />
      <AboutTechStack />
      <AboutTimeline />
      <Certificates />
      <CTA />
    </main>
  )
}
