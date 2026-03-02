import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

/**
 * Property-Based Test for SSG Page Generation
 * Feature: nextjs-performance-optimization, Property 1: SSG Pages Generate Static HTML
 * 
 * Property 1: SSG Pages Generate Static HTML
 * For any page configured with SSG rendering strategy, the build process should produce 
 * a corresponding static HTML file in the build output directory.
 * 
 * Validates: Requirements 1.5
 */
describe('Property Test: SSG Page Generation', () => {
  const appDir = join(process.cwd(), 'src', 'app', '[locale]');

  /**
   * Helper function to check if a page is configured for SSG
   */
  function isConfiguredForSSG(filePath: string): boolean {
    if (!existsSync(filePath)) return false;
    
    const content = readFileSync(filePath, 'utf-8');
    
    // A page is configured for SSG if:
    // 1. It has generateStaticParams function
    // 2. It's not using force-dynamic
    // 3. It's a server component (no 'use client' at the top)
    
    const hasGenerateStaticParams = content.includes('generateStaticParams');
    const hasForceDynamic = content.includes("export const dynamic = 'force-dynamic'");
    const isClientComponent = /^['"]use client['"]/m.test(content);
    
    return hasGenerateStaticParams && !hasForceDynamic && !isClientComponent;
  }

  /**
   * Property Test: For any page configured with SSG, it should have the necessary
   * configuration to generate static HTML at build time
   */
  it('should verify all SSG-configured pages have proper static generation setup', () => {
    const ssgPages = [
      { path: join(appDir, 'page.tsx'), name: 'Homepage' },
      { path: join(appDir, 'projects', 'page.tsx'), name: 'Projects Page' },
      { path: join(appDir, 'articles', 'page.tsx'), name: 'Articles List Page' },
      { path: join(appDir, 'articles', '[slug]', 'page.tsx'), name: 'Article Detail Page' },
    ];

    // Property: For all pages in ssgPages, they should be configured for SSG
    for (const page of ssgPages) {
      const isSSG = isConfiguredForSSG(page.path);
      expect(isSSG, `${page.name} should be configured for SSG`).toBe(true);
      
      if (isSSG) {
        const content = readFileSync(page.path, 'utf-8');
        
        // Additional property checks:
        // 1. Should have generateStaticParams
        expect(content, `${page.name} should export generateStaticParams`).toContain('generateStaticParams');
        
        // 2. Should not have dynamic rendering
        expect(content, `${page.name} should not use force-dynamic`).not.toContain("export const dynamic = 'force-dynamic'");
        
        // 3. Should be a server component
        expect(content, `${page.name} should be a server component`).not.toMatch(/^['"]use client['"]/m);
        
        // 4. Should handle locale variants
        expect(content, `${page.name} should handle locale variants`).toContain('locale');
      }
    }
  });

  /**
   * Property Test: ISR pages should have revalidate configuration
   */
  it('should verify ISR pages have proper revalidate configuration', () => {
    const isrPages = [
      { path: join(appDir, 'articles', '[slug]', 'page.tsx'), name: 'Article Detail Page (ISR)' },
    ];

    // Property: For all ISR pages, they should have revalidate export
    for (const page of isrPages) {
      expect(existsSync(page.path), `${page.name} should exist`).toBe(true);
      
      const content = readFileSync(page.path, 'utf-8');
      
      // Should have revalidate export
      expect(content, `${page.name} should export revalidate`).toContain('export const revalidate');
      
      // Extract and validate revalidate value
      const revalidateMatch = content.match(/export\s+const\s+revalidate\s*=\s*(\d+)/);
      expect(revalidateMatch, `${page.name} should have numeric revalidate value`).toBeTruthy();
      
      if (revalidateMatch) {
        const revalidateValue = parseInt(revalidateMatch[1], 10);
        expect(revalidateValue, `${page.name} revalidate should be between 60-300 seconds`).toBeGreaterThanOrEqual(60);
        expect(revalidateValue, `${page.name} revalidate should be between 60-300 seconds`).toBeLessThanOrEqual(300);
      }
    }
  });

  /**
   * Property Test: All SSG pages should fetch data at build time
   */
  it('should verify SSG pages fetch data at build time (not client-side)', () => {
    const ssgPages = [
      { path: join(appDir, 'projects', 'page.tsx'), name: 'Projects Page', requiresDataFetch: true },
      { path: join(appDir, 'articles', 'page.tsx'), name: 'Articles List Page', requiresDataFetch: true },
      { path: join(appDir, 'articles', '[slug]', 'page.tsx'), name: 'Article Detail Page', requiresDataFetch: true },
    ];

    // Property: For all SSG pages that require data, they should not use client-side data fetching hooks
    for (const page of ssgPages) {
      const content = readFileSync(page.path, 'utf-8');
      
      // Should not use client-side hooks for data fetching
      expect(content, `${page.name} should not use useSWR`).not.toContain('useSWR');
      expect(content, `${page.name} should not use useEffect for data fetching`).not.toMatch(/useEffect.*fetch/);
      
      if (page.requiresDataFetch) {
        // Should be async server component or use server-side data fetching
        const isAsync = content.includes('export default async function');
        const hasServerFetch = content.includes('await') || content.includes('getAllProjects') || content.includes('getAllArticles') || content.includes('getArticleBySlug');
        
        expect(isAsync || hasServerFetch, `${page.name} should use server-side data fetching`).toBe(true);
      }
    }
  });
});
