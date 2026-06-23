'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Code2, Smartphone, Zap } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export function Services() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
      })

      cardsRef.current.forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
          },
          opacity: 0,
          y: 30,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power3.out',
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const services = [
    {
      number: '01',
      title: 'Web Design',
      description:
        'Beautiful, responsive interfaces that engage users and drive conversions.',
      icon: Code2,
    },
    {
      number: '02',
      title: 'Web Development',
      description:
        'Full-stack solutions with modern frameworks, ensuring scalability and performance.',
      icon: Smartphone,
    },
    {
      number: '03',
      title: 'Optimization',
      description:
        'Fast, SEO-optimized experiences that rank well and load instantly.',
      icon: Zap,
    },
  ]

  return (
    <section
      id="services"
      ref={containerRef}
      className="py-20 px-6 border-b border-zinc-400"
    >
      <div className="max-w-[110em]   mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
              Services
          </h2>
          <p className="text-lg text-foreground/70">
            Comprehensive solutions tailored to your needs, from design to
            deployment.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={service.number}
                ref={(el) => {
                  cardsRef.current[index] = el
                }}
                className="group backdrop-blur-lg bg-black/5 dark:bg-white/5 border border-border/40 p-8 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                {/* Number */}
                <div className="text-6xl font-bold text-primary/10 mb-4 group-hover:text-primary/20 transition-colors">
                  {service.number}
                </div>

                {/* Icon */}
                <Icon size={32} className="text-primary mb-4" strokeWidth={1.5} />

                {/* Title */}
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-foreground/70 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Link */}
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all"
                >
                  Learn More
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
