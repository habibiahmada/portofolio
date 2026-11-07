"use client";

import { startTransition, useMemo, useRef, useState, ViewTransition } from "react";
import { NodeNetworkLazy } from "@/components/ui/node-network-lazy";
import { CpuArchitecture } from "@/components/ui/cpu-architecture";
import { ProjectCard } from "@/components/ui/project-card";
import { ProjectRow } from "@/components/ui/project-row";
import { OpenSourceCard } from "@/components/ui/open-source-card";
import { WorkCapabilities } from "@/components/sections/work-capabilities";
import { WorkPath } from "@/components/sections/work-path";
import { OPEN_SOURCE_PROJECTS } from "@/lib/data/open-source";
import { ProjectGridSkeleton } from "@/components/ui/skeletons";
import { PageShell } from "@/components/ui/page-shell";
import { useProjects } from "@/lib/hooks/use-api";
import { groupProjectsForArchive, PROJECT_STATS } from "@/lib/data/project-taxonomy";
import { projectHasCapability, type CapabilityId } from "@/lib/data/capabilities";
import type { Project } from "@/lib/supabase/types";

interface ProjectsPageProps {
  locale?: string;
  /** SSR first paint — skips `/api/public/projects` when set. */
  initialData?: Project[];
}

const STATS = [
  { value: String(PROJECT_STATS.featured), label: "Case studies" },
  { value: String(PROJECT_STATS.total), label: "Projects" },
  { value: String(PROJECT_STATS.kinds), label: "Kinds of work" },
  { value: String(PROJECT_STATS.personalOnly), label: "Personal and school" },
] as const;

function SectionHeading({ eyebrow, title, blurb, accent }: { eyebrow: string; title: string; blurb?: string; accent?: boolean }) {
  return (
    <div className="space-y-2">
      <span className={`block font-mono text-xs uppercase tracking-widest ${accent ? "text-brand" : "text-muted-foreground"}`}>
        {eyebrow}
      </span>
      <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{title}</h2>
      {blurb && <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">{blurb}</p>}
    </div>
  );
}

export function ProjectsPage({ locale = "en", initialData }: ProjectsPageProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const nodeMouseRef = useRef<{ x: number; y: number; active: boolean } | null>({ x: 0, y: 0, active: false });
  const [selected, setSelected] = useState<CapabilityId | null>(null);

  const { data: fetched, loading, error } = useProjects({ enabled: !initialData });

  const projects = initialData ?? fetched;
  const showSkeleton = !initialData && loading;
  const showError = !initialData && error;
  const archive = useMemo(() => (projects ? groupProjectsForArchive(projects) : null), [projects]);

  // A capability narrows Featured and the archive; Open Source is not part of it.
  const filtered = useMemo(() => {
    if (!archive) return null;
    const keep = (p: Project) => projectHasCapability(p.id, selected);
    const featured = archive.featured.filter(keep);
    const groups = archive.groups
      .map((g) => ({ ...g, items: g.items.filter(keep) }))
      .filter((g) => g.items.length > 0);
    const count = featured.length + groups.reduce((n, g) => n + g.items.length, 0);
    return { featured, groups, count };
  }, [archive, selected]);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Transition so the lists cross-fade through the page's ViewTransition.
  // Applying a filter scrolls to its results: on a phone they sit below the
  // fold, and otherwise the only visible change would be the button state.
  const select = (id: CapabilityId | null) => {
    startTransition(() => setSelected(id));
    if (id === null) return;
    requestAnimationFrame(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      resultsRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = sectionRef.current;
    if (!el || !nodeMouseRef.current) return;
    const rect = el.getBoundingClientRect();
    nodeMouseRef.current.x = e.clientX - rect.left;
    nodeMouseRef.current.y = e.clientY - rect.top;
    nodeMouseRef.current.active = true;
  };

  const handleMouseLeave = () => {
    if (nodeMouseRef.current) nodeMouseRef.current.active = false;
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen w-full bg-transparent py-12 md:py-24"
    >
      {/* Node network: the site's identity motif, shared with the home hero. */}
      <NodeNetworkLazy externalMouseRef={nodeMouseRef} densityBias="topRight" />

      <PageShell wide className="relative">
        <div className="space-y-8 md:space-y-10">
          <div className="relative z-10 space-y-3">
            <span className="block font-mono text-xs uppercase tracking-widest text-brand">Work</span>
            <h1 className="text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              I build more than websites
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              I turn real problems into working products, from school systems to client platforms in
              production. Each project below says what I owned; pick a capability to see the ones
              that prove it.
            </p>
          </div>

          {/* Supporting figures, aligned on one baseline: they back the headline, they are not the headline. */}
          <dl className="grid grid-cols-2 gap-x-8 gap-y-5 sm:flex sm:flex-wrap sm:gap-x-12">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <dd className="text-3xl font-black leading-none tracking-tight text-foreground md:text-4xl">{stat.value}</dd>
                <dt className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>

          <WorkPath />
        </div>

        {showSkeleton && (
          <div className="mt-12">
            <ProjectGridSkeleton count={6} />
          </div>
        )}

        {showError && (
          <p className="mt-12 font-mono text-sm text-red-600 dark:text-red-400">
            Projects could not load ({error}). Refresh the page to try again.
          </p>
        )}

        {!showSkeleton && !showError && projects && filtered && (
          <div className="mt-12 space-y-12 md:mt-20 md:space-y-20">
            <WorkCapabilities projects={projects} selected={selected} onSelect={select} matchCount={filtered.count} />

            <ViewTransition>
              <div ref={resultsRef} className="scroll-mt-24 space-y-12 md:space-y-20">
                {filtered.count === 0 && (
                  <div className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
                    <p className="text-sm text-foreground">No projects match this capability.</p>
                    <button
                      type="button"
                      onClick={() => select(null)}
                      className="mt-3 inline-flex min-h-11 items-center rounded-full border border-black/15 px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground hover:border-brand/60 dark:border-white/15"
                    >
                      Show all work
                    </button>
                  </div>
                )}

                {filtered.featured.length > 0 && (
                  <section className="space-y-6">
                    <SectionHeading
                      eyebrow="Selected"
                      title="Featured case studies"
                      blurb="The longer write-ups: the problem, the constraints, what I built, and what shipped."
                      accent
                    />
                    {/* Phones: a swipe row with the next card peeking, so six showcase cards
                        keep full-size images without six screens of scrolling. */}
                    <div
                      role="region"
                      aria-label="Featured case studies"
                      className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 md:gap-6"
                    >
                      {filtered.featured.map((project, i) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          locale={locale}
                          index={i}
                          variant="featured"
                          className="w-[82%] shrink-0 snap-start sm:w-auto"
                        />
                      ))}
                    </div>
                  </section>
                )}

                {filtered.groups.map((group) => (
                  <section key={group.label} className="space-y-6">
                    <SectionHeading eyebrow="Archive" title={group.label} blurb={group.blurb} />
                    {group.id === "web-app" ? (
                      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 md:gap-6">
                        {group.items.map((project, i) => (
                          <ProjectCard key={project.id} project={project} locale={locale} index={i} compact />
                        ))}
                      </div>
                    ) : (
                      <ul className="grid grid-cols-1 divide-y divide-black/5 border-y border-black/5 dark:divide-white/5 dark:border-white/5 md:grid-cols-2 md:gap-x-10 md:divide-y-0 md:border-y-0 md:[&>li]:border-b md:[&>li]:border-black/5 md:dark:[&>li]:border-white/5">
                        {group.items.map((project) => (
                          <ProjectRow key={project.id} project={project} locale={locale} />
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>
            </ViewTransition>

            <section className="space-y-6">
              <SectionHeading
                eyebrow="Open source"
                title="Built in public, free to fork"
                blurb="Tools I maintain on GitHub under the MIT license: a GitHub year-in-review, an editor package, this portfolio as a CLI, and a Linux emoji picker."
                accent
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                {OPEN_SOURCE_PROJECTS.map((project) => (
                  <OpenSourceCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Room for the CPU drawing below the last section (owner decision: it stays). */}
        <div className="h-28 md:h-40" />
      </PageShell>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-72 overflow-hidden md:h-96 lg:h-128">
        <div className="absolute inset-0 z-10 bg-linear-to-t from-black/10 via-transparent to-transparent dark:from-black/30" />
        <div className="absolute bottom-[-50%] left-1/2 h-full w-full max-w-4xl -translate-x-1/2 opacity-40 dark:opacity-35 md:max-w-5xl lg:max-w-6xl">
          <CpuArchitecture text="DEV" animateText showCpuConnections className="h-full w-full text-zinc-600 dark:text-zinc-300" />
        </div>
      </div>
    </section>
  );
}
