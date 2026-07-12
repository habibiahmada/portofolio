'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const techs = [
  { name: 'React',        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',           invert: false },
  { name: 'Next.js',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',          invert: true  },
  { name: 'Node.js',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',          invert: false },
  { name: 'TypeScript',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',  invert: false },
  { name: 'PostgreSQL',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',  invert: false },
  { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',invert: false },
  { name: 'PHP',          icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',                invert: false },
  { name: 'Git',          icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',                invert: false },
  { name: 'GitHub',       icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',          invert: true  },
  { name: 'Bootstrap',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',    invert: false },
  { name: 'Vercel',       icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg',           invert: true  },
  { name: 'JavaScript',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',  invert: false },
]

export function AboutTechStack() {
  return (
    <section
      id="about-techstack"
      className="py-24 w-full bg-transparent"
    >
      <div className="w-full mx-auto px-6 md:px-12 lg:px-16">

        {/* Header — same pattern as Services / Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.215, 0.61, 0.355, 1] }}
          className="max-w-2xl mb-14 space-y-3"
        >
          <span className="text-xs font-mono tracking-widest text-rose-500 dark:text-blue-400 uppercase block">
            // Tech Stack
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
            Tools I Work With
          </h2>
          <p className="text-sm md:text-base text-muted-foreground/80 leading-relaxed font-medium max-w-lg">
            My go-to technologies for building modern, performant, and scalable web applications.
          </p>
        </motion.div>

        {/* Grid — card style matches bento cards */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {techs.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.215, 0.61, 0.355, 1] }}
              className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-950 p-4 hover:border-black/10 dark:hover:border-white/10 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30 transition-all duration-500 cursor-default group"
            >
              <div className="relative w-8 h-8 shrink-0">
                <Image
                  src={tech.icon}
                  alt={tech.name}
                  fill
                  className={`object-contain transition-transform duration-300 group-hover:scale-110 ${
                    tech.invert ? 'invert dark:invert-0' : ''
                  }`}
                  unoptimized
                />
              </div>
              <span className="text-[11px] font-mono text-muted-foreground/70 group-hover:text-foreground transition-colors duration-300 text-center leading-tight">
                {tech.name}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
