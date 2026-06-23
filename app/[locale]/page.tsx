import { CTA } from '@/components/sections/cta'
import { HeroSection } from '@/components/sections/hero'
import { Projects } from '@/components/sections/projects'
import { Services } from '@/components/sections/services'
import { Companies } from '@/components/sections/companies'

export default function Home() {
  return (
    <div className="max-w-[110em] mx-auto border-x border-zinc-400">
      <HeroSection />
      <Companies />
      <Projects />
      <Services />
      <CTA/>
    </div>
  )
}
