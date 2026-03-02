import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Unit tests for rendering configuration
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 2.1
 */
describe('Rendering Configuration Tests', () => {
  const appDir = join(process.cwd(), 'src', 'app', '[locale]');

  /**
   * Example 1: Homepage Uses SSG
   * Validates: Requirements 1.1
   */
  it('should configure homepage to use SSG with generateStaticParams', () => {
    const homepagePath = join(appDir, 'page.tsx');
    expect(existsSync(homepagePath)).toBe(true);

    const content = readFileSync(homepagePath, 'utf-8');

    // Check for generateStaticParams function
    expect(content).toContain('generateStaticParams');
    
    // Check that it's not using dynamic rendering
    expect(content).not.toContain("export const dynamic = 'force-dynamic'");
    expect(content).not.toContain("export const dynamic = 'error'");
    
    // Check for locale generation
    expect(content).toContain('routing.locales');
  });

  /**
   * Example 2: Project Pages Use SSG
   * Validates: Requirements 1.2
   */
  it('should configure project pages to use SSG with generateStaticParams', () => {
    const projectsPath = join(appDir, 'projects', 'page.tsx');
    expect(existsSync(projectsPath)).toBe(true);

    const content = readFileSync(projectsPath, 'utf-8');

    // Check for generateStaticParams function
    expect(content).toContain('generateStaticParams');
    
    // Check that it's not using dynamic rendering
    expect(content).not.toContain("export const dynamic = 'force-dynamic'");
    
    // Check for locale generation
    expect(content).toContain('routing.locales');
    
    // Check that it's a server component (no 'use client')
    expect(content).not.toMatch(/^['"]use client['"]/m);
  });

  /**
   * Example 3: Blog List Uses SSG
   * Validates: Requirements 1.3
   */
  it('should configure blog listing page to use SSG with generateStaticParams', () => {
    const articlesPath = join(appDir, 'articles', 'page.tsx');
    expect(existsSync(articlesPath)).toBe(true);

    const content = readFileSync(articlesPath, 'utf-8');

    // Check for generateStaticParams function
    expect(content).toContain('generateStaticParams');
    
    // Check that it's not using dynamic rendering
    expect(content).not.toContain("export const dynamic = 'force-dynamic'");
    
    // Check for locale generation
    expect(content).toContain('routing.locales');
    
    // Check that it's a server component
    expect(content).not.toMatch(/^['"]use client['"]/m);
  });

  /**
   * Example 4: Blog Detail Uses SSG/ISR
   * Validates: Requirements 1.4
   */
  it('should configure blog detail pages to use SSG with generateStaticParams', () => {
    const articleDetailPath = join(appDir, 'articles', '[slug]', 'page.tsx');
    expect(existsSync(articleDetailPath)).toBe(true);

    const content = readFileSync(articleDetailPath, 'utf-8');

    // Check for generateStaticParams function
    expect(content).toContain('generateStaticParams');
    
    // Check for slug and locale generation
    expect(content).toContain('slug');
    expect(content).toContain('locale');
    
    // Check that it's a server component
    expect(content).not.toMatch(/^['"]use client['"]/m);
  });

  /**
   * Example 5: ISR Revalidate Interval
   * Validates: Requirements 2.1
   */
  it('should configure ISR pages with revalidate interval between 60-300 seconds', () => {
    const articleDetailPath = join(appDir, 'articles', '[slug]', 'page.tsx');
    expect(existsSync(articleDetailPath)).toBe(true);

    const content = readFileSync(articleDetailPath, 'utf-8');

    // Check for revalidate export
    expect(content).toContain('export const revalidate');
    
    // Extract revalidate value
    const revalidateMatch = content.match(/export\s+const\s+revalidate\s*=\s*(\d+)/);
    expect(revalidateMatch).toBeTruthy();
    
    if (revalidateMatch) {
      const revalidateValue = parseInt(revalidateMatch[1], 10);
      expect(revalidateValue).toBeGreaterThanOrEqual(60);
      expect(revalidateValue).toBeLessThanOrEqual(300);
    }
  });
});
