"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GlitchText } from "@/components/ui/glitch-text";
import { ProjectCard } from "@/components/ui/project-card";
import { projects } from "@/lib/projects";

interface ProjectsProps {
  locale?: string;
}

// ─── Featured project IDs (pinned) ───────────────────────────────────────────
const FEATURED_IDS = [
  "1dd8ca69-4921-4ca7-80e3-56177efaf499", // E-Vote
  "bde24764-8fcf-4d67-8bb2-697cb57fb66d", // Smartfarm AI
  "ff98b3c6-e267-4ee0-9059-9444858eacf4", // CultureConnect
  "13e602b8-c324-44e6-9c61-e9e40f388394", // Spacelab
  "f5c13a15-1bc6-4e82-8d62-d1196894d189", // Renshuu
];

// ─── Main Section ─────────────────────────────────────────────────────────────

export function Projects({ locale = "en" }: ProjectsProps) {
  const featuredProjects = projects.filter((p) => FEATURED_IDS.includes(p.id));

  return (
    <section id="projects" className="relative py-24 w-full bg-transparent">
      <div className="w-full px-24">
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6"
        >
          <div className="space-y-3">
            <span className="text-xs font-mono tracking-widest text-[#ef4444] dark:text-blue-400 uppercase block">
              // Selected Works
            </span>
            <GlitchText
              as="h2"
              className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight"
              interval={5000}
              duration={320}
            >
              Featured Projects
            </GlitchText>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 self-start rounded-full border border-black/10 bg-black/5 px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground/80 transition-all duration-300 hover:border-black/20 hover:text-foreground dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 sm:self-auto"
          >
            All Projects
            <ArrowUpRight size={12} strokeWidth={1.6} />
          </Link>
        </div>

        {/* Grid — 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProjects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              locale={locale}
              index={i}
              variant="featured"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
