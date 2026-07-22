import { Navbar } from '@/components/navigation'
import { Footer } from '@/components/sections/footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
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

      <div className="relative flex flex-col flex-1" style={{ zIndex: 2 }}>
        <Navbar />
        {children}
        <Footer />
      </div>
    </>
  )
}

