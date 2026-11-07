"use client";

import Link from "next/link";
import { getCapabilities, type CapabilityId } from "@/lib/data/capabilities";
import { projectDetailHref } from "@/components/ui/project-card";
import type { Project } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

interface WorkCapabilitiesProps {
  projects: Project[];
  selected: CapabilityId | null;
  onSelect: (id: CapabilityId | null) => void;
  /** How many projects the current selection shows, for the live status line. */
  matchCount: number;
}

function shortTitle(title: string) {
  return title.includes(":") ? title.split(":")[0]!.trim() : title;
}

/**
 * What I can own, each claim followed by the projects that prove it.
 * The capability names are the filter: choosing one narrows Featured and
 * the archive below to its proof.
 */
export function WorkCapabilities({ projects, selected, onSelect, matchCount }: WorkCapabilitiesProps) {
  const byId = new Map(projects.map((p) => [p.id, p]));
  const capabilities = getCapabilities();
  const active = capabilities.find((c) => c.id === selected);

  return (
    <section aria-labelledby="capabilities-heading" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <span className="block font-mono text-xs uppercase tracking-widest text-brand">What I can own</span>
          <h2 id="capabilities-heading" className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Each claim, with its proof
          </h2>
        </div>
        <button
          type="button"
          onClick={() => onSelect(null)}
          aria-pressed={selected === null}
          className={cn(
            "inline-flex min-h-11 items-center self-start rounded-full border px-4 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors sm:self-auto",
            selected === null
              ? "border-foreground bg-foreground text-background"
              : "border-black/15 text-foreground hover:border-brand/60 dark:border-white/15",
          )}
        >
          All work
        </button>
      </div>

      <ol className="grid grid-cols-1 border-t border-black/10 dark:border-white/10 md:grid-cols-2 xl:grid-cols-5">
        {capabilities.map((cap, i) => {
          const isOn = cap.id === selected;
          const proof = cap.projectIds.map((id) => byId.get(id)).filter((p): p is Project => Boolean(p));
          return (
            <li
              key={cap.id}
              className={cn(
                "relative flex flex-col gap-3 border-b border-black/10 py-5 dark:border-white/10 xl:border-b-0 xl:border-r xl:px-5 xl:first:pl-0 xl:last:border-r-0",
                // The selected capability gets the brand rule on top: the page's one accent moment.
                "before:absolute before:inset-x-0 before:-top-px before:h-0.5 before:bg-brand before:transition-opacity",
                isOn ? "before:opacity-100" : "before:opacity-0",
              )}
            >
              <button
                type="button"
                onClick={() => onSelect(isOn ? null : cap.id)}
                aria-pressed={isOn}
                className="group flex min-h-11 items-baseline gap-3 text-left"
              >
                <span className={cn("font-mono text-xs", isOn ? "text-brand" : "text-muted-foreground")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "font-heading text-lg font-bold leading-snug tracking-tight underline-offset-4 group-hover:underline",
                    isOn ? "text-brand" : "text-foreground",
                  )}
                >
                  {cap.label}
                </span>
              </button>
              <p className="text-sm leading-relaxed text-muted-foreground">{cap.sentence}</p>
              <ul className="mt-auto flex flex-wrap gap-1.5" aria-label={`Projects that prove ${cap.label}`}>
                {proof.map((p) => {
                  const href = projectDetailHref(p.id);
                  const name = shortTitle(p.title_en);
                  return (
                    <li key={p.id}>
                      {href ? (
                        <Link
                          href={href}
                          transitionTypes={["nav-forward"]}
                          className="inline-flex min-h-8 items-center rounded-full border border-black/10 px-2.5 text-xs text-foreground transition-colors hover:border-brand/60 dark:border-white/15"
                        >
                          {name}
                        </Link>
                      ) : (
                        <span className="inline-flex min-h-8 items-center rounded-full border border-black/10 px-2.5 text-xs text-foreground dark:border-white/15">
                          {name}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ol>

      <p aria-live="polite" className="font-mono text-xs text-muted-foreground">
        {active
          ? `Showing ${matchCount} ${matchCount === 1 ? "project" : "projects"} that prove “${active.label}”. Open Source stays below.`
          : "Pick a capability to narrow the work below to its proof."}
      </p>
    </section>
  );
}
