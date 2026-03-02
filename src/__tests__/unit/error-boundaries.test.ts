import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Unit Tests for Error Boundaries
 * Feature: nextjs-performance-optimization
 * 
 * Example 38: Root Error Boundary Exists
 * Example 39: Section Error Boundaries Exist
 * 
 * Validates: Requirements 29.1, 29.2
 */
describe('Unit Tests: Error Boundaries', () => {
  /**
   * Example 38: Root Error Boundary Exists
   * Verify that root layout or error.tsx implements error boundary.
   * 
   * Validates: Requirements 29.1
   */
  describe('Example 38: Root Error Boundary', () => {
    it('should have root error boundary at src/app/error.tsx', () => {
      const rootErrorPath = join(process.cwd(), 'src', 'app', 'error.tsx');
      
      expect(
        existsSync(rootErrorPath),
        'Root error boundary should exist at src/app/error.tsx'
      ).toBe(true);
    });

    it('should have ErrorBoundary component at src/components/ErrorBoundary.tsx', () => {
      const errorBoundaryPath = join(process.cwd(), 'src', 'components', 'ErrorBoundary.tsx');
      
      expect(
        existsSync(errorBoundaryPath),
        'ErrorBoundary component should exist at src/components/ErrorBoundary.tsx'
      ).toBe(true);
    });
  });

  /**
   * Example 39: Section Error Boundaries Exist
   * Verify that major sections (admin, blog, projects) have error.tsx files.
   * 
   * Validates: Requirements 29.2
   */
  describe('Example 39: Section Error Boundaries', () => {
    it('should have error boundary for admin/dashboard section', () => {
      const dashboardErrorPath = join(
        process.cwd(),
        'src',
        'app',
        '[locale]',
        'dashboard',
        'error.tsx'
      );
      
      expect(
        existsSync(dashboardErrorPath),
        'Dashboard error boundary should exist at src/app/[locale]/dashboard/error.tsx'
      ).toBe(true);
    });

    it('should have error boundary for blog/articles section', () => {
      const articlesErrorPath = join(
        process.cwd(),
        'src',
        'app',
        '[locale]',
        'articles',
        'error.tsx'
      );
      
      expect(
        existsSync(articlesErrorPath),
        'Articles error boundary should exist at src/app/[locale]/articles/error.tsx'
      ).toBe(true);
    });

    it('should have error boundary for projects section', () => {
      const projectsErrorPath = join(
        process.cwd(),
        'src',
        'app',
        '[locale]',
        'projects',
        'error.tsx'
      );
      
      expect(
        existsSync(projectsErrorPath),
        'Projects error boundary should exist at src/app/[locale]/projects/error.tsx'
      ).toBe(true);
    });

    it('should have all three section error boundaries', () => {
      const sections = [
        {
          name: 'Dashboard',
          path: join(process.cwd(), 'src', 'app', '[locale]', 'dashboard', 'error.tsx'),
        },
        {
          name: 'Articles',
          path: join(process.cwd(), 'src', 'app', '[locale]', 'articles', 'error.tsx'),
        },
        {
          name: 'Projects',
          path: join(process.cwd(), 'src', 'app', '[locale]', 'projects', 'error.tsx'),
        },
      ];

      const missingSections = sections.filter(section => !existsSync(section.path));
      
      expect(
        missingSections.length,
        `All section error boundaries should exist. Missing: ${missingSections.map(s => s.name).join(', ')}`
      ).toBe(0);
    });
  });

  /**
   * Additional Unit Test: Error Boundary File Structure
   */
  describe('Additional: Error Boundary File Structure', () => {
    it('should have all required error boundary files', () => {
      const requiredFiles = [
        {
          name: 'ErrorBoundary Component',
          path: join(process.cwd(), 'src', 'components', 'ErrorBoundary.tsx'),
        },
        {
          name: 'Root Error Boundary',
          path: join(process.cwd(), 'src', 'app', 'error.tsx'),
        },
        {
          name: 'Dashboard Error Boundary',
          path: join(process.cwd(), 'src', 'app', '[locale]', 'dashboard', 'error.tsx'),
        },
        {
          name: 'Articles Error Boundary',
          path: join(process.cwd(), 'src', 'app', '[locale]', 'articles', 'error.tsx'),
        },
        {
          name: 'Projects Error Boundary',
          path: join(process.cwd(), 'src', 'app', '[locale]', 'projects', 'error.tsx'),
        },
      ];

      const missingFiles = requiredFiles.filter(file => !existsSync(file.path));
      
      expect(
        missingFiles.length,
        `All error boundary files should exist. Missing: ${missingFiles.map(f => f.name).join(', ')}`
      ).toBe(0);

      // Verify each file exists individually for better error messages
      requiredFiles.forEach(file => {
        expect(
          existsSync(file.path),
          `${file.name} should exist at ${file.path}`
        ).toBe(true);
      });
    });
  });
});
