'use client'

import { motion } from 'framer-motion'

const ease = [0.215, 0.61, 0.355, 1] as const

export function AboutHero() {
  return (
    <section
      id="about-hero"
      className="pt-32 pb-12 px-6 border-b border-border"
    >
      <div className="max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-8"
        >
          <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
            About Me
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="space-y-6 max-w-3xl"
        >
          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
            Hi, I&apos;m Habibi Ahmad, a passionate full-stack web developer with a mission to create beautiful, performant digital experiences that solve real problems.
          </p>
          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
            With over 5 years of experience in web development, I&apos;ve had the privilege of working with startups, agencies, and enterprises to bring their visions to life. My expertise spans modern frontend frameworks, backend systems, and everything in between.
          </p>
          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
            I believe in the power of clean code, thoughtful design, and continuous learning. Every project is an opportunity to push boundaries and deliver excellence.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
