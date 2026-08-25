import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { getDraftByPreviewToken } from "@/lib/blog-publish";
import { pageMetadata } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";
export const robots = { index: false, follow: false };

const CATEGORY_LABELS: Record<string, string> = {
  programming: "Programming",
  education: "Education",
  web: "Web",
  career: "Career",
  opinion: "Opinion",
  "news-commentary": "News",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const post = await getDraftByPreviewToken(token).catch(() => null);
  if (!post) {
    return pageMetadata({
      title: "Preview unavailable",
      description: "This draft preview link is invalid or expired.",
      path: `/blog/preview/${token}`,
      noIndex: true,
    });
  }

  return pageMetadata({
    title: `Preview: ${post.title}`,
    description: post.description.slice(0, 160),
    path: `/blog/preview/${token}`,
    noIndex: true,
  });
}

export default async function BlogPreviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  let post;
  try {
    post = await getDraftByPreviewToken(token);
  } catch {
    notFound();
  }
  if (!post) notFound();

  const deadline = post.review_deadline_at
    ? new Date(post.review_deadline_at).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <main className="min-h-screen">
      <PageShell className="py-16 md:py-24">
        <div className="max-w-3xl mb-8 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100">
          <p className="font-semibold">Draft preview (not public)</p>
          <p className="mt-1 text-amber-900/80 dark:text-amber-100/80">
            This link is temporary. Approve or reject from Telegram, or it may
            auto-publish
            {deadline ? ` after ${deadline} WIB` : " after the review window"}.
            Search engines should not index this page.
          </p>
        </div>

        {post.cover_url && (
          <div className="max-w-3xl mb-8 md:mb-12">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.cover_url}
                alt={post.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        <header className="max-w-3xl mb-10 md:mb-14">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950">
              {CATEGORY_LABELS[post.category] ?? post.category}
            </span>
            <span className="text-[11px] font-mono text-muted-foreground/60 uppercase">
              Draft
            </span>
            {post.reading_time_minutes && (
              <>
                <span className="text-muted-foreground/30">·</span>
                <span className="text-[11px] font-mono text-muted-foreground/50">
                  {post.reading_time_minutes} min read
                </span>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-[2.5rem] font-black tracking-tight text-foreground leading-tight text-balance">
            {post.seo_title || post.title}
          </h1>

          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            {post.description}
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono text-muted-foreground/50 bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <hr className="border-t border-black/5 dark:border-white/10 mb-10 md:mb-14" />

        <article className="max-w-3xl">
          <MarkdownRenderer content={post.body_md} />
        </article>
      </PageShell>
    </main>
  );
}
