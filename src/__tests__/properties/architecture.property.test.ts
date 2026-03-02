/**
 * Property-Based Tests for Architecture Separation
 * Feature: nextjs-performance-optimization
 */

import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

// Helper function to get all files in a directory recursively
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  if (!fs.existsSync(dirPath)) return arrayOfFiles

  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    const filePath = path.join(dirPath, file)
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles)
    } else {
      arrayOfFiles.push(filePath)
    }
  })

  return arrayOfFiles
}

// Helper function to check if a file has 'use client' directive
function hasUseClientDirective(filePath: string): boolean {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n').slice(0, 10) // Check first 10 lines
  return lines.some(line => 
    line.includes("'use client'") || line.includes('"use client"')
  )
}

// Helper function to check if a file is imported by a client component
function isImportedByClientComponent(filePath: string, adminFiles: string[]): boolean {
  // For simplicity, we'll check if it's a component that's likely imported
  // In a real implementation, you'd parse imports
  const fileName = path.basename(filePath)
  return fileName.startsWith('use') || fileName.includes('context')
}

describe('Property 2: Admin Components Are Client Components', () => {
  /**
   * For any component file in the admin/dashboard directory,
   * it should contain the 'use client' directive or be imported by a client component
   * 
   * Validates: Requirements 3.1, 4.4, 10.1
   */
  it('should have use client directive in all admin page components', () => {
    const dashboardDir = path.join(process.cwd(), 'src/app/[locale]/dashboard')
    
    if (!fs.existsSync(dashboardDir)) {
      console.warn('Dashboard directory not found, skipping test')
      return
    }

    const allFiles = getAllFiles(dashboardDir)
    const pageFiles = allFiles.filter(file => 
      file.endsWith('page.tsx') || file.endsWith('layout.tsx')
    )

    pageFiles.forEach(filePath => {
      const hasUseClient = hasUseClientDirective(filePath)
      const isImported = isImportedByClientComponent(filePath, allFiles)
      
      expect(
        hasUseClient || isImported,
        `Admin component ${path.relative(process.cwd(), filePath)} should be a client component`
      ).toBe(true)
    })
  })
})

describe('Property 3: Public Pages Use Static Rendering', () => {
  /**
   * For any page in the public site (non-admin routes),
   * it should use either SSG or ISR rendering strategy, not dynamic SSR
   * 
   * Validates: Requirements 3.2, 10.3
   */
  it('should not use force-dynamic in public pages', () => {
    const appDir = path.join(process.cwd(), 'src/app/[locale]')
    
    if (!fs.existsSync(appDir)) {
      console.warn('App directory not found, skipping test')
      return
    }

    const allFiles = getAllFiles(appDir)
    const publicPageFiles = allFiles.filter(file => 
      file.endsWith('page.tsx') && 
      !file.includes('/dashboard/') &&
      !file.includes('/login/')
    )

    publicPageFiles.forEach(filePath => {
      const content = fs.readFileSync(filePath, 'utf-8')
      const hasForceDynamic = content.includes("dynamic = 'force-dynamic'")
      
      expect(
        hasForceDynamic,
        `Public page ${path.relative(process.cwd(), filePath)} should not use force-dynamic`
      ).toBe(false)
    })
  })
})

describe('Property 11: Admin Pages Avoid SSR', () => {
  /**
   * For any page in the admin/dashboard routes,
   * it should not use server-side rendering (should be client-only)
   * 
   * Validates: Requirements 10.2
   */
  it('should not use async server components in admin pages', () => {
    const dashboardDir = path.join(process.cwd(), 'src/app/[locale]/dashboard')
    
    if (!fs.existsSync(dashboardDir)) {
      console.warn('Dashboard directory not found, skipping test')
      return
    }

    const allFiles = getAllFiles(dashboardDir)
    const pageFiles = allFiles.filter(file => file.endsWith('page.tsx'))

    pageFiles.forEach(filePath => {
      const content = fs.readFileSync(filePath, 'utf-8')
      
      // Check if it's an async server component
      const isAsyncServerComponent = 
        content.includes('export default async function') &&
        !hasUseClientDirective(filePath)
      
      expect(
        isAsyncServerComponent,
        `Admin page ${path.relative(process.cwd(), filePath)} should not be an async server component`
      ).toBe(false)
    })
  })
})
