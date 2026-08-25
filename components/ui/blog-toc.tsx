"use client";

import { useEffect, useMemo, useState } from "react";
import type { BlogHeading } from "@/lib/blog-headings";

interface BlogTocProps {
  headings: BlogHeading[];
}

export function BlogToc({ headings }: BlogTocProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");

  const ids = useMemo(() => headings.map((h) => h.id), [headings]);

  useEffect(() => {
    if (!ids.length) return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 1],
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [ids]);

  if (!headings.length) return null;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
    setActiveId(id);
  };

  return (
    <nav aria-label="On this page" className="space-y-3">
      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/60">
        On this page
      </p>
      <ul className="space-y-1 border-l border-black/10 dark:border-white/10">
        {headings.map((heading) => {
          const active = activeId === heading.id;
          return (
            <li key={heading.id}>
              <button
                type="button"
                onClick={() => scrollTo(heading.id)}
                className={`block w-full text-left text-xs leading-snug transition-colors border-l-2 -ml-px pl-3 py-1.5 ${
                  heading.level === 3 ? "pl-5" : ""
                } ${
                  active
                    ? "border-brand text-foreground font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {heading.text}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
