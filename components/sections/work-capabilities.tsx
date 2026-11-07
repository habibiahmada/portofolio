"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCapabilities, type CapabilityId } from "@/lib/data/capabilities";
import { projectDetailHref } from "@/components/ui/project-card";
import type { Project } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

interface WorkCapabilitiesProps {
  projects: Project[];
  /** The capability currently filtering the work below, or null for all work. */
  selected: CapabilityId | null;
  onSelect: (id: CapabilityId | null) => void;
  /** How many projects the current filter shows, for the live status line. */
  matchCount: number;
}

function shortTitle(title: string) {
  return title.includes(":") ? title.split(":")[0]!.trim() : title;
}

/**
 * An index of what I can own. Picking a capability (tabs) shows its claim and
 * the projects that prove it as thumbnails; narrowing the work below is a
 * separate, explicit button, so browsing the index never reshapes the page.
 */
export function WorkCapabilities({ projects, selected, onSelect, matchCount }: WorkCapabilitiesProps) {
  const capabilities = getCapabilities();
  const byId = new Map(projects.map((p) => [p.id, p]));
  const [activeId, setActiveId] = useState<CapabilityId>(capabilities[0]!.id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const activeIndex = Math.max(0, capabilities.findIndex((c) => c.id === activeId));
  const active = capabilities[activeIndex]!;
  const proof = active.projectIds.map((id) => byId.get(id)).filter((p): p is Project => Boolean(p));
  const isFiltering = selected === active.id;
  const filtering = capabilities.find((c) => c.id === selected);

  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next: number | null = null;
    if (e.key in keys) next = (activeIndex + keys[e.key]! + capabilities.length) % capabilities.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = capabilities.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActiveId(capabilities[next]!.id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section aria-labelledby={`${baseId}-heading`} className="space-y-6 md:space-y-8">
      <div className="space-y-2">
        <span className="block font-mono text-xs uppercase tracking-widest text-brand">What I can own</span>
        <h2 id={`${baseId}-heading`} className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          Each claim, with its proof
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
        {/* Phones: a sideways row of tabs. From lg: a numbered index in large type. */}
        <div
          role="tablist"
          aria-label="Capabilities"
          aria-orientation="vertical"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {capabilities.map((cap, i) => {
            const on = cap.id === activeId;
            return (
              <button
                key={cap.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${cap.id}`}
                aria-selected={on}
                aria-controls={`${baseId}-panel`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActiveId(cap.id)}
                onKeyDown={onTabKey}
                className={cn(
                  "group flex min-h-11 shrink-0 items-baseline gap-3 text-left transition-colors",
                  // Phones: pills. lg: rows of the index, separated by hairlines.
                  "rounded-full border px-4 py-2 lg:rounded-none lg:border-0 lg:border-b lg:px-0 lg:py-4",
                  "lg:border-black/10 lg:dark:border-white/10",
                  on
                    ? "border-foreground bg-foreground text-background lg:bg-transparent lg:text-foreground"
                    : "border-black/15 text-muted-foreground hover:text-foreground dark:border-white/15",
                )}
              >
                <span className={cn("hidden font-mono text-xs lg:inline", on ? "text-brand" : "text-muted-foreground")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="whitespace-nowrap text-sm font-semibold lg:whitespace-normal lg:font-heading lg:text-2xl lg:font-bold lg:tracking-tight">
                  {cap.label}
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${baseId}-panel`}
          aria-labelledby={`${baseId}-tab-${active.id}`}
          className="space-y-5"
        >
          <p className="max-w-xl text-base leading-relaxed text-foreground sm:text-lg">{active.sentence}</p>

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label={`Projects that prove ${active.label}`}>
            {proof.map((p) => {
              const href = projectDetailHref(p.id);
              const name = shortTitle(p.title_en);
              const thumb = (
                <>
                  <span className="relative block aspect-16/10 overflow-hidden rounded-lg ring-1 ring-black/5 dark:ring-white/10">
                    <Image src={p.image} alt="" fill className="object-cover" sizes="(max-width: 640px) 45vw, 220px" />
                  </span>
                  <span className="mt-2 block truncate text-sm font-medium text-foreground group-hover:text-brand">
                    {name}
                  </span>
                </>
              );
              return (
                <li key={p.id}>
                  {href ? (
                    <Link href={href} transitionTypes={["nav-forward"]} className="group block">
                      {thumb}
                    </Link>
                  ) : (
                    <div className="group block">{thumb}</div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              aria-pressed={isFiltering}
              onClick={() => onSelect(isFiltering ? null : active.id)}
              className={cn(
                "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold transition-colors",
                isFiltering
                  ? "border-brand bg-brand text-white dark:text-zinc-950"
                  : "border-black/15 text-foreground hover:border-brand/60 dark:border-white/15",
              )}
            >
              {isFiltering ? "Showing only these below" : "Show only these below"}
            </button>
            {selected !== null && (
              <button
                type="button"
                onClick={() => onSelect(null)}
                className="inline-flex min-h-11 items-center px-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Show all work
              </button>
            )}
          </div>

          <p aria-live="polite" className="font-mono text-xs text-muted-foreground">
            {filtering
              ? `The work below shows ${matchCount} ${matchCount === 1 ? "project" : "projects"} for “${filtering.label}”. Open Source stays.`
              : ""}
          </p>
        </div>
      </div>
    </section>
  );
}
