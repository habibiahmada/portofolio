import { AboutHero } from '@/components/sections/about-hero'
import { AboutIntro } from '@/components/sections/about-intro'
import { AboutTechStack } from '@/components/sections/about-tech-stack'
import { AboutTimeline } from '@/components/sections/about-timeline'
import { CTA } from '@/components/sections/cta'

export default function Page() {
  return (
    <main className="w-full overflow-x-hidden">
      <AboutHero />
      <AboutIntro />
      <AboutTechStack />
      <AboutTimeline />
      <CTA />
    </main>
  )
}
