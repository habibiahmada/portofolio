'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { flushSync } from 'react-dom'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'

function shouldSkipViewTransition() {
  if (typeof document.startViewTransition !== 'function') return true
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  return false
}

function getTransitionOrigin(
  event: React.MouseEvent<HTMLButtonElement>,
  button: HTMLButtonElement,
) {
  const vv = window.visualViewport
  const viewportW = vv?.width ?? window.innerWidth
  const viewportH = vv?.height ?? window.innerHeight
  const offsetX = vv?.offsetLeft ?? 0
  const offsetY = vv?.offsetTop ?? 0

  // Pointer coords reflect where the user tapped; adjust for mobile browser chrome
  let cx = event.clientX - offsetX
  let cy = event.clientY - offsetY

  if (!Number.isFinite(cx) || !Number.isFinite(cy) || (cx === 0 && cy === 0)) {
    const { top, left, width, height } = button.getBoundingClientRect()
    cx = left + width / 2 - offsetX
    cy = top + height / 2 - offsetY
  }

  return {
    cxPct: (cx / viewportW) * 100,
    cyPct: (cy / viewportH) * 100,
  }
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

  const toggleTheme = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current
    if (!button) return

    const isDark = resolvedTheme === 'dark'
    const { cxPct, cyPct } = getTransitionOrigin(event, button)

    const applyTheme = () => {
      document.documentElement.classList.toggle('dark')
      setTheme(isDark ? 'light' : 'dark')
    }

    if (shouldSkipViewTransition()) {
      applyTheme()
      return
    }

    const root = document.documentElement
    root.dataset.themeVt = 'active'
    root.style.setProperty('--vt-duration', '500ms')
    root.style.setProperty('--vt-cx', `${cxPct}%`)
    root.style.setProperty('--vt-cy', `${cyPct}%`)

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
