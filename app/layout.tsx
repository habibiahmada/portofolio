import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Anek_Tamil } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'
import { Navbar } from '@/components/navigation'
import { Footer } from '@/components/sections/footer'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const anekTamil = Anek_Tamil({ variable: '--font-anek-tamil', subsets: ['latin'] })

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
        url: '/open-graph/og-image.png',
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
    images: ['/open-graph/og-image.png'],
    creator: '@habibiahmad',
  },
  icons: {
    icon: [
      { url: '/icons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: '/icons/apple-touch-icon.png',
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
      className={`${geistSans.variable} ${geistMono.variable} ${anekTamil.variable}`}
    >
      <body className="min-h-full flex flex-col font-sans antialiased">
        {/* Curtain overlay — z-index:1, content wrapper z-index:2 */}
        <div id="theme-curtain" aria-hidden="true" />

        {/* CRT Scanline overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-50 opacity-[0.015]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)',
            backgroundSize: '100% 2px',
            animation: 'scanlines 8s linear infinite',
          }}
          aria-hidden="true"
        />

        {/* CRT subtle flicker */}
        <div
          className="fixed inset-0 pointer-events-none z-50 bg-black"
          style={{ animation: 'crt-flicker 0.15s infinite', opacity: 0.02 }}
          aria-hidden="true"
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="relative flex flex-col flex-1" style={{ zIndex: 2 }}>
            <Navbar />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
