'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export function CTA() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([titleRef.current, subtitleRef.current, buttonRef.current], {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="cta" ref={containerRef} className="py-24 px-6 border-b border-zinc-400">
      <div className="max-w-4xl mx-auto text-center">
        <div className="backdrop-blur-lg bg-black/5 dark:bg-white/5 border border-zinc-400 p-16">
          {/* Title */}
          <h2
            ref={titleRef}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
              Ready to Build?
          </h2>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-foreground/70 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Let&apos;s work together to bring your ideas to life with cutting-edge technology and design.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              ref={buttonRef}
                className="px-8 py-3.5 text-white font-semibold transition-colors duration-200"
                style={{
                  background: 'var(--navy-btn-bg)',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--navy-btn-bg-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--navy-btn-bg)')}
              >
              Get Free Consultation
            </button>
            <button className="backdrop-blur-md bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-foreground px-8 py-3.5 font-semibold border border-zinc-400 hover:border-zinc-500 transition-all duration-300 w-full sm:w-auto">
              Schedule a Call
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
