'use client'


import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun, Globe } from 'lucide-react'

export function Navigation() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [locale, setLocale] = useState<'en' | 'id'>('en')

  useEffect(() => {
    setMounted(true)
    const currentLocale = window.location.pathname.split('/')[1] as 'en' | 'id'
    setLocale(currentLocale || 'en')
  }, [])

  const navItems = [
    { label: 'Home', href: `/${locale}` },
    { label: 'About', href: `/${locale}/about` },
    { label: 'Work', href: `/${locale}#projects` },
    { label: 'Services', href: `/${locale}#services` },
    { label: 'Contact', href: `/${locale}/contact` },
  ]

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const otherLocale = locale === 'en' ? 'id' : 'en'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-border/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent hover:from-blue-500 hover:to-primary transition-all"
        >
          HA
        </Link>

        {/* Nav Items */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors duration-200 hover:translate-y-[-2px]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="relative group">
            <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 flex items-center gap-2 text-foreground/70 hover:text-foreground border border-border/30">
              <Globe size={18} strokeWidth={1.5} />
              <span className="text-sm font-semibold">{locale.toUpperCase()}</span>
            </button>
            <div className="absolute right-0 top-full mt-2 backdrop-blur-lg bg-card border border-border/40 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 min-w-max">
              <Link
                href={`/${otherLocale}`}
                className="block px-4 py-2 text-sm font-semibold text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
              >
                {otherLocale === 'en' ? 'English' : 'Bahasa Indonesia'}
              </Link>
            </div>
          </div>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 text-foreground/70 hover:text-foreground border border-border/30"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun size={18} strokeWidth={1.5} />
              ) : (
                <Moon size={18} strokeWidth={1.5} />
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
