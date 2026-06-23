'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

interface Project {
  id: string
  title_en: string
  title_id: string
  description_en: string
  description_id: string
  image: string
  tags: string[]
  live_url: string
  github_url: string
  year: number
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    fetch('/data/projects.json')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error('Failed to load projects:', err))
  }, [])

  return (
    <section id="projects" className="py-20 px-6 border-b border-zinc-400">
      <div className="max-w-[110em] mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Work</h2>
          <p className="text-lg text-foreground/60 max-w-2xl">
            A selection of my recent projects and case studies
          </p>
        </div>

        {/* Projects Grid */}
        <div className="space-y-16">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            >
              {/* Image */}
              <div
                className={`relative h-80 md:h-96 overflow-hidden bg-black/5 dark:bg-white/5 border border-zinc-400 ${
                  index % 2 === 1 ? 'md:order-last' : ''
                }`}
              >
                <Image
                  src={`https://placehold.co/800x600/e2e8f0/94a3b8?text=${encodeURIComponent(project.title_en)}`}
                  alt={project.title_en}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Content */}
              <div className={index % 2 === 1 ? 'md:order-first' : ''}>
                <span className="text-sm text-foreground/40 font-medium mb-2 block">
                  {project.year}
                </span>
                <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  {project.title_en}
                </h3>
                <p className="text-foreground/70 text-lg mb-6 leading-relaxed">
                  {project.description_en}
                </p>

                {/* Tags */}
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-sm font-medium bg-primary/10 text-primary border border-primary/30 hover:border-primary/60 transition-all duration-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                <div className="flex items-center gap-4">
                  {project.live_url && project.live_url !== '#' && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all group"
                    >
                      Live Demo
                      <ArrowUpRight
                        size={20}
                        className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                      />
                    </a>
                  )}
                  {project.github_url && project.github_url !== '#' && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-foreground/60 font-semibold hover:text-foreground transition-colors"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
