'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from "@/components/ui/navbar/main";
import Footer from "@/components/ui/footer/footer";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, Clock, Tag, Search, Calendar, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useArticles from '@/hooks/api/public/useArticles';



export default function ArticlesPage() {
  const t = useTranslations("articles");
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { articles, loading } = useArticles();

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach(article => {
      article.translation?.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [articles]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = !searchQuery ||
        article.translation?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.translation?.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag = !selectedTag ||
        article.translation?.tags?.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [articles, searchQuery, selectedTag]);

  // Featured article (first one)
  const featuredArticle = filteredArticles[0];
  const otherArticles = filteredArticles.slice(1);

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
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-6 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto relative">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                {t('badge')}
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                {t('titleLine1')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                  {t('titleHighlight')}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('description1')}
              </p>
            </div>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="px-6 pb-12">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>

              {/* Tags Filter */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedTag === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(null)}
                  className="rounded-full"
                >
                  {t('allTags')}
                </Button>
                {allTags.slice(0, 6).map(tag => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(tag)}
                    className="rounded-full"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="px-6 pb-24">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-2xl mb-4" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : filteredArticles.length === 0 ? (
          <section className="px-6 pb-24">
            <div className="container mx-auto text-center py-24">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {t('noArticles')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {t('noArticlesDesc')}
              </p>
            </div>
          </section>
        ) : (
          <>
            {/* Featured Article */}
            {featuredArticle && (
              <section className="px-6 pb-16">
                <div className="container mx-auto">
                  <Link
                    href={`/articles/${featuredArticle.translation?.slug}`}
                    className="group block"
                  >
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800">
                      <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                        <div className="flex flex-col justify-center space-y-6">
                          <span className="inline-flex items-center gap-2 px-3 py-1 w-fit text-sm font-medium text-blue-400 bg-blue-500/20 rounded-full">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
                            </span>
                            {t('featured')}
                          </span>

                          <h2 className="text-3xl md:text-4xl font-bold text-white group-hover:text-blue-400 transition-colors">
                            {featuredArticle.translation?.title}
                          </h2>

                          <p className="text-slate-300 line-clamp-3 text-lg">
                            {featuredArticle.translation?.excerpt}
                          </p>

                          <div className="flex items-center gap-6 text-slate-400">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">{formatDate(featuredArticle.published_at)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">{featuredArticle.translation?.read_time}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-blue-400 font-medium group-hover:gap-4 transition-all">
                            {t('readMore')}
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        </div>

                        <div className="relative aspect-video md:aspect-auto rounded-2xl overflow-hidden">
                          {(featuredArticle.image_url || featuredArticle.image) ? (
                            <Image
                              src={featuredArticle.image_url || featuredArticle.image || ''}
                              alt={featuredArticle.translation?.title || ''}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                              <span className="text-slate-500 text-6xl">📝</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </section>
            )}

            {/* Other Articles Grid */}
            {otherArticles.length > 0 && (
              <section className="px-6 pb-24">
                <div className="container mx-auto">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                    {t('moreArticles')}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherArticles.map(article => (
                      <Link
                        key={article.id}
                        href={`/articles/${article.translation?.slug}`}
                        className="group"
                      >
                        <article className="h-full bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/5">
                          <div className="aspect-video relative overflow-hidden">
                            {(article.image_url || article.image) ? (
                              <Image
                                src={article.image_url || article.image || ''}
                                alt={article.translation?.title || ''}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                <span className="text-slate-400 text-4xl">📝</span>
                              </div>
                            )}
                          </div>

                          <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(article.published_at)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {article.translation?.read_time}
                              </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                              {article.translation?.title}
                            </h3>

                            <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                              {article.translation?.excerpt}
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {article.translation?.tags?.slice(0, 3).map(tag => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full"
                                >
                                  <Tag className="w-3 h-3" />
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:gap-2 transition-all">
                              {t('readMore')}
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}