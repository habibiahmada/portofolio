/**
 * Unit Tests for Static OG Images
 * Feature: nextjs-performance-optimization
 */

import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

describe('Static OG Images', () => {
  /**
   * Example 14: OG Images Are Static Files
   * Test OG images are static files
   * 
   * Validates: Requirements 8.4, 17.1, 17.2, 17.4
   */
  it('should have public/open-graph directory', () => {
    const ogDir = path.join(process.cwd(), 'public/open-graph')
    
    expect(
      fs.existsSync(ogDir),
      'public/open-graph directory should exist'
    ).toBe(true)
    
    expect(
      fs.statSync(ogDir).isDirectory(),
      'public/open-graph should be a directory'
    ).toBe(true)
  })

  it('should have default OG image', () => {
    const defaultOGImage = path.join(process.cwd(), 'public/open-graph/og-image.png')
    
    expect(
      fs.existsSync(defaultOGImage),
      'Default OG image (og-image.png) should exist'
    ).toBe(true)
    
    expect(
      fs.statSync(defaultOGImage).isFile(),
      'Default OG image should be a file'
    ).toBe(true)
    
    // Check file size is reasonable (not empty, not too large)
    const stats = fs.statSync(defaultOGImage)
    expect(
      stats.size,
      'Default OG image should have reasonable file size (> 1KB)'
    ).toBeGreaterThan(1024)
    
    expect(
      stats.size,
      'Default OG image should not be too large (< 5MB)'
    ).toBeLessThan(5 * 1024 * 1024)
  })

  it('should not have runtime OG image generation API routes', () => {
    const apiDir = path.join(process.cwd(), 'src/app/api')
    
    if (!fs.existsSync(apiDir)) {
      // No API directory means no runtime generation
      return
    }

    // Check for common OG image generation route patterns
    const ogRoutes = [
      path.join(apiDir, 'og'),
      path.join(apiDir, 'og-image'),
      path.join(apiDir, 'opengraph'),
      path.join(apiDir, 'open-graph'),
    ]

    ogRoutes.forEach(routePath => {
      expect(
        fs.existsSync(routePath),
        `Runtime OG image generation route ${path.relative(process.cwd(), routePath)} should not exist`
      ).toBe(false)
    })
  })

  it('should reference static OG images in metadata utility', () => {
    const metadataUtilPath = path.join(process.cwd(), 'src/lib/metadata/index.ts')
    
    expect(
      fs.existsSync(metadataUtilPath),
      'Metadata utility file should exist'
    ).toBe(true)
    
    const content = fs.readFileSync(metadataUtilPath, 'utf-8')
    
    // Should reference static OG image path
    expect(
      content.includes('/open-graph/') || content.includes('defaultImage'),
      'Metadata utility should reference static OG image path'
    ).toBe(true)
    
    // Should have default image fallback
    expect(
      content.includes('defaultImage') || content.includes('og-image.png'),
      'Metadata utility should have default OG image fallback'
    ).toBe(true)
    
    // Should NOT import ImageResponse or @vercel/og
    expect(
      content.includes('ImageResponse') || content.includes('@vercel/og'),
      'Metadata utility should not use runtime OG image generation'
    ).toBe(false)
  })

  it('should use static images in blog metadata generation', () => {
    const metadataUtilPath = path.join(process.cwd(), 'src/lib/metadata/index.ts')
    
    if (!fs.existsSync(metadataUtilPath)) {
      console.warn('Metadata utility not found, skipping test')
      return
    }
    
    const content = fs.readFileSync(metadataUtilPath, 'utf-8')
    
    // Check for generateArticleMetadata function
    expect(
      content.includes('generateArticleMetadata'),
      'Should have generateArticleMetadata function'
    ).toBe(true)
    
    // Should accept image parameter (for article-specific images)
    expect(
      content.includes('image?:') || content.includes('image:'),
      'generateArticleMetadata should accept image parameter'
    ).toBe(true)
    
    // Should use image parameter or fallback to default
    expect(
      content.includes('image ||') || content.includes('image:'),
      'Should use provided image or fallback to default'
    ).toBe(true)
  })

  it('should have OG images as static assets, not generated at runtime', () => {
    const ogDir = path.join(process.cwd(), 'public/open-graph')
    
    if (!fs.existsSync(ogDir)) {
      console.warn('OG directory not found, skipping test')
      return
    }
    
    const files = fs.readdirSync(ogDir)
    const imageFiles = files.filter(file => 
      /\.(png|jpg|jpeg|webp)$/i.test(file)
    )
    
    // Should have at least one static OG image
    expect(
      imageFiles.length,
      'Should have at least one static OG image file'
    ).toBeGreaterThan(0)
    
    // All files should be actual image files (not empty)
    imageFiles.forEach(file => {
      const filePath = path.join(ogDir, file)
      const stats = fs.statSync(filePath)
      
      expect(
        stats.size,
        `OG image ${file} should not be empty`
      ).toBeGreaterThan(0)
    })
  })

  it('should not have OG image generation in build process', () => {
    const nextConfigPath = path.join(process.cwd(), 'next.config.ts')
    
    if (!fs.existsSync(nextConfigPath)) {
      const jsConfigPath = path.join(process.cwd(), 'next.config.js')
      if (!fs.existsSync(jsConfigPath)) {
        console.warn('Next.js config not found, skipping test')
        return
      }
    }
    
    const configPath = fs.existsSync(nextConfigPath) 
      ? nextConfigPath 
      : path.join(process.cwd(), 'next.config.js')
    
    const content = fs.readFileSync(configPath, 'utf-8')
    
    // Should NOT have OG image generation plugins or configuration
    expect(
      content.includes('@vercel/og') || content.includes('generateOGImage'),
      'Next.js config should not include runtime OG image generation'
    ).toBe(false)
  })
})
