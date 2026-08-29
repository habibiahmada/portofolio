'use client'

import { motion } from 'framer-motion'

const ease = [0.215, 0.61, 0.355, 1] as const

export function AboutSkills() {
  const skillCategories = [
    {
      category: 'Frontend',
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js', 'JavaScript'],
    },
    {
      category: 'Backend',
      skills: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'REST API', 'GraphQL'],
    },
    {
      category: 'Tools & DevOps',
      skills: ['Git', 'Docker', 'AWS', 'Vercel', 'CI/CD', 'GitHub Actions'],
    },
  ]

  return (
    <section
      id="about-skills"
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
            Skills
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: (idx % 3) * 0.1, ease }}
              className="backdrop-blur-lg bg-black/5 dark:bg-white/5 border border-border/40 p-8"
            >
              <h3 className="text-2xl font-bold mb-6 text-primary">{cat.category}</h3>
              <div className="flex flex-wrap gap-3">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 backdrop-blur-md bg-primary/10 text-primary border border-primary/30 text-sm font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
