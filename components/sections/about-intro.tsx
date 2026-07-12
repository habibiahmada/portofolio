'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'

const stats = [
  { value: '3+', label: 'Years Learning' },
  { value: '10+', label: 'Projects Built' },
  { value: '3',  label: 'Internships' },
  { value: '1',  label: 'Top-15 Award' },
]

export function AboutIntro() {
  const sectionRef = useRef<HTMLDivElement>(null)

  return (
    <section
      id="about-intro"
      ref={sectionRef}
      className="py-24 w-full bg-transparent"
    >
      <div className="w-full mx-auto px-6 md:px-12 lg:px-16">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.215, 0.61, 0.355, 1] }}
          className="max-w-2xl mb-14 space-y-3"
        >
          <span className="text-xs font-mono tracking-widest text-rose-500 dark:text-blue-400 uppercase block">
            // About
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
            A Bit Curious?{' '}
            <span style={{ color: 'var(--navy-accent-text)' }}>Take a quick glance</span>
          </h2>
          <div className="flex gap-2 pt-1">
            <span className="h-0.5 w-10 rounded-full bg-rose-500 dark:bg-blue-400" />
            <span className="h-0.5 w-6 rounded-full" style={{ background: 'var(--navy-accent-text)', opacity: 0.3 }} />
          </div>
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left: body text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
            className="space-y-6"
          >
            <p className="text-base md:text-lg text-foreground/80 leading-relaxed font-medium">
              I am a Web Developer and a student at{' '}
              <span className="font-bold text-foreground">SMKN 1 Karawang</span>{' '}
              with a strong passion for building modern digital solutions.
            </p>

            {/* Quote */}
            <div className="relative pl-5 border-l-2 border-rose-500/60 rounded-r-xl py-4 pr-5 bg-rose-500/4 dark:bg-rose-500/5">
              <p className="text-base md:text-lg italic text-foreground/70 leading-relaxed">
                &ldquo;Skilled in various programming languages and popular frameworks,
                with experience in both frontend and backend projects.&rdquo;
              </p>
            </div>

            <p className="text-base md:text-lg text-foreground/80 leading-relaxed font-medium">
              I am always motivated to learn new technologies and deliver impactful
              solutions that make a real difference.
            </p>

            <a
              href="#cta"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-full font-bold text-sm shadow-lg hover:shadow-rose-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Let&apos;s Collaborate
            </a>
          </motion.div>

          {/* Right: stats grid */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.215, 0.61, 0.355, 1] }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
                className="flex flex-col gap-2 rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-950 p-6 hover:border-black/10 dark:hover:border-white/10 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30 transition-all duration-500"
              >
                <span
                  className="text-4xl font-black tracking-tight"
                  style={{ color: 'var(--navy-accent-text)' }}
                >
                  {stat.value}
                </span>
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground/70">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  )
}
