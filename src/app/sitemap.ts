import { MetadataRoute } from 'next';
import { getAllArticles } from '@/services/api/public/articles';
import { routing } from '@/i18n/routing';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://habibiahmada.dev';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = routing.locales;
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Static pages for each locale
  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/articles', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/projects', priority: 0.8, changeFrequency: 'weekly' as const },
  ];

  // Add static pages for each locale
  for (const locale of locales) {
    for (const page of staticPages) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  // Add article pages for each locale
  for (const locale of locales) {
    try {
      const articles = await getAllArticles(locale);
      
      for (const article of articles) {
        if (article.translation?.slug) {
          sitemapEntries.push({
            url: `${baseUrl}/${locale}/articles/${article.translation.slug}`,
            lastModified: article.updated_at 
              ? new Date(article.updated_at) 
              : article.published_at 
              ? new Date(article.published_at)
              : new Date(article.created_at),
            changeFrequency: 'daily',
            priority: 0.7,
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching articles for locale ${locale}:`, error);
    }
  }

  return sitemapEntries;
}
