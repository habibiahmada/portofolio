import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import Navbar from "@/components/ui/navbar/main";
import Footer from "@/components/ui/footer/footer";
import HtmlRenderer from "@/components/ui/html-renderer";
import ShareButton from "@/components/ui/share-button";
import { Button } from '@/components/ui/button';

interface PageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

import { getArticleBySlug } from '@/services/api/public/articles';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { getTranslations } from 'next-intl/server';

export default async function ArticlePage({ params }: PageProps) {
  const t = await getTranslations('articles');
  const resolvedParams = await params;
  const { slug, locale } = resolvedParams;

  const article = await getArticleBySlug(slug, locale);

  if (!article || !article.published) {
    notFound();
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

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
                style={{ backgroundImage: `url(${article.image_url || article.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-transparent dark:from-slate-950 dark:via-slate-950" />
            </div>
          )}

          <div className="container mx-auto px-6 relative">
            {/* Back Button */}
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">{t('breadcrumb.home')}</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                  <BreadcrumbLink href="/articles">{t('breadcrumb.articles')}</BreadcrumbLink>
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
                {article.translation?.tags?.map(tag => (
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
                  <span>{formatDate(article.published_at || article.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{article.translation?.read_time}</span>
                </div>
                <ShareButton
                  title={article.translation?.title}
                  label={locale === 'id' ? 'Bagikan' : 'Share'}
                />
              </div>

              {/* Excerpt */}
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                {article.translation?.excerpt}
              </p>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {(article.image_url || article.image) && (
          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-full">
              <div className="relative aspect-video overflow-hidden shadow-2xl shadow-slate-900/10 dark:shadow-black/30">
                <Image
                  src={article.image_url || article.image || ''}
                  alt={article.translation?.title || ''}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </section>
        )}

        {/* Article Content */}
        <section className="container mx-auto px-6 pb-24 flex justify-center items-center">
          <div className="max-w-full">
            <article className="bg-white dark:bg-slate-900/50 p-6 md:p-12 border border-slate-200 dark:border-slate-800">
              <HtmlRenderer content={article.translation?.content || ''} />
            </article>

            {/* Bottom Tags */}
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.translation?.tags?.map(tag => (
                  <Link
                    key={tag}
                    href={`/articles?tag=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Back to Articles */}
            <div className="mt-12 text-center">
              <Link href="/articles">
                <Button variant="outline" size="lg" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {locale === 'id' ? 'Lihat Semua Artikel' : 'View All Articles'}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}