import type { Metadata } from 'next'
import { CTA } from '@/components/sections/cta'
import { HeroSection } from '@/components/sections/hero'
import { Projects } from '@/components/sections/projects'
import { Services } from '@/components/sections/services'
import { Companies } from '@/components/sections/companies'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Habibi Ahmad Aziz — Full-stack web developer dari Karawang, Indonesia. Spesialis Next.js, React, Laravel, WordPress. Jasa pembuatan website profesional, web design, frontend & backend development, CMS, dan optimasi performa web.',
  openGraph: {
    title: 'Habibi Ahmad Aziz | Web Developer Karawang — Full-Stack Developer Indonesia',
    description:
      'Full-stack web developer dari Karawang. Jasa pembuatan website profesional dengan Next.js, React, Laravel, WordPress. 🚀',
  },
  alternates: {
    canonical: 'https://habibiahmad.dev',
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
