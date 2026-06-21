'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function ContactHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
      })

      gsap.from(contentRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        delay: 0.2,
        ease: 'power3.out',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="contact-hero"
      ref={containerRef}
      className="pt-32 pb-12 px-6 border-b border-border"
    >
      <div className="max-w-5xl mx-auto text-center">
        {/* Title */}
        <h1
          ref={titleRef}
          className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-8"
        >
          <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
            Get In Touch
          </span>
        </h1>

        {/* Content */}
        <div ref={contentRef} className="space-y-4 max-w-2xl mx-auto">
          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
            Have a project in mind? I&apos;d love to hear about it. Let&apos;s discuss how I can help bring your ideas to life.
          </p>
          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
            Whether you have a question or want to collaborate, feel free to reach out. I&apos;m always excited to work on new challenges.
          </p>
        </div>
      </div>
    </section>
  )
}
