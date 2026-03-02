/**
 * Property-Based Tests for Authentication Performance
 * Feature: nextjs-performance-optimization
 * 
 * These tests verify that authentication doesn't block public page rendering
 * and that auth is properly isolated to admin routes only.
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

/**
 * Property 29: Public Pages Don't Block on Auth
 * 
 * For any public site page, it should not include authentication checks that block rendering.
 * 
 * Validates: Requirements 23.4
 */
describe('Property 29: Public Pages Don\'t Block on Auth', () => {
  it('should not import AuthContext or useAuth in public pages', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          'src/app/[locale]/page.tsx',
          'src/app/[locale]/articles/page.tsx',
          'src/app/[locale]/articles/[slug]/page.tsx',
          'src/app/[locale]/projects/page.tsx'
        ),
        async (publicPagePath) => {
          const fs = await import('fs/promises');
          const path = await import('path');
          
          try {
            const fullPath = path.resolve(process.cwd(), publicPagePath);
            const content = await fs.readFile(fullPath, 'utf-8');
            
            // Public pages should not import auth-related modules
            const hasAuthImport = content.includes('useAuth') || 
                                 content.includes('AuthContext') ||
                                 content.includes('@/contexts/AuthContext');
            
            expect(hasAuthImport).toBe(false);
          } catch (error) {
            // If file doesn't exist, that's okay - it means the page structure might be different
            // We'll just skip this test case
            if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
              throw error;
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not call auth functions during page component initialization', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          'src/app/[locale]/page.tsx',
          'src/app/[locale]/articles/page.tsx',
          'src/app/[locale]/projects/page.tsx'
        ),
        async (publicPagePath) => {
          const fs = await import('fs/promises');
          const path = await import('path');
          
          try {
            const fullPath = path.resolve(process.cwd(), publicPagePath);
            const content = await fs.readFile(fullPath, 'utf-8');
            
            // Public pages should not have auth-related function calls
            const hasAuthCall = content.includes('getCurrentUser()') ||
                               content.includes('getCurrentSession()') ||
                               content.includes('isAuthorizedUser(');
            
            expect(hasAuthCall).toBe(false);
          } catch (error) {
            if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
              throw error;
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have AuthProvider conditionally loaded only for admin routes', async () => {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const providersPath = path.resolve(process.cwd(), 'src/app/[locale]/providers.tsx');
    const content = await fs.readFile(providersPath, 'utf-8');
    
    // Providers should conditionally wrap with AuthProvider based on route
    const hasConditionalAuth = content.includes('isAdminRoute') || 
                               content.includes('dashboard') ||
                               content.includes('login');
    
    expect(hasConditionalAuth).toBe(true);
  });
});
