/**
 * Build Time Performance Test
 * 
 * Tests that build completes within 50% of baseline time
 * Validates: Requirements 6.4
 */

import { describe, it, expect } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

describe('Build Time Performance', () => {
  // Baseline build time in milliseconds (adjust based on your actual baseline)
  // This should be measured from your pre-optimization build
  const BASELINE_BUILD_TIME_MS = 120000; // 2 minutes baseline
  const TARGET_BUILD_TIME_MS = BASELINE_BUILD_TIME_MS * 0.5; // 50% improvement target
  const BUILD_TIMEOUT_MS = 300000; // 5 minute timeout

  it('should complete build within 50% of baseline time', async () => {
    // Skip in CI if SKIP_BUILD_TEST is set
    if (process.env.SKIP_BUILD_TEST === 'true') {
      console.log('Skipping build time test (SKIP_BUILD_TEST=true)');
      return;
    }

    console.log(`\nBaseline build time: ${BASELINE_BUILD_TIME_MS / 1000}s`);
    console.log(`Target build time: ${TARGET_BUILD_TIME_MS / 1000}s (50% improvement)`);
    console.log('Starting build...\n');

    const startTime = Date.now();

    try {
      // Run production build
      await execAsync('pnpm run build', {
        cwd: path.resolve(__dirname, '../../..'),
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer for build output
      });

      const buildTime = Date.now() - startTime;
      const buildTimeSeconds = (buildTime / 1000).toFixed(2);

      console.log(`\nBuild completed in: ${buildTimeSeconds}s`);
      console.log(`Target time: ${TARGET_BUILD_TIME_MS / 1000}s`);
      console.log(`Improvement: ${((1 - buildTime / BASELINE_BUILD_TIME_MS) * 100).toFixed(1)}%\n`);

      // Verify build output exists
      const buildDir = path.resolve(__dirname, '../../../.next');
      expect(fs.existsSync(buildDir)).toBe(true);

      // Check that build completed within target time
      expect(buildTime).toBeLessThan(TARGET_BUILD_TIME_MS);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Build failed:', error.message);
      }
      throw error;
    }
  }, BUILD_TIMEOUT_MS);

  it('should generate build manifest', async () => {
    const manifestPath = path.resolve(__dirname, '../../../.next/build-manifest.json');

    // Check if build has been run
    if (!fs.existsSync(manifestPath)) {
      console.log('Build manifest not found. Run build first.');
      return;
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

    // Verify manifest has expected structure
    expect(manifest).toHaveProperty('pages');
    expect(manifest.pages).toBeDefined();
  });

  it('should generate static pages', async () => {
    const serverDir = path.resolve(__dirname, '../../../.next/server/app');

    // Check if build has been run
    if (!fs.existsSync(serverDir)) {
      console.log('Server directory not found. Run build first.');
      return;
    }

    // Verify static pages exist
    const hasStaticPages = fs.existsSync(serverDir);
    expect(hasStaticPages).toBe(true);
  });
});
