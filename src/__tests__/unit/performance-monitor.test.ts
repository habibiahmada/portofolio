/**
 * Unit Tests for Performance Monitoring Utilities
 * 
 * These tests verify the performance monitoring utilities work correctly
 * according to requirements 11.1, 11.2, 11.3, 11.4
 */

import { describe, it, expect } from 'vitest';
import {
  checkPerformanceThresholds,
  formatPerformanceReport,
  compareWithBaseline,
  DEFAULT_THRESHOLDS,
  type LighthouseScore,
} from '@/lib/performance/monitor';

describe('Performance Monitoring Utilities', () => {
  const mockScores: LighthouseScore = {
    performance: 92,
    seo: 96,
    accessibility: 91,
    bestPractices: 93,
    timestamp: '2024-01-01T00:00:00.000Z',
  };

  describe('checkPerformanceThresholds', () => {
    it('should pass when all scores meet thresholds', () => {
      const result = checkPerformanceThresholds(mockScores);

      expect(result.passed).toBe(true);
      expect(result.failures).toHaveLength(0);
      expect(result.scores).toEqual(mockScores);
    });

    it('should fail when performance score is below threshold', () => {
      const lowScores: LighthouseScore = {
        ...mockScores,
        performance: 85, // Below 90 threshold
      };

      const result = checkPerformanceThresholds(lowScores);

      expect(result.passed).toBe(false);
      expect(result.failures).toHaveLength(1);
      expect(result.failures[0]).toContain('Performance score 85 is below threshold 90');
    });

    it('should fail when SEO score is below threshold', () => {
      const lowScores: LighthouseScore = {
        ...mockScores,
        seo: 90, // Below 95 threshold
      };

      const result = checkPerformanceThresholds(lowScores);

      expect(result.passed).toBe(false);
      expect(result.failures).toHaveLength(1);
      expect(result.failures[0]).toContain('SEO score 90 is below threshold 95');
    });

    it('should use default thresholds when not provided', () => {
      const result = checkPerformanceThresholds(mockScores);

      // Verify default thresholds are used
      expect(DEFAULT_THRESHOLDS.performance).toBe(90);
      expect(DEFAULT_THRESHOLDS.seo).toBe(95);
      expect(DEFAULT_THRESHOLDS.accessibility).toBe(90);
      expect(DEFAULT_THRESHOLDS.bestPractices).toBe(90);
      expect(result.passed).toBe(true);
    });

    it('should allow custom thresholds', () => {
      const customThresholds = {
        performance: 95,
        seo: 98,
        accessibility: 95,
        bestPractices: 95,
      };

      const result = checkPerformanceThresholds(mockScores, customThresholds);

      expect(result.passed).toBe(false);
      expect(result.failures.length).toBeGreaterThan(0);
    });

    it('should report multiple failures when multiple scores are below threshold', () => {
      const lowScores: LighthouseScore = {
        performance: 85,
        seo: 90,
        accessibility: 85,
        bestPractices: 85,
        timestamp: '2024-01-01T00:00:00.000Z',
      };

      const result = checkPerformanceThresholds(lowScores);

      expect(result.passed).toBe(false);
      expect(result.failures).toHaveLength(4);
    });
  });

  describe('formatPerformanceReport', () => {
    it('should format passing report correctly', () => {
      const result = checkPerformanceThresholds(mockScores);
      const report = formatPerformanceReport(result);

      expect(report).toContain('Performance Report');
      expect(report).toContain('Performance: 92');
      expect(report).toContain('SEO: 96');
      expect(report).toContain('Accessibility: 91');
      expect(report).toContain('Best Practices: 93');
      expect(report).toContain('✓ All thresholds passed!');
    });

    it('should format failing report correctly', () => {
      const lowScores: LighthouseScore = {
        ...mockScores,
        performance: 85,
      };

      const result = checkPerformanceThresholds(lowScores);
      const report = formatPerformanceReport(result);

      expect(report).toContain('✗ Failed thresholds:');
      expect(report).toContain('Performance score 85 is below threshold 90');
    });

    it('should include timestamp in report', () => {
      const result = checkPerformanceThresholds(mockScores);
      const report = formatPerformanceReport(result);

      expect(report).toContain('Timestamp: 2024-01-01T00:00:00.000Z');
    });
  });

  describe('compareWithBaseline', () => {
    const baseline: LighthouseScore = {
      performance: 90,
      seo: 95,
      accessibility: 90,
      bestPractices: 90,
      timestamp: '2024-01-01T00:00:00.000Z',
    };

    it('should calculate positive deltas for improvements', () => {
      const improved: LighthouseScore = {
        performance: 95,
        seo: 98,
        accessibility: 93,
        bestPractices: 92,
        timestamp: '2024-01-02T00:00:00.000Z',
      };

      const comparison = compareWithBaseline(improved, baseline);

      expect(comparison.performance.delta).toBe(5);
      expect(comparison.seo.delta).toBe(3);
      expect(comparison.accessibility.delta).toBe(3);
      expect(comparison.bestPractices.delta).toBe(2);
      expect(comparison.hasRegression).toBe(false);
    });

    it('should detect regression when scores drop significantly', () => {
      const regressed: LighthouseScore = {
        performance: 84, // -6 from baseline
        seo: 95,
        accessibility: 90,
        bestPractices: 90,
        timestamp: '2024-01-02T00:00:00.000Z',
      };

      const comparison = compareWithBaseline(regressed, baseline);

      expect(comparison.performance.delta).toBe(-6);
      expect(comparison.hasRegression).toBe(true);
    });

    it('should not flag regression for small drops', () => {
      const slightDrop: LighthouseScore = {
        performance: 88, // -2 from baseline (within tolerance)
        seo: 94, // -1 from baseline
        accessibility: 89, // -1 from baseline
        bestPractices: 89, // -1 from baseline
        timestamp: '2024-01-02T00:00:00.000Z',
      };

      const comparison = compareWithBaseline(slightDrop, baseline);

      expect(comparison.hasRegression).toBe(false);
    });

    it('should include current and baseline values in comparison', () => {
      const comparison = compareWithBaseline(mockScores, baseline);

      expect(comparison.performance.current).toBe(92);
      expect(comparison.performance.baseline).toBe(90);
      expect(comparison.seo.current).toBe(96);
      expect(comparison.seo.baseline).toBe(95);
    });
  });

  describe('DEFAULT_THRESHOLDS', () => {
    it('should have correct threshold values per requirements', () => {
      // Requirements 11.2, 11.3 specify:
      // Performance ≥90, SEO ≥95, Accessibility ≥90, Best Practices ≥90
      expect(DEFAULT_THRESHOLDS.performance).toBe(90);
      expect(DEFAULT_THRESHOLDS.seo).toBe(95);
      expect(DEFAULT_THRESHOLDS.accessibility).toBe(90);
      expect(DEFAULT_THRESHOLDS.bestPractices).toBe(90);
    });
  });
});
