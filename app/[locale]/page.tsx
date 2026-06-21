import { Hero } from '@/components/sections/hero'
import { Stats } from '@/components/sections/stats'
import { Projects } from '@/components/sections/projects'
import { Services } from '@/components/sections/services'
import { CTA } from '@/components/sections/cta'

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Projects />
      <Services />
      <CTA />
    </>
  )
}
