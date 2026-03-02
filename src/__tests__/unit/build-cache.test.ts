/**
 * Build Cache Configuration Tests
 * 
 * These tests verify that Next.js build cache is properly configured
 * and that cache management scripts are available.
 * 
 * Requirements: 30.1, 30.2, 30.4, 30.5
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('Build Cache Configuration', () => {
  describe('Example 40: Build cache directory exists', () => {
    it('should have .next directory in gitignore', () => {
      const gitignorePath = join(process.cwd(), '.gitignore');
      expect(existsSync(gitignorePath)).toBe(true);

      const gitignoreContent = readFileSync(gitignorePath, 'utf-8');
      
      // Verify .next directory is excluded (which includes cache)
      expect(gitignoreContent).toMatch(/\/\.next\//);
    });

    it('should have cache management scripts in package.json', () => {
      const packageJsonPath = join(process.cwd(), 'package.json');
      expect(existsSync(packageJsonPath)).toBe(true);

      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      
      // Verify cache management scripts exist
      expect(packageJson.scripts).toHaveProperty('clean');
      expect(packageJson.scripts).toHaveProperty('clean:cache');
      expect(packageJson.scripts).toHaveProperty('clean:build');
      expect(packageJson.scripts).toHaveProperty('cache:info');

      // Verify script commands
      expect(packageJson.scripts.clean).toContain('.next');
      expect(packageJson.scripts['clean:cache']).toContain('.next/cache');
      expect(packageJson.scripts['clean:build']).toContain('rm -rf .next');
    });

    it('should have cache documentation', () => {
      const cacheDocPath = join(process.cwd(), 'docs', 'BUILD_CACHE.md');
      expect(existsSync(cacheDocPath)).toBe(true);

      const docContent = readFileSync(cacheDocPath, 'utf-8');
      
      // Verify documentation covers key topics
      expect(docContent).toContain('Cache Location');
      expect(docContent).toContain('Cache Behavior');
      expect(docContent).toContain('Cache Invalidation');
      expect(docContent).toContain('.next/cache');
    });

    it('should have cache info script', () => {
      const cacheInfoScriptPath = join(process.cwd(), 'scripts', 'cache-info.ts');
      expect(existsSync(cacheInfoScriptPath)).toBe(true);

      const scriptContent = readFileSync(cacheInfoScriptPath, 'utf-8');
      
      // Verify script checks for cache directory
      expect(scriptContent).toContain('.next/cache');
      expect(scriptContent).toContain('Cache Information');
    });

    it('should have Next.js config with cache documentation', () => {
      const nextConfigPath = join(process.cwd(), 'next.config.ts');
      expect(existsSync(nextConfigPath)).toBe(true);

      const configContent = readFileSync(nextConfigPath, 'utf-8');
      
      // Verify config documents cache behavior
      expect(configContent).toContain('cache');
      expect(configContent).toContain('BUILD_CACHE.md');
    });
  });

  describe('Cache Invalidation Strategy', () => {
    it('should document automatic cache invalidation triggers', () => {
      const cacheDocPath = join(process.cwd(), 'docs', 'BUILD_CACHE.md');
      const docContent = readFileSync(cacheDocPath, 'utf-8');

      // Verify documentation covers invalidation triggers
      expect(docContent).toContain('Cache Invalidation');
      expect(docContent).toContain('Dependencies');
      expect(docContent).toContain('package.json');
      expect(docContent).toContain('Configuration');
      expect(docContent).toContain('Environment variables');
    });

    it('should provide manual cache clearing commands', () => {
      const cacheDocPath = join(process.cwd(), 'docs', 'BUILD_CACHE.md');
      const docContent = readFileSync(cacheDocPath, 'utf-8');

      // Verify manual cache management is documented
      expect(docContent).toContain('Clearing Cache');
      expect(docContent).toContain('rm -rf .next');
      expect(docContent).toContain('pnpm clean');
    });
  });

  describe('Cache Performance Documentation', () => {
    it('should document cache performance benefits', () => {
      const cacheDocPath = join(process.cwd(), 'docs', 'BUILD_CACHE.md');
      const docContent = readFileSync(cacheDocPath, 'utf-8');

      // Verify performance impact is documented
      expect(docContent).toContain('Performance Impact');
      expect(docContent).toContain('faster');
      expect(docContent).toContain('With Cache');
      expect(docContent).toContain('Without Cache');
    });

    it('should document cache monitoring approach', () => {
      const cacheDocPath = join(process.cwd(), 'docs', 'BUILD_CACHE.md');
      const docContent = readFileSync(cacheDocPath, 'utf-8');

      // Verify monitoring is documented
      expect(docContent).toContain('Monitoring');
      expect(docContent).toContain('time pnpm build');
    });
  });

  describe('Cache Best Practices', () => {
    it('should document cache best practices', () => {
      const cacheDocPath = join(process.cwd(), 'docs', 'BUILD_CACHE.md');
      const docContent = readFileSync(cacheDocPath, 'utf-8');

      // Verify best practices are documented
      expect(docContent).toContain('Best Practices');
      expect(docContent).toContain('CI/CD');
      expect(docContent).toContain('Clear on Major Changes');
      expect(docContent).toContain('Don\'t Commit Cache');
    });

    it('should document troubleshooting steps', () => {
      const cacheDocPath = join(process.cwd(), 'docs', 'BUILD_CACHE.md');
      const docContent = readFileSync(cacheDocPath, 'utf-8');

      // Verify troubleshooting is documented
      expect(docContent).toContain('Troubleshooting');
      expect(docContent).toContain('Stale Cache');
      expect(docContent).toContain('Build Issues');
    });
  });
});
