'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mail, Phone, MapPin, Code2, MessageCircle, Send } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export function ContactInfo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const infoRef = useRef<(HTMLDivElement | null)[]>([])

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

      infoRef.current.forEach((item, index) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
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

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: 'hello@habibiahmad.dev',
      href: 'mailto:hello@habibiahmad.dev',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+62 812 3456 7890',
      href: 'tel:+628123456789',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Jakarta, Indonesia',
      href: '#',
    },
    {
      icon: Code2,
      label: 'GitHub',
      value: '@habibiahmad',
      href: '#',
    },
    {
      icon: MessageCircle,
      label: 'LinkedIn',
      value: 'Habibi Ahmad',
      href: '#',
    },
    {
      icon: Send,
      label: 'Twitter',
      value: '@habibiahmad',
      href: '#',
    },
  ]

  return (
    <section
      id="contact-info"
      ref={containerRef}
      className="py-20 px-6 border-b border-border"
    >
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl font-bold mb-16 text-center"
        >
          <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Other Ways to Connect
          </span>
        </h2>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <a
                key={index}
                href={method.href}
                ref={(el) => {
                  infoRef.current[index] = el
                }}
                className="group backdrop-blur-lg bg-black/5 dark:bg-white/5 border border-border/40 p-8 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{method.label}</h3>
                  </div>
                </div>
                <p className="text-foreground/70 group-hover:text-foreground transition-colors">
                  {method.value}
                </p>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
