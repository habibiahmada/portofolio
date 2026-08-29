'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { flushSync } from 'react-dom'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'

function shouldSkipViewTransition() {
  if (typeof document.startViewTransition !== 'function') return true
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  // Mobile/touch: viewport coords ≠ Snapshot Containing Block coords → wrong origin
  if (window.matchMedia('(pointer: coarse)').matches) return true
  return false
}

/**
 * Simplified theme toggle using the View Transitions API.
 * Expands a circle clip-path from the button position — no dark overlay.
 */
export function AnimatedThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => { setMounted(true) }, [])

  const toggleTheme = useCallback(() => {
    const button = buttonRef.current
    if (!button) return

    const isDark = resolvedTheme === 'dark'
    const { top, left, width, height } = button.getBoundingClientRect()
    const cx = left + width / 2
    const cy = top + height / 2

    const viewportW = window.innerWidth
    const viewportH = window.innerHeight

    const applyTheme = () => {
      document.documentElement.classList.toggle('dark')
      setTheme(isDark ? 'light' : 'dark')
    }

    if (shouldSkipViewTransition()) {
      applyTheme()
      return
    }

    // Percentage coords are more stable in ::view-transition pseudo-elements
    const root = document.documentElement
    root.dataset.themeVt = 'active'
    root.style.setProperty('--vt-duration', '500ms')
    root.style.setProperty('--vt-cx', `${(cx / viewportW) * 100}%`)
    root.style.setProperty('--vt-cy', `${(cy / viewportH) * 100}%`)

    const cleanup = () => {
      delete root.dataset.themeVt
      root.style.removeProperty('--vt-duration')
      root.style.removeProperty('--vt-cx')
      root.style.removeProperty('--vt-cy')
    }

    const transition = document.startViewTransition(() => {
      flushSync(applyTheme)
    })

    transition.finished.finally(cleanup)
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
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative w-8 h-8 flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 transition-colors overflow-hidden cursor-pointer"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute text-blue-400"
          >
            <Moon size={14} strokeWidth={1.75} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute text-amber-500"
          >
            <Sun size={14} strokeWidth={1.75} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
