import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import Navbar from "@/components/ui/navbar/main";
import Footer from "@/components/ui/footer/footer";
import HtmlRenderer from "@/components/ui/html-renderer";
import ShareButton from "@/components/ui/share-button";
import { Button } from "@/components/ui/button";
import ArticleToc from "@/components/ui/article-toc";

interface PageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

import { getArticleBySlug } from "@/services/api/public/articles";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getTranslations } from "next-intl/server";

export default async function ArticlePage({ params }: PageProps) {
  const t = await getTranslations("articles");
  const resolvedParams = await params;
  const { slug, locale } = resolvedParams;

  const article = await getArticleBySlug(slug, locale);

  if (!article || !article.published) {
    return notFound();
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(
      locale === "id" ? "id-ID" : "en-US",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      },
    );
  };

  const buildHeadings = (html: string) => {
    const headings: Array<{ id: string; text: string; level: 2 | 3 }> = [];
    const idCounts = new Map<string, number>();

    const slugify = (value: string) =>
      value
        .toLowerCase()
        .replace(/&[a-z]+;/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const ensureUnique = (value: string) => {
      const count = idCounts.get(value) || 0;
      idCounts.set(value, count + 1);
      return count === 0 ? value : `${value}-${count + 1}`;
    };

    const htmlWithIds = html.replace(
      /<(h2|h3)([^>]*)>(.*?)<\/\1>/gi,
      (match, tag, attrs, inner) => {
        const level = tag === "h2" ? 2 : 3;
        const text = inner.replace(/<[^>]+>/g, "").trim();
        if (!text) return match;

        const existingIdMatch = attrs.match(/\sid=["']([^"']+)["']/i);
        const baseId = existingIdMatch?.[1] || slugify(text);
        const id = ensureUnique(baseId || "section");

        headings.push({ id, text, level });

        if (existingIdMatch) {
          return match;
        }

        return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
      },
    );

    return { htmlWithIds, headings };
  };

  const { htmlWithIds, headings } = buildHeadings(
    article.translation?.content || "",
  );

  return (
    <>
      <Navbar withNavigation={false} />
      <main className="min-h-screen bg-white dark:bg-slate-950">
        {/* Hero Section */}
        <section className="relative pt-24 pb-12">
          {/* Background Image Blur */}
          {(article.image_url || article.image) && (
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-10 blur-3xl scale-110"
                style={{
                  backgroundImage: `url(${article.image_url || article.image})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-transparent dark:from-slate-950 dark:via-slate-950" />
            </div>
          )}

          <div className="container mx-auto px-6 relative">
            {/* Back Button */}
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">
                    {t("breadcrumb.home")}
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                  <BreadcrumbLink href="/articles">
                    {t("breadcrumb.articles")}
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                  <BreadcrumbPage>{article.translation?.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Article Header */}
            <div className="max-w-4xl">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {article.translation?.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                {article.translation?.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-400 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDate(article.published_at || article.created_at)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{article.translation?.read_time}</span>
                </div>
                <ShareButton
                  title={article.translation?.title}
                  label={locale === "id" ? "Bagikan" : "Share"}
                />
              </div>

              {/* Excerpt */}
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                {article.translation?.excerpt}
              </p>
            </div>
          </div>
        </section>

        {/* Article Content + Navigation */}
        <section className="container mx-auto px-6 md:py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_350px] xl:grid-cols-[minmax(0,1fr)_400px] gap-5 items-start">
            <div>
              {/* Featured Image */}
              {(article.image_url || article.image) && (
                <div>
                  <div className="max-w-5xl mx-auto">
                    <div className="relative aspect-video overflow-hidden rounded-lg shadow-lg shadow-slate-900/5 dark:shadow-black/20">
                      <Image
                        src={article.image_url || article.image || ""}
                        alt={article.translation?.title || ""}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="max-w-5xl mx-auto">
                <article className="bg-white dark:bg-slate-900/50 p-6 md:p-12 border border-slate-200 dark:border-slate-800">
                  <HtmlRenderer content={htmlWithIds} />
                </article>

                {/* Back to Articles */}
                <div className="mt-12 text-center">
                  <Link href="/articles">
                    <Button
                      variant="outline"
                      size="lg"
                      className="gap-2"
                      aria-label={t("backToArticles")}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      {locale === "id"
                        ? "Lihat Semua Artikel"
                        : "View All Articles"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {headings.length > 0 && (
              <ArticleToc headings={headings} locale={locale} />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
