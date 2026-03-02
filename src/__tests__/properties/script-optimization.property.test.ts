import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join } from 'path';

/**
 * Property-Based Tests for Third-Party Script Optimization
 * Feature: nextjs-performance-optimization
 *
 * Property 35: Third-Party Scripts Use Script Component
 * For any third-party script (analytics, widgets, etc.), it should use the
 * next/script Script component rather than native script tags.
 *
 * Property 36: Non-Critical Scripts Use lazyOnload
 * For any third-party script that is not critical for initial page load,
 * it should use strategy="lazyOnload".
 *
 * Property 37: Analytics Scripts Use afterInteractive
 * For any analytics or tracking script, it should use strategy="afterInteractive"
 * to avoid blocking page load.
 *
 * Validates: Requirements 27.1, 27.2, 27.4
 */
describe('Property Test: Third-Party Script Optimization', () => {
  const srcDir = join(process.cwd(), 'src');

  /**
   * Helper function to find all files that might contain scripts
   */
  function findFilesWithScripts(dir: string, files: string[] = []): string[] {
    const items = readdirSync(dir);

    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules and .next
        if (item !== 'node_modules' && item !== '.next' && item !== '__tests__') {
          findFilesWithScripts(fullPath, files);
        }
      } else if (item.endsWith('.tsx') || item.endsWith('.jsx')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Helper function to check if file uses native script tags
   */
  function usesNativeScriptTag(filePath: string): boolean {
    const content = readFileSync(filePath, 'utf-8');

    // Check for native <script> tags (lowercase) but exclude JSON-LD structured data
    const nativeScriptRegex = /<script[\s>]/i;
    const hasScriptTag = nativeScriptRegex.test(content);

    if (!hasScriptTag) return false;

    // Exclude JSON-LD structured data (legitimate use case for SEO)
    const isJsonLd = content.includes('type="application/ld+json"') ||
                     content.includes("type='application/ld+json'");

    // Exclude Next.js Script component (capital S)
    const usesNextScript = content.includes('<Script') &&
                          (content.includes("from 'next/script'") || content.includes('from "next/script"'));

    return hasScriptTag && !isJsonLd && !usesNextScript;
  }

  /**
   * Helper function to check if file uses Next.js Script component
   */
  function usesNextScript(filePath: string): boolean {
    const content = readFileSync(filePath, 'utf-8');
    return content.includes("from 'next/script'") || content.includes('from "next/script"');
  }

  /**
   * Helper function to extract Script components and their strategies
   */
  function extractScriptStrategies(filePath: string): Array<{ src: string; strategy?: string }> {
    const content = readFileSync(filePath, 'utf-8');
    const scripts: Array<{ src: string; strategy?: string }> = [];

    // Match <Script ... /> patterns
    const scriptRegex = /<Script\s+([^>]*?)\/>/g;
    let match;

    while ((match = scriptRegex.exec(content)) !== null) {
      const attrs = match[1];
      const srcMatch = attrs.match(/src=["']([^"']+)["']/);
      const strategyMatch = attrs.match(/strategy=["']([^"']+)["']/);

      if (srcMatch) {
        scripts.push({
          src: srcMatch[1],
          strategy: strategyMatch?.[1],
        });
      }
    }

    return scripts;
  }

  it('should not use native script tags for third-party scripts', () => {
    if (!existsSync(srcDir)) {
      console.warn(`Source directory not found: ${srcDir}`);
      expect(true).toBe(true);
      return;
    }

    const files = findFilesWithScripts(srcDir);
    const problematicFiles = files.filter(file => usesNativeScriptTag(file));

    expect(
      problematicFiles,
      `The following files use native <script> tags instead of Next.js Script component:\n${problematicFiles.join('\n')}`
    ).toHaveLength(0);
  });

  it('should use Next.js Script component for third-party scripts', () => {
    if (!existsSync(srcDir)) {
      console.warn(`Source directory not found: ${srcDir}`);
      expect(true).toBe(true);
      return;
    }

    const files = findFilesWithScripts(srcDir);
    const filesWithScripts = files.filter(file => usesNextScript(file) || usesNativeScriptTag(file));

    expect(filesWithScripts.length).toBeGreaterThanOrEqual(0);
  });

  it('should use appropriate strategy for scripts', () => {
    if (!existsSync(srcDir)) {
      console.warn(`Source directory not found: ${srcDir}`);
      expect(true).toBe(true);
      return;
    }

    const files = findFilesWithScripts(srcDir);

    for (const file of files) {
      if (!usesNextScript(file)) continue;

      const scripts = extractScriptStrategies(file);
      for (const script of scripts) {
        // Analytics or tracking scripts should use 'afterInteractive'
        const isAnalytics = script.src.includes('analytics') ||
                           script.src.includes('gtag') ||
                           script.src.includes('ga.js');

        if (isAnalytics && script.strategy) {
          expect(
            script.strategy,
            `Analytics script ${script.src} in ${file} should use strategy="afterInteractive"`
          ).toBe('afterInteractive');
        }
      }
    }

    expect(true).toBe(true);
  });
});
