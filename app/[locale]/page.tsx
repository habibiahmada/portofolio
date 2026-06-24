import { CTA } from '@/components/sections/cta'
import { HeroSection } from '@/components/sections/hero'
import { Projects } from '@/components/sections/projects'
import { Services } from '@/components/sections/services'
import { Companies } from '@/components/sections/companies'
import { getLocale } from 'next-intl/server'

export default async function Home() {
  const locale = await getLocale()
  return (
    <div className="w-full noise-bg">
      <HeroSection />
      <Companies />
      <Projects locale={locale} />
      <Services />
      <CTA/>
    </div>
  )
}
