"use client";

import { useRef } from "react";
import { GlitchText } from "@/components/ui/glitch-text";
import { NodeNetworkLazy } from "@/components/ui/node-network-lazy";
import { CpuArchitecture } from "@/components/ui/cpu-architecture";
import { ProjectCard } from "@/components/ui/project-card";
import { ProjectGridSkeleton } from "@/components/ui/skeletons";
import { useProjects } from "@/lib/hooks/use-api";
import type { Project } from "@/lib/supabase/types";

interface ProjectsPageProps {
  locale?: string;
  /** SSR first paint — skips `/api/public/projects` when set. */
  initialData?: Project[];
}

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
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-red-500/3 dark:bg-blue-500/3 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500/3 dark:bg-red-500/3 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-purple-500/2 dark:bg-purple-500/2 blur-3xl" />
      </div>

      <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-14 md:mb-18">
          <div className="relative z-10 space-y-3">
            <span className="text-xs font-mono tracking-widest text-[#ef4444] dark:text-blue-400 uppercase block">
              // Archive
            </span>
            <GlitchText
              as="h1"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-tight"
              interval={6000}
              duration={350}
            >
              All Projects
            </GlitchText>
            <p className="text-sm sm:text-base text-muted-foreground/60 max-w-xl leading-relaxed">
              A curated collection of everything I&apos;ve built — from
              production applications to experimental side projects.
            </p>
          </div>
        </div>

        {/* Loading state (only when no initialData) */}
        {showSkeleton && <ProjectGridSkeleton count={8} />}

        {/* Error state (only when no initialData) */}
        {showError && (
          <p className="text-sm text-red-500 dark:text-red-400 font-mono">
            Failed to load projects: {error}
          </p>
        )}

        {/* Projects Grid — 4 columns */}
        {!showSkeleton && !showError && projects && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                locale={locale}
                index={i}
                variant="archive"
              />
            ))}
          </div>
        )}

        <div className="h-24 md:h-32" />
      </div>

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
