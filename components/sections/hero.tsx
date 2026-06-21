'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
      })

      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        delay: 0.15,
        ease: 'power3.out',
      })

      gsap.from(ctasRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        delay: 0.3,
        ease: 'power3.out',
      })

      gsap.from(statsRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        delay: 0.45,
        ease: 'power3.out',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero"
      ref={containerRef}
      className="min-h-screen flex items-center justify-center pt-24 pb-12 px-6"
    >
      <div className="max-w-5xl mx-auto w-full space-y-12">
        {/* Main Content */}
        <div className="space-y-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 backdrop-blur-md bg-black/5 dark:bg-white/5 px-4 py-2 rounded-full border border-border/40">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-sm font-semibold text-foreground">
              Welcome to Habibi Ahmad
            </span>
          </div>

          {/* Title */}
          <h1
            ref={titleRef}
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
          >
            <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
              Full-Stack Web Developer
            </span>
          </h1>

          {/* Description */}
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed"
          >
            Crafting beautiful, performant digital experiences with modern
            technologies. From concept to deployment, I deliver solutions that
            matter.
          </p>

          {/* CTAs */}
          <div ref={ctasRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button className="group backdrop-blur-md bg-primary/80 hover:bg-primary text-primary-foreground px-8 py-3.5 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/40 hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-center">
              Get Free Consultation
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button className="backdrop-blur-md bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-foreground px-8 py-3.5 rounded-lg font-semibold border border-border/40 hover:border-border/60 transition-all duration-300 w-full sm:w-auto">
              View My Work
            </button>
          </div>
        </div>

        {/* Stats Box */}
        <div
          ref={statsRef}
          className="backdrop-blur-lg bg-black/5 dark:bg-white/5 border border-border/40 rounded-xl p-8 max-w-2xl mx-auto w-full"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <CheckCircle2 size={24} className="text-primary flex-shrink-0" />
              <div>
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-foreground/60">Projects Completed</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CheckCircle2 size={24} className="text-primary flex-shrink-0" />
              <div>
                <div className="text-2xl font-bold text-primary">5+</div>
                <div className="text-sm text-foreground/60">Years Experience</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CheckCircle2 size={24} className="text-primary flex-shrink-0" />
              <div>
                <div className="text-2xl font-bold text-primary">30+</div>
                <div className="text-sm text-foreground/60">Happy Clients</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
