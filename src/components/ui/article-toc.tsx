'use client';

import { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

interface ArticleTocProps {
  headings: TocItem[];
  offset?: number;
  locale?: string;
}

export default function ArticleToc({
  headings,
  offset = 120,
  locale,
}: ArticleTocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!headings.length) return;

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
          return;
        }

        const above = entries
          .filter((entry) => entry.boundingClientRect.top < 0)
          .sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top);

        if (above.length > 0) {
          setActiveId(above[0].target.id);
        }
      },
      {
        rootMargin: `-${offset}px 0px -70% 0px`,
        threshold: [0, 1],
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [headings, offset]);

  return (
    <aside className="hidden lg:block sticky top-28 self-start max-w-2xl max-h-[calc(100vh-7rem)] overflow-y-auto">
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-5">
        <div className="mb-4">
          <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 px-3 py-3 text-slate-900 dark:text-slate-100">
            <div className="text-md uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 text-center">
              {locale === "id" ? "Selamat Datang" : "Welcome To My"}
            </div>
            <div className="mt-2 flex items-center justify-between text-md font-semibold">
              <Briefcase className="h-4 w-4 text-slate-700 dark:text-slate-300" />
              <span className="text-md uppercase tracking-[0.25em]">
                {locale === "id" ? "Artikel" : "Article"}
              </span>
              <Briefcase className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            </div>
            <div className="mt-2 text-center text-md uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {locale === "id" ? "Portofolio" : "Portfolio"}
            </div>
            <div className="mt-2 text-center text-sm lowercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {locale === "id" ? "selamat membaca!" : "Happy Reading!"}
            </div>
          </div>
          <div className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100 border-b-2 pb-3">
            {locale === "id" ? "Di halaman ini" : "On this page"}
          </div>
        </div>
        <nav aria-label="On this page">
          <ul className="space-y-2 text-sm">
            {headings.map((heading) => {
              const isActive = activeId === heading.id;
              return (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`block transition ${
                      heading.level === 3 ? "pl-4" : ""
                    } ${
                      isActive
                        ? "font-semibold text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
