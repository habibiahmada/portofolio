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
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#stats' },
    { label: 'Work', href: '#projects' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#cta' },
  ]

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const otherLocale = locale === 'en' ? 'id' : 'en'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
        >
          HA
        </Link>

        {/* Nav Items */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="relative group">
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2">
              <Globe size={20} />
              <span className="text-sm font-medium">{locale.toUpperCase()}</span>
            </button>
            <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
              <Link
                href={`/${otherLocale}`}
                className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors whitespace-nowrap"
              >
                {otherLocale.toUpperCase()}
              </Link>
            </div>
          </div>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun size={20} className="text-yellow-500" />
              ) : (
                <Moon size={20} className="text-slate-700" />
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
