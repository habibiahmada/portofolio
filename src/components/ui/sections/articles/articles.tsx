'use client';
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import SectionHeader from "../SectionHeader";
import { useTheme } from "next-themes";
import useArticles from "@/hooks/useArticles";
import ArticleGrid from "./articlegrid";

const ArticlesSection: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("articles");
  const { articles, loading, error } = useArticles(3);

  useEffect(() => {
    setMounted(true);
  }, []);

  const uiArticles = useMemo(() => {
    return (articles || []).map((a, idx) => {
      const tr = a.article_translations?.[0] || undefined;
      return {
        id: a.id ? Number(a.id) : idx + 1, // fallback ke index
        title: tr?.title || "",
        excerpt: tr?.excerpt || "",
        date: a.published_at || a.created_at,
        readTime: tr?.read_time || "",
        image: a.image || "/about-illustration.webp",
        tags: tr?.tags || [],
        href: tr?.slug ? `/articles/${tr.slug}` : "#",
      };
    });
  }, [articles]);  

  if (!mounted) return null;
  const isDark = resolvedTheme === "dark";

  return (
    <section
      className={`
        relative min-h-screen overflow-hidden
        py-28 sm:py-36 lg:py-40 transition-colors duration-300
        ${isDark ? "bg-slate-950" : "bg-gray-50"}
      `}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        {/* Header */}
        <div className="mb-20">
          <SectionHeader
            title={t("titleLine1")}
            description={t("description1")}
            align="center"
          />
        </div>

        {/* Articles Grid */}
        <div className="mb-16 min-h-24">
          <ArticleGrid
            articles={uiArticles}
            loading={loading}
            error={error ? t("error") : null}
            columns={3}
          />
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/articles">
            <Button
              size="lg"
              className="px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-transform duration-300"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              {t("button")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;