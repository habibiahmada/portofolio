import { CTA } from '@/components/sections/cta'
import { HeroSection } from '@/components/sections/hero'
import { Projects } from '@/components/sections/projects'
import { Services } from '@/components/sections/services'
import { Companies } from '@/components/sections/companies'
import { Navbar } from '@/components/navigation'
import { Footer } from '@/components/sections/footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="noise-bg">
        <div className="w-full">
          <HeroSection />
          <Companies />
          <Projects />
          <Services />
          <CTA />
        </div>
      </main>
      <Footer />
    </>
  )
}
