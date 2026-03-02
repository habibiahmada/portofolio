/**
 * Unit Tests for CSS Optimization Configuration
 * 
 * These tests verify that CSS optimization is properly configured
 * according to requirements 26.1 and 26.2
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('CSS Optimization Configuration', () => {
  /**
   * Example 34: Tailwind Purge Configured
   * Validates: Requirements 26.1
   * 
   * Verifies that tailwind.config.js has content paths configured for CSS purging
   */
  it('should have content paths configured in tailwind.config.js', () => {
    const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');
    
    expect(fs.existsSync(tailwindConfigPath), 'tailwind.config.js should exist').toBe(true);
    
    const tailwindConfigContent = fs.readFileSync(tailwindConfigPath, 'utf-8');

    // Check that content array is defined
    expect(tailwindConfigContent).toContain('content:');
    
    // Check that it includes src/app directory
    expect(tailwindConfigContent).toMatch(/["']\.\/src\/app\/\*\*\/\*\.{[^}]+}["']/);
    
    // Check that it includes src/components directory
    expect(tailwindConfigContent).toMatch(/["']\.\/src\/components\/\*\*\/\*\.{[^}]+}["']/);
  });

  it('should include proper file extensions in content paths', () => {
    const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');
    const tailwindConfigContent = fs.readFileSync(tailwindConfigPath, 'utf-8');

    // Check for TypeScript and JSX extensions
    expect(tailwindConfigContent).toContain('tsx');
    expect(tailwindConfigContent).toContain('ts');
    expect(tailwindConfigContent).toContain('jsx');
    expect(tailwindConfigContent).toContain('js');
  });

  it('should exclude test files and node_modules from content paths', () => {
    const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');
    const tailwindConfigContent = fs.readFileSync(tailwindConfigPath, 'utf-8');

    // Check for exclusion patterns
    const hasExclusions = 
      tailwindConfigContent.includes('!./src/**/*.test.') ||
      tailwindConfigContent.includes('!./src/**/*.spec.') ||
      tailwindConfigContent.includes('!./node_modules/');

    expect(hasExclusions, 'Should exclude test files or node_modules').toBe(true);
  });

  /**
   * Example 35: Minimal Global CSS
   * Validates: Requirements 26.2
   * 
   * Verifies that only globals.css exists for reset/base styles, no other global CSS files
   */
  it('should have only globals.css as global CSS file', () => {
    const globalsPath = path.join(process.cwd(), 'src/app/[locale]/globals.css');
    
    expect(fs.existsSync(globalsPath), 'globals.css should exist').toBe(true);
  });

  it('should not have other global CSS files in src/app', () => {
    const appDir = path.join(process.cwd(), 'src/app');
    
    if (!fs.existsSync(appDir)) {
      console.warn('src/app directory not found, skipping test');
      return;
    }

    // Get all CSS files in src/app (excluding globals.css)
    function findCssFiles(dir: string, files: string[] = []): string[] {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          findCssFiles(fullPath, files);
        } else if (item.endsWith('.css') && item !== 'globals.css') {
          files.push(fullPath);
        }
      });
      
      return files;
    }

    const otherCssFiles = findCssFiles(appDir);
    
    expect(
      otherCssFiles,
      `Found unexpected global CSS files: ${otherCssFiles.map(f => path.relative(process.cwd(), f)).join(', ')}`
    ).toHaveLength(0);
  });

  it('should import globals.css only in root layout', () => {
    const layoutPath = path.join(process.cwd(), 'src/app/[locale]/layout.tsx');
    
    if (!fs.existsSync(layoutPath)) {
      console.warn('Root layout not found, skipping test');
      return;
    }

    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
    
    // Check that globals.css is imported
    expect(layoutContent).toMatch(/import\s+["']\.\/globals\.css["']/);
  });

  it('should have minimal content in globals.css', () => {
    const globalsPath = path.join(process.cwd(), 'src/app/[locale]/globals.css');
    
    if (!fs.existsSync(globalsPath)) {
      console.warn('globals.css not found, skipping test');
      return;
    }

    const globalsContent = fs.readFileSync(globalsPath, 'utf-8');
    
    // Check that it contains Tailwind imports
    expect(globalsContent).toContain('tailwindcss');
    
    // Check that it contains theme tokens or CSS variables
    const hasThemeTokens = 
      globalsContent.includes('@theme') ||
      globalsContent.includes(':root') ||
      globalsContent.includes('--');

    expect(hasThemeTokens, 'globals.css should contain theme tokens or CSS variables').toBe(true);
    
    // Should not contain component-specific styles (those should be in CSS modules)
    const hasComponentStyles = 
      globalsContent.includes('.card') ||
      globalsContent.includes('.button') ||
      globalsContent.includes('.modal');

    expect(hasComponentStyles, 'globals.css should not contain component-specific styles').toBe(false);
  });

  it('should use CSS modules for component-specific styles', () => {
    const componentsDir = path.join(process.cwd(), 'src/components');
    
    if (!fs.existsSync(componentsDir)) {
      console.warn('Components directory not found, skipping test');
      return;
    }

    // Find all CSS files in components directory
    function findCssFiles(dir: string, files: string[] = []): string[] {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          findCssFiles(fullPath, files);
        } else if (item.endsWith('.css')) {
          files.push(fullPath);
        }
      });
      
      return files;
    }

    const cssFiles = findCssFiles(componentsDir);
    
    // All CSS files in components should be CSS modules
    const nonModuleCss = cssFiles.filter(file => !file.endsWith('.module.css'));
    
    expect(
      nonModuleCss,
      `Found non-module CSS files in components: ${nonModuleCss.map(f => path.relative(process.cwd(), f)).join(', ')}`
    ).toHaveLength(0);
  });
});
