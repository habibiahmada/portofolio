"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { BlogHeading } from "@/lib/blog-headings";
import { ShareButtons } from "@/components/ui/share-buttons";
import { BlogToc } from "@/components/ui/blog-toc";
import { ViewCounter } from "@/components/ui/view-counter";

interface BlogArticleSidebarProps {
  articleUrl: string;
  title: string;
  headings: BlogHeading[];
  postId?: string;
  viewCount?: number;
  /** Preview drafts: TOC only, no share / view counter. */
  showShare?: boolean;
  showViews?: boolean;
}

export function BlogArticleSidebar({
  articleUrl,
  title,
  headings,
  postId = "",
  viewCount = 0,
  showShare = true,
  showViews = true,
}: BlogArticleSidebarProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const hasToc = headings.length > 0;
  if (!showShare && !showViews && !hasToc) return null;

  const panelContent = (
    <div className="space-y-8">
      {showShare && (
        <ShareButtons url={articleUrl} title={title} layout="icons" />
      )}
      {hasToc && (
        <BlogToc headings={headings} onNavigate={() => setOpen(false)} />
      )}
    </div>
  );

  const panelLabel = showShare ? "Share & Nav" : "On this page";

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <aside className="hidden lg:block lg:sticky lg:top-28 lg:self-start w-full">
        <div className="space-y-8 pr-1">
          {showShare && (
            <ShareButtons url={articleUrl} title={title} layout="icons" />
          )}
          {showViews && postId && (
            <ViewCounter postId={postId} initialCount={viewCount} />
          )}
          {hasToc && <BlogToc headings={headings} />}
        </div>
      </aside>

      {/* Mobile: floating tab + slide-over panel */}
      {(showShare || hasToc) && (
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="blog-article-panel"
            aria-label={showShare ? "Open share and navigation" : "Open table of contents"}
            className={`fixed right-0 top-1/2 z-40 -translate-y-1/2 flex h-12 w-9 items-center justify-center rounded-l-xl border border-r-0 border-black/10 dark:border-white/10 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-lg shadow-black/10 transition-transform duration-300 ${
              open ? "translate-x-full opacity-0 pointer-events-none" : "translate-x-0"
            }`}
          >
            <ChevronLeft className="h-5 w-5 text-foreground" aria-hidden />
          </button>

          {open && (
            <button
              type="button"
              aria-label="Close panel"
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
            />
          )}

          <aside
            id="blog-article-panel"
            role="dialog"
            aria-modal="true"
            aria-label={panelLabel}
            className={`fixed inset-y-0 right-0 z-50 flex w-[min(88vw,320px)] flex-col border-l border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 shadow-2xl transition-transform duration-300 ease-out ${
              open ? "translate-x-0" : "translate-x-full pointer-events-none"
            }`}
          >
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 px-4 py-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                {panelLabel}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-5">{panelContent}</div>
          </aside>

          {open && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close panel"
              className="fixed right-[min(88vw,320px)] top-1/2 z-50 -translate-y-1/2 flex h-12 w-9 items-center justify-center rounded-l-xl border border-r-0 border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 shadow-lg"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
