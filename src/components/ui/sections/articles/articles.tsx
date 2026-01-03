'use client';

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "next-intl";

import useArticles from "@/hooks/api/public/useArticles";

interface UIArticle {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  href: string;
}

function formatDate(dateString?: string, locale?: string) {
  if (!dateString) return "";

  return new Date(dateString).toLocaleDateString(locale ?? "id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const Articles: React.FC = () => {
  const locale = useLocale();
  const { articles, loading, error } = useArticles(3);

  const uiArticles: UIArticle[] = useMemo(() => {
    if (!articles?.length) return [];

    return articles.map((a, idx) => {
      const tr = a.translation;

      return {
        id: a.id ?? `article-${idx}`,
        title: tr?.title ?? "",
        excerpt: tr?.excerpt ?? "",
        date: a.published_at ?? a.created_at ?? "",
        readTime: tr?.read_time ?? "",
        image: a.image || "/images/about-illustration.webp",
        href: tr?.slug ? `/${locale}/articles/${tr.slug}` : "#",
      };
    });
  }, [articles, locale]);

  if (loading || error || uiArticles.length === 0) return null;

  return (
    <section
      id="articles"
      className="py-24 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
    >
      <div className="container px-6 mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-sm text-blue-600 dark:text-blue-400 uppercase tracking-widest font-semibold">
              Blog
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              Latest{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Articles
              </span>
            </h2>
          </div>

          <Link
            href={`/${locale}/articles`}
            className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors flex items-center gap-2 font-medium"
          >
            View All Articles
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Articles */}
        <div className="space-y-6">
          {uiArticles.map((article) => (
            <Link
              key={article.id}
              href={article.href}
              className="group grid md:grid-cols-[250px_1fr] gap-6 p-6 border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
            >
              {/* Thumbnail */}
              <div className="aspect-video md:h-full overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  width={250}
                  height={250}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  {formatDate(article.date, locale)}
                  {article.readTime && ` • ${article.readTime} read`}
                </div>

                <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                  {article.title}
                  <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>

                <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Articles;