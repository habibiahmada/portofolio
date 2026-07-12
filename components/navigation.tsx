'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
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

    // transition: target state
    const toLight = isDark 

    setIconState('exit')

    if (toLight) {
      // ── KELUAR: curtain warna gelap, mulai full, shrink ke tombol ──
      curtain.style.background = '#030303'
      setTheme('light') 
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
      curtain.style.background = '#030303'
      gsap.set(curtain, { clipPath: `circle(0px at ${cx}px ${cy}px)` })
      gsap.to(curtain, {
        clipPath: `circle(${maxR}px at ${cx}px ${cy}px)`,
        duration: 0.6,
        ease: 'power3.inOut',
        onComplete: () => {
          setTheme('dark') 
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              gsap.set(curtain, { clipPath: 'circle(0px at 50% 50%)' })
              setIconState('enter')
              setTimeout(() => setIconState('idle'), 400)
            })
          })
        },
      })
    }
  }, [resolvedTheme, setTheme])

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full border border-black/5 dark:border-white/10" />
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      ref={buttonRef}
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative w-8 h-8 flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 transition-colors overflow-hidden cursor-pointer"
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
            className="absolute text-blue-400"
          >
            <Moon size={14} strokeWidth={1.75} />
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
            <Sun size={14} strokeWidth={1.75} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

// ─── Nav links ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Home',     href: '#hero' },
  { label: 'Work',     href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Contact',  href: '#cta' },
  { label: 'About',    href: '/about' },
]

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const pathname = usePathname()

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

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 w-full z-50 border-b border-black/5 dark:border-white/5 bg-white/70 dark:bg-black/75 backdrop-blur-md transition-all duration-300 ${
        scrolled ? 'shadow-md shadow-black/5 dark:shadow-white/5' : ''
      }`}
    >
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="w-full mx-auto px-6 md:px-12 lg:px-16 h-18 flex items-center justify-between"
      >
        {/* Logo */}
        <motion.a
          href={pathname === '/' ? '#hero' : '/'}
          aria-label="Habibi Ahmad — home"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-base font-bold tracking-tight text-foreground"
        >
          habibiahmad<span className="text-rose-500">.</span>
        </motion.a>

        {/* Desktop links with sliding pill */}
        <ul className="hidden md:flex items-center gap-1.5 relative" role="list">
          {NAV_LINKS.map((link, i) => {
            const href = link.href.startsWith('#') && pathname !== '/'
              ? `/${link.href}`
              : link.href
            const isActive = link.href === '/about'
              ? pathname === '/about'
              : pathname === '/'

            return (
              <motion.li
                key={link.href}
                className="relative px-3.5 py-1.5"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 + i * 0.06, ease: 'easeOut' }}
              >
                <a
                  href={href}
                  aria-current={isActive && link.href !== '/about' ? undefined : isActive ? 'page' : undefined}
                  className={`relative text-xs font-semibold transition-colors z-10 ${
                    isActive && link.href === '/about'
                      ? 'text-foreground'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  {link.label}
                </a>
                {hoveredIndex === i && (
                  <motion.div
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.li>
            )
          })}
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
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 transition-colors overflow-hidden"
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
                  <X size={14} strokeWidth={1.75} />
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
                  <Menu size={14} strokeWidth={1.75} />
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
            className="md:hidden overflow-hidden mt-2 border-t border-black/5 dark:border-white/5 bg-transparent"
          >
            <ul className="flex flex-col px-6 py-4 gap-1.5" role="list">
              {NAV_LINKS.map((link, i) => {
                const href = link.href.startsWith('#') && pathname !== '/'
                  ? `/${link.href}`
                  : link.href
                const isActive = link.href === '/about' ? pathname === '/about' : false

                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.25 }}
                  >
                    <a
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`block py-2 text-sm font-semibold transition-colors ${
                        isActive ? 'text-foreground' : 'text-foreground/70 hover:text-foreground'
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-rose-500 align-middle" />
                      )}
                    </a>
                  </motion.li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
