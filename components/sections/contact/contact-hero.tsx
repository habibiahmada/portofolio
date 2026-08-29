'use client'

import { motion } from 'framer-motion'

const ease = [0.215, 0.61, 0.355, 1] as const

export function ContactHero() {
  return (
    <section
      id="contact-hero"
      className="pt-32 pb-12 px-6 border-b border-border"
    >
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-8"
        >
          <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
            Get In Touch
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="space-y-4 max-w-2xl mx-auto"
        >
          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
            Have a project in mind? I&apos;d love to hear about it. Let&apos;s discuss how I can help bring your ideas to life.
          </p>
          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
            Whether you have a question or want to collaborate, feel free to reach out. I&apos;m always excited to work on new challenges.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
