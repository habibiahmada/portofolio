/**
 * Performance Monitoring Utilities
 * 
 * This module provides utilities for monitoring application performance
 * using Lighthouse and custom performance thresholds.
 */

export interface PerformanceThresholds {
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
}

export interface LighthouseScore {
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
  timestamp: string;
}

/**
 * Default performance thresholds based on requirements
 */
export const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  performance: 90,
  seo: 95,
  accessibility: 90,
  bestPractices: 90,
};

/**
 * Check if Lighthouse scores meet the defined thresholds
 * 
 * @param scores - The Lighthouse scores to check
 * @param thresholds - The thresholds to check against (defaults to DEFAULT_THRESHOLDS)
 * @returns Object containing pass/fail status and details
 */
export function checkPerformanceThresholds(
  scores: LighthouseScore,
  thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS
): {
  passed: boolean;
  failures: string[];
  scores: LighthouseScore;
} {
  const failures: string[] = [];

  if (scores.performance < thresholds.performance) {
    failures.push(
      `Performance score ${scores.performance} is below threshold ${thresholds.performance}`
    );
  }

  if (scores.seo < thresholds.seo) {
    failures.push(
      `SEO score ${scores.seo} is below threshold ${thresholds.seo}`
    );
  }

  if (scores.accessibility < thresholds.accessibility) {
    failures.push(
      `Accessibility score ${scores.accessibility} is below threshold ${thresholds.accessibility}`
    );
  }

  if (scores.bestPractices < thresholds.bestPractices) {
    failures.push(
      `Best Practices score ${scores.bestPractices} is below threshold ${thresholds.bestPractices}`
    );
  }

  return {
    passed: failures.length === 0,
    failures,
    scores,
  };
}

/**
 * Format performance check results for display
 * 
 * @param result - The result from checkPerformanceThresholds
 * @returns Formatted string for console output
 */
export function formatPerformanceReport(result: ReturnType<typeof checkPerformanceThresholds>): string {
  const lines: string[] = [
    '=== Performance Report ===',
    `Timestamp: ${result.scores.timestamp}`,
    '',
    'Scores:',
    `  Performance: ${result.scores.performance}`,
    `  SEO: ${result.scores.seo}`,
    `  Accessibility: ${result.scores.accessibility}`,
    `  Best Practices: ${result.scores.bestPractices}`,
    '',
  ];

  if (result.passed) {
    lines.push('✓ All thresholds passed!');
  } else {
    lines.push('✗ Failed thresholds:');
    result.failures.forEach(failure => {
      lines.push(`  - ${failure}`);
    });
  }

  lines.push('========================');

  return lines.join('\n');
}

/**
 * Run Lighthouse audit using CLI (requires lighthouse package)
 * This is a helper function that can be used in CI/CD pipelines
 * 
 * @param url - The URL to audit
 * @param options - Additional Lighthouse options
 * @returns Promise with Lighthouse scores
 */
export async function runLighthouseAudit(
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options: {
    formFactor?: 'mobile' | 'desktop';
    categories?: string[];
  } = {}
): Promise<LighthouseScore> {
  // This is a placeholder for actual Lighthouse integration
  // In a real implementation, this would use the lighthouse npm package
  // or call the Lighthouse CLI
  
  throw new Error(
    'Lighthouse integration not implemented. ' +
    'Please use the Lighthouse CLI directly or integrate the lighthouse npm package.'
  );
}

/**
 * Store performance metrics for tracking over time
 * This can be extended to write to a file or database
 * 
 * @param scores - The Lighthouse scores to store
 */
export function storePerformanceMetrics(scores: LighthouseScore): void {
  // In a real implementation, this would write to a file or database
  // For now, we just log to console
  console.log('Performance metrics:', JSON.stringify(scores, null, 2));
}

/**
 * Compare current scores with previous baseline
 * 
 * @param current - Current Lighthouse scores
 * @param baseline - Baseline scores to compare against
 * @returns Comparison result with deltas
 */
export function compareWithBaseline(
  current: LighthouseScore,
  baseline: LighthouseScore
): {
  performance: { current: number; baseline: number; delta: number };
  seo: { current: number; baseline: number; delta: number };
  accessibility: { current: number; baseline: number; delta: number };
  bestPractices: { current: number; baseline: number; delta: number };
  hasRegression: boolean;
} {
  const performanceDelta = current.performance - baseline.performance;
  const seoDelta = current.seo - baseline.seo;
  const accessibilityDelta = current.accessibility - baseline.accessibility;
  const bestPracticesDelta = current.bestPractices - baseline.bestPractices;

  // Consider it a regression if any score drops by more than 5 points
  const hasRegression = 
    performanceDelta < -5 ||
    seoDelta < -5 ||
    accessibilityDelta < -5 ||
    bestPracticesDelta < -5;

  return {
    performance: {
      current: current.performance,
      baseline: baseline.performance,
      delta: performanceDelta,
    },
    seo: {
      current: current.seo,
      baseline: baseline.seo,
      delta: seoDelta,
    },
    accessibility: {
      current: current.accessibility,
      baseline: baseline.accessibility,
      delta: accessibilityDelta,
    },
    bestPractices: {
      current: current.bestPractices,
      baseline: baseline.bestPractices,
      delta: bestPracticesDelta,
    },
    hasRegression,
  };
}

/**
 * Database Query Performance Monitoring
 */

export interface QueryPerformanceMetrics {
  query: string;
  duration: number;
  timestamp: string;
  table?: string;
  operation?: string;
}

const SLOW_QUERY_THRESHOLD_MS = 100;

/**
 * Monitor database query performance and log slow queries
 * 
 * @param queryName - Name/description of the query
 * @param queryFn - The async function that executes the query
 * @param options - Optional configuration
 * @returns The result of the query function
 */
export async function monitorQuery<T>(
  queryName: string,
  queryFn: () => Promise<T>,
  queryOptions: {
    table?: string;
    operation?: string;
    threshold?: number;
  } = {}
): Promise<T> {
  const startTime = performance.now();
  const threshold = queryOptions.threshold ?? SLOW_QUERY_THRESHOLD_MS;

  try {
    const result = await queryFn();
    const duration = performance.now() - startTime;

    if (duration > threshold) {
      const metrics: QueryPerformanceMetrics = {
        query: queryName,
        duration: Math.round(duration * 100) / 100,
        timestamp: new Date().toISOString(),
        table: queryOptions.table,
        operation: queryOptions.operation,
      };

      console.warn(
        `[SLOW QUERY] ${queryName} took ${metrics.duration}ms (threshold: ${threshold}ms)`,
        {
          table: queryOptions.table,
          operation: queryOptions.operation,
        }
      );
    }

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(
      `[QUERY ERROR] ${queryName} failed after ${Math.round(duration * 100) / 100}ms`,
      error
    );
    throw error;
  }
}

/**
 * Log slow query for investigation
 * 
 * @param metrics - Query performance metrics
 */
export function logSlowQuery(metrics: QueryPerformanceMetrics): void {
  if (metrics.duration > SLOW_QUERY_THRESHOLD_MS) {
    console.warn('[SLOW QUERY DETECTED]', {
      query: metrics.query,
      duration: `${metrics.duration}ms`,
      timestamp: metrics.timestamp,
      table: metrics.table,
      operation: metrics.operation,
      recommendation: 'Consider adding indexes or optimizing the query',
    });
  }
}
