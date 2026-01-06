import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import process from 'process'

/* Load .env.local (build-time only) */
try {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8')
      .split('\n')
      .forEach((line) => {
        const [key, ...rest] = line.split('=')
        if (key && rest.length) {
          process.env[key.trim()] = rest
            .join('=')
            .trim()
            .replace(/^["']|["']$/g, '')
        }
      })
  }
} catch {}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://habibiahmada.dev',
  generateRobotsTxt: true,
  sitemapSize: 7000,

  /* Jangan masukkan halaman redirect & internal */
  exclude: [
    '/',
    '/login',
    '/register',
    '/dashboard',
    '/admin/*',
    '/api/*',
  ],

  additionalPaths: async (config) => {
    const locales = ['en', 'id']
    const result = []

    /* Static public pages */
    const staticPages = ['', '/articles', '/projects']

    for (const route of staticPages) {
      for (const locale of locales) {
        result.push({
          loc: `${config.siteUrl}/${locale}${route}`,
          changefreq: 'weekly',
          priority: route === '' ? 1.0 : 0.8,
          lastmod: new Date().toISOString(),
          alternateRefs: locales.map((lang) => ({
            href: `${config.siteUrl}/${lang}${route}`,
            hreflang: lang,
          })),
        })
      }
    }

    /* Article detail pages */
    const { data: articles } = await supabase
      .from('article_translations')
      .select('slug, language')

    if (articles?.length) {
      for (const article of articles) {
        result.push({
          loc: `${config.siteUrl}/${article.language}/articles/${article.slug}`,
          changefreq: 'daily',
          priority: 0.7,
          lastmod: new Date().toISOString(),
        })
      }
    }

    return result
  },
}

export default config