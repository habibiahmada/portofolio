'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface Project {
  id: number
  title_en: string
  title_id: string
  description_en: string
  description_id: string
  image: string
  tags: string[]
  link: string
}

export function Projects() {
  const containerRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<(HTMLDivElement | null)[]>([])
  const [projects, setProjects] = React.useState<Project[]>([])

  useEffect(() => {
    // Load projects from JSON
    fetch('/data/projects.json')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error('Failed to load projects:', err))
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger in projects
      gsap.from(projectsRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power3.out',
      })

      // Parallax effect on images
      projectsRef.current.forEach((el) => {
        if (!el) return
        gsap.to(el.querySelector('img'), {
          scrollTrigger: {
            trigger: el,
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
          },
          y: 50,
          ease: 'power1.out',
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [projects])

  return (
    <section id="projects" ref={containerRef} className="py-20 px-6 border-b border-zinc-400">
      <div className="max-w-[110em] mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured Work
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl">
            A selection of my recent projects and case studies
          </p>
        </div>

        {/* Projects Grid */}
        <div className="space-y-16">
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => {
                projectsRef.current[index] = el
              }}
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Image */}
              <div
                className={`group relative h-80 md:h-96 overflow-hidden backdrop-blur-lg bg-black/5 dark:bg-white/5 border border-border/40 ${
                  index % 2 === 1 ? 'md:order-last' : ''
                }`}
              >
                <Image
                  src={project.image}
                  alt={project.title_en}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className={index % 2 === 1 ? 'md:order-first' : ''}>
                <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  {project.title_en}
                </h3>
                <p className="text-foreground/70 text-lg mb-6 leading-relaxed">
                  {project.description_en}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 text-sm font-medium backdrop-blur-md bg-primary/10 text-primary border border-primary/30 hover:border-primary/60 transition-all duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Link */}
                <a
                  href={project.link}
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all group"
                >
                  View Case Study
                  <ArrowUpRight
                    size={20}
                    className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                  />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
