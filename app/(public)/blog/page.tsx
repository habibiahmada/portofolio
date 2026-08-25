import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/ui/page-shell";
import { getPublishedPosts } from "@/lib/data/blog";
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

// ─── Category label map ────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  programming: "Programming",
  education: "Education",
  web: "Web",
  career: "Career",
  opinion: "Opinion",
  "news-commentary": "News",
};

// ─── Date formatter ────────────────────────────────────────────────────────

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Category badge colors ─────────────────────────────────────────────────

function categoryBadgeColor(category: string): string {
  const colors: Record<string, string> = {
    programming:
      "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    education:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    web: "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 border-violet-200 dark:border-violet-800",
    career:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    opinion:
      "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    "news-commentary":
      "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
  };
  return colors[category] ?? "bg-zinc-50 text-zinc-700 dark:bg-zinc-950/50 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800";
}

// ─── Page Component ────────────────────────────────────────────────────────

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const allPosts = await getPublishedPosts();
  const activeCategory = params.category ?? null;

  const filteredPosts = activeCategory
    ? allPosts.filter((p) => p.category === activeCategory)
    : allPosts;

  const postCount = filteredPosts.length;

  return (
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
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider border transition-all duration-200 ${
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider border transition-all duration-200 ${
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

        {/* Post List */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group border border-black/5 dark:border-white/8 rounded-2xl overflow-hidden bg-white/80 dark:bg-zinc-900/60 backdrop-blur-sm hover:border-black/15 dark:hover:border-white/15 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/40 transition-all duration-300"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex flex-col sm:flex-row sm:items-stretch gap-0">
                  {post.cover_url ? (
                    <div className="relative sm:w-48 md:w-56 lg:w-64 shrink-0 aspect-[16/10] sm:aspect-auto sm:min-h-[140px] bg-black/5 dark:bg-white/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.cover_url}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </div>
                  ) : null}

                  <div className="flex flex-1 min-w-0 gap-3 sm:gap-4 p-5 md:p-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${categoryBadgeColor(post.category)}`}
                        >
                          {CATEGORY_LABELS[post.category] ?? post.category}
                        </span>
                        {post.published_at && (
                          <time
                            dateTime={post.published_at}
                            className="text-[11px] font-mono text-muted-foreground/60"
                          >
                            {formatDate(post.published_at)}
                          </time>
                        )}
                        {post.reading_time_minutes && (
                          <span className="text-[11px] font-mono text-muted-foreground/50">
                            {post.reading_time_minutes} min read
                          </span>
                        )}
                      </div>

                      <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground group-hover:text-brand transition-colors leading-snug mb-2">
                        {post.seo_title || post.title}
                      </h2>

                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {post.description}
                      </p>

                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {post.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono text-muted-foreground/50 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="hidden sm:flex items-center self-center shrink-0">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground/30 group-hover:text-brand group-hover:translate-x-1 transition-all duration-300"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </PageShell>
    </main>
  );
}
