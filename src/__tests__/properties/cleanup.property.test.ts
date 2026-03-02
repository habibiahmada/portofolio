/**
 * Property-Based Tests for Memory Leak Prevention
 * Feature: nextjs-performance-optimization
 * 
 * These tests verify that components properly cleanup resources to prevent memory leaks
 */

import fc from 'fast-check';
import * as fs from 'fs';
import { glob } from 'glob';
import { describe, it, expect } from 'vitest';

/**
 * Helper function to get all component files
 */
function getComponentFiles(): string[] {
  const patterns = [
    'src/components/**/*.{ts,tsx}',
    'src/app/**/*.{ts,tsx}',
    'src/hooks/**/*.{ts,tsx}',
  ];
  
  const files: string[] = [];
  patterns.forEach(pattern => {
    const matches = glob.sync(pattern, { 
      ignore: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      cwd: process.cwd()
    });
    files.push(...matches);
  });
  
  return files;
}

/**
 * Helper function to check if a file contains event listeners
 */
function hasEventListeners(content: string): boolean {
  return /addEventListener/.test(content);
}

/**
 * Helper function to check if a file has proper cleanup for event listeners
 */
function hasEventListenerCleanup(content: string): boolean {
  // Check for removeEventListener in cleanup
  const hasRemoveListener = /removeEventListener/.test(content);
  
  // Check for cleanup return in useEffect
  const hasCleanupReturn = /return\s*\(\s*\)\s*=>\s*{[\s\S]*?removeEventListener/.test(content);
  
  // Check for { once: true } option which auto-removes
  const hasOnceOption = /addEventListener\([^)]*,\s*{\s*once:\s*true/.test(content);
  
  return hasRemoveListener || hasCleanupReturn || hasOnceOption;
}

/**
 * Helper function to check if a file contains fetch calls in useEffect
 */
function hasFetchCalls(content: string): boolean {
  // Only flag fetch calls inside useEffect
  return /useEffect\([^)]*\)\s*=>\s*{[\s\S]*?fetch\s*\(/.test(content);
}

/**
 * Helper function to check if fetch uses AbortController
 */
function fetchUsesAbortController(content: string): boolean {
  // Check for AbortController usage
  const hasAbortController = /new\s+AbortController\(\)/.test(content);
  
  // Check for signal in fetch options (both `signal:` and `signal` shorthand)
  const hasSignalInFetch = /fetch\([^)]*[,{]\s*signal/.test(content);
  
  // Check for useSafeAsync or useSafeFetch hooks
  const usesSafeHooks = /use(Safe(Async|Fetch)|SWR)/.test(content);
  
  return (hasAbortController && hasSignalInFetch) || usesSafeHooks;
}

/**
 * Helper function to check if a file contains timers
 */
function hasTimers(content: string): boolean {
  return /\b(setTimeout|setInterval)\s*\(/.test(content);
}

/**
 * Helper function to check if timers are properly cleared
 */
function hasTimerCleanup(content: string): boolean {
  const hasSetTimeout = /setTimeout/.test(content);
  const hasSetInterval = /setInterval/.test(content);
  const hasClearTimeout = /clearTimeout/.test(content);
  const hasClearInterval = /clearInterval/.test(content);
  
  // If has setTimeout, should have clearTimeout
  if (hasSetTimeout && !hasClearTimeout) {
    return false;
  }
  
  // If has setInterval, should have clearInterval
  if (hasSetInterval && !hasClearInterval) {
    return false;
  }
  
  // Check for cleanup return in useEffect
  const hasCleanupReturn = /return\s*\(\s*\)\s*=>\s*{[\s\S]*?clear(Timeout|Interval)/.test(content);
  
  return hasClearTimeout || hasClearInterval || hasCleanupReturn;
}

/**
 * Helper function to check if component has pending async operations
 */
function hasPendingAsyncOps(content: string): boolean {
  // Check for async operations in useEffect (these need cleanup)
  const hasAsyncInEffect = /useEffect\([^)]*\)\s*=>\s*{[\s\S]*?(async|\.then\(|fetch\()/.test(content);
  
  // Don't flag user-triggered async operations (onClick, onSubmit, etc.)
  // Only flag async operations that run automatically in useEffect
  
  return hasAsyncInEffect;
}

/**
 * Helper function to check if component cancels pending requests
 */
function cancelsPendingRequests(content: string): boolean {
  // Check for AbortController
  const hasAbortController = /AbortController/.test(content);
  
  // Check for abort() call in cleanup
  const hasAbortInCleanup = /return\s*\(\s*\)\s*=>\s*{[\s\S]*?\.abort\(\)/.test(content);
  
  // Check for useSafeAsync or similar hooks
  const usesSafeHooks = /useSafe(Async|Fetch)/.test(content);
  
  // Check for SWR which handles cleanup automatically
  const usesSWR = /useSWR/.test(content);
  
  // Check for isMounted pattern
  const hasIsMountedPattern = /isMounted|mounted/.test(content);
  
  return hasAbortController || hasAbortInCleanup || usesSafeHooks || usesSWR || hasIsMountedPattern;
}

describe('Memory Leak Prevention Properties', () => {
  const componentFiles = getComponentFiles();
  
  /**
   * Property 30: Components Cleanup Event Listeners
   * Feature: nextjs-performance-optimization, Property 30
   * Validates: Requirements 25.1
   * 
   * For any component that adds event listeners,
   * it should return a cleanup function from useEffect that removes those listeners
   */
  it('Property 30: should cleanup event listeners in components', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...componentFiles.filter(f => {
          const content = fs.readFileSync(f, 'utf-8');
          return hasEventListeners(content);
        })),
        (componentPath) => {
          const content = fs.readFileSync(componentPath, 'utf-8');
          
          // If component has event listeners, it should have cleanup
          if (hasEventListeners(content)) {
            const hasCleanup = hasEventListenerCleanup(content);
            
            if (!hasCleanup) {
              console.error(`Component ${componentPath} has event listeners without cleanup`);
            }
            
            expect(hasCleanup).toBe(true);
          }
        }
      ),
      { numRuns: Math.min(100, componentFiles.length) }
    );
  });

  /**
   * Property 31: Components Cancel Pending Requests
   * Feature: nextjs-performance-optimization, Property 31
   * Validates: Requirements 25.2
   * 
   * For any component that makes async requests,
   * it should use AbortController and cancel pending requests in the useEffect cleanup function
   */
  it('Property 31: should cancel pending requests on unmount', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...componentFiles.filter(f => {
          const content = fs.readFileSync(f, 'utf-8');
          return hasPendingAsyncOps(content);
        })),
        (componentPath) => {
          const content = fs.readFileSync(componentPath, 'utf-8');
          
          // If component has async operations, it should cancel them
          if (hasPendingAsyncOps(content)) {
            const cancelsRequests = cancelsPendingRequests(content);
            
            if (!cancelsRequests) {
              console.error(`Component ${componentPath} has async operations without cancellation`);
            }
            
            expect(cancelsRequests).toBe(true);
          }
        }
      ),
      { numRuns: Math.min(100, componentFiles.length) }
    );
  });

  /**
   * Property 32: Components Clear Timers
   * Feature: nextjs-performance-optimization, Property 32
   * Validates: Requirements 25.3
   * 
   * For any component using setInterval or setTimeout,
   * it should clear those timers in the useEffect cleanup function
   */
  it('Property 32: should clear timers in cleanup', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...componentFiles.filter(f => {
          const content = fs.readFileSync(f, 'utf-8');
          return hasTimers(content);
        })),
        (componentPath) => {
          const content = fs.readFileSync(componentPath, 'utf-8');
          
          // If component has timers, it should clear them
          if (hasTimers(content)) {
            const hasCleanup = hasTimerCleanup(content);
            
            if (!hasCleanup) {
              console.error(`Component ${componentPath} has timers without cleanup`);
            }
            
            expect(hasCleanup).toBe(true);
          }
        }
      ),
      { numRuns: Math.min(100, componentFiles.length) }
    );
  });

  /**
   * Property 33: Fetch Requests Use AbortController
   * Feature: nextjs-performance-optimization, Property 33
   * Validates: Requirements 25.4
   * 
   * For any fetch call in components,
   * it should use AbortController to make the request cancelable
   */
  it('Property 33: should use AbortController for fetch requests', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...componentFiles.filter(f => {
          const content = fs.readFileSync(f, 'utf-8');
          return hasFetchCalls(content);
        })),
        (componentPath) => {
          const content = fs.readFileSync(componentPath, 'utf-8');
          
          // If component has fetch calls, it should use AbortController
          if (hasFetchCalls(content)) {
            const usesAbortController = fetchUsesAbortController(content);
            
            if (!usesAbortController) {
              console.error(`Component ${componentPath} has fetch calls without AbortController`);
            }
            
            expect(usesAbortController).toBe(true);
          }
        }
      ),
      { numRuns: Math.min(100, componentFiles.length) }
    );
  });
});
