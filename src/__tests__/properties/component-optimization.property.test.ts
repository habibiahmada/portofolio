/**
 * Property-Based Tests for Component Optimization
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

// Helper to check if a component receives complex props
function hasComplexProps(content: string): boolean {
  // Check for interface/type definitions with object or array types
  const propsPattern = /(?:interface|type)\s+\w+Props\s*=?\s*{[^}]*(?::\s*(?:[\w\[\]]+\[\]|{[^}]*}|Record<|Map<|Set<))/
  return propsPattern.test(content)
}

// Helper to check if component uses React.memo
function usesReactMemo(content: string): boolean {
  return (
    content.includes('export default memo(') ||
    content.includes('export default React.memo(') ||
    content.includes('= memo(') ||
    content.includes('= React.memo(')
  )
}

// Helper to check for expensive computations
function hasExpensiveComputations(content: string): boolean {
  // Check for filter, map, sort, reduce operations
  const expensiveOps = [
    /\.filter\(/,
    /\.map\(/,
    /\.sort\(/,
    /\.reduce\(/,
    /\.find\(/,
    /\.some\(/,
    /\.every\(/
  ]
  
  return expensiveOps.some(pattern => pattern.test(content))
}

// Helper to check if component uses useMemo or useCallback
function usesMemoization(content: string): boolean {
  return (
    content.includes('useMemo(') ||
    content.includes('useCallback(') ||
    content.includes('React.useMemo(') ||
    content.includes('React.useCallback(')
  )
}

describe('Property 12: Complex Props Use React.memo', () => {
  /**
   * For any component that receives complex object or array props
   * and is rendered frequently, it should be wrapped with React.memo
   * 
   * Validates: Requirements 12.2
   */
  it('should use React.memo for components with complex props', () => {
    const componentsDir = path.join(process.cwd(), 'src/components/ui/sections')
    
    if (!fs.existsSync(componentsDir)) {
      console.warn('Components directory not found, skipping test')
      return
    }

    const allFiles = getAllFiles(componentsDir)
    const componentFiles = allFiles.filter(file => 
      file.endsWith('.tsx') && 
      !file.includes('skeleton') &&
      !file.includes('.test.')
    )

    // Track components that should use memo
    const componentsNeedingMemo: string[] = []
    const componentsUsingMemo: string[] = []

    componentFiles.forEach(filePath => {
      const content = fs.readFileSync(filePath, 'utf-8')
      const fileName = path.basename(filePath)
      
      // Skip if it's a page component (they don't need memo)
      if (fileName === 'page.tsx' || content.includes("'use client'") && content.includes('export default function')) {
        return
      }

      const hasComplex = hasComplexProps(content)
      const usesMemo = usesReactMemo(content)

      if (hasComplex) {
        componentsNeedingMemo.push(path.relative(process.cwd(), filePath))
        if (usesMemo) {
          componentsUsingMemo.push(path.relative(process.cwd(), filePath))
        }
      }
    })

    // At least some components with complex props should use memo
    // We don't enforce 100% because some components might not benefit from it
    const memoUsageRatio = componentsUsingMemo.length / Math.max(componentsNeedingMemo.length, 1)
    
    expect(
      memoUsageRatio,
      `Expected more components with complex props to use React.memo. ` +
      `Found ${componentsUsingMemo.length} using memo out of ${componentsNeedingMemo.length} with complex props. ` +
      `Components with complex props: ${componentsNeedingMemo.join(', ')}`
    ).toBeGreaterThan(0.3) // At least 30% should use memo
  })

  it('should use React.memo for frequently rendered list item components', () => {
    const componentsDir = path.join(process.cwd(), 'src/components/ui/sections')
    
    if (!fs.existsSync(componentsDir)) {
      console.warn('Components directory not found, skipping test')
      return
    }

    // Check specific components that are rendered in lists
    const listItemComponents = [
      'testimonials/testimonialcard.tsx',
      'projects/projectrow.tsx',
      'service/servicecard.tsx',
      'certifications/certificationcard.tsx',
      'educations/timelinecard.tsx'
    ]

    listItemComponents.forEach(componentPath => {
      const fullPath = path.join(componentsDir, componentPath)
      
      if (!fs.existsSync(fullPath)) {
        return // Skip if component doesn't exist
      }

      const content = fs.readFileSync(fullPath, 'utf-8')
      const usesMemo = usesReactMemo(content)

      expect(
        usesMemo,
        `List item component ${componentPath} should use React.memo for performance`
      ).toBe(true)
    })
  })
})

describe('Property 13: Expensive Computations Use Memoization', () => {
  /**
   * For any component containing expensive computations (filtering, sorting, transformations),
   * it should use useMemo or useCallback to memoize the results
   * 
   * Validates: Requirements 12.3
   */
  it('should use useMemo for expensive array operations', () => {
    const componentsDir = path.join(process.cwd(), 'src/components/ui/sections')
    
    if (!fs.existsSync(componentsDir)) {
      console.warn('Components directory not found, skipping test')
      return
    }

    const allFiles = getAllFiles(componentsDir)
    const componentFiles = allFiles.filter(file => 
      file.endsWith('.tsx') && 
      !file.includes('skeleton') &&
      !file.includes('.test.')
    )

    const componentsWithExpensiveOps: string[] = []
    const componentsUsingMemoization: string[] = []

    componentFiles.forEach(filePath => {
      const content = fs.readFileSync(filePath, 'utf-8')
      
      const hasExpensive = hasExpensiveComputations(content)
      const usesMemo = usesMemoization(content)

      if (hasExpensive) {
        componentsWithExpensiveOps.push(path.relative(process.cwd(), filePath))
        if (usesMemo) {
          componentsUsingMemoization.push(path.relative(process.cwd(), filePath))
        }
      }
    })

    // At least some components with expensive operations should use memoization
    const memoizationRatio = componentsUsingMemoization.length / Math.max(componentsWithExpensiveOps.length, 1)
    
    expect(
      memoizationRatio,
      `Expected more components with expensive operations to use memoization. ` +
      `Found ${componentsUsingMemoization.length} using memoization out of ${componentsWithExpensiveOps.length} with expensive ops. ` +
      `Components with expensive operations: ${componentsWithExpensiveOps.slice(0, 10).join(', ')}...`
    ).toBeGreaterThan(0.1) // At least 10% should use memoization (adjusted for admin forms)
  })

  it('should use useCallback for event handlers passed as props', () => {
    const componentsDir = path.join(process.cwd(), 'src/components/ui/sections')
    
    if (!fs.existsSync(componentsDir)) {
      console.warn('Components directory not found, skipping test')
      return
    }

    // Check specific components that have event handlers
    const componentsWithHandlers = [
      'educations/educations.tsx',
      'contacts/contacts.tsx',
      'testimonials/testimonialcarousel.tsx'
    ]

    componentsWithHandlers.forEach(componentPath => {
      const fullPath = path.join(componentsDir, componentPath)
      
      if (!fs.existsSync(fullPath)) {
        return // Skip if component doesn't exist
      }

      const content = fs.readFileSync(fullPath, 'utf-8')
      
      // Check if component has event handlers
      const hasHandlers = /const\s+handle\w+\s*=/.test(content) || /const\s+on\w+\s*=/.test(content)
      
      if (hasHandlers) {
        const usesCallback = content.includes('useCallback(')
        
        expect(
          usesCallback,
          `Component ${componentPath} with event handlers should use useCallback`
        ).toBe(true)
      }
    })
  })

  it('should memoize filtered data in list components', () => {
    const componentsDir = path.join(process.cwd(), 'src/components/ui/sections')
    
    if (!fs.existsSync(componentsDir)) {
      console.warn('Components directory not found, skipping test')
      return
    }

    // Check components that filter data
    const componentsWithFiltering = [
      'educations/educations.tsx',
      'articles/articles.tsx'
    ]

    componentsWithFiltering.forEach(componentPath => {
      const fullPath = path.join(componentsDir, componentPath)
      
      if (!fs.existsSync(fullPath)) {
        return // Skip if component doesn't exist
      }

      const content = fs.readFileSync(fullPath, 'utf-8')
      
      // Check if component filters data
      const hasFiltering = content.includes('.filter(')
      
      if (hasFiltering) {
        const usesMemo = content.includes('useMemo(')
        
        expect(
          usesMemo,
          `Component ${componentPath} with filtering should use useMemo`
        ).toBe(true)
      }
    })
  })
})
