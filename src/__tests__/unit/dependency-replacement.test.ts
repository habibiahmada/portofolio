/**
 * Unit Tests for Dependency Replacement
 * Feature: nextjs-performance-optimization
 */

import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

describe('Dependency Replacement Unit Tests', () => {
  /**
   * Example 11: Heavy Dependencies Replaced
   * Validates: Requirements 6.2, 7.1, 7.2
   */
  it('should not have moment.js in dependencies', () => {
    const packageJsonPath = path.join(process.cwd(), 'package.json')
    expect(fs.existsSync(packageJsonPath)).toBe(true)
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    
    // Check that moment.js is not in dependencies
    expect(packageJson.dependencies).toBeDefined()
    expect(packageJson.dependencies['moment']).toBeUndefined()
    
    // Check that moment.js is not in devDependencies
    if (packageJson.devDependencies) {
      expect(packageJson.devDependencies['moment']).toBeUndefined()
    }
  })

  it('should not have full lodash in dependencies', () => {
    const packageJsonPath = path.join(process.cwd(), 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    
    // Check that full lodash is not in dependencies
    expect(packageJson.dependencies).toBeDefined()
    expect(packageJson.dependencies['lodash']).toBeUndefined()
    
    // Check that full lodash is not in devDependencies
    if (packageJson.devDependencies) {
      expect(packageJson.devDependencies['lodash']).toBeUndefined()
    }
  })

  it('should not have moment.js imports in codebase', () => {
    // Check common directories for moment imports
    const srcDir = path.join(process.cwd(), 'src')
    
    const checkForMoment = (dir: string): boolean => {
      if (!fs.existsSync(dir)) return false
      
      const files = fs.readdirSync(dir, { withFileTypes: true })
      
      for (const file of files) {
        const fullPath = path.join(dir, file.name)
        
        if (file.isDirectory()) {
          // Skip node_modules and .next
          if (file.name === 'node_modules' || file.name === '.next') continue
          if (checkForMoment(fullPath)) return true
        } else if (file.name.match(/\.(ts|tsx|js|jsx)$/)) {
          const content = fs.readFileSync(fullPath, 'utf-8')
          if (content.match(/import.*['"]moment['"]/)) {
            console.log(`Found moment import in: ${fullPath}`)
            return true
          }
          if (content.match(/require\(['"]moment['"]\)/)) {
            console.log(`Found moment require in: ${fullPath}`)
            return true
          }
        }
      }
      
      return false
    }
    
    const hasMoment = checkForMoment(srcDir)
    expect(hasMoment).toBe(false)
  })

  it('should not have full lodash imports in codebase', () => {
    // Check common directories for lodash imports
    const srcDir = path.join(process.cwd(), 'src')
    
    const checkForLodash = (dir: string): boolean => {
      if (!fs.existsSync(dir)) return false
      
      const files = fs.readdirSync(dir, { withFileTypes: true })
      
      for (const file of files) {
        const fullPath = path.join(dir, file.name)
        
        if (file.isDirectory()) {
          // Skip node_modules and .next
          if (file.name === 'node_modules' || file.name === '.next') continue
          if (checkForLodash(fullPath)) return true
        } else if (file.name.match(/\.(ts|tsx|js|jsx)$/)) {
          const content = fs.readFileSync(fullPath, 'utf-8')
          // Check for full lodash import (not lodash-es or specific imports)
          if (content.match(/import\s+.*\s+from\s+['"]lodash['"]/)) {
            console.log(`Found full lodash import in: ${fullPath}`)
            return true
          }
          if (content.match(/require\(['"]lodash['"]\)/)) {
            console.log(`Found full lodash require in: ${fullPath}`)
            return true
          }
        }
      }
      
      return false
    }
    
    const hasLodash = checkForLodash(srcDir)
    expect(hasLodash).toBe(false)
  })
})
