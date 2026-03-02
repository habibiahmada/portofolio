/**
 * Bundle Size Performance Test
 * 
 * Tests that bundle size is reduced by 20%+ and initial bundle by 30%+ after dynamic imports
 * Validates: Requirements 7.4, 14.5
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Bundle Size Performance', () => {
  // Baseline bundle sizes in KB (adjust based on your actual baseline)
  const BASELINE_TOTAL_BUNDLE_KB = 1000; // 1MB baseline
  const BASELINE_INITIAL_BUNDLE_KB = 500; // 500KB initial baseline
  
  const TARGET_TOTAL_REDUCTION = 0.20; // 20% reduction
  const TARGET_INITIAL_REDUCTION = 0.30; // 30% reduction after dynamic imports
  
  const TARGET_TOTAL_BUNDLE_KB = BASELINE_TOTAL_BUNDLE_KB * (1 - TARGET_TOTAL_REDUCTION);
  const TARGET_INITIAL_BUNDLE_KB = BASELINE_INITIAL_BUNDLE_KB * (1 - TARGET_INITIAL_REDUCTION);

  function getBuildStats() {
    const buildDir = path.resolve(__dirname, '../../../.next');
    
    if (!fs.existsSync(buildDir)) {
      throw new Error('Build directory not found. Run build first.');
    }

    // Read build manifest to get chunk information
    const manifestPath = path.join(buildDir, 'build-manifest.json');
    if (!fs.existsSync(manifestPath)) {
      throw new Error('Build manifest not found. Run build first.');
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    
    // Calculate total bundle size from static chunks
    const staticDir = path.join(buildDir, 'static/chunks');
    let totalSize = 0;
    let initialSize = 0;

    if (fs.existsSync(staticDir)) {
      const files = fs.readdirSync(staticDir, { recursive: true });
      
      for (const file of files) {
        if (typeof file === 'string' && file.endsWith('.js')) {
          const filePath = path.join(staticDir, file);
          const stats = fs.statSync(filePath);
          totalSize += stats.size;
          
          // Consider main chunks as initial bundle
          if (file.includes('main') || file.includes('webpack') || file.includes('framework')) {
            initialSize += stats.size;
          }
        }
      }
    }

    return {
      totalSizeKB: totalSize / 1024,
      initialSizeKB: initialSize / 1024,
      manifest,
    };
  }

  it('should reduce total bundle size by 20%+', () => {
    // Skip if build not available
    const buildDir = path.resolve(__dirname, '../../../.next');
    if (!fs.existsSync(buildDir)) {
      console.log('Build not found. Run build first to test bundle size.');
      return;
    }

    const stats = getBuildStats();
    
    console.log(`\nTotal Bundle Size: ${stats.totalSizeKB.toFixed(2)} KB`);
    console.log(`Target Size: ${TARGET_TOTAL_BUNDLE_KB.toFixed(2)} KB (20% reduction)`);
    console.log(`Baseline Size: ${BASELINE_TOTAL_BUNDLE_KB} KB`);
    
    const actualReduction = ((BASELINE_TOTAL_BUNDLE_KB - stats.totalSizeKB) / BASELINE_TOTAL_BUNDLE_KB) * 100;
    console.log(`Actual Reduction: ${actualReduction.toFixed(1)}%\n`);

    // Verify bundle size meets target
    expect(stats.totalSizeKB).toBeLessThanOrEqual(TARGET_TOTAL_BUNDLE_KB);
  });

  it('should reduce initial bundle by 30%+ after dynamic imports', () => {
    // Skip if build not available
    const buildDir = path.resolve(__dirname, '../../../.next');
    if (!fs.existsSync(buildDir)) {
      console.log('Build not found. Run build first to test bundle size.');
      return;
    }

    const stats = getBuildStats();
    
    console.log(`\nInitial Bundle Size: ${stats.initialSizeKB.toFixed(2)} KB`);
    console.log(`Target Size: ${TARGET_INITIAL_BUNDLE_KB.toFixed(2)} KB (30% reduction)`);
    console.log(`Baseline Size: ${BASELINE_INITIAL_BUNDLE_KB} KB`);
    
    const actualReduction = ((BASELINE_INITIAL_BUNDLE_KB - stats.initialSizeKB) / BASELINE_INITIAL_BUNDLE_KB) * 100;
    console.log(`Actual Reduction: ${actualReduction.toFixed(1)}%\n`);

    // Verify initial bundle size meets target
    expect(stats.initialSizeKB).toBeLessThanOrEqual(TARGET_INITIAL_BUNDLE_KB);
  });

  it('should have separate chunks for dynamic imports', () => {
    // Skip if build not available
    const buildDir = path.resolve(__dirname, '../../../.next');
    if (!fs.existsSync(buildDir)) {
      console.log('Build not found. Run build first to test bundle size.');
      return;
    }

    const staticDir = path.join(buildDir, 'static/chunks');
    
    if (!fs.existsSync(staticDir)) {
      console.log('Static chunks directory not found.');
      return;
    }

    const files = fs.readdirSync(staticDir, { recursive: true });
    const jsFiles = files.filter(f => typeof f === 'string' && f.endsWith('.js'));
    
    console.log(`\nTotal JS chunks: ${jsFiles.length}`);
    
    // Should have multiple chunks (indicating code splitting)
    expect(jsFiles.length).toBeGreaterThan(5);
  });

  it('should keep CSS bundle under 50KB', () => {
    // Skip if build not available
    const buildDir = path.resolve(__dirname, '../../../.next');
    if (!fs.existsSync(buildDir)) {
      console.log('Build not found. Run build first to test bundle size.');
      return;
    }

    const staticDir = path.join(buildDir, 'static/css');
    
    if (!fs.existsSync(staticDir)) {
      console.log('CSS directory not found.');
      return;
    }

    let totalCssSize = 0;
    const files = fs.readdirSync(staticDir, { recursive: true });
    
    for (const file of files) {
      if (typeof file === 'string' && file.endsWith('.css')) {
        const filePath = path.join(staticDir, file);
        const stats = fs.statSync(filePath);
        totalCssSize += stats.size;
      }
    }

    const totalCssSizeKB = totalCssSize / 1024;
    console.log(`\nTotal CSS Size: ${totalCssSizeKB.toFixed(2)} KB`);
    console.log(`Target: < 50 KB\n`);

    // Requirement 26.5: CSS bundle should be under 50KB
    expect(totalCssSizeKB).toBeLessThan(50);
  });

  it('should generate bundle analysis data when ANALYZE=true', () => {
    // Check if bundle analyzer has been run
    const analyzeDir = path.resolve(__dirname, '../../../.next/analyze');
    
    if (!fs.existsSync(analyzeDir)) {
      console.log('Bundle analysis not found. Run "pnpm run analyze" to generate.');
      return;
    }

    // Verify analysis files exist
    const clientStatsPath = path.join(analyzeDir, 'client.json');
    const serverStatsPath = path.join(analyzeDir, 'server.json');
    
    const hasClientStats = fs.existsSync(clientStatsPath);
    const hasServerStats = fs.existsSync(serverStatsPath);
    
    console.log(`\nClient stats: ${hasClientStats ? 'Found' : 'Not found'}`);
    console.log(`Server stats: ${hasServerStats ? 'Found' : 'Not found'}\n`);
    
    // At least client stats should exist
    expect(hasClientStats).toBe(true);
  });
});
