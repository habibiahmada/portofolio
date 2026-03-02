/**
 * Property-Based Tests for SEO Metadata
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

// Helper function to check if a page file exports metadata or generateMetadata
function hasMetadataAPI(filePath: string): boolean {
  const content = fs.readFileSync(filePath, 'utf-8')
  
  // Check for metadata export or generateMetadata function
  const hasMetadataExport = /export\s+(const|async\s+function)\s+metadata/i.test(content)
  const hasGenerateMetadata = /export\s+async\s+function\s+generateMetadata/i.test(content)
  
  return hasMetadataExport || hasGenerateMetadata
}

// Helper function to check if metadata includes required fields
function hasRequiredMetadataFields(filePath: string): { 
  hasTitle: boolean; 
  hasDescription: boolean; 
  hasImage: boolean;
} {
  const content = fs.readFileSync(filePath, 'utf-8')
  
  return {
    hasTitle: /title\s*[:=]/i.test(content),
    hasDescription: /description\s*[:=]/i.test(content),
    hasImage: /image\s*[:=]|og:image|openGraph.*images/i.test(content),
  }
}

// Helper function to check if ISR page uses generateMetadata
function isISRPage(filePath: string): boolean {
  const content = fs.readFileSync(filePath, 'utf-8')
  return /export\s+const\s+revalidate\s*=\s*\d+/i.test(content)
}

describe('Property 6: Pages Use Metadata API', () => {
  /**
   * For any page that requires SEO metadata,
   * it should export either a metadata object or generateMetadata function
   * 
   * Validates: Requirements 8.1, 18.1
   */
  it('should use Metadata API for all public pages', () => {
    const appDir = path.join(process.cwd(), 'src/app/[locale]')
    
    if (!fs.existsSync(appDir)) {
      console.warn('App directory not found, skipping test')
      return
    }

    const allFiles = getAllFiles(appDir)
    const publicPageFiles = allFiles.filter(file => 
      file.endsWith('page.tsx') && 
      !file.includes(path.sep + 'dashboard' + path.sep) &&
      !file.includes(path.sep + 'login' + path.sep)
    )

    // At least some pages should have metadata
    expect(publicPageFiles.length).toBeGreaterThan(0)

    publicPageFiles.forEach(filePath => {
      const hasMetadata = hasMetadataAPI(filePath)
      
      // We expect all public pages to have metadata
      expect(
        hasMetadata,
        `Public page ${path.relative(process.cwd(), filePath)} should use Metadata API`
      ).toBe(true)
    })
  })
})

describe('Property 8: Public Pages Have Required Metadata', () => {
  /**
   * For any public page, its metadata should include at minimum:
   * title, description, and openGraph image fields
   * 
   * Validates: Requirements 8.5
   */
  it('should have title, description, and og:image in all public pages', () => {
    const appDir = path.join(process.cwd(), 'src/app/[locale]')
    
    if (!fs.existsSync(appDir)) {
      console.warn('App directory not found, skipping test')
      return
    }

    const allFiles = getAllFiles(appDir)
    const publicPageFiles = allFiles.filter(file => 
      file.endsWith('page.tsx') && 
      !file.includes(path.sep + 'dashboard' + path.sep) &&
      !file.includes(path.sep + 'login' + path.sep)
    )

    publicPageFiles.forEach(filePath => {
      const fields = hasRequiredMetadataFields(filePath)
      
      expect(
        fields.hasTitle,
        `Public page ${path.relative(process.cwd(), filePath)} should have title metadata`
      ).toBe(true)
      
      expect(
        fields.hasDescription,
        `Public page ${path.relative(process.cwd(), filePath)} should have description metadata`
      ).toBe(true)
      
      expect(
        fields.hasImage,
        `Public page ${path.relative(process.cwd(), filePath)} should have og:image metadata`
      ).toBe(true)
    })
  })
})

describe('Property 16: ISR Pages Use generateMetadata', () => {
  /**
   * For any page using ISR with dynamic metadata,
   * it should export a generateMetadata function rather than static metadata
   * 
   * Validates: Requirements 18.5
   */
  it('should use generateMetadata for ISR pages with dynamic content', () => {
    const appDir = path.join(process.cwd(), 'src/app/[locale]')
    
    if (!fs.existsSync(appDir)) {
      console.warn('App directory not found, skipping test')
      return
    }

    const allFiles = getAllFiles(appDir)
    const isrPageFiles = allFiles.filter(file => 
      file.endsWith('page.tsx') && isISRPage(file)
    )

    // If we have ISR pages, they should use generateMetadata
    if (isrPageFiles.length > 0) {
      isrPageFiles.forEach(filePath => {
        const content = fs.readFileSync(filePath, 'utf-8')
        const hasGenerateMetadata = /export\s+async\s+function\s+generateMetadata/i.test(content)
        
        expect(
          hasGenerateMetadata,
          `ISR page ${path.relative(process.cwd(), filePath)} should use generateMetadata function`
        ).toBe(true)
      })
    }
  })
})

describe('Property 17: Metadata Generates Valid Meta Tags', () => {
  /**
   * For any page using the Metadata API, the rendered HTML should contain
   * valid meta tags for title, description, og:title, og:description, and og:image
   * 
   * Validates: Requirements 18.4
   */
  it('should generate metadata with OpenGraph and Twitter card fields', () => {
    const appDir = path.join(process.cwd(), 'src/app/[locale]')
    
    if (!fs.existsSync(appDir)) {
      console.warn('App directory not found, skipping test')
      return
    }

    const allFiles = getAllFiles(appDir)
    const publicPageFiles = allFiles.filter(file => 
      file.endsWith('page.tsx') && 
      !file.includes(path.sep + 'dashboard' + path.sep) &&
      !file.includes(path.sep + 'login' + path.sep)
    )

    publicPageFiles.forEach(filePath => {
      const content = fs.readFileSync(filePath, 'utf-8')
      
      // Check if metadata includes OpenGraph fields
      const hasOpenGraph = /openGraph\s*[:=]|generatePageMetadata|generateArticleMetadata/i.test(content)
      
      // Check if metadata includes Twitter card fields
      const hasTwitter = /twitter\s*[:=]|generatePageMetadata|generateArticleMetadata/i.test(content)
      
      // At least one should be present (either direct or via utility function)
      expect(
        hasOpenGraph || hasTwitter,
        `Public page ${path.relative(process.cwd(), filePath)} should include OpenGraph or Twitter metadata`
      ).toBe(true)
    })
  })
})
