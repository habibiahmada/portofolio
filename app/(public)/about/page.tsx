import type { Metadata } from 'next'
import { AboutHero } from '@/components/sections/about-hero'
import { AboutIntro } from '@/components/sections/about-intro'
import { AboutTechStack } from '@/components/sections/about-tech-stack'
import { AboutTimeline } from '@/components/sections/about-timeline'
import { Certificates } from '@/components/sections/certificates'
import { CTA } from '@/components/sections/cta'
import { getPinnedCertificates, getNonPinnedCertificates } from '@/lib/data/certificates'
import { pageMetadata, SITE_COPY } from '@/lib/site-metadata'

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'About Habibi Ahmad Aziz',
    description: SITE_COPY.aboutDescription,
    path: '/about',
    image: '/images/habibiahmada.webp',
    imageWidth: 600,
    imageHeight: 600,
    imageAlt: 'Portrait of Habibi Ahmad Aziz, Fullstack Developer from Karawang',
    absoluteTitle: true,
    ogType: 'profile',
    keywords: [
      'about Habibi Ahmad Aziz',
      'SMKN 1 Karawang',
      'Webekspres',
      'certificates Habibi Ahmad',
      'Web Developer Karawang',
    ],
  }),
}

export default async function Page() {
  const [pinnedCerts, nonPinnedPage] = await Promise.all([
    getPinnedCertificates(),
    // All non-pinned (~50 items); client slices for Load More
    getNonPinnedCertificates(1, 100),
  ])

  return (
    <main className="w-full overflow-x-hidden">
      <AboutHero />
      <AboutIntro />
      <AboutTechStack />
      <AboutTimeline />
      <Certificates
        initialPinned={pinnedCerts}
        initialNonPinned={nonPinnedPage.items}
      />
      <CTA />
    </main>
  )
}
