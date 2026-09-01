"use client";

import { useMemo, useRef } from "react";
import { NodeNetworkLazy } from "@/components/ui/node-network-lazy";
import { CpuArchitecture } from "@/components/ui/cpu-architecture";
import { ProjectCard } from "@/components/ui/project-card";
import { ProjectGridSkeleton } from "@/components/ui/skeletons";
import { PageShell } from "@/components/ui/page-shell";
import { useProjects } from "@/lib/hooks/use-api";
import {
  groupProjectsForArchive,
  PROJECT_STATS,
} from "@/lib/data/project-taxonomy";
import type { Project } from "@/lib/supabase/types";

interface ProjectsPageProps {
  locale?: string;
  /** SSR first paint — skips `/api/public/projects` when set. */
  initialData?: Project[];
}

const STATS = [
  { value: String(PROJECT_STATS.featured), label: "Featured case studies" },
  { value: String(PROJECT_STATS.total), label: "Projects in this archive" },
  { value: String(PROJECT_STATS.categories), label: "Types of work" },
  { value: String(PROJECT_STATS.personalShips), label: "Personal and school ships" },
] as const;

export function ProjectsPage({ locale = "en", initialData }: ProjectsPageProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const nodeMouseRef = useRef<{ x: number; y: number; active: boolean } | null>(
    { x: 0, y: 0, active: false },
  );

  const {
    data: fetched,
    loading,
    error,
  } = useProjects({ enabled: !initialData });

  const projects = initialData ?? fetched;
  const showSkeleton = !initialData && loading;
  const showError = !initialData && error;
  const archive = useMemo(
    () => (projects ? groupProjectsForArchive(projects) : null),
    [projects],
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (nodeMouseRef.current) {
      nodeMouseRef.current.x = e.clientX - rect.left;
      nodeMouseRef.current.y = e.clientY - rect.top;
      nodeMouseRef.current.active = true;
    }
  };

  const handleMouseLeave = () => {
    if (nodeMouseRef.current) nodeMouseRef.current.active = false;
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-16 md:py-24 w-full bg-transparent min-h-screen"
    >
      <NodeNetworkLazy externalMouseRef={nodeMouseRef} densityBias="topRight" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand/3 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500/3 dark:bg-red-500/3 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-purple-500/2 dark:bg-purple-500/2 blur-3xl" />
      </div>

      <PageShell wide className="relative">
        <div className="mb-14 md:mb-18">
          <div className="relative z-10 space-y-3">
            <span className="text-xs font-mono tracking-widest text-brand uppercase block">
              Work
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-tight">
              Work I can walk you through
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground/60 max-w-2xl leading-relaxed">
              Featured case studies first: school systems, AI products, and sites
              I shipped as a web developer. The archive below groups the rest by
              type. Cards mark personal work versus employment, with team projects
              scoped to what I actually built.
            </p>
          </div>

          <dl className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-black/5 dark:border-white/8 bg-white/50 dark:bg-zinc-950/40 px-4 py-4 md:px-5 md:py-5"
              >
                <dt className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground/70">
                  {stat.label}
                </dt>
                <dd className="mt-2 text-3xl md:text-4xl font-black tracking-tight text-foreground">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {showSkeleton && <ProjectGridSkeleton count={8} />}

        {showError && (
          <p className="text-sm text-red-500 dark:text-red-400 font-mono">
            Failed to load projects: {error}
          </p>
        )}

        {!showSkeleton && !showError && archive && (
          <div className="space-y-16 md:space-y-20">
            {archive.featured.length > 0 && (
              <section className="space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-mono tracking-widest text-brand uppercase block">
                    Selected
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                    Featured case studies
                  </h2>
                  <p className="text-sm text-muted-foreground/70 max-w-xl leading-relaxed">
                    Six ships with a longer write-up: E-Vote, JepangKu,
                    CultureConnect, Smartfarm, BagiBerkah, and Terraju.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {archive.featured.map((project, i) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      locale={locale}
                      index={i}
                      variant="featured"
                    />
                  ))}
                </div>
              </section>
            )}

            {archive.groups.map((group) => (
              <section key={group.label} className="space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-mono tracking-widest text-muted-foreground/70 uppercase block">
                    Archive
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                    {group.label}
                  </h2>
                  <p className="text-sm text-muted-foreground/70 max-w-xl leading-relaxed">
                    {group.blurb}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                  {group.items.map((project, i) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      locale={locale}
                      index={i}
                      variant="archive"
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <div className="h-24 md:h-32" />
      </PageShell>

      <div className="absolute bottom-0 left-0 right-0 h-72 md:h-96 lg:h-128 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-black/10 dark:from-black/30 via-transparent to-transparent z-10" />
        <div className="absolute bottom-[-50%] left-1/2 -translate-x-1/2 w-full max-w-4xl md:max-w-5xl lg:max-w-6xl h-full opacity-40 dark:opacity-35">
          <div className="w-full h-full">
            <CpuArchitecture
              text="DEV"
              animateText
              showCpuConnections
              className="w-full h-full text-zinc-600 dark:text-zinc-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
