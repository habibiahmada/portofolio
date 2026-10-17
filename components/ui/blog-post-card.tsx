import { ViewTransition } from "react";
import Link from "next/link";
import type { BlogPostSummary } from "@/lib/data/blog";
import { blogCoverTransitionName } from "@/lib/view-transitions";

export const BLOG_CATEGORY_LABELS: Record<string, string> = {
  programming: "Programming",
  education: "Education",
  web: "Web",
  career: "Career",
  opinion: "Opinion",
  "news-commentary": "News",
};

// Fixed time zone so the server render and the browser agree on the date.
const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "Asia/Jakarta",
});

/** One row in the blog list. Shared by the first server render and later pages. */
export function BlogPostCard({ post }: { post: BlogPostSummary }) {
  return (
    <article className="group border border-black/5 dark:border-white/8 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 hover:border-black/15 dark:hover:border-white/15 transition-colors duration-300">
      <Link
        href={`/blog/${post.slug}`}
        transitionTypes={["nav-forward"]}
        className="block"
      >
        <div className="flex flex-col sm:flex-row sm:items-stretch">
          {post.cover_url ? (
            <ViewTransition
              name={blogCoverTransitionName(post.slug)}
              share="morph"
              default="none"
            >
              <div className="relative sm:w-48 md:w-56 lg:w-64 shrink-0 aspect-16/10 sm:aspect-auto sm:min-h-35 bg-black/5 dark:bg-white/5 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.cover_url}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </ViewTransition>
          ) : null}

          <div className="flex-1 min-w-0 p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider border bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700">
                {BLOG_CATEGORY_LABELS[post.category] ?? post.category}
              </span>
              {post.published_at && (
                <time
                  dateTime={post.published_at}
                  className="text-[11px] font-mono text-muted-foreground"
                >
                  {dateFormat.format(new Date(post.published_at))}
                </time>
              )}
              {post.reading_time_minutes ? (
                <span className="text-[11px] font-mono text-muted-foreground">
                  {post.reading_time_minutes} min read
                </span>
              ) : null}
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
                    className="text-[11px] font-mono text-muted-foreground bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
