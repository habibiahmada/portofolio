'use client'


import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface StatItem {
  label: string
  value: number
  suffix?: string
}

export function Stats() {
  const containerRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<(HTMLDivElement | null)[]>([])

  const stats: StatItem[] = [
    { label: 'Projects Completed', value: 50, suffix: '+' },
    { label: 'Years of Experience', value: 5, suffix: '+' },
    { label: 'Happy Clients', value: 30, suffix: '+' },
    { label: 'Lines of Code', value: 100000, suffix: '+' },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      const triggerElement = containerRef.current

      stats.forEach((stat, index) => {
        const counter = statsRef.current[index]?.querySelector('.counter')
        if (!counter) return

        gsap.from(counter, {
          scrollTrigger: {
            trigger: triggerElement,
            start: 'top center',
            end: 'center center',
            once: true,
          },
          textContent: 0,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: 1 },
          onUpdate: function () {
            const currentValue = Math.floor((this.targets()[0] as any).textContent)
            ;(this.targets()[0] as any).textContent = currentValue.toLocaleString()
          },
        })
      })

      // Stagger in stat containers
      gsap.from(statsRef.current, {
        scrollTrigger: {
          trigger: triggerElement,
          start: 'top center',
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="stats"
      ref={containerRef}
      className="py-20 px-6 bg-secondary/30 border-t border-border"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              ref={(el) => {
                statsRef.current[index] = el
              }}
              className="text-center p-6 rounded-lg bg-card border border-border/50 hover:border-border transition-colors"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                <span className="counter">0</span>
                <span className="text-2xl md:text-3xl">{stat.suffix}</span>
              </div>
              <p className="text-sm md:text-base text-foreground/70 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
