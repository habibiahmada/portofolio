import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/ui/page-shell";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { ShareButtons } from "@/components/ui/share-buttons";
import { BlogToc } from "@/components/ui/blog-toc";
import { ViewCounter } from "@/components/ui/view-counter";
import { BlogJsonLd } from "@/components/json-ld";
import { getPostBySlug, getPublishedPosts } from "@/lib/data/blog";
import { extractBlogHeadings } from "@/lib/blog-headings";
import { pageMetadata, SITE } from "@/lib/site-metadata";

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = post.seo_title || post.title;
  const description = (post.seo_description || post.description).slice(0, 160);

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

const CATEGORY_LABELS: Record<string, string> = {
  programming: "Programming",
  education: "Education",
  web: "Web",
  career: "Career",
  opinion: "Opinion",
  "news-commentary": "News",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

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
  const headings = extractBlogHeadings(post.body_md);
  const viewCount = Number(post.view_count) || 0;

  return (
    <main className="min-h-screen">
      <PageShell className="py-16 md:py-24">
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

        {post.cover_url && (
          <div className="mb-8 md:mb-12">
            <div className="relative aspect-[21/9] md:aspect-[2.4/1] rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5">
              <Image
                src={post.cover_url}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
            </div>
          </div>
        )}

        <header className="max-w-3xl mb-10 md:mb-12">
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
            <span className="text-muted-foreground/30">·</span>
            <ViewCounter postId={post.id} initialCount={viewCount} />
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

        <hr className="border-t border-black/5 dark:border-white/10 mb-10 md:mb-14" />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px] gap-10 xl:gap-14 items-start">
          <article className="min-w-0 max-w-3xl">
            <MarkdownRenderer content={post.body_md} />

            <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/10 lg:hidden">
              <ShareButtons url={articleUrl} title={displayTitle} />
            </div>

            <div className="mt-10">
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
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-8 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
              <ShareButtons
                url={articleUrl}
                title={displayTitle}
                layout="stack"
              />
              <ViewCounter postId={post.id} initialCount={viewCount} />
              <BlogToc headings={headings} />
            </div>
          </aside>
        </div>
      </PageShell>

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
