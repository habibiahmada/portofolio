'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { CpuArchitecture } from '@/components/ui/cpu-architecture'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Palet dari #15233e:
// --navy-900: #15233e  (base)
// --navy-700: #1e3460  (medium)
// --navy-500: #2a4a85  (accent)
// --navy-300: #4a72b8  (light accent)

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export function HeroSection() {
  const cpuWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cpuWrapperRef.current
    if (!el) return

    // Initial isometric state — tilted like the reference image
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

  return (
    <section
      id="hero"
      aria-label="Hero section"
      className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-16 px-6 overflow-hidden"
    >
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(100,100,100,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(100,100,100,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '3rem 3rem',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 100%)',
          maskImage:
            'radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 100%)',
        }}
      />

      {/* Content wrapper — rata tengah, satu kolom */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-8">

        {/* Heading */}
        <motion.h1
          {...fadeUp(0.1)}
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight"
        >
          Building digital&nbsp;
          <span style={{ color: 'var(--navy-accent-text)' }}>experiences</span>
          <br />
          that actually&nbsp;
          <span style={{ color: 'var(--navy-accent-text)' }}>matter</span>
        </motion.h1>

        {/* Sub description */}
        <motion.p
          {...fadeUp(0.2)}
          className="text-base md:text-lg text-foreground/60 max-w-lg"
        >
          Full-stack developer crafting fast, accessible, and beautifully
          animated web products — from concept to deployment.
        </motion.p>

        {/* CTA buttons */}
        <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-3">
          <a
            href="#projects"
            aria-label="View my projects"
            className="px-7 py-3 text-white font-semibold text-sm transition-colors duration-200"
            style={{
              background: 'var(--navy-btn-bg)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--navy-btn-bg-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--navy-btn-bg)')}
          >
            View My Work
          </a>
          <a
            href="#cta"
            aria-label="Get in touch"
            className="px-7 py-3 text-sm font-semibold duration-200 border transition-colors"
            style={{ borderColor: 'var(--navy-btn-border)', color: 'var(--navy-btn-text)' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--navy-btn-bg)'
              e.currentTarget.style.color = '#ffffff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--navy-btn-text)'
            }}
          >
            Get in Touch
          </a>
        </motion.div>

        {/* CPU Architecture — miring saat pertama load, lurus saat di-scroll */}
        <motion.div
          {...fadeUp(0.35)}
          className="w-full max-w-lg"
          aria-hidden="true"
          style={{ perspective: 900 }}
        >
          <div ref={cpuWrapperRef} style={{ willChange: 'transform' }}>
            <CpuArchitecture
              width="100%"
              height="100%"
              text="DEV"
              className="cpu-svg-lines w-full h-auto"
            />
          </div>
        </motion.div>

      </div>
    </section>
  )
}
