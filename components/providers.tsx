'use client'

import { ReactNode, useEffect, useState } from 'react'
import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Setup tirai curtain animation on theme change
    const handleThemeChange = () => {
      const curtain = document.getElementById('tirai-curtain')
      if (curtain) {
        // Remove animation class if it exists
        curtain.classList.remove('animate-tirai')
        
        // Trigger reflow to restart animation
        void curtain.offsetWidth
        
        // Add animation class to play tirai effect
        curtain.classList.add('animate-tirai')
        
        // Remove class after animation completes
        setTimeout(() => {
          curtain.classList.remove('animate-tirai')
        }, 700)
      }
    }

    // Listen for theme changes from next-themes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const htmlElement = mutation.target as HTMLElement
          // Check if theme actually changed
          const isDark = htmlElement.classList.contains('dark')
          handleThemeChange()
        }
      })
    })

    const htmlElement = document.documentElement
    observer.observe(htmlElement, { attributes: true, attributeFilter: ['class'] })

    return () => {
      observer.disconnect()
    }
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      enableTransition={true}
      disableTransitionOnChange={false}
      storageKey="theme-preference"
    >
      {children}
    </ThemeProvider>
  )
}
