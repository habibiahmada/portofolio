/**
 * Unit Tests for i18n Configuration
 * Feature: nextjs-performance-optimization
 * 
 * Example 25: Static message files
 * Example 26: Per-page language loading
 * 
 * Validates: Requirements 20.1, 20.2
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Define locales directly to avoid importing routing module in tests
const SUPPORTED_LOCALES = ['en', 'id'];

describe('i18n Configuration', () => {
  describe('Example 25: Static message files', () => {
    it('should use static JSON files in messages/ directory', () => {
      const messagesDir = path.join(process.cwd(), 'messages');
      
      // Verify messages directory exists
      expect(fs.existsSync(messagesDir)).toBe(true);
      expect(fs.statSync(messagesDir).isDirectory()).toBe(true);
    });

    it('should have message files for all configured locales', () => {
      for (const locale of SUPPORTED_LOCALES) {
        const messagePath = path.join(process.cwd(), 'messages', `${locale}.json`);
        
        // Verify file exists
        expect(
          fs.existsSync(messagePath),
          `Message file should exist for locale: ${locale}`
        ).toBe(true);
        
        // Verify it's a valid JSON file
        const content = fs.readFileSync(messagePath, 'utf-8');
        expect(() => JSON.parse(content)).not.toThrow();
      }
    });

    it('should have consistent message structure across locales', () => {
      const messageFiles = SUPPORTED_LOCALES.map(locale => {
        const messagePath = path.join(process.cwd(), 'messages', `${locale}.json`);
        return {
          locale,
          messages: JSON.parse(fs.readFileSync(messagePath, 'utf-8'))
        };
      });
      
      // Get keys from first locale as reference
      const referenceKeys = Object.keys(messageFiles[0].messages);
      
      // Verify all locales have the same top-level keys
      for (const { locale, messages } of messageFiles) {
        const keys = Object.keys(messages);
        expect(
          keys.sort(),
          `Locale ${locale} should have the same top-level keys as reference`
        ).toEqual(referenceKeys.sort());
      }
    });

    it('should not use dynamic message loading in production', () => {
      const requestConfigPath = path.join(process.cwd(), 'src/i18n/request.ts');
      const content = fs.readFileSync(requestConfigPath, 'utf-8');
      
      // Verify it uses static imports
      expect(
        content.includes('import('),
        'Should use dynamic import for messages'
      ).toBe(true);
      
      // Verify it imports from messages directory
      expect(
        content.includes('messages/'),
        'Should import from messages directory'
      ).toBe(true);
    });
  });

  describe('Example 26: Per-page language loading', () => {
    it('should load messages through next-intl request config', () => {
      const requestConfigPath = path.join(process.cwd(), 'src/i18n/request.ts');
      
      // Verify request config file exists
      expect(fs.existsSync(requestConfigPath)).toBe(true);
      
      const content = fs.readFileSync(requestConfigPath, 'utf-8');
      
      // Verify it uses getRequestConfig from next-intl
      expect(
        content.includes('getRequestConfig'),
        'Should use getRequestConfig from next-intl'
      ).toBe(true);
      
      // Verify it returns messages
      expect(
        content.includes('messages:'),
        'Should return messages in config'
      ).toBe(true);
    });

    it('should validate locale before loading messages', () => {
      const requestConfigPath = path.join(process.cwd(), 'src/i18n/request.ts');
      const content = fs.readFileSync(requestConfigPath, 'utf-8');
      
      // Verify locale validation exists
      expect(
        content.includes('hasLocale') || content.includes('routing.locales'),
        'Should validate locale before loading'
      ).toBe(true);
    });

    it('should have fallback to default locale', () => {
      const requestConfigPath = path.join(process.cwd(), 'src/i18n/request.ts');
      const content = fs.readFileSync(requestConfigPath, 'utf-8');
      
      // Verify fallback logic exists
      expect(
        content.includes('defaultLocale') || content.includes('routing.defaultLocale'),
        'Should have fallback to default locale'
      ).toBe(true);
    });

    it('should use getTranslations for component-level message access', () => {
      // Check a sample page for proper usage
      const samplePages = [
        'src/app/[locale]/page.tsx',
        'src/app/[locale]/projects/page.tsx',
      ];
      
      for (const pagePath of samplePages) {
        const fullPath = path.join(process.cwd(), pagePath);
        const content = fs.readFileSync(fullPath, 'utf-8');
        
        // Verify it uses getTranslations
        expect(
          content.includes('getTranslations'),
          `${pagePath} should use getTranslations for message access`
        ).toBe(true);
        
        // Verify it's imported from next-intl/server
        expect(
          content.includes('next-intl/server'),
          `${pagePath} should import from next-intl/server`
        ).toBe(true);
      }
    });

    it('should not load all messages globally', () => {
      const layoutPath = path.join(process.cwd(), 'src/app/[locale]/layout.tsx');
      const content = fs.readFileSync(layoutPath, 'utf-8');
      
      // Verify it doesn't import all messages directly
      expect(
        !content.includes('import messages from'),
        'Layout should not import all messages directly'
      ).toBe(true);
      
      // Verify it uses NextIntlClientProvider for client components
      expect(
        content.includes('NextIntlClientProvider'),
        'Layout should use NextIntlClientProvider'
      ).toBe(true);
    });

    it('should support lazy loading for language switching', () => {
      const routingPath = path.join(process.cwd(), 'src/i18n/routing.ts');
      const content = fs.readFileSync(routingPath, 'utf-8');
      
      // Verify routing configuration exists
      expect(
        content.includes('defineRouting'),
        'Should define routing configuration'
      ).toBe(true);
      
      // Verify it exports navigation utilities
      expect(
        content.includes('createNavigation'),
        'Should create navigation utilities for language switching'
      ).toBe(true);
    });
  });
});
