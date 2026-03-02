import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Unit Tests for Script Loading Configuration
 * Feature: nextjs-performance-optimization
 * 
 * Example 36: reCAPTCHA Conditional Loading
 * Test reCAPTCHA conditional loading - script should only load on pages with forms
 * 
 * Validates: Requirements 27.3
 */
describe('Unit Test: Script Loading Configuration', () => {
  const srcDir = join(process.cwd(), 'src');

  /**
   * Example 36: reCAPTCHA Conditional Loading
   * Verify that reCAPTCHA script is only loaded when the component is visible,
   * not globally across all pages
   */
  it('should verify reCAPTCHA uses conditional loading (only on form pages)', () => {
    const reCaptchaFile = join(srcDir, 'components', 'ui', 'reCaptcha.tsx');
    
    expect(existsSync(reCaptchaFile), 'reCAPTCHA component file should exist').toBe(true);

    const content = readFileSync(reCaptchaFile, 'utf-8');

    // Verify it's a client component (required for conditional rendering)
    expect(
      content.match(/^['"]use client['"]/m),
      'reCAPTCHA should be a client component'
    ).toBeTruthy();

    // Verify Script component is conditionally rendered
    expect(
      content.includes('{visible &&'),
      'Script should be conditionally rendered based on visibility'
    ).toBe(true);

    // Verify IntersectionObserver is used for lazy loading
    expect(
      content.includes('IntersectionObserver'),
      'Should use IntersectionObserver for lazy loading'
    ).toBe(true);

    // Verify Script is only rendered when visible
    expect(
      content.includes('<Script') && content.includes('visible'),
      'Script component should only render when component is visible'
    ).toBe(true);

    // Verify it uses lazyOnload strategy
    expect(
      content.includes('strategy="lazyOnload"'),
      'reCAPTCHA should use lazyOnload strategy'
    ).toBe(true);
  });

  /**
   * Verify reCAPTCHA is not loaded globally in layout
   */
  it('should verify reCAPTCHA is not loaded globally in root layout', () => {
    const layoutFile = join(srcDir, 'app', '[locale]', 'layout.tsx');
    
    expect(existsSync(layoutFile), 'Root layout should exist').toBe(true);

    const content = readFileSync(layoutFile, 'utf-8');

    // reCAPTCHA should NOT be in the root layout
    expect(
      content.includes('recaptcha') || content.includes('reCAPTCHA'),
      'reCAPTCHA should not be loaded globally in root layout'
    ).toBe(false);
  });

  /**
   * Verify reCAPTCHA is only used in contact form
   */
  it('should verify reCAPTCHA is only imported in contact-related components', () => {
    const contactFormFile = join(srcDir, 'components', 'ui', 'sections', 'contacts', 'contactform.tsx');
    const contactRecaptchaFile = join(srcDir, 'components', 'ui', 'sections', 'contacts', 'contactrecaptcha.tsx');
    
    // Contact form should use reCAPTCHA
    if (existsSync(contactFormFile)) {
      const content = readFileSync(contactFormFile, 'utf-8');
      expect(
        content.includes('reCaptcha') || content.includes('ReCaptcha'),
        'Contact form should import reCAPTCHA component'
      ).toBe(true);
    }

    // Contact reCAPTCHA wrapper should exist
    if (existsSync(contactRecaptchaFile)) {
      const content = readFileSync(contactRecaptchaFile, 'utf-8');
      expect(
        content.includes('reCaptcha') || content.includes('ReCaptcha'),
        'Contact reCAPTCHA wrapper should import base reCAPTCHA component'
      ).toBe(true);
    }
  });

  /**
   * Verify Script component is from next/script
   */
  it('should verify reCAPTCHA uses Next.js Script component', () => {
    const reCaptchaFile = join(srcDir, 'components', 'ui', 'reCaptcha.tsx');
    
    const content = readFileSync(reCaptchaFile, 'utf-8');

    // Should import Script from next/script
    expect(
      content.includes("import Script from 'next/script'") ||
      content.includes('import Script from "next/script"'),
      'Should import Script from next/script'
    ).toBe(true);

    // Should use <Script> component
    expect(
      content.includes('<Script'),
      'Should use <Script> component'
    ).toBe(true);

    // Should NOT use document.createElement for script loading
    expect(
      content.includes('document.createElement("script")') ||
      content.includes("document.createElement('script')"),
      'Should not use document.createElement for script loading'
    ).toBe(false);
  });

  /**
   * Verify script has proper error handling
   */
  it('should verify reCAPTCHA script has error handling', () => {
    const reCaptchaFile = join(srcDir, 'components', 'ui', 'reCaptcha.tsx');
    
    const content = readFileSync(reCaptchaFile, 'utf-8');

    // Should have onError handler
    expect(
      content.includes('onError'),
      'Script should have onError handler'
    ).toBe(true);

    // Should have error logging
    expect(
      content.includes('console.error') && content.includes('reCAPTCHA'),
      'Should log reCAPTCHA errors'
    ).toBe(true);
  });

  /**
   * Verify script has onLoad callback
   */
  it('should verify reCAPTCHA script has onLoad callback', () => {
    const reCaptchaFile = join(srcDir, 'components', 'ui', 'reCaptcha.tsx');
    
    const content = readFileSync(reCaptchaFile, 'utf-8');

    // Should have onLoad handler
    expect(
      content.includes('onLoad'),
      'Script should have onLoad handler'
    ).toBe(true);

    // Should track script ready state
    expect(
      content.includes('scriptReady') || content.includes('setScriptReady'),
      'Should track script loading state'
    ).toBe(true);
  });

  /**
   * Verify analytics is conditionally loaded
   */
  it('should verify analytics is conditionally loaded in production only', () => {
    const layoutFile = join(srcDir, 'app', '[locale]', 'layout.tsx');
    
    const content = readFileSync(layoutFile, 'utf-8');

    if (content.includes('Analytics')) {
      // Analytics should be conditionally loaded
      expect(
        content.includes("process.env.NODE_ENV === 'production'") ||
        content.includes('NODE_ENV'),
        'Analytics should be conditionally loaded (production only)'
      ).toBe(true);
    }
  });

  /**
   * Verify no blocking scripts in head
   */
  it('should verify no blocking scripts are in the document head', () => {
    const layoutFile = join(srcDir, 'app', '[locale]', 'layout.tsx');
    
    const content = readFileSync(layoutFile, 'utf-8');

    // Should not have synchronous script tags in head
    const headMatch = content.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    if (headMatch) {
      const headContent = headMatch[1];
      expect(
        headContent.includes('<script') && !headContent.includes('async') && !headContent.includes('defer'),
        'Should not have blocking scripts in head'
      ).toBe(false);
    }
  });
});
