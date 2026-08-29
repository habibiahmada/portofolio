'use client'

import { motion } from 'framer-motion'
import { Briefcase, Code2, Award } from 'lucide-react'

const ease = [0.215, 0.61, 0.355, 1] as const

export function AboutExperience() {
  const experiences = [
    {
      icon: Briefcase,
      title: 'Senior Developer',
      company: 'Tech Company Inc',
      period: '2022 - Present',
      description: 'Leading frontend development initiatives and mentoring junior developers',
    },
    {
      icon: Code2,
      title: 'Full-Stack Developer',
      company: 'Creative Agency',
      period: '2020 - 2022',
      description: 'Developed web applications using React, Node.js, and various databases',
    },
    {
      icon: Award,
      title: 'Web Developer',
      company: 'Startup Studio',
      period: '2019 - 2020',
      description: 'Built responsive websites and web apps for early-stage startups',
    },
  ]

  return (
    <section
      id="about-experience"
      className="py-20 px-6 border-b border-border"
    >
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="text-4xl md:text-5xl font-bold mb-16"
        >
          <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Experience
          </span>
        </motion.h2>

        <div className="space-y-8">
          {experiences.map((exp, index) => {
            const Icon = exp.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, ease }}
                className="backdrop-blur-lg bg-black/5 dark:bg-white/5 border border-border/40 p-8 hover:border-primary/40 transition-all duration-300"
              >
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 text-primary">
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{exp.title}</h3>
                    <p className="text-primary font-semibold mb-2">{exp.company}</p>
                    <p className="text-sm text-foreground/60 mb-3">{exp.period}</p>
                    <p className="text-foreground/70">{exp.description}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
