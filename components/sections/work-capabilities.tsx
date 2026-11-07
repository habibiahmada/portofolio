"use client";

import { useId, useRef, type KeyboardEvent } from "react";
import { getCapabilities, type CapabilityId } from "@/lib/data/capabilities";
import { cn } from "@/lib/utils";

interface WorkCapabilitiesProps {
  /** The capability filtering the work below, or null for all work. */
  selected: CapabilityId | null;
  onSelect: (id: CapabilityId | null) => void;
  /** How many projects the current choice shows below. */
  matchCount: number;
}

const ALL_WORK = {
  label: "All work",
  sentence:
    "I turn real problems into working products, from school systems to client platforms in production. Pick a claim to see only the projects that prove it.",
};

/**
 * An index of what I can own. Each entry is a filter: choosing one swaps the
 * claim on the right and narrows the work right below it, so the projects
 * are the proof and nothing is shown twice.
 */
export function WorkCapabilities({ selected, onSelect, matchCount }: WorkCapabilitiesProps) {
  const capabilities = getCapabilities();
  const entries = [{ id: null, ...ALL_WORK }, ...capabilities.map((c) => ({ id: c.id, label: c.label, sentence: c.sentence }))];
  const activeIndex = Math.max(0, entries.findIndex((e) => e.id === selected));
  const active = entries[activeIndex]!;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  // Arrow keys move between entries and apply them (WAI-ARIA tabs, automatic activation).
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next: number | null = null;
    if (e.key in step) next = (activeIndex + step[e.key]! + entries.length) % entries.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = entries.length - 1;
    if (next === null) return;
    e.preventDefault();
    onSelect(entries[next]!.id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section aria-labelledby={`${baseId}-heading`} className="space-y-6">
      <h2 id={`${baseId}-heading`} className="font-mono text-xs uppercase tracking-widest text-brand">
        What I can own
      </h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
        {/* Phones: a sideways pill row. From lg: an index in large type. */}
        <div
          role="tablist"
          aria-label="Filter the work by what it proves"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {entries.map((entry, i) => {
            const on = i === activeIndex;
            return (
              <button
                key={entry.label}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${i}`}
                aria-selected={on}
                aria-controls={`${baseId}-panel`}
                tabIndex={on ? 0 : -1}
                onClick={() => onSelect(entry.id)}
                onKeyDown={onKey}
                className={cn(
                  "group flex min-h-11 shrink-0 items-baseline text-left transition-colors duration-300",
                  "rounded-full border px-4 py-2 lg:rounded-none lg:border-0 lg:border-b lg:px-0 lg:py-3.5",
                  "lg:border-black/10 lg:dark:border-white/10",
                  on
                    ? "border-foreground bg-foreground text-background lg:bg-transparent lg:text-foreground"
                    : "border-black/15 text-muted-foreground hover:text-foreground dark:border-white/15",
                )}
              >
                <span
                  className={cn(
                    "whitespace-nowrap text-sm font-semibold lg:font-heading lg:text-2xl lg:font-bold lg:tracking-tight",
                    // Desktop marks the active entry by shape, not colour alone.
                    on && "lg:underline lg:decoration-brand lg:decoration-2 lg:underline-offset-8",
                  )}
                >
                  {entry.label}
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${baseId}-panel`}
          aria-labelledby={`${baseId}-tab-${activeIndex}`}
          className="lg:border-l lg:border-black/10 lg:pl-16 lg:dark:border-white/10"
        >
          {/* Keyed so the claim fades in each time the choice changes. */}
          <div key={active.label} className="space-y-4 motion-safe:animate-[fade-in-up_0.4s_cubic-bezier(0.215,0.61,0.355,1)_both]">
            <p className="text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl lg:text-3xl">
              {active.sentence}
            </p>
            <p aria-live="polite" className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {selected === null
                ? `${matchCount} projects below`
                : `${matchCount} ${matchCount === 1 ? "project proves" : "projects prove"} it, below`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
