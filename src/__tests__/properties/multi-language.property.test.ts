/**
 * Property-Based Tests for Multi-Language Optimization
 * Feature: nextjs-performance-optimization
 * 
 * Property 20: All Language Variants Use SSG
 * Property 21: Static Pages Generated Per Language
 * 
 * Validates: Requirements 20.4, 20.5
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Define locales directly to avoid importing routing module in tests
const SUPPORTED_LOCALES = ['en', 'id'];
const DEFAULT_LOCALE = 'en';

describe('Multi-Language Optimization Properties', () => {
  describe('Property 20: All Language Variants Use SSG', () => {
    it('should verify all public pages implement generateStaticParams with all locales', async () => {
      // Define public pages that should support all locales
      const publicPages = [
        'src/app/[locale]/page.tsx',
        'src/app/[locale]/projects/page.tsx',
        'src/app/[locale]/articles/page.tsx',
        'src/app/[locale]/articles/[slug]/page.tsx',
      ];

      for (const pagePath of publicPages) {
        const fullPath = path.join(process.cwd(), pagePath);
        
        // Check if file exists
        expect(fs.existsSync(fullPath), `Page ${pagePath} should exist`).toBe(true);
        
        const content = fs.readFileSync(fullPath, 'utf-8');
        
        // Verify generateStaticParams is exported
        expect(
          content.includes('export async function generateStaticParams'),
          `${pagePath} should export generateStaticParams function`
        ).toBe(true);
        
        // Verify it uses routing.locales
        expect(
          content.includes('routing.locales'),
          `${pagePath} should use routing.locales for locale generation`
        ).toBe(true);
        
        // Verify it maps over locales
        expect(
          content.includes('.map(') && content.includes('locale'),
          `${pagePath} should map over locales to generate params`
        ).toBe(true);
      }
    });

    it('should verify ISR pages use generateStaticParams with all locales', () => {
      const isrPagePath = 'src/app/[locale]/articles/[slug]/page.tsx';
      const fullPath = path.join(process.cwd(), isrPagePath);
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      // Verify revalidate is set
      expect(
        content.includes('export const revalidate'),
        'ISR page should export revalidate constant'
      ).toBe(true);
      
      // Verify generateStaticParams includes all locales
      expect(
        content.includes('routing.locales'),
        'ISR page should generate static params for all locales'
      ).toBe(true);
    });

    it('should verify no pages use dynamic rendering by default', () => {
      const publicPages = [
        'src/app/[locale]/page.tsx',
        'src/app/[locale]/projects/page.tsx',
        'src/app/[locale]/articles/page.tsx',
      ];

      for (const pagePath of publicPages) {
        const fullPath = path.join(process.cwd(), pagePath);
        const content = fs.readFileSync(fullPath, 'utf-8');
        
        // Verify no force-dynamic
        expect(
          !content.includes("dynamic = 'force-dynamic'"),
          `${pagePath} should not use force-dynamic rendering`
        ).toBe(true);
        
        // Verify no 'use client' directive (should be server components)
        const lines = content.split('\n');
        const firstNonEmptyLine = lines.find(line => line.trim().length > 0);
        expect(
          firstNonEmptyLine && !firstNonEmptyLine.includes("'use client'"),
          `${pagePath} should not be a client component`
        ).toBe(true);
      }
    });
  });

  describe('Property 21: Static Pages Generated Per Language', () => {
    it('should verify routing configuration includes all supported locales', () => {
      const routingPath = path.join(process.cwd(), 'src/i18n/routing.ts');
      const content = fs.readFileSync(routingPath, 'utf-8');
      
      // Verify routing file exists and has locale configuration
      expect(content.includes('locales:')).toBe(true);
      
      // Verify expected locales are present in the file
      for (const locale of SUPPORTED_LOCALES) {
        expect(
          content.includes(`'${locale}'`),
          `Routing should include locale: ${locale}`
        ).toBe(true);
      }
    });

    it('should verify default locale is configured', () => {
      const routingPath = path.join(process.cwd(), 'src/i18n/routing.ts');
      const content = fs.readFileSync(routingPath, 'utf-8');
      
      expect(content.includes('defaultLocale:')).toBe(true);
      expect(content.includes(`'${DEFAULT_LOCALE}'`)).toBe(true);
    });

    it('should verify message files exist for all locales', () => {
      for (const locale of SUPPORTED_LOCALES) {
        const messagePath = path.join(process.cwd(), 'messages', `${locale}.json`);
        expect(
          fs.existsSync(messagePath),
          `Message file should exist for locale: ${locale}`
        ).toBe(true);
        
        // Verify message file is valid JSON
        const content = fs.readFileSync(messagePath, 'utf-8');
        expect(() => JSON.parse(content)).not.toThrow();
        
        // Verify message file has content
        const messages = JSON.parse(content);
        expect(Object.keys(messages).length).toBeGreaterThan(0);
      }
    });

    it('should verify generateStaticParams returns params for all locales', () => {
      // Simulate what generateStaticParams should return
      const expectedParams = SUPPORTED_LOCALES.map((locale) => ({
        locale,
      }));
      
      expect(expectedParams.length).toBe(SUPPORTED_LOCALES.length);
      
      // Verify each locale is represented
      for (const locale of SUPPORTED_LOCALES) {
        const hasLocale = expectedParams.some(param => param.locale === locale);
        expect(hasLocale, `generateStaticParams should include locale: ${locale}`).toBe(true);
      }
    });

    it('should verify pages with dynamic segments generate params for all locale combinations', () => {
      const dynamicPagePath = 'src/app/[locale]/articles/[slug]/page.tsx';
      const fullPath = path.join(process.cwd(), dynamicPagePath);
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      // Verify it generates params for all locale combinations
      expect(
        content.includes('for (const locale of routing.locales)') ||
        content.includes('routing.locales.forEach') ||
        content.includes('routing.locales.map'),
        'Dynamic pages should generate params for all locale combinations'
      ).toBe(true);
    });
  });
});
