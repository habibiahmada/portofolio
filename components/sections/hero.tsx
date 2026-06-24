'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { CpuArchitecture } from '@/components/ui/cpu-architecture'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cpuWrapperRef = useRef<HTMLDivElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)

  // Track mouse coordinates for background spotlight without re-rendering React
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current
    if (!el || !spotlightRef.current) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    spotlightRef.current.style.setProperty('--mouse-x', `${x}px`)
    spotlightRef.current.style.setProperty('--mouse-y', `${y}px`)
  }

  useEffect(() => {
    const el = cpuWrapperRef.current
    if (!el) return

    // Initial isometric state 
    gsap.set(el, {
      rotationX: 38,
      rotationY: 58,
      rotationZ: -38,
      transformPerspective: 900,
      transformOrigin: '50% 50%',
    })

    // Animate back to flat as user scrolls down
    const tween = gsap.to(el, {
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1.2,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  const headingText = "Building digital experiences that actually matter"
  const words = headingText.split(" ")

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      aria-label="Hero section"
      className="relative min-h-screen w-full flex items-center justify-center pt-28 pb-16 px-6 sm:px-12 md:px-16 lg:px-24 overflow-hidden group/hero"
    >
      {/* Dynamic spotlight overlay */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none opacity-0 group-hover/hero:opacity-100 transition-opacity duration-700 -z-10"
        style={{
          background: 'radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(99, 102, 241, 0.06), transparent 80%)'
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Col: Cinematic Copywriting */}
        <div className="lg:col-span-7 flex flex-col items-start text-left gap-8">
          
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
              Available for Freelance & Contracts
            </span>
          </motion.div>

          {/* Heading with Split-Word Animation */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] select-none text-foreground">
            {words.map((word, i) => {
              const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "")
              const isAccent = cleanWord === "experiences" || cleanWord === "matter"
              return (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.2em] origin-bottom"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: i * 0.05 + 0.1, 
                    ease: [0.215, 0.61, 0.355, 1] 
                  }}
                  style={isAccent ? { color: "var(--navy-accent-text)" } : undefined}
                >
                  {word}
                </motion.span>
              )
            })}
          </h1>

          {/* Sub description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
            className="text-base md:text-lg text-muted-foreground/80 max-w-xl leading-relaxed font-medium"
          >
            Full-stack developer crafting high-performance, accessible, and beautifully animated web products from concept to deployment.
          </motion.p>

          {/* CTA buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <a
              href="#projects"
              aria-label="View my projects"
              className="px-8 py-3.5 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-full font-bold text-sm text-center shadow-lg hover:shadow-indigo-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              View My Work
            </a>
            <a
              href="#cta"
              aria-label="Get in touch"
              className="px-8 py-3.5 rounded-full font-bold text-sm text-center border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 bg-black/[0.02] dark:bg-white/[0.02] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-foreground"
            >
              Get in Touch
            </a>
          </motion.div>
        </div>

        {/* Right Col: Sleek Interactive CPU Architecture SVG */}
        <div className="lg:col-span-5 flex justify-center items-center relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-cyan-500/5 blur-3xl rounded-full -z-10" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="w-full max-w-md cursor-grab active:cursor-grabbing"
            aria-hidden="true"
            style={{ perspective: 1000 }}
          >
            <div ref={cpuWrapperRef} style={{ willChange: 'transform' }} className="transition-transform duration-300 hover:scale-105">
              <CpuArchitecture
                width="100%"
                height="100%"
                text="DEV"
                className="cpu-svg-lines w-full h-auto"
              />
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
