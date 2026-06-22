import type { Metadata } from 'next'
import { Navbar } from '@/components/navigation'
import { Footer } from '@/components/sections/footer'

export const metadata: Metadata = {
  title: 'Habibi Ahmad | Full-Stack Web Developer',
  description: 'Full-stack web developer crafting beautiful, performant digital experiences',
}

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'id' }]
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
