/**
 * Property-Based Tests for Static OG Images
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

// Helper function to check if a blog page has OG image metadata
function hasOGImageMetadata(filePath: string): boolean {
  const content = fs.readFileSync(filePath, 'utf-8')
  
  // Check if the page uses generateArticleMetadata or generatePageMetadata
  // which includes image parameter
  const usesMetadataUtil = /generateArticleMetadata|generatePageMetadata/i.test(content)
  
  // Check if image is passed to metadata function
  const passesImage = /image\s*:\s*\w+\.image|image_url|image\s*[:=]/i.test(content)
  
  // Check for direct openGraph.images configuration
  const hasOpenGraphImages = /openGraph.*images|images\s*:\s*\[/i.test(content)
  
  return (usesMetadataUtil && passesImage) || hasOpenGraphImages
}

describe('Property 15: Blog Pages Have OG Images', () => {
  /**
   * For any blog detail page, its metadata should include a valid og:image URL
   * pointing to a static asset
   * 
   * Validates: Requirements 17.5
   */
  it('should have OG image metadata in all blog pages', () => {
    const articlesDir = path.join(process.cwd(), 'src/app/[locale]/articles')
    
    if (!fs.existsSync(articlesDir)) {
      console.warn('Articles directory not found, skipping test')
      return
    }

    const allFiles = getAllFiles(articlesDir)
    const blogDetailPages = allFiles.filter(file => 
      file.endsWith('page.tsx') && 
      file.includes('[slug]')
    )

    // Should have at least one blog detail page
    expect(blogDetailPages.length).toBeGreaterThan(0)

    blogDetailPages.forEach(filePath => {
      const hasOGImage = hasOGImageMetadata(filePath)
      
      expect(
        hasOGImage,
        `Blog page ${path.relative(process.cwd(), filePath)} should include OG image in metadata`
      ).toBe(true)
    })
  })

  it('should reference static OG images, not runtime generation', () => {
    const articlesDir = path.join(process.cwd(), 'src/app/[locale]/articles')
    
    if (!fs.existsSync(articlesDir)) {
      console.warn('Articles directory not found, skipping test')
      return
    }

    const allFiles = getAllFiles(articlesDir)
    const blogDetailPages = allFiles.filter(file => 
      file.endsWith('page.tsx') && 
      file.includes('[slug]')
    )

    blogDetailPages.forEach(filePath => {
      const content = fs.readFileSync(filePath, 'utf-8')
      
      // Should NOT use ImageResponse or runtime OG image generation
      const hasRuntimeGeneration = /ImageResponse|@vercel\/og|generateOGImage/i.test(content)
      
      expect(
        hasRuntimeGeneration,
        `Blog page ${path.relative(process.cwd(), filePath)} should not use runtime OG image generation`
      ).toBe(false)
    })
  })

  it('should use metadata utility functions that reference static images', () => {
    const metadataUtilPath = path.join(process.cwd(), 'src/lib/metadata/index.ts')
    
    if (!fs.existsSync(metadataUtilPath)) {
      console.warn('Metadata utility not found, skipping test')
      return
    }

    const content = fs.readFileSync(metadataUtilPath, 'utf-8')
    
    // Should reference static OG image path
    const referencesStaticPath = /\/open-graph\/|\/og-|defaultImage/i.test(content)
    
    expect(
      referencesStaticPath,
      'Metadata utility should reference static OG image paths'
    ).toBe(true)
    
    // Should NOT use ImageResponse or runtime generation
    const hasRuntimeGeneration = /ImageResponse|@vercel\/og/i.test(content)
    
    expect(
      hasRuntimeGeneration,
      'Metadata utility should not use runtime OG image generation'
    ).toBe(false)
  })
})
