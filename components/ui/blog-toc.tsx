"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { BlogHeading } from "@/lib/blog-headings";

interface BlogTocProps {
  headings: BlogHeading[];
  onNavigate?: () => void;
}

/** Matches sticky sidebar / heading scroll-mt offset (top-28). */
const HEADER_OFFSET = 112;

function getActiveHeadingId(ids: string[]): string {
  if (!ids.length) return "";

  let active = ids[0];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;

    if (el.getBoundingClientRect().top <= HEADER_OFFSET + 12) {
      active = id;
    } else {
      break;
    }
  }

  return active;
}

export function BlogToc({ headings, onNavigate }: BlogTocProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");
  const scrollLockRef = useRef(false);
  const scrollTimerRef = useRef<number | undefined>(undefined);

  const ids = useMemo(() => headings.map((h) => h.id), [headings]);

  useEffect(() => {
    if (!ids.length) return;

    let ticking = false;

    const updateActive = () => {
      if (scrollLockRef.current) {
        ticking = false;
        return;
      }
      setActiveId(getActiveHeadingId(ids));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateActive);
      }
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActive, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActive);
    };
  }, [ids]);

  if (!headings.length) return null;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    scrollLockRef.current = true;
    setActiveId(id);

    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
    onNavigate?.();

    window.clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = window.setTimeout(() => {
      scrollLockRef.current = false;
      setActiveId(getActiveHeadingId(ids));
    }, 700);
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
                className={`block w-full cursor-pointer text-left text-xs leading-snug transition-colors border-l-2 -ml-px pl-3 py-1.5 ${
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
