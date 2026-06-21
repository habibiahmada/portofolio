import type { Metadata } from 'next'
import { AboutHero } from '@/components/sections/about/about-hero'
import { AboutExperience } from '@/components/sections/about/about-experience'
import { AboutSkills } from '@/components/sections/about/about-skills'
import { CTA } from '@/components/sections/cta'

export const metadata: Metadata = {
  title: 'About | Habibi Ahmad',
  description: 'Learn more about Habibi Ahmad and my experience as a full-stack web developer',
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutExperience />
      <AboutSkills />
      <CTA />
    </>
  )
}
