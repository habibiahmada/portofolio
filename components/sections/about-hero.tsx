'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PcbBackground } from '@/components/ui/pcb-background'

gsap.registerPlugin(ScrollTrigger)

export function AboutHero() {
  const containerRef  = useRef<HTMLDivElement>(null)
  const photoRef      = useRef<HTMLDivElement>(null)
  const spotlightRef  = useRef<HTMLDivElement>(null)

  // Parallax: photo floats up as user scrolls
  useEffect(() => {
    const el = photoRef.current
    if (!el) return

    const tween = gsap.to(el, {
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.4,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  // Spotlight follow cursor
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current
    if (!el || !spotlightRef.current) return
    const rect = el.getBoundingClientRect()
    spotlightRef.current.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    spotlightRef.current.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  const words = ['Habibi', 'Ahmad', 'Aziz']

  return (
    <section
      id="about-hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      aria-label="About hero"
      className="relative min-h-screen w-full flex items-center justify-center pt-28 pb-16 px-6 sm:px-12 md:px-16 lg:px-24 overflow-hidden group/hero"
    >
      {/* Spotlight overlay */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none opacity-0 group-hover/hero:opacity-100 transition-opacity duration-700 -z-10"
        style={{
          background:
            'radial-gradient(600px circle at var(--mx, 0px) var(--my, 0px), rgba(99,102,241,0.06), transparent 80%)',
        }}
      />

      {/* Subtle radial bg glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-indigo-500/4 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center gap-10">

        {/* ── Center: Photo + PCB decoration ── */}
        <div className="flex justify-center items-center relative w-full">
          {/* PCB traces behind photo */}
          <div className="absolute inset-0 -z-10 opacity-50 text-zinc-400 dark:text-zinc-700 pointer-events-none">
            <PcbBackground />
          </div>

          {/* Indigo glow behind photo */}
          <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/5 to-cyan-500/5 blur-3xl rounded-full -z-10" />

          <motion.div
            ref={photoRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="relative w-56 h-72 sm:w-64 sm:h-80 md:w-72 md:h-96"
          >
            {/* Decorative ring */}
            <div className="absolute -inset-4 rounded-3xl border border-indigo-500/10 rotate-2" />
            <div className="absolute -inset-4 rounded-3xl border border-indigo-500/5 -rotate-1" />

            {/* Photo card */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 shadow-2xl shadow-black/20">
              <Image
                src="/images/habibiahmada.png"
                alt="Habibi Ahmada"
                fill
                className="object-contain object-bottom"
                priority
              />
              {/* Bottom gradient overlay */}
              <div className="absolute bottom-0 inset-x-0 h-24 bg-linear-to-t from-background/30 to-transparent" />
            </div>

            {/* Floating badge — top right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: 12 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.9, ease: [0.175, 0.885, 0.32, 1.275] }}
              className="absolute -top-4 -right-4 px-3 py-1.5 rounded-xl border border-indigo-500/20 bg-background/80 backdrop-blur-sm shadow-lg"
            >
              <span className="text-[10px] font-mono font-bold text-indigo-400 tracking-widest">
                DEV ✦
              </span>
            </motion.div>

            {/* Floating badge — bottom left */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 1.05, ease: [0.175, 0.885, 0.32, 1.275] }}
              className="absolute -bottom-4 -left-4 px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-background/80 backdrop-blur-sm shadow-lg"
            >
              <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-widest">
                WEB DEV
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Text below photo ── */}
        <div className="flex flex-col items-center text-center gap-6 max-w-2xl">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-black/5 dark:border-white/5 bg-black/2 dark:bg-white/2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
              Full-Stack Web Developer
            </span>
          </motion.div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] select-none text-foreground">
            {words.map((word, i) => (
              <motion.span
                key={word}
                className="inline-block mr-[0.2em] origin-bottom"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.07 + 0.1,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
              >
                {i === 0 ? (
                  <span style={{ color: 'var(--navy-accent-text)' }}>{word}</span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            className="text-base md:text-lg text-muted-foreground/80 max-w-xl leading-relaxed font-medium"
          >
            Full-Stack Web Developer passionate about building modern, performant
            and accessible digital products from concept to deployment.
          </motion.p>

          {/* Quick facts row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: 'easeOut' }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              { label: 'Location', value: 'Karawang, ID' },
              { label: 'Status', value: 'Open to work' },
              { label: 'Focus', value: 'Frontend + Backend' },
            ].map((fact) => (
              <div
                key={fact.label}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-black/5 dark:border-white/5 bg-black/2 dark:bg-white/2"
              >
                <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/50">
                  {fact.label}
                </span>
                <span className="text-[10px] font-semibold text-foreground/80">
                  {fact.value}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#cta"
              className="px-8 py-3.5 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-full font-bold text-sm text-center shadow-lg hover:shadow-indigo-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Let&apos;s Collaborate
            </a>
            <a
              href="#about-timeline"
              className="px-8 py-3.5 rounded-full font-bold text-sm text-center border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 bg-black/2 dark:bg-white/2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-foreground"
            >
              View Experience
            </a>
          </motion.div>
        </div>

      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] font-mono tracking-widest text-muted-foreground/40 uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-linear-to-b from-indigo-500/40 to-transparent"
        />
      </motion.div>
    </section>
  )
}
