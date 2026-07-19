import type { Metadata } from 'next'
import { AboutHero } from '@/components/sections/about-hero'
import { AboutIntro } from '@/components/sections/about-intro'
import { AboutTechStack } from '@/components/sections/about-tech-stack'
import { AboutTimeline } from '@/components/sections/about-timeline'
import { Certificates } from '@/components/sections/certificates'
import { CTA } from '@/components/sections/cta'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Kenali Habibi Ahmad Aziz — Full-stack web developer dari Karawang, lulusan SMKN 1 Karawang jurusan Rekayasa Perangkat Lunak. Saat ini bekerja sebagai Web Developer di PT Webekspres Teknologi Indonesia. Spesialis Next.js, React, Laravel, WordPress, dan pengembangan CMS.',
  openGraph: {
    title: 'About Habibi Ahmad Aziz | Web Developer Karawang',
    description:
      'Full-stack web developer dari Karawang dengan pengalaman di Next.js, React, Laravel, WordPress. Lulusan SMKN 1 Karawang — RPL.',
    images: [
      {
        url: '/images/habibiahmada.webp',
        width: 600,
        height: 600,
        alt: 'Habibi Ahmad Aziz — Web Developer Karawang',
      },
    ],
  },
  alternates: {
    canonical: 'https://habibiahmad.dev/about',
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
