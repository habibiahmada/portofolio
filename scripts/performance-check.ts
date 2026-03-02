#!/usr/bin/env node

/**
 * Performance Check Script
 * 
 * This script can be used to check performance thresholds in CI/CD pipelines.
 * It requires Lighthouse to be installed globally or as a dev dependency.
 * 
 * Usage:
 *   node scripts/performance-check.ts <url>
 *   
 * Example:
 *   node scripts/performance-check.ts http://localhost:3000
 */

import {
  checkPerformanceThresholds,
  formatPerformanceReport,
  DEFAULT_THRESHOLDS,
  type LighthouseScore,
} from '../src/lib/performance/monitor';

async function main() {
  const url = process.argv[2];

  if (!url) {
    console.error('Error: URL is required');
    console.error('Usage: node scripts/performance-check.ts <url>');
    process.exit(1);
  }

  console.log(`Checking performance for: ${url}`);
  console.log('Thresholds:', DEFAULT_THRESHOLDS);
  console.log('');

  // In a real implementation, this would run Lighthouse
  // For now, we'll show how to use the monitoring utilities
  console.log('Note: This script requires Lighthouse to be installed and configured.');
  console.log('To run Lighthouse manually:');
  console.log(`  npx lighthouse ${url} --output=json --output-path=./lighthouse-report.json`);
  console.log('');
  console.log('Then parse the JSON report and use checkPerformanceThresholds()');
  console.log('');

  // Example of how to use the monitoring utilities with mock data
  const mockScores: LighthouseScore = {
    performance: 92,
    seo: 96,
    accessibility: 91,
    bestPractices: 93,
    timestamp: new Date().toISOString(),
  };

  console.log('Example with mock scores:');
  const result = checkPerformanceThresholds(mockScores);
  console.log(formatPerformanceReport(result));

  if (!result.passed) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
