"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BlogPostSummary } from "@/lib/data/blog";
import { BlogPostCard } from "@/components/ui/blog-post-card";

type Status = "idle" | "loading" | "error";

interface BlogFeedProps {
  initialPosts: BlogPostSummary[];
  total: number;
  pageSize: number;
  category: string | null;
}

/**
 * Infinite scroll for /blog. The first page comes from the server; the next
 * pages load from /api/public/blog/feed when the sentinel nears the viewport.
 * The "Load more" button stays as the keyboard and fallback path, and lets
 * people reach the footer without being pulled into another page.
 */
export function BlogFeed({ initialPosts, total, pageSize, category }: BlogFeedProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [status, setStatus] = useState<Status>("idle");
  const [announce, setAnnounce] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);

  const hasMore = posts.length < total;

  const loadMore = useCallback(async () => {
    if (inFlight.current || !hasMore) return;
    inFlight.current = true;
    setStatus("loading");

    const params = new URLSearchParams({
      offset: String(posts.length),
      limit: String(pageSize),
    });
    if (category) params.set("category", category);

    try {
      const res = await fetch(`/api/public/blog/feed?${params}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error?.message ?? "Request failed");

      const next = json.data as BlogPostSummary[];
      setPosts((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...next.filter((p) => !seen.has(p.id))];
      });
      setAnnounce(`Loaded ${next.length} more articles.`);
      setStatus("idle");
    } catch {
      setStatus("error");
    } finally {
      inFlight.current = false;
    }
  }, [category, hasMore, pageSize, posts.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || status === "error") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loadMore, status]);

  return (
    <>
      <div className="space-y-4">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>

      <div ref={sentinelRef} className="mt-8 flex min-h-11 flex-col items-center gap-3 text-center">
        {status === "loading" && (
          <p className="text-xs font-mono text-muted-foreground">Loading more articles…</p>
        )}

        {status === "error" && (
          <>
            <p className="text-sm text-muted-foreground">
              Could not load more articles. Check your connection and try again.
            </p>
            <button
              type="button"
              onClick={loadMore}
              className="inline-flex min-h-11 items-center rounded-full border border-black/10 dark:border-white/10 px-5 text-xs font-mono font-semibold uppercase tracking-wider text-foreground hover:border-brand/40"
            >
              Try again
            </button>
          </>
        )}

        {status === "idle" && hasMore && (
          <button
            type="button"
            onClick={loadMore}
            className="inline-flex min-h-11 items-center rounded-full border border-black/10 dark:border-white/10 px-5 text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-brand/40"
          >
            Load more articles ({total - posts.length} left)
          </button>
        )}

        {!hasMore && posts.length > pageSize && (
          <p className="text-xs font-mono text-muted-foreground">
            That is every article ({total}).
          </p>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </>
  );
}
