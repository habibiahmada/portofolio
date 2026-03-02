import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Property-Based Tests for Dynamic Imports
 * Feature: nextjs-performance-optimization
 * 
 * Property 5: Heavy Components Use Dynamic Import
 * For any component identified as heavy (charts, animations, rich text editors, PDF viewers),
 * it should be imported using next/dynamic.
 * 
 * Property 14: Dynamic Imports Have Loading States
 * For any component loaded via next/dynamic, the dynamic import configuration should include
 * a loading component.
 * 
 * Validates: Requirements 6.1, 14.4
 */
describe('Property Test: Dynamic Imports for Heavy Components', () => {
  const adminComponentsDir = join(process.cwd(), 'src', 'components', 'admin');

  /**
   * Helper function to check if a file uses dynamic import
   */
  function usesDynamicImport(filePath: string): boolean {
    if (!existsSync(filePath)) return false;
    const content = readFileSync(filePath, 'utf-8');
    return content.includes("import dynamic from 'next/dynamic'") && 
           content.includes('dynamic(');
  }

  /**
   * Helper function to check if dynamic imports have loading states
   */
  function hasLoadingState(filePath: string, componentName: string): boolean {
    if (!existsSync(filePath)) return false;
    const content = readFileSync(filePath, 'utf-8');
    
    // Find the dynamic import for this component - match until the closing );
    const dynamicImportRegex = new RegExp(
      `export\\s+const\\s+${componentName}\\s*=\\s*dynamic\\([\\s\\S]*?\\);`,
      ''
    );
    const match = content.match(dynamicImportRegex);
    
    if (!match) return false;
    
    // Check if it has loading configuration
    return match[0].includes('loading:');
  }

  /**
   * Helper function to check if dynamic imports have ssr: false
   */
  function hasSsrDisabled(filePath: string, componentName: string): boolean {
    if (!existsSync(filePath)) return false;
    const content = readFileSync(filePath, 'utf-8');
    
    // Find the dynamic import for this component - match until the closing );
    const dynamicImportRegex = new RegExp(
      `export\\s+const\\s+${componentName}\\s*=\\s*dynamic\\([\\s\\S]*?\\);`,
      ''
    );
    const match = content.match(dynamicImportRegex);
    
    if (!match) return false;
    
    // Check if it has ssr: false
    return match[0].includes('ssr: false') || match[0].includes('ssr:false');
  }

  /**
   * Property 5: Heavy Components Use Dynamic Import
   * For any heavy component (charts, animations, editors, PDF viewers),
   * it should be imported using next/dynamic
   */
  it('should verify all heavy components use dynamic import', () => {
    const heavyComponents = [
      { 
        file: join(adminComponentsDir, 'LazyCharts.tsx'),
        components: ['LazyChart', 'LazyBarChart', 'LazyLineChart', 'LazyPieChart'],
        type: 'Chart'
      },
      { 
        file: join(adminComponentsDir, 'LazyAnimations.tsx'),
        components: ['LazyLottieAnimation', 'LazyMotion', 'LazyAnimatePresence', 'LazySpringAnimation'],
        type: 'Animation'
      },
      { 
        file: join(adminComponentsDir, 'LazyEditor.tsx'),
        components: ['LazyTiptapEditor', 'LazyMonacoEditor', 'LazyMarkdownEditor'],
        type: 'Editor'
      },
      { 
        file: join(adminComponentsDir, 'LazyPDF.tsx'),
        components: ['LazyPDFDocument', 'LazyPDFPage', 'LazyPDFPreview', 'LazyPDFThumbnail'],
        type: 'PDF Viewer'
      },
    ];

    // Property: For all heavy component files, they should use dynamic import
    for (const { file, components, type } of heavyComponents) {
      expect(existsSync(file), `${type} lazy component file should exist`).toBe(true);
      
      const usesDynamic = usesDynamicImport(file);
      expect(usesDynamic, `${type} components should use dynamic import`).toBe(true);
      
      // Verify each component in the file
      const content = readFileSync(file, 'utf-8');
      for (const component of components) {
        expect(
          content.includes(`export const ${component}`),
          `${component} should be exported`
        ).toBe(true);
      }
    }
  });

  /**
   * Property 14: Dynamic Imports Have Loading States
   * For any component loaded via next/dynamic, the dynamic import configuration
   * should include a loading component
   */
  it('should verify all dynamic imports have loading states', () => {
    const componentsWithLoading = [
      { file: join(adminComponentsDir, 'LazyCharts.tsx'), components: ['LazyChart', 'LazyBarChart', 'LazyLineChart', 'LazyPieChart'] },
      { file: join(adminComponentsDir, 'LazyAnimations.tsx'), components: ['LazyLottieAnimation', 'LazyMotion', 'LazySpringAnimation'] },
      { file: join(adminComponentsDir, 'LazyEditor.tsx'), components: ['LazyTiptapEditor', 'LazyMonacoEditor', 'LazyMarkdownEditor'] },
      { file: join(adminComponentsDir, 'LazyPDF.tsx'), components: ['LazyPDFDocument', 'LazyPDFPage', 'LazyPDFPreview', 'LazyPDFThumbnail'] },
    ];

    // Property: For all dynamic imports, they should have loading configuration
    for (const { file, components } of componentsWithLoading) {
      for (const component of components) {
        const hasLoading = hasLoadingState(file, component);
        expect(
          hasLoading,
          `${component} should have loading state configuration`
        ).toBe(true);
      }
    }
  });

  /**
   * Additional Property: Dynamic imports should have ssr: false
   * Heavy components should not be rendered on the server
   */
  it('should verify all heavy component dynamic imports have ssr: false', () => {
    const heavyComponents = [
      { file: join(adminComponentsDir, 'LazyCharts.tsx'), components: ['LazyChart', 'LazyBarChart', 'LazyLineChart', 'LazyPieChart'] },
      { file: join(adminComponentsDir, 'LazyAnimations.tsx'), components: ['LazyLottieAnimation', 'LazyMotion', 'LazySpringAnimation'] },
      { file: join(adminComponentsDir, 'LazyEditor.tsx'), components: ['LazyTiptapEditor', 'LazyMonacoEditor', 'LazyMarkdownEditor'] },
      { file: join(adminComponentsDir, 'LazyPDF.tsx'), components: ['LazyPDFDocument', 'LazyPDFPage', 'LazyPDFPreview', 'LazyPDFThumbnail'] },
    ];

    // Property: For all heavy components, dynamic imports should have ssr: false
    for (const { file, components } of heavyComponents) {
      for (const component of components) {
        const ssrDisabled = hasSsrDisabled(file, component);
        expect(
          ssrDisabled,
          `${component} should have ssr: false configuration`
        ).toBe(true);
      }
    }
  });

  /**
   * Property: Loading skeletons should be exported
   * Each lazy component file should export its loading skeleton
   */
  it('should verify loading skeleton components are exported', () => {
    const skeletons = [
      { file: join(adminComponentsDir, 'LazyCharts.tsx'), skeleton: 'ChartSkeleton' },
      { file: join(adminComponentsDir, 'LazyAnimations.tsx'), skeleton: 'AnimationSkeleton' },
      { file: join(adminComponentsDir, 'LazyEditor.tsx'), skeleton: 'EditorSkeleton' },
      { file: join(adminComponentsDir, 'LazyPDF.tsx'), skeleton: 'PDFSkeleton' },
    ];

    // Property: For all lazy component files, they should export skeleton components
    for (const { file, skeleton } of skeletons) {
      const content = readFileSync(file, 'utf-8');
      expect(
        content.includes(`export function ${skeleton}`),
        `${skeleton} should be exported from ${file}`
      ).toBe(true);
    }
  });

  /**
   * Property: Lazy components should have 'use client' directive
   * Since they use dynamic imports and hooks, they must be client components
   */
  it('should verify lazy component files have use client directive', () => {
    const lazyFiles = [
      join(adminComponentsDir, 'LazyCharts.tsx'),
      join(adminComponentsDir, 'LazyAnimations.tsx'),
      join(adminComponentsDir, 'LazyEditor.tsx'),
      join(adminComponentsDir, 'LazyPDF.tsx'),
    ];

    // Property: For all lazy component files, they should have 'use client' directive
    for (const file of lazyFiles) {
      const content = readFileSync(file, 'utf-8');
      expect(
        content.match(/^['"]use client['"]/m),
        `${file} should have 'use client' directive at the top`
      ).toBeTruthy();
    }
  });

  /**
   * Property: Index file should export all lazy components
   * The index file should provide a single entry point for all lazy components
   */
  it('should verify index file exports all lazy components', () => {
    const indexFile = join(adminComponentsDir, 'index.ts');
    expect(existsSync(indexFile), 'Admin components index file should exist').toBe(true);

    const content = readFileSync(indexFile, 'utf-8');

    const expectedExports = [
      // Charts
      'LazyChart', 'LazyBarChart', 'LazyLineChart', 'LazyPieChart', 'ChartSkeleton',
      // Animations
      'LazyLottieAnimation', 'LazyMotion', 'LazyAnimatePresence', 'LazySpringAnimation', 'AnimationSkeleton',
      // Editors
      'LazyTiptapEditor', 'LazyMonacoEditor', 'LazyMarkdownEditor', 'EditorSkeleton',
      // PDF
      'LazyPDFDocument', 'LazyPDFPage', 'LazyPDFPreview', 'LazyPDFThumbnail', 'PDFSkeleton',
    ];

    // Property: For all lazy components, they should be exported from index
    for (const exportName of expectedExports) {
      expect(
        content.includes(exportName),
        `${exportName} should be exported from index file`
      ).toBe(true);
    }
  });
});
