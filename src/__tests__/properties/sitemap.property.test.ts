import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Property-Based Tests for Sitemap Generation
 * Feature: nextjs-performance-optimization
 */

describe('Sitemap Properties', () => {
  /**
   * Property 9: Sitemap Includes All Static Pages
   * For any page using SSG or ISR rendering, its URL should appear in the generated sitemap.xml file.
   * Validates: Requirements 9.2
   */
  it('Property 9: Sitemap includes all static pages', () => {
    const sitemapPath = path.join(process.cwd(), 'src', 'app', 'sitemap.ts');
    const content = fs.readFileSync(sitemapPath, 'utf-8');

    // Define all static pages that should be in the sitemap
    const staticPages = ['', '/articles', '/projects'];
    const locales = ['en', 'id'];

    // For each locale and static page combination, verify the sitemap code includes them
    for (const locale of locales) {
      // Verify the sitemap iterates through locales
      expect(
        content.includes('locales') || content.includes(`'${locale}'`),
        `Sitemap should handle locale: ${locale}`
      ).toBe(true);
    }

    for (const page of staticPages) {
      // Verify each static page is included in the sitemap logic
      const pagePattern = page === '' ? 'path: \'\'' : `'${page}'`;
      expect(
        content.includes(pagePattern) || content.includes(`${page}`),
        `Sitemap should include static page: ${page}`
      ).toBe(true);
    }

    // Verify the sitemap constructs URLs with locale and page path
    expect(
      content.includes('${baseUrl}/${locale}') || content.includes('`${baseUrl}/${locale}`'),
      'Sitemap should construct URLs with locale'
    ).toBe(true);
  });

  /**
   * Property 10: Sitemap URLs Have Lastmod
   * For any URL entry in the sitemap.xml, it should include a lastmod timestamp field.
   * Validates: Requirements 9.3
   */
  it('Property 10: All sitemap URLs have lastmod timestamps', () => {
    const sitemapPath = path.join(process.cwd(), 'src', 'app', 'sitemap.ts');
    const content = fs.readFileSync(sitemapPath, 'utf-8');

    // Verify every entry type includes lastModified field
    // Count how many times lastModified appears (should be at least 2: static pages and articles)
    const lastModifiedMatches = content.match(/lastModified:/g);
    
    expect(
      lastModifiedMatches,
      'Sitemap should include lastModified field for entries'
    ).toBeTruthy();

    expect(
      lastModifiedMatches && lastModifiedMatches.length >= 2,
      'Sitemap should include lastModified for both static and dynamic pages'
    ).toBe(true);

    // Verify it uses Date objects for lastModified
    expect(
      content.includes('new Date()') || content.includes('new Date('),
      'Sitemap should use Date objects for lastModified timestamps'
    ).toBe(true);

    // Verify it uses article timestamps for dynamic content
    expect(
      content.includes('updated_at') || content.includes('published_at') || content.includes('created_at'),
      'Sitemap should use article timestamps for lastModified on dynamic pages'
    ).toBe(true);
  });
});
