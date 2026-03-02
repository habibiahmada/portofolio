import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Unit Tests for Lazy Loading Implementation
 * Feature: nextjs-performance-optimization
 * 
 * These tests verify specific examples of lazy loading implementation:
 * - Example 18: Chart components use dynamic import
 * - Example 19: Animation libraries use dynamic import
 * - Example 20: CMS editor uses dynamic import
 * 
 * Validates: Requirements 14.1, 14.2, 14.3
 */
describe('Unit Tests: Lazy Loading Implementation', () => {
  const adminComponentsDir = join(process.cwd(), 'src', 'components', 'admin');

  /**
   * Example 18: Chart components use dynamic import
   * Validates: Requirements 14.1
   */
  describe('Example 18: Chart Components Dynamic Import', () => {
    it('should verify LazyCharts.tsx exists and uses dynamic import', () => {
      const chartsFile = join(adminComponentsDir, 'LazyCharts.tsx');

      expect(existsSync(chartsFile), 'LazyCharts.tsx should exist').toBe(true);

      const content = readFileSync(chartsFile, 'utf-8');

      // Should import dynamic from next/dynamic
      expect(content).toContain("import dynamic from 'next/dynamic'");

      // Should have 'use client' directive
      expect(content).toMatch(/^['"]use client['"]/m);

      // Should export chart components
      expect(content).toContain('export const LazyChart');
      expect(content).toContain('export const LazyBarChart');
      expect(content).toContain('export const LazyLineChart');
      expect(content).toContain('export const LazyPieChart');

      // Should have ChartSkeleton
      expect(content).toContain('export function ChartSkeleton');
    });

    it('should verify chart components have proper dynamic import configuration', () => {
      const chartsFile = join(adminComponentsDir, 'LazyCharts.tsx');
      const content = readFileSync(chartsFile, 'utf-8');

      // Each chart component should have:
      // 1. dynamic() call
      // 2. loading configuration
      // 3. ssr: false

      const chartComponents = ['LazyChart', 'LazyBarChart', 'LazyLineChart', 'LazyPieChart'];

      for (const component of chartComponents) {
        // Find the component export - match until the closing );
        const componentRegex = new RegExp(`export\\s+const\\s+${component}\\s*=\\s*dynamic`, '');
        expect(content).toMatch(componentRegex);

        // Extract the dynamic import block for this component
        const dynamicBlockRegex = new RegExp(
          `export\\s+const\\s+${component}\\s*=\\s*dynamic\\([\\s\\S]*?\\);`,
          ''
        );
        const match = content.match(dynamicBlockRegex);
        expect(match, `${component} should have complete dynamic import configuration`).toBeTruthy();

        if (match) {
          const block = match[0];
          expect(block, `${component} should have loading configuration`).toContain('loading:');
          expect(block, `${component} should have ssr: false`).toMatch(/ssr:\s*false/);
        }
      }
    });
  });

  /**
   * Example 19: Animation libraries use dynamic import
   * Validates: Requirements 14.2
   */
  describe('Example 19: Animation Libraries Dynamic Import', () => {
    it('should verify LazyAnimations.tsx exists and uses dynamic import', () => {
      const animationsFile = join(adminComponentsDir, 'LazyAnimations.tsx');

      expect(existsSync(animationsFile), 'LazyAnimations.tsx should exist').toBe(true);

      const content = readFileSync(animationsFile, 'utf-8');

      // Should import dynamic from next/dynamic
      expect(content).toContain("import dynamic from 'next/dynamic'");

      // Should have 'use client' directive
      expect(content).toMatch(/^['"]use client['"]/m);

      // Should export animation components
      expect(content).toContain('export const LazyLottieAnimation');
      expect(content).toContain('export const LazyMotion');
      expect(content).toContain('export const LazyAnimatePresence');
      expect(content).toContain('export const LazySpringAnimation');

      // Should have AnimationSkeleton
      expect(content).toContain('export function AnimationSkeleton');
    });

    it('should verify animation components have proper dynamic import configuration', () => {
      const animationsFile = join(adminComponentsDir, 'LazyAnimations.tsx');
      const content = readFileSync(animationsFile, 'utf-8');

      const animationComponents = ['LazyLottieAnimation', 'LazyMotion', 'LazySpringAnimation'];

      for (const component of animationComponents) {
        // Find the component export
        const componentRegex = new RegExp(`export\\s+const\\s+${component}\\s*=\\s*dynamic`, '');
        expect(content, `${component} should use dynamic import`).toMatch(componentRegex);

        // Extract the dynamic import block
        const dynamicBlockRegex = new RegExp(
          `export\\s+const\\s+${component}\\s*=\\s*dynamic\\([\\s\\S]*?\\);`,
          ''
        );
        const match = content.match(dynamicBlockRegex);

        if (match) {
          const block = match[0];
          expect(block, `${component} should have ssr: false`).toMatch(/ssr:\s*false/);
        }
      }
    });

    it('should verify animation libraries are imported from correct packages', () => {
      const animationsFile = join(adminComponentsDir, 'LazyAnimations.tsx');
      const content = readFileSync(animationsFile, 'utf-8');

      // Should import from animation library packages
      expect(content).toMatch(/lottie-react|framer-motion|@react-spring\/web/);
    });
  });

  /**
   * Example 20: CMS editor uses dynamic import
   * Validates: Requirements 14.3
   */
  describe('Example 20: CMS Editor Dynamic Import', () => {
    it('should verify LazyEditor.tsx exists and uses dynamic import', () => {
      const editorFile = join(adminComponentsDir, 'LazyEditor.tsx');

      expect(existsSync(editorFile), 'LazyEditor.tsx should exist').toBe(true);

      const content = readFileSync(editorFile, 'utf-8');

      // Should import dynamic from next/dynamic
      expect(content).toContain("import dynamic from 'next/dynamic'");

      // Should have 'use client' directive
      expect(content).toMatch(/^['"]use client['"]/m);

      // Should export Tiptap editor component
      expect(content).toContain('export const LazyTiptapEditor');

      // Should have EditorSkeleton
      expect(content).toContain('export function EditorSkeleton');
    });

    it('should verify Tiptap editor has proper dynamic import configuration', () => {
      const editorFile = join(adminComponentsDir, 'LazyEditor.tsx');
      const content = readFileSync(editorFile, 'utf-8');

      // Find LazyTiptapEditor export
      const tiptapRegex = /export\s+const\s+LazyTiptapEditor\s*=\s*dynamic\([\s\S]*?\);/;
      const match = content.match(tiptapRegex);

      expect(match, 'LazyTiptapEditor should have dynamic import configuration').toBeTruthy();

      if (match) {
        const block = match[0];

        // Should have a dynamic import factory (either importing a component or using a stub)
        expect(block).toMatch(/import\(|Promise\.resolve/);

        // Should have loading configuration
        expect(block).toContain('loading:');

        // Should have ssr: false
        expect(block).toMatch(/ssr:\s*false/);

        // Should use EditorSkeleton as loading component
        expect(block).toContain('EditorSkeleton');
      }
    });

    it('should verify EditorSkeleton mimics editor layout', () => {
      const editorFile = join(adminComponentsDir, 'LazyEditor.tsx');
      const content = readFileSync(editorFile, 'utf-8');

      // Find EditorSkeleton function
      const skeletonRegex = /export\s+function\s+EditorSkeleton\(\)\s*\{[\s\S]*?\n\}/;
      const match = content.match(skeletonRegex);

      expect(match, 'EditorSkeleton should be defined').toBeTruthy();

      if (match) {
        const skeleton = match[0];

        // Should use Skeleton component
        expect(skeleton).toContain('Skeleton');

        // Should have border and rounded styling (mimicking editor)
        expect(skeleton).toContain('border');
        expect(skeleton).toContain('rounded');
      }
    });

    it('should verify additional editor types are available', () => {
      const editorFile = join(adminComponentsDir, 'LazyEditor.tsx');
      const content = readFileSync(editorFile, 'utf-8');

      // Should provide alternative editors
      expect(content).toContain('LazyMonacoEditor');
      expect(content).toContain('LazyMarkdownEditor');
    });
  });

  /**
   * Additional test: Verify PDF viewer uses dynamic import
   * This complements the lazy loading tests
   */
  describe('Additional: PDF Viewer Dynamic Import', () => {
    it('should verify LazyPDF.tsx exists and uses dynamic import', () => {
      const pdfFile = join(adminComponentsDir, 'LazyPDF.tsx');

      expect(existsSync(pdfFile), 'LazyPDF.tsx should exist').toBe(true);

      const content = readFileSync(pdfFile, 'utf-8');

      // Should import dynamic from next/dynamic
      expect(content).toContain("import dynamic from 'next/dynamic'");

      // Should have 'use client' directive
      expect(content).toMatch(/^['"]use client['"]/m);

      // Should export PDF components
      expect(content).toContain('export const LazyPDFDocument');
      expect(content).toContain('export const LazyPDFPage');
      expect(content).toContain('export const LazyPDFPreview');

      // Should have PDFSkeleton
      expect(content).toContain('export function PDFSkeleton');
    });

    it('should verify PDF components import from react-pdf', () => {
      const pdfFile = join(adminComponentsDir, 'LazyPDF.tsx');
      const content = readFileSync(pdfFile, 'utf-8');

      // Should import from react-pdf package
      expect(content).toContain('react-pdf');
    });
  });

  /**
   * Integration test: Verify all lazy components are exported from index
   */
  describe('Integration: Index File Exports', () => {
    it('should verify index.ts exports all lazy components', () => {
      const indexFile = join(adminComponentsDir, 'index.ts');

      expect(existsSync(indexFile), 'index.ts should exist').toBe(true);

      const content = readFileSync(indexFile, 'utf-8');

      // Should export from all lazy component files
      expect(content).toContain("from './LazyCharts'");
      expect(content).toContain("from './LazyAnimations'");
      expect(content).toContain("from './LazyEditor'");
      expect(content).toContain("from './LazyPDF'");

      // Should export key components
      expect(content).toContain('LazyChart');
      expect(content).toContain('LazyTiptapEditor');
      expect(content).toContain('LazyLottieAnimation');
      expect(content).toContain('LazyPDFDocument');
    });
  });
});
