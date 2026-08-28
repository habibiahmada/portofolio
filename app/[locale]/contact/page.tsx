import type { Metadata } from 'next'
import { ContactHero } from '@/components/sections/contact/contact-hero'
import { ContactForm } from '@/components/sections/contact/contact-form'
import { ContactInfo } from '@/components/sections/contact/contact-info'

export const metadata: Metadata = {
  title: 'Contact | Habibi Ahmad',
  description: 'Get in touch with Habibi Ahmad for your next project',
}

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactForm />
      <ContactInfo />
    </>
  )
}
