/**
 * Lighthouse Performance Test
 * 
 * Tests that Lighthouse scores meet thresholds:
 * - Performance ≥90
 * - SEO ≥95
 * - Accessibility ≥90
 * - Best Practices ≥90
 * 
 * Validates: Requirements 11.2, 11.3
 */

import { describe, it, expect } from 'vitest';
import {
  checkPerformanceThresholds,
  DEFAULT_THRESHOLDS,
  type LighthouseScore,
} from '@/lib/performance/monitor';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

describe('Lighthouse Performance Scores', () => {
  const LIGHTHOUSE_REPORT_PATH = path.resolve(__dirname, '../../../lighthouse-report.json');

  /**
   * Run Lighthouse audit on a URL
   * Requires lighthouse to be installed globally or as dev dependency
   */
  async function runLighthouse(url: string): Promise<LighthouseScore> {
    try {
      console.log(`\nRunning Lighthouse audit on: ${url}`);
      
      // Run Lighthouse CLI
      await execAsync(
        `npx lighthouse ${url} --output=json --output-path=${LIGHTHOUSE_REPORT_PATH} --chrome-flags="--headless" --quiet`,
        { maxBuffer: 10 * 1024 * 1024 }
      );

      // Read the report
      const report = JSON.parse(fs.readFileSync(LIGHTHOUSE_REPORT_PATH, 'utf-8'));

      // Extract scores (Lighthouse returns scores as 0-1, convert to 0-100)
      const scores: LighthouseScore = {
        performance: Math.round(report.categories.performance.score * 100),
        seo: Math.round(report.categories.seo.score * 100),
        accessibility: Math.round(report.categories.accessibility.score * 100),
        bestPractices: Math.round(report.categories['best-practices'].score * 100),
        timestamp: new Date().toISOString(),
      };

      return scores;
    } catch (error) {
      throw new Error(`Failed to run Lighthouse: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Load existing Lighthouse report if available
   */
  function loadExistingReport(): LighthouseScore | null {
    if (!fs.existsSync(LIGHTHOUSE_REPORT_PATH)) {
      return null;
    }

    try {
      const report = JSON.parse(fs.readFileSync(LIGHTHOUSE_REPORT_PATH, 'utf-8'));
      
      return {
        performance: Math.round(report.categories.performance.score * 100),
        seo: Math.round(report.categories.seo.score * 100),
        accessibility: Math.round(report.categories.accessibility.score * 100),
        bestPractices: Math.round(report.categories['best-practices'].score * 100),
        timestamp: report.fetchTime,
      };
    } catch (error) {
      return null;
    }
  }

  it('should meet Performance score threshold (≥90)', async () => {
    // Try to load existing report first
    let scores = loadExistingReport();

    // If no report exists and LIGHTHOUSE_URL is provided, run Lighthouse
    if (!scores && process.env.LIGHTHOUSE_URL) {
      scores = await runLighthouse(process.env.LIGHTHOUSE_URL);
    }

    if (!scores) {
      console.log('\nNo Lighthouse report found.');
      console.log('To run this test:');
      console.log('1. Start your production server: pnpm run build && pnpm run start');
      console.log('2. Run: LIGHTHOUSE_URL=http://localhost:3000 pnpm test lighthouse.test.ts');
      console.log('Or manually run: npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json\n');
      return;
    }

    console.log(`\nPerformance Score: ${scores.performance}`);
    console.log(`Threshold: ${DEFAULT_THRESHOLDS.performance}\n`);

    // Requirement 11.2: Performance score ≥90
    expect(scores.performance).toBeGreaterThanOrEqual(DEFAULT_THRESHOLDS.performance);
  });

  it('should meet SEO score threshold (≥95)', async () => {
    let scores = loadExistingReport();

    if (!scores && process.env.LIGHTHOUSE_URL) {
      scores = await runLighthouse(process.env.LIGHTHOUSE_URL);
    }

    if (!scores) {
      console.log('\nNo Lighthouse report found. See previous test for instructions.\n');
      return;
    }

    console.log(`\nSEO Score: ${scores.seo}`);
    console.log(`Threshold: ${DEFAULT_THRESHOLDS.seo}\n`);

    // Requirement 11.3: SEO score ≥95
    expect(scores.seo).toBeGreaterThanOrEqual(DEFAULT_THRESHOLDS.seo);
  });

  it('should meet Accessibility score threshold (≥90)', async () => {
    let scores = loadExistingReport();

    if (!scores && process.env.LIGHTHOUSE_URL) {
      scores = await runLighthouse(process.env.LIGHTHOUSE_URL);
    }

    if (!scores) {
      console.log('\nNo Lighthouse report found. See previous test for instructions.\n');
      return;
    }

    console.log(`\nAccessibility Score: ${scores.accessibility}`);
    console.log(`Threshold: ${DEFAULT_THRESHOLDS.accessibility}\n`);

    // Requirement 11.3: Accessibility score ≥90
    expect(scores.accessibility).toBeGreaterThanOrEqual(DEFAULT_THRESHOLDS.accessibility);
  });

  it('should meet Best Practices score threshold (≥90)', async () => {
    let scores = loadExistingReport();

    if (!scores && process.env.LIGHTHOUSE_URL) {
      scores = await runLighthouse(process.env.LIGHTHOUSE_URL);
    }

    if (!scores) {
      console.log('\nNo Lighthouse report found. See previous test for instructions.\n');
      return;
    }

    console.log(`\nBest Practices Score: ${scores.bestPractices}`);
    console.log(`Threshold: ${DEFAULT_THRESHOLDS.bestPractices}\n`);

    // Requirement 11.3: Best Practices score ≥90
    expect(scores.bestPractices).toBeGreaterThanOrEqual(DEFAULT_THRESHOLDS.bestPractices);
  });

  it('should pass all thresholds together', async () => {
    let scores = loadExistingReport();

    if (!scores && process.env.LIGHTHOUSE_URL) {
      scores = await runLighthouse(process.env.LIGHTHOUSE_URL);
    }

    if (!scores) {
      console.log('\nNo Lighthouse report found. See previous test for instructions.\n');
      return;
    }

    const result = checkPerformanceThresholds(scores);

    console.log('\n=== Lighthouse Performance Report ===');
    console.log(`Performance: ${scores.performance} (threshold: ${DEFAULT_THRESHOLDS.performance})`);
    console.log(`SEO: ${scores.seo} (threshold: ${DEFAULT_THRESHOLDS.seo})`);
    console.log(`Accessibility: ${scores.accessibility} (threshold: ${DEFAULT_THRESHOLDS.accessibility})`);
    console.log(`Best Practices: ${scores.bestPractices} (threshold: ${DEFAULT_THRESHOLDS.bestPractices})`);
    console.log(`\nResult: ${result.passed ? '✓ PASSED' : '✗ FAILED'}`);
    
    if (!result.passed) {
      console.log('\nFailures:');
      result.failures.forEach(failure => console.log(`  - ${failure}`));
    }
    console.log('=====================================\n');

    expect(result.passed).toBe(true);
  });

  it('should have First Contentful Paint under 1.8s', async () => {
    if (!fs.existsSync(LIGHTHOUSE_REPORT_PATH)) {
      console.log('\nNo Lighthouse report found. Run Lighthouse first.\n');
      return;
    }

    const report = JSON.parse(fs.readFileSync(LIGHTHOUSE_REPORT_PATH, 'utf-8'));
    const fcp = report.audits['first-contentful-paint']?.numericValue;

    if (!fcp) {
      console.log('\nFCP metric not found in report.\n');
      return;
    }

    const fcpSeconds = (fcp / 1000).toFixed(2);
    console.log(`\nFirst Contentful Paint: ${fcpSeconds}s`);
    console.log('Target: < 1.8s\n');

    // Good FCP is under 1.8 seconds
    expect(fcp).toBeLessThan(1800);
  });

  it('should have Largest Contentful Paint under 2.5s', async () => {
    if (!fs.existsSync(LIGHTHOUSE_REPORT_PATH)) {
      console.log('\nNo Lighthouse report found. Run Lighthouse first.\n');
      return;
    }

    const report = JSON.parse(fs.readFileSync(LIGHTHOUSE_REPORT_PATH, 'utf-8'));
    const lcp = report.audits['largest-contentful-paint']?.numericValue;

    if (!lcp) {
      console.log('\nLCP metric not found in report.\n');
      return;
    }

    const lcpSeconds = (lcp / 1000).toFixed(2);
    console.log(`\nLargest Contentful Paint: ${lcpSeconds}s`);
    console.log('Target: < 2.5s\n');

    // Good LCP is under 2.5 seconds
    expect(lcp).toBeLessThan(2500);
  });

  it('should have Total Blocking Time under 200ms', async () => {
    if (!fs.existsSync(LIGHTHOUSE_REPORT_PATH)) {
      console.log('\nNo Lighthouse report found. Run Lighthouse first.\n');
      return;
    }

    const report = JSON.parse(fs.readFileSync(LIGHTHOUSE_REPORT_PATH, 'utf-8'));
    const tbt = report.audits['total-blocking-time']?.numericValue;

    if (!tbt) {
      console.log('\nTBT metric not found in report.\n');
      return;
    }

    console.log(`\nTotal Blocking Time: ${tbt.toFixed(0)}ms`);
    console.log('Target: < 200ms\n');

    // Good TBT is under 200ms
    expect(tbt).toBeLessThan(200);
  });

  it('should have Cumulative Layout Shift under 0.1', async () => {
    if (!fs.existsSync(LIGHTHOUSE_REPORT_PATH)) {
      console.log('\nNo Lighthouse report found. Run Lighthouse first.\n');
      return;
    }

    const report = JSON.parse(fs.readFileSync(LIGHTHOUSE_REPORT_PATH, 'utf-8'));
    const cls = report.audits['cumulative-layout-shift']?.numericValue;

    if (cls === undefined) {
      console.log('\nCLS metric not found in report.\n');
      return;
    }

    console.log(`\nCumulative Layout Shift: ${cls.toFixed(3)}`);
    console.log('Target: < 0.1\n');

    // Good CLS is under 0.1
    expect(cls).toBeLessThan(0.1);
  });
});
