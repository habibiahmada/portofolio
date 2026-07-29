"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GlitchText } from "@/components/ui/glitch-text";
import { ProjectCard } from "@/components/ui/project-card";
import { ProjectGridSkeleton } from "@/components/ui/skeletons";
import { useProjects } from "@/lib/hooks/use-api";
import { FEATURED_PROJECT_IDS } from "@/lib/data/featured-ids";
import type { Project } from "@/lib/supabase/types";

interface ProjectsProps {
  locale?: string;
  /** SSR first paint — skips `/api/public/projects` when set. */
  initialData?: Project[];
}

export function Projects({ locale = "en", initialData }: ProjectsProps) {
  const {
    data: fetched,
    loading,
    error,
  } = useProjects({
    featured: [...FEATURED_PROJECT_IDS],
    enabled: !initialData,
  });

  const projects = initialData ?? fetched;
  const showSkeleton = !initialData && loading;
  const showError = !initialData && error;

  return (
    <section id="projects" className="relative py-16 md:py-24 w-full bg-transparent">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-mono tracking-widest text-[#ef4444] dark:text-blue-400 uppercase block">
              // Selected Works
            </span>
            <GlitchText
              as="h2"
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight"
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

        {/* Loading state */}
        {showSkeleton && <ProjectGridSkeleton count={4} />}

        {/* Error state */}
        {showError && (
          <p className="text-sm text-red-500 dark:text-red-400 font-mono">
            Failed to load projects: {error}
          </p>
        )}

        {!showSkeleton && !showError && projects && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                locale={locale}
                index={i}
                variant="featured"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
