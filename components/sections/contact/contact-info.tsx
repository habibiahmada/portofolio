'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Code2, MessageCircle, Send } from 'lucide-react'

const ease = [0.215, 0.61, 0.355, 1] as const

export function ContactInfo() {
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
      className="py-20 px-6 border-b border-border"
    >
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="text-4xl md:text-5xl font-bold mb-16 text-center"
        >
          <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Other Ways to Connect
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <motion.a
                key={index}
                href={method.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, ease }}
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
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
