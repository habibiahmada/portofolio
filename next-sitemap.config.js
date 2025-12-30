const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8')
      .split('\n')
      .forEach((line) => {
        const [key, ...rest] = line.split('=');
        if (key && rest.length) {
          process.env[key.trim()] = rest
            .join('=')
            .trim()
            .replace(/^["']|["']$/g, '');
        }
      });
  }
} catch {}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://habibiahmada.dev',
  generateRobotsTxt: true,
  sitemapSize: 7000,

  // All routes are controlled manually
  exclude: ['/*'],

  additionalPaths: async (config) => {
    const locales = ['id', 'en'];
    const result = [];

    // Static pages
    const pages = [
      '',          // Home
      '/articles', // Articles list
    ];

    pages.forEach((route) => {
      locales.forEach((locale) => {
        result.push({
          loc: `${config.siteUrl}/${locale}${route}`,
          changefreq: 'weekly',
          priority: route === '' ? 1.0 : 0.8,
          lastmod: new Date().toISOString(),
          alternateRefs: locales.map((lang) => ({
            href: `${config.siteUrl}/${lang}${route}`,
            hreflang: lang,
          })),
        });
      });
    });

    // Dynamic articles
    const { data: articles } = await supabase
      .from('article_translations')
      .select('slug, language');

    if (articles) {
      articles.forEach((article) => {
        result.push({
          loc: `${config.siteUrl}/${article.language}/articles/${article.slug}`,
          changefreq: 'daily',
          priority: 0.7,
          lastmod: new Date().toISOString(),
        });
      });
    }

    return result;
  },
};
