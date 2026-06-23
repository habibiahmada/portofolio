'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Code2, Smartphone, Zap, Database, Globe, Layout } from 'lucide-react'
import { IsometricBox } from '@/components/ui/isometric-box'
import { PcbBackground } from '@/components/ui/pcb-background'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    number: '01',
    title: 'Web Design',
    description: 'Beautiful, responsive interfaces that engage users and drive conversions.',
    icon: Layout,
  },
  {
    number: '02',
    title: 'Web Development',
    description: 'Full-stack solutions with modern frameworks, ensuring scalability and performance.',
    icon: Code2,
  },
  {
    number: '03',
    title: 'Mobile-First',
    description: 'Optimized experiences across all screen sizes and devices.',
    icon: Smartphone,
  },
  {
    number: '04',
    title: 'Performance',
    description: 'Fast, SEO-optimized experiences that rank well and load instantly.',
    icon: Zap,
  },
  {
    number: '05',
    title: 'Backend & API',
    description: 'Robust server-side logic, REST APIs, and database architecture.',
    icon: Database,
  },
  {
    number: '06',
    title: 'Deployment',
    description: 'CI/CD pipelines, cloud hosting, and production-ready infrastructure.',
    icon: Globe,
  },
]

export function Services() {
  const containerRef = useRef<HTMLDivElement>(null)
  const topBoxRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(topBoxRef.current, {
        scrollTrigger: {
          trigger: topBoxRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
      })

      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        x: -30,
        duration: 0.8,
        ease: 'power3.out',
      })

      cardsRef.current.forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
          opacity: 0,
          y: 30,
          duration: 0.7,
          delay: index * 0.08,
          ease: 'power3.out',
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="services"
      ref={containerRef}
      className="py-20 px-6 border-b border-zinc-400"
    >
      <div className="max-w-[110em] mx-auto">

        {/* Top block */}
        <div
          ref={topBoxRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20 border border-zinc-400 p-10 md:p-16"
        >
            <div className="absolute -inset-y-5 md:-left-14 -top-52 md:top-0 pointer-events-none scale-100">
              <PcbBackground className="text-foreground opacity-40" />
            </div>
          {/* Left col: text with PCB behind */}
          <div className="relative overflow-hidden">
            <div className="relative z-10">
              <h2
                ref={titleRef}
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              >
                Services
              </h2>
              <p className="text-lg text-foreground/70 max-w-md">
                Comprehensive solutions tailored to your needs, from design to deployment.
              </p>
            </div>
          </div>

          {/* Right col: isometric box */}
          <div>
            <IsometricBox />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={service.number}
                ref={(el) => { cardsRef.current[index] = el }}
                className="group border border-zinc-400 p-8 hover:border-primary/40 transition-all duration-300"
              >
                <div className="text-6xl font-bold text-primary/10 mb-4 group-hover:text-primary/20 transition-colors">
                  <Icon size={42} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {service.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
