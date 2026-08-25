import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/ui/page-shell";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { ShareButtons } from "@/components/ui/share-buttons";
import { ReactionButtons } from "@/components/ui/reaction-buttons";
import { CommentSection } from "@/components/ui/comment-section";
import { BlogJsonLd } from "@/components/json-ld";
import { getPostBySlug, getPublishedPosts } from "@/lib/data/blog";
import { pageMetadata, SITE } from "@/lib/site-metadata";

// ─── Static params for ISR ─────────────────────────────────────────────────

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// ─── Metadata per slug ─────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = post.seo_title || post.title;
  const description =
    (post.seo_description || post.description).slice(0, 160);

  // Use cover image for OG if available, otherwise generate dynamically
  const ogImage = post.cover_url
    ? post.cover_url
    : `/api/og/blog?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}`;

  return pageMetadata({
    title,
    description,
    path: `/blog/${post.slug}`,
    image: ogImage,
    imageAlt: `${post.title} by ${SITE.name}`,
    imageWidth: 1200,
    imageHeight: 630,
    absoluteTitle: true,
    ogType: "article",
    keywords: [
      post.title,
      post.category,
      ...post.tags,
      "blog",
      "tech article",
      SITE.name,
    ],
  });
}

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
    month: "long",
    day: "numeric",
  });
}

// ─── Page Component ────────────────────────────────────────────────────────

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleUrl = `${SITE.url}/blog/${post.slug}`;
  const displayTitle = post.seo_title || post.title;

  return (
    <main className="min-h-screen">
      <PageShell className="py-16 md:py-24">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          All articles
        </Link>

        {/* Cover Image (Task 11.3) */}
        {post.cover_url && (
          <div className="max-w-3xl mb-8 md:mb-12">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5">
              <Image
                src={post.cover_url}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          </div>
        )}

        {/* Article Header */}
        <header className="max-w-3xl mb-10 md:mb-14">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950">
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
              <>
                <span className="text-muted-foreground/30">·</span>
                <span className="text-[11px] font-mono text-muted-foreground/50">
                  {post.reading_time_minutes} min read
                </span>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-[2.5rem] font-black tracking-tight text-foreground leading-tight text-balance">
            {displayTitle}
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

        {/* Divider */}
        <hr className="border-t border-black/5 dark:border-white/10 mb-10 md:mb-14" />

        {/* Article Body */}
        <article className="max-w-3xl">
          <MarkdownRenderer content={post.body_md} />
        </article>

        {/* Reactions (Task 10.3) */}
        <div className="max-w-3xl mt-12 pt-8 border-t border-black/5 dark:border-white/10">
          <ReactionButtons
            postId={post.id}
            initialCounts={post.reaction_counts}
          />
        </div>

        {/* Share Row (Task 4.8) */}
        <div className="max-w-3xl mt-8">
          <ShareButtons url={articleUrl} title={displayTitle} />
        </div>

        {/* Comments (Task 12.3) */}
        <div className="max-w-3xl mt-12 pt-8 border-t border-black/5 dark:border-white/10">
          <CommentSection postId={post.id} />
        </div>

        {/* Back to blog */}
        <div className="max-w-3xl mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back to all articles
          </Link>
        </div>
      </PageShell>

      {/* JSON-LD (Task 4.4) */}
      <BlogJsonLd
        slug={post.slug}
        title={displayTitle}
        description={post.description}
        category={post.category}
        tags={post.tags}
        publishedAt={post.published_at}
        readingTime={post.reading_time_minutes}
      />
    </main>
  );
}
