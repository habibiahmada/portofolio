import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'
import { Navbar } from '@/components/navigation'
import { Footer } from '@/components/sections/footer'
import { JsonLd, rootMetadata } from '@/components/json-ld'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = rootMetadata

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
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}
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
          <JsonLd />
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
