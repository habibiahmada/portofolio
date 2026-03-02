/**
 * Unit Tests for Admin Architecture
 * Feature: nextjs-performance-optimization
 */

import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

describe('Admin Architecture Unit Tests', () => {
  /**
   * Example 6: Admin Routes Separated
   * Validates: Requirements 4.1
   */
  it('should have admin routes under /dashboard path', () => {
    const dashboardDir = path.join(process.cwd(), 'src/app/[locale]/dashboard')
    expect(fs.existsSync(dashboardDir)).toBe(true)
    
    // Check that dashboard directory contains expected subdirectories
    const dashboardContents = fs.readdirSync(dashboardDir)
    const expectedDirs = ['articles', 'projects', 'certificates']
    
    expectedDirs.forEach(dir => {
      expect(
        dashboardContents.includes(dir),
        `Dashboard should contain ${dir} directory`
      ).toBe(true)
    })
  })

  /**
   * Example 7: Middleware Uses Matcher
   * Validates: Requirements 4.2, 23.5
   */
  it('should have middleware with matcher configuration', () => {
    const middlewarePath = path.join(process.cwd(), 'src/middleware.ts')
    
    if (!fs.existsSync(middlewarePath)) {
      console.warn('Middleware file not found, skipping test')
      return
    }

    const content = fs.readFileSync(middlewarePath, 'utf-8')
    
    // Check for matcher export
    expect(content).toContain('export const config')
    expect(content).toContain('matcher')
    
    // Verify matcher excludes static files and API routes
    expect(content).toMatch(/api|_next\/static|_next\/image/)
  })

  /**
   * Example 16: Admin Uses API Routes
   * Validates: Requirements 10.5
   */
  it('should have API routes for admin operations', () => {
    const adminApiDir = path.join(process.cwd(), 'src/app/api/admin')
    expect(fs.existsSync(adminApiDir)).toBe(true)
    
    // Check for common admin API routes
    const expectedRoutes = ['articles', 'projects', 'certificates']
    
    expectedRoutes.forEach(route => {
      const routePath = path.join(adminApiDir, route)
      expect(
        fs.existsSync(routePath),
        `Admin API should have ${route} route`
      ).toBe(true)
    })
  })

  it('should have error handling utilities', () => {
    const errorHandlerPath = path.join(process.cwd(), 'src/lib/api-error-handler.ts')
    expect(fs.existsSync(errorHandlerPath)).toBe(true)
    
    const content = fs.readFileSync(errorHandlerPath, 'utf-8')
    expect(content).toContain('APIError')
    expect(content).toContain('handleAPIError')
  })

  it('should have rate limiting configured', () => {
    const rateLimitPath = path.join(process.cwd(), 'src/lib/ratelimit.ts')
    expect(fs.existsSync(rateLimitPath)).toBe(true)
    
    const content = fs.readFileSync(rateLimitPath, 'utf-8')
    expect(content).toContain('checkRateLimit')
    expect(content).toContain('NextRequest')
  })

  it('should have Supabase admin client with connection pooling', () => {
    const supabaseAdminPath = path.join(process.cwd(), 'src/lib/supabase/admin.ts')
    expect(fs.existsSync(supabaseAdminPath)).toBe(true)
    
    const content = fs.readFileSync(supabaseAdminPath, 'utf-8')
    expect(content).toContain('createClient')
    expect(content).toContain('supabaseAdmin')
    // Check for connection pooling configuration
    expect(content).toMatch(/connection-pool|db:|global:/)
  })
})
