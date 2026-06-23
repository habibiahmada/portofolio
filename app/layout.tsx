import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://habibiahmad.dev'),
  title: {
    default: 'Habibi Ahmad | Full-Stack Web Developer',
    template: '%s | Habibi Ahmad',
  },
  description:
    'Full-stack web developer crafting beautiful, performant digital experiences — from concept to deployment.',
  keywords: [
    'full-stack developer',
    'web developer',
    'Next.js',
    'React',
    'TypeScript',
    'frontend',
    'backend',
    'Habibi Ahmad',
  ],
  authors: [{ name: 'Habibi Ahmad', url: 'https://habibiahmad.dev' }],
  creator: 'Habibi Ahmad',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://habibiahmad.dev',
    siteName: 'Habibi Ahmad',
    title: 'Habibi Ahmad | Full-Stack Web Developer',
    description:
      'Full-stack web developer crafting beautiful, performant digital experiences — from concept to deployment.',
    images: [
      {
        url: '/images/habibiahmada.png',
        width: 1200,
        height: 630,
        alt: 'Habibi Ahmad — Full-Stack Web Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Habibi Ahmad | Full-Stack Web Developer',
    description:
      'Full-stack web developer crafting beautiful, performant digital experiences — from concept to deployment.',
    images: ['/images/habibiahmada.png'],
    creator: '@habibiahmad',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png',  media: '(prefers-color-scheme: dark)'  },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-full flex flex-col font-sans antialiased">
        {/* Curtain overlay — z-index:1, content wrapper z-index:2 */}
        <div id="theme-curtain" aria-hidden="true" />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="relative flex flex-col flex-1" style={{ zIndex: 2 }}>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
