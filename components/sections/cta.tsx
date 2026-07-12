'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function CTA() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const btnRef1 = useRef<HTMLButtonElement>(null)
  const btnRef2 = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([titleRef.current, subtitleRef.current, btnRef1.current, btnRef2.current], {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Magnetic button hover effect
  const handleMagneticMove = (e: React.MouseEvent<HTMLButtonElement>, ref: React.RefObject<HTMLButtonElement | null>) => {
    const btn = ref.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()

    // Position of cursor relative to center of the button
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    gsap.to(btn, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto'
    })
  }

  // Elastic snap back when leaving hover area
  const handleMagneticLeave = (ref: React.RefObject<HTMLButtonElement | null>) => {
    const btn = ref.current
    if (!btn) return
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1.1, 0.45)',
      overwrite: 'auto'
    })
  }

  return (
    <section id="cta" ref={containerRef} className="py-24 w-full bg-transparent overflow-hidden">
      <div className="w-full max-w-200 mx-auto px-6 md:px-12 text-center">

        {/* Glassmorphic box container with background gradient reflection */}
        <div className="relative overflow-hidden rounded-3xl border border-black/5 dark:border-white/5 bg-black/1.5 dark:bg-white/1.5 p-12 md:p-20 shadow-xl backdrop-blur-md">

          {/* Accent radial glow behind */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-87.5 h-87.5 bg-rose-500/5 blur-[130px] rounded-full -z-10 pointer-events-none" />

          {/* Label */}
          <span className="text-[10px] font-mono tracking-widest text-rose-500 dark:text-blue-400 font-semibold uppercase block mb-4">
            // Start a Project
          </span>

          {/* Title */}
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-foreground leading-[1.1]"
          >
            Ready to Build?
          </h2>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-sm md:text-base text-muted-foreground/80 mb-12 l mx-auto leading-relaxed font-medium"
          >
            Let&apos;s work together to bring your digital product concepts to life with high-performance frameworks and pristine animated interactions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button
              ref={btnRef1}
              onMouseMove={(e) => handleMagneticMove(e, btnRef1)}
              onMouseLeave={() => handleMagneticLeave(btnRef1)}
              className="w-full sm:w-auto px-8 py-3.5 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-full font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300 cursor-pointer select-none"
            >
              Get Free Consultation
            </button>

            <button
              ref={btnRef2}
              onMouseMove={(e) => handleMagneticMove(e, btnRef2)}
              onMouseLeave={() => handleMagneticLeave(btnRef2)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 bg-black/2 dark:bg-white/2 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300 text-foreground cursor-pointer select-none"
            >
              Schedule a Call
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}
