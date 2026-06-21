'use client'


import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Code2, Zap, Palette } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const serviceIcons = {
  web_design: Palette,
  web_dev: Code2,
  optimization: Zap,
}

export function Services() {
  const containerRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<(HTMLDivElement | null)[]>([])

  const services = [
    { key: 'web_design', icon: 'web_design' },
    { key: 'web_dev', icon: 'web_dev' },
    { key: 'optimization', icon: 'optimization' },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(servicesRef.current, {
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
    <section id="services" ref={containerRef} className="py-20 px-6 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Services</h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            What I can help you with
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = serviceIcons[service.icon as keyof typeof serviceIcons]
            return (
              <div
                key={service.key}
                ref={(el) => {
                  servicesRef.current[index] = el
                }}
                className="p-8 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <IconComponent size={28} className="text-primary" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-3">
                  {service.key === 'web_design' && 'Web Design'}
                  {service.key === 'web_dev' && 'Web Development'}
                  {service.key === 'optimization' && 'Performance'}
                </h3>

                {/* Description */}
                <p className="text-foreground/70 leading-relaxed">
                  {service.key === 'web_design' && 'Beautiful, responsive interfaces'}
                  {service.key === 'web_dev' && 'Full-stack solutions with modern tech'}
                  {service.key === 'optimization' && 'Fast, optimized experiences'}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
