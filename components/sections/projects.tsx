"use client";

import Link from "next/link";
import { FeaturedProjectCard } from "@/components/ui/featured-project-card";
import { ProjectGridSkeleton } from "@/components/ui/skeletons";
import { PageShell } from "@/components/ui/page-shell";
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
      <PageShell wide>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-mono tracking-widest text-brand uppercase block">
              Selected
            </span>
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                Featured Projects
              </h2>
              <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
                Six problems I can walk you through: MIRU, E-Vote, JepangKu,
                CultureConnect, Smartfarm, and Terraju. The rest lives in the archive.
              </p>
            </div>
          </div>
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-black/10 bg-black/5 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground transition-all duration-300 hover:border-black/20 hover:text-foreground dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 sm:self-auto"
          >
            Full archive
          </Link>
        </div>

        {showSkeleton && <ProjectGridSkeleton count={4} />}

        {showError && (
          <p className="text-sm text-red-500 dark:text-red-400 font-mono">
            Failed to load projects: {error}
          </p>
        )}

        {/* Two columns of equal compact cards: six projects of similar weight,
            so no tile needs to dominate. */}
        {!showSkeleton && !showError && projects && projects.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
            {projects.map((project, i) => (
              <FeaturedProjectCard
                key={project.id}
                project={project}
                locale={locale}
                index={i}
              />
            ))}
          </div>
        )}
      </PageShell>
    </section>
  );
}
