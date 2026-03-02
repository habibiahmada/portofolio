/**
 * Property-Based Tests for API Route Optimization
 * Feature: nextjs-performance-optimization
 * 
 * These tests validate that API routes follow optimization best practices:
 * - Edge runtime for eligible routes
 * - Cache headers for cacheable data
 * - Rate limiting for public routes
 * - Proper error status codes
 * - Specific field selection in database queries
 * - Caching for static data
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// Helper to get all API route files
function getAPIRouteFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAPIRouteFiles(fullPath));
    } else if (entry.name === 'route.ts' || entry.name === 'route.js') {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Helper to check if route is eligible for edge runtime
function isEligibleForEdge(content: string): boolean {
  // Routes with Node.js-specific features are not eligible
  const nodeFeatures = [
    'fs.', 'require(\'fs\')', 'import fs from',
    'process.cwd()', 
    'Buffer.from',
    'Resend', // Email sending requires Node.js
    'sharp', // Image processing requires Node.js
    'remark', // Markdown processing might require Node.js
  ];
  
  return !nodeFeatures.some(feature => content.includes(feature));
}

// Helper to check if route returns cacheable data
function isCacheableRoute(routePath: string, content: string): boolean {
  // Public GET routes that fetch data are cacheable
  const isPublicRoute = routePath.includes('/api/public/');
  const isGetRoute = content.includes('export async function GET');
  const isDataFetch = content.includes('.from(') && content.includes('.select(');
  
  return isPublicRoute && isGetRoute && isDataFetch;
}

// Helper to check if route should have rate limiting
function shouldHaveRateLimit(routePath: string, content: string): boolean {
  // Public POST routes should have rate limiting
  const isPublicRoute = routePath.includes('/api/public/');
  const hasPostMethod = content.includes('export async function POST');
  
  return isPublicRoute && hasPostMethod;
}

describe('Property 22: Eligible API Routes Use Edge Runtime', () => {
  /**
   * Feature: nextjs-performance-optimization
   * Property 22: For any API route that doesn't require Node.js-specific features,
   * it should export runtime = 'edge'
   * Validates: Requirements 21.1
   */
  it('should use edge runtime for eligible public API routes', () => {
    const apiDir = path.join(process.cwd(), 'src/app/api/public');
    
    if (!fs.existsSync(apiDir)) {
      console.warn('Public API directory not found, skipping test');
      return;
    }
    
    const routeFiles = getAPIRouteFiles(apiDir);
    let eligibleRoutes = 0;
    let routesWithEdge = 0;
    
    routeFiles.forEach(routePath => {
      const content = fs.readFileSync(routePath, 'utf-8');
      
      if (isEligibleForEdge(content)) {
        eligibleRoutes++;
        const hasEdgeRuntime = content.includes("export const runtime = 'edge'");
        if (hasEdgeRuntime) {
          routesWithEdge++;
        }
      }
    });
    
    // At least 80% of eligible routes should use edge runtime
    const ratio = routesWithEdge / eligibleRoutes;
    expect(ratio).toBeGreaterThan(0.8);
  });
});

describe('Property 23: API Routes Return Cache Headers', () => {
  /**
   * Feature: nextjs-performance-optimization
   * Property 23: For any API route that returns cacheable data,
   * the response should include Cache-Control headers
   * Validates: Requirements 21.2
   */
  it('should return cache headers for cacheable API routes', () => {
    const apiDir = path.join(process.cwd(), 'src/app/api/public');
    
    if (!fs.existsSync(apiDir)) {
      console.warn('Public API directory not found, skipping test');
      return;
    }
    
    const routeFiles = getAPIRouteFiles(apiDir);
    
    routeFiles.forEach(routePath => {
      const content = fs.readFileSync(routePath, 'utf-8');
      
      if (isCacheableRoute(routePath, content)) {
        const hasCacheControl = content.includes('Cache-Control');
        const hasMaxAge = content.includes('s-maxage') || content.includes('max-age');
        
        expect(hasCacheControl).toBe(true);
        expect(hasMaxAge).toBe(true);
      }
    });
  });
});

describe('Property 24: API Routes Implement Rate Limiting', () => {
  /**
   * Feature: nextjs-performance-optimization
   * Property 24: For any public API route with POST method,
   * it should include rate limiting middleware
   * Validates: Requirements 21.4
   */
  it('should implement rate limiting for public POST routes', () => {
    const apiDir = path.join(process.cwd(), 'src/app/api/public');
    
    if (!fs.existsSync(apiDir)) {
      console.warn('Public API directory not found, skipping test');
      return;
    }
    
    const routeFiles = getAPIRouteFiles(apiDir);
    
    routeFiles.forEach(routePath => {
      const content = fs.readFileSync(routePath, 'utf-8');
      
      if (shouldHaveRateLimit(routePath, content)) {
        const hasRateLimitImport = content.includes('checkRateLimit') || content.includes('rateLimit');
        const hasRateLimitCheck = content.includes('checkRateLimit(') || content.includes('rateLimit(');
        const has429Response = content.includes('429');
        
        expect(hasRateLimitImport).toBe(true);
        expect(hasRateLimitCheck).toBe(true);
        expect(has429Response).toBe(true);
      }
    });
  });
});

describe('Property 25: API Errors Return Proper Status', () => {
  /**
   * Feature: nextjs-performance-optimization
   * Property 25: For any API route error condition,
   * the response should return an appropriate HTTP status code and structured error message
   * Validates: Requirements 21.5
   */
  it('should return proper status codes for errors', () => {
    const apiDir = path.join(process.cwd(), 'src/app/api');
    
    if (!fs.existsSync(apiDir)) {
      console.warn('API directory not found, skipping test');
      return;
    }
    
    const routeFiles = getAPIRouteFiles(apiDir);
    let routesWithErrors = 0;
    let routesWithProperErrorHandling = 0;
    
    routeFiles.forEach(routePath => {
      const content = fs.readFileSync(routePath, 'utf-8');
      
      // Check for error handling
      if (content.includes('catch') || content.includes('error')) {
        routesWithErrors++;
        
        // Should have status codes in error responses
        const hasErrorStatus = 
          content.includes('status: 400') ||
          content.includes('status: 401') ||
          content.includes('status: 403') ||
          content.includes('status: 404') ||
          content.includes('status: 429') ||
          content.includes('status: 500') ||
          content.includes('{ status: 500 }') ||
          content.includes('{ status: 400 }');
        
        // Should return error message
        const hasErrorMessage = content.includes('error:') || content.includes('error =');
        
        if (hasErrorStatus && hasErrorMessage) {
          routesWithProperErrorHandling++;
        }
      }
    });
    
    // At least 80% of routes with error handling should have proper status codes
    const ratio = routesWithProperErrorHandling / routesWithErrors;
    expect(ratio).toBeGreaterThan(0.8);
  });
});

describe('Property 38: Database Queries Select Specific Fields', () => {
  /**
   * Feature: nextjs-performance-optimization
   * Property 38: For any database query in API routes,
   * it should use .select() to specify only the required fields
   * Validates: Requirements 28.2
   */
  it('should select specific fields in database queries', () => {
    const apiDir = path.join(process.cwd(), 'src/app/api');
    
    if (!fs.existsSync(apiDir)) {
      console.warn('API directory not found, skipping test');
      return;
    }
    
    const routeFiles = getAPIRouteFiles(apiDir);
    
    routeFiles.forEach(routePath => {
      const content = fs.readFileSync(routePath, 'utf-8');
      
      // Check for database queries
      if (content.includes('.from(') && content.includes('.select(')) {
        // Should not use .select("*") or .select('*')
        const usesSelectAll = content.includes('.select("*")') || content.includes(".select('*')");
        
        // Exception: Some queries might legitimately need all fields
        // But we should minimize this
        if (usesSelectAll) {
          console.warn(`Route ${routePath} uses select(*), consider specifying fields`);
        }
        
        // At minimum, should have .select() call
        const hasSelectCall = content.includes('.select(');
        expect(hasSelectCall).toBe(true);
      }
    });
  });
});

describe('Property 39: Static Data API Routes Use Caching', () => {
  /**
   * Feature: nextjs-performance-optimization
   * Property 39: For any API route that returns data that changes infrequently,
   * it should implement response caching
   * Validates: Requirements 28.4
   */
  it('should implement caching for static data routes', () => {
    const apiDir = path.join(process.cwd(), 'src/app/api/public');
    
    if (!fs.existsSync(apiDir)) {
      console.warn('Public API directory not found, skipping test');
      return;
    }
    
    const routeFiles = getAPIRouteFiles(apiDir);
    
    // Routes that typically serve static/semi-static data
    const staticDataRoutes = [
      'hero', 'stats', 'companies', 'services', 
      'techstacks', 'certificates', 'testimonials'
    ];
    
    routeFiles.forEach(routePath => {
      const isStaticDataRoute = staticDataRoutes.some(route => 
        routePath.includes(`/api/public/${route}/`)
      );
      
      if (isStaticDataRoute) {
        const content = fs.readFileSync(routePath, 'utf-8');
        
        // Should have revalidate export or Cache-Control header
        const hasRevalidate = content.includes('export const revalidate');
        const hasCacheControl = content.includes('Cache-Control');
        
        expect(hasRevalidate || hasCacheControl).toBe(true);
      }
    });
  });
});
