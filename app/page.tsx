import type { Metadata } from 'next'
import { CTA } from '@/components/sections/cta'
import { HeroSection } from '@/components/sections/hero'
import { Projects } from '@/components/sections/projects'
import { Services } from '@/components/sections/services'
import { Companies } from '@/components/sections/companies'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Habibi Ahmad Aziz crafts elegant, high-performance web solutions that empower businesses to succeed. Combining deep expertise in Next.js, React, Laravel, and WordPress, I deliver seamless user experiences and robust back-end systems, helping brands stand out online.',
  openGraph: {
    title: 'Habibi Ahmad Aziz | Web Developer Karawang — Full-Stack Developer',
    description:
      'Elegant, high-performance web solutions that empower businesses to grow, built with Next.js, React, Laravel, and WordPress and another modern technologies.',
    images: [
      {
        url: '/open-graph/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Habibi Ahmad Aziz — Full-Stack Web Developer Karawang',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.habibiahmada.dev',
  },
}

export default function Home() {
  return (
    <>
      <main className="w-full overflow-x-hidden">
        <HeroSection />
        <Companies />
        <Projects />
        <Services />
        <CTA />
      </main>
    </>
  )
}
