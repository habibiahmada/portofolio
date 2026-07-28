import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/hero'
import { Projects } from '@/components/sections/projects'
import { Companies } from '@/components/sections/companies'
import { HomeBelowFold } from '@/components/sections/home-below-fold'
import { getCompanies } from '@/lib/data/companies'
import {
  FEATURED_PROJECT_IDS,
  getFeaturedProjects,
} from '@/lib/data/projects'
import { pageMetadata, SITE_COPY } from '@/lib/site-metadata'

const base = pageMetadata({
  title: SITE_COPY.defaultTitle,
  description: SITE_COPY.homeDescription,
  path: '',
})

export const metadata: Metadata = {
  ...base,
  title: { absolute: SITE_COPY.defaultTitle },
  openGraph: { ...base.openGraph, title: SITE_COPY.defaultTitle },
  twitter: { ...base.twitter, title: SITE_COPY.defaultTitle },
}

export default async function Home() {
  const [companies, featuredProjects] = await Promise.all([
    getCompanies(),
    getFeaturedProjects([...FEATURED_PROJECT_IDS]),
  ])

  return (
    <main className="w-full overflow-x-hidden">
      <HeroSection />
      <Companies initialData={companies} />
      <Projects initialData={featuredProjects} />
      <HomeBelowFold />
    </main>
  )
}
