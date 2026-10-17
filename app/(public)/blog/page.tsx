import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/ui/page-shell";
import { getPostSummaries, isBlogCategory } from "@/lib/data/blog";
import { BlogFeed } from "@/components/ui/blog-feed";
import { BLOG_CATEGORY_LABELS as CATEGORY_LABELS } from "@/components/ui/blog-post-card";
import { PageTransition } from "@/components/page-transition";
import { BLOG_CATEGORIES } from "@/lib/data/constants";
import { pageMetadata, SITE_COPY, SITE } from "@/lib/site-metadata";

// ─── Metadata ──────────────────────────────────────────────────────────────

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description: `Technical articles, tutorials, and commentary by ${SITE.name}. ${SITE_COPY.defaultDescription.slice(0, 120)}...`,
  path: "/blog",
  absoluteTitle: true,
  ogType: "website",
  keywords: [
    "blog",
    "tech blog",
    "programming articles",
    "web development",
    "Habibi Ahmad blog",
  ],
});

/** Posts in the first server render; later pages load as you scroll. */
const PAGE_SIZE = 10;

// ─── Page Component ────────────────────────────────────────────────────────

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const activeCategory = isBlogCategory(params.category) ? params.category : null;
  const { posts, total } = await getPostSummaries(activeCategory, 0, PAGE_SIZE);
  const postCount = total;

  return (
    <PageTransition>
    <main className="min-h-screen">
      <PageShell className="py-16 md:py-24">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <span className="text-xs font-mono tracking-widest text-brand uppercase block mb-4">
            Blog
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
            Articles &amp; Commentary
          </h1>
          <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed">
            Technical writing on web development, programming, and the craft of
            shipping production software.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/blog"
            aria-current={!activeCategory ? "page" : undefined}
            className={`inline-flex min-h-11 sm:min-h-9 items-center px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider border transition-all duration-200 ${
              !activeCategory
                ? "bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 border-transparent"
                : "bg-white dark:bg-zinc-900 text-muted-foreground border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30"
            }`}
          >
            All
          </Link>
          {BLOG_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/blog?category=${cat}`}
              aria-current={activeCategory === cat ? "page" : undefined}
              className={`inline-flex min-h-11 sm:min-h-9 items-center px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider border transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 border-transparent"
                  : "bg-white dark:bg-zinc-900 text-muted-foreground border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30"
              }`}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </Link>
          ))}
        </div>

        {/* Empty State (Task 4.9) */}
        {postCount === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-6">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-foreground mb-2">
              No articles yet
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              {activeCategory
                ? `No posts found in the "${CATEGORY_LABELS[activeCategory] ?? activeCategory}" category.`
                : "Articles will appear here once published."}
            </p>
          </div>
        )}

        {/* Post list: first page server-rendered, the rest on scroll. Keyed by
            category so switching filters starts a fresh list. */}
        {postCount > 0 && (
          <BlogFeed
            key={activeCategory ?? "all"}
            initialPosts={posts}
            total={total}
            pageSize={PAGE_SIZE}
            category={activeCategory}
          />
        )}
      </PageShell>
    </main>
    </PageTransition>
  );
}
