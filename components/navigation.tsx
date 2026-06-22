'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { Sun, Moon, Menu, X } from 'lucide-react'

// ─── Theme Toggle with GSAP curtain ──────────────────────────────────────────

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [iconState, setIconState] = useState<'idle' | 'exit' | 'enter'>('idle')

  useEffect(() => { setMounted(true) }, [])

  const handleToggle = useCallback(() => {
    const isDark = resolvedTheme === 'dark'
    const curtain = document.getElementById('theme-curtain')
    if (!curtain || !buttonRef.current) return

    // Get button center for circle origin
    const rect = buttonRef.current.getBoundingClientRect()
    const cx = Math.round(rect.left + rect.width / 2)
    const cy = Math.round(rect.top + rect.height / 2)

    // Max radius to cover full screen
    const maxR = Math.ceil(
      Math.hypot(
        Math.max(cx, window.innerWidth - cx),
        Math.max(cy, window.innerHeight - cy)
      )
    )

    // ke GELAP → curtain masuk (expand dari tombol ke full screen)
    // ke TERANG → curtain keluar (shrink dari full screen menuju tombol)
    const toLight = isDark // sedang dark, mau ke light

    setIconState('exit')

    if (toLight) {
      // ── KELUAR: curtain warna gelap, mulai full, shrink ke tombol ──
      curtain.style.background = '#0a0a0a'
      setTheme('light') // ganti tema dulu, curtain menyembunyikan transisi
      gsap.set(curtain, { clipPath: `circle(${maxR}px at ${cx}px ${cy}px)` })
      gsap.to(curtain, {
        clipPath: `circle(0px at ${cx}px ${cy}px)`,
        duration: 0.6,
        ease: 'power3.inOut',
        onComplete: () => {
          gsap.set(curtain, { clipPath: 'circle(0px at 50% 50%)' })
          setIconState('enter')
          setTimeout(() => setIconState('idle'), 400)
        },
      })
    } else {
      // ── MASUK: curtain warna gelap, mulai 0px, expand ke full screen ──
      curtain.style.background = '#0a0a0a'
      gsap.set(curtain, { clipPath: `circle(0px at ${cx}px ${cy}px)` })
      gsap.to(curtain, {
        clipPath: `circle(${maxR}px at ${cx}px ${cy}px)`,
        duration: 0.6,
        ease: 'power3.inOut',
        onComplete: () => {
          setTheme('dark') // ganti tema saat layar tertutup penuh
          // beri satu frame agar background gelap terapply sebelum curtain hilang
          requestAnimationFrame(() => {
            gsap.set(curtain, { clipPath: 'circle(0px at 50% 50%)' })
            setIconState('enter')
            setTimeout(() => setIconState('idle'), 400)
          })
        },
      })
    }
  }, [resolvedTheme, setTheme])

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg border border-zinc-400 dark:border-zinc-800" />
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      ref={buttonRef}
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-400 dark:border-zinc-800 hover:border-violet-500 transition-colors overflow-hidden cursor-pointer"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={iconState === 'enter' ? { rotate: -180, scale: 0 } : { opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 180, scale: 0, opacity: 0 }}
            transition={
              iconState === 'enter'
                ? { duration: 0.35, ease: [0.175, 0.885, 0.32, 1.275] }
                : { duration: 0.2 }
            }
            className="absolute text-violet-400"
          >
            <Moon size={16} strokeWidth={1.75} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={iconState === 'enter' ? { rotate: -180, scale: 0 } : { opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 180, scale: 0, opacity: 0 }}
            transition={
              iconState === 'enter'
                ? { duration: 0.35, ease: [0.175, 0.885, 0.32, 1.275] }
                : { duration: 0.2 }
            }
            className="absolute text-amber-500"
          >
            <Sun size={16} strokeWidth={1.75} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

// ─── Nav links ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#stats' },
  { label: 'Work', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#cta' },
]

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-zinc-400 bg-transparent`}
    >
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="max-w-[110em] mx-auto px-6 h-16 flex items-center justify-between border-x border-zinc-400"
      >
        {/* Logo */}
        <motion.a
          href="#hero"
          aria-label="Habibi Ahmad — home"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-xl font-bold tracking-tight text-foreground"
        >
          habibiahmad<span className="text-violet-500">.</span>
        </motion.a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {NAV_LINKS.map((link, i) => (
            <motion.li
              key={link.href}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.06, ease: 'easeOut' }}
            >
              <a
                href={link.href}
                className={[
                  'relative text-sm font-medium text-foreground/70 hover:text-foreground transition-colors',
                  'after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full',
                  'after:bg-violet-500 after:scale-x-0 after:origin-left',
                  'hover:after:scale-x-100 after:transition-transform after:duration-300',
                ].join(' ')}
              >
                {link.label}
              </a>
            </motion.li>
          ))}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-400 dark:border-zinc-800 hover:border-violet-500 transition-colors overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="x"
                  initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute"
                >
                  <X size={16} strokeWidth={1.75} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute"
                >
                  <Menu size={16} strokeWidth={1.75} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            role="navigation"
            aria-label="Mobile navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md"
          >
            <ul className="flex flex-col px-6 py-4 gap-1" role="list">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.25 }}
                >
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2.5 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
