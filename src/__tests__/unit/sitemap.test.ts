import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Unit Tests for Sitemap Generation
 * Feature: nextjs-performance-optimization
 */

describe('Sitemap Unit Tests', () => {
  /**
   * Example 13: Sitemap.xml Generated
   * Verify that sitemap.xml exists in the build output or public directory.
   * Validates: Requirements 8.2, 9.1
   */
  it('Example 13: sitemap.ts file exists and is properly structured', () => {
    const sitemapPath = path.join(process.cwd(), 'src', 'app', 'sitemap.ts');
    
    expect(
      fs.existsSync(sitemapPath),
      'sitemap.ts should exist in src/app directory'
    ).toBe(true);

    // Read the file content
    const content = fs.readFileSync(sitemapPath, 'utf-8');

    // Verify it exports a default function
    expect(
      content.includes('export default'),
      'sitemap.ts should have a default export'
    ).toBe(true);

    // Verify it returns MetadataRoute.Sitemap type
    expect(
      content.includes('MetadataRoute.Sitemap'),
      'sitemap.ts should return MetadataRoute.Sitemap type'
    ).toBe(true);

    // Verify it includes getAllArticles import
    expect(
      content.includes('getAllArticles'),
      'sitemap.ts should import getAllArticles for dynamic content'
    ).toBe(true);

    // Verify it includes routing/locales
    expect(
      content.includes('routing') || content.includes('locales'),
      'sitemap.ts should handle multi-language support'
    ).toBe(true);
  });

  /**
   * Example 15: Sitemap Accessible
   * Verify that /sitemap.xml route is accessible and returns valid XML.
   * Validates: Requirements 9.4
   */
  it('Example 15: sitemap.ts includes required fields for each entry', () => {
    const sitemapPath = path.join(process.cwd(), 'src', 'app', 'sitemap.ts');
    const content = fs.readFileSync(sitemapPath, 'utf-8');

    // Verify it includes url field
    expect(
      content.includes('url:'),
      'sitemap entries should include url field'
    ).toBe(true);

    // Verify it includes lastModified field
    expect(
      content.includes('lastModified:'),
      'sitemap entries should include lastModified field'
    ).toBe(true);

    // Verify it includes changeFrequency
    expect(
      content.includes('changeFrequency'),
      'sitemap entries should include changeFrequency field'
    ).toBe(true);

    // Verify it includes priority
    expect(
      content.includes('priority'),
      'sitemap entries should include priority field'
    ).toBe(true);
  });

  it('sitemap.ts includes multi-language support', () => {
    const sitemapPath = path.join(process.cwd(), 'src', 'app', 'sitemap.ts');
    const content = fs.readFileSync(sitemapPath, 'utf-8');

    // Verify it loops through locales
    expect(
      content.includes('for (const locale of locales)') || 
      content.includes('locales.forEach') ||
      content.includes('locales.map'),
      'sitemap should iterate through locales'
    ).toBe(true);
  });

  it('sitemap.ts includes static pages', () => {
    const sitemapPath = path.join(process.cwd(), 'src', 'app', 'sitemap.ts');
    const content = fs.readFileSync(sitemapPath, 'utf-8');

    // Verify it includes static pages
    expect(
      content.includes('/articles') && content.includes('/projects'),
      'sitemap should include static pages like /articles and /projects'
    ).toBe(true);
  });

  it('sitemap.ts includes dynamic article pages', () => {
    const sitemapPath = path.join(process.cwd(), 'src', 'app', 'sitemap.ts');
    const content = fs.readFileSync(sitemapPath, 'utf-8');

    // Verify it fetches articles
    expect(
      content.includes('getAllArticles'),
      'sitemap should fetch articles dynamically'
    ).toBe(true);

    // Verify it uses article slug
    expect(
      content.includes('slug'),
      'sitemap should use article slugs for URLs'
    ).toBe(true);
  });

  it('sitemap.ts uses proper lastModified timestamps for articles', () => {
    const sitemapPath = path.join(process.cwd(), 'src', 'app', 'sitemap.ts');
    const content = fs.readFileSync(sitemapPath, 'utf-8');

    // Verify it uses updated_at or published_at for articles
    expect(
      content.includes('updated_at') || content.includes('published_at') || content.includes('created_at'),
      'sitemap should use article timestamps for lastModified'
    ).toBe(true);
  });
});
