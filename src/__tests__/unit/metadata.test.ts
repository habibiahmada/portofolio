/**
 * Unit Tests for Metadata Implementation
 * Feature: nextjs-performance-optimization
 */

import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

describe('Metadata Implementation', () => {
  /**
   * Example 23: Root Layout Has Default Metadata
   * Test root layout has default metadata
   * 
   * Validates: Requirements 18.2
   */
  it('should have default metadata in root layout', () => {
    const layoutPath = path.join(process.cwd(), 'src/app/[locale]/layout.tsx')
    
    expect(fs.existsSync(layoutPath), 'Root layout file should exist').toBe(true)
    
    const content = fs.readFileSync(layoutPath, 'utf-8')
    
    // Check for generateMetadata function
    expect(
      content.includes('generateMetadata'),
      'Root layout should export generateMetadata function'
    ).toBe(true)
    
    // Check for title template (allows child pages to override)
    expect(
      content.includes('template') || content.includes('title'),
      'Root layout should define title or title template'
    ).toBe(true)
    
    // Check for description
    expect(
      content.includes('description'),
      'Root layout should define description'
    ).toBe(true)
    
    // Check for OpenGraph metadata
    expect(
      content.includes('openGraph'),
      'Root layout should define OpenGraph metadata'
    ).toBe(true)
    
    // Check for Twitter metadata
    expect(
      content.includes('twitter'),
      'Root layout should define Twitter card metadata'
    ).toBe(true)
    
    // Check for metadataBase
    expect(
      content.includes('metadataBase'),
      'Root layout should define metadataBase URL'
    ).toBe(true)
  })

  it('should have metadata utility functions', () => {
    const metadataUtilPath = path.join(process.cwd(), 'src/lib/metadata/index.ts')
    
    expect(fs.existsSync(metadataUtilPath), 'Metadata utility file should exist').toBe(true)
    
    const content = fs.readFileSync(metadataUtilPath, 'utf-8')
    
    // Check for generatePageMetadata function
    expect(
      content.includes('generatePageMetadata'),
      'Should export generatePageMetadata function'
    ).toBe(true)
    
    // Check for generateArticleMetadata function
    expect(
      content.includes('generateArticleMetadata'),
      'Should export generateArticleMetadata function'
    ).toBe(true)
    
    // Check for type safety
    expect(
      content.includes('PageMetadataParams') || content.includes('interface'),
      'Should have type definitions for metadata parameters'
    ).toBe(true)
    
    // Check for OpenGraph support
    expect(
      content.includes('openGraph'),
      'Should support OpenGraph metadata'
    ).toBe(true)
    
    // Check for Twitter card support
    expect(
      content.includes('twitter'),
      'Should support Twitter card metadata'
    ).toBe(true)
  })

  it('should have metadata in homepage', () => {
    const homepagePath = path.join(process.cwd(), 'src/app/[locale]/page.tsx')
    
    expect(fs.existsSync(homepagePath), 'Homepage file should exist').toBe(true)
    
    const content = fs.readFileSync(homepagePath, 'utf-8')
    
    // Check for generateMetadata function
    expect(
      content.includes('generateMetadata'),
      'Homepage should export generateMetadata function'
    ).toBe(true)
    
    // Check for metadata utility import
    expect(
      content.includes('generatePageMetadata') || content.includes('@/lib/metadata'),
      'Homepage should use metadata utility functions'
    ).toBe(true)
  })

  it('should have generateMetadata in blog detail pages', () => {
    const blogDetailPath = path.join(process.cwd(), 'src/app/[locale]/articles/[slug]/page.tsx')
    
    if (!fs.existsSync(blogDetailPath)) {
      console.warn('Blog detail page not found, skipping test')
      return
    }
    
    const content = fs.readFileSync(blogDetailPath, 'utf-8')
    
    // Check for generateMetadata function (required for ISR pages)
    expect(
      content.includes('export async function generateMetadata'),
      'Blog detail page should export generateMetadata function'
    ).toBe(true)
    
    // Check for article metadata utility
    expect(
      content.includes('generateArticleMetadata') || content.includes('@/lib/metadata'),
      'Blog detail page should use article metadata utility'
    ).toBe(true)
    
    // Check for ISR configuration
    expect(
      content.includes('revalidate'),
      'Blog detail page should have ISR revalidate configuration'
    ).toBe(true)
  })

  it('should have metadata in projects page', () => {
    const projectsPath = path.join(process.cwd(), 'src/app/[locale]/projects/page.tsx')
    
    if (!fs.existsSync(projectsPath)) {
      console.warn('Projects page not found, skipping test')
      return
    }
    
    const content = fs.readFileSync(projectsPath, 'utf-8')
    
    // Check for generateMetadata function
    expect(
      content.includes('generateMetadata'),
      'Projects page should export generateMetadata function'
    ).toBe(true)
    
    // Check for metadata utility import
    expect(
      content.includes('generatePageMetadata') || content.includes('@/lib/metadata'),
      'Projects page should use metadata utility functions'
    ).toBe(true)
  })

  it('should have metadata in articles listing page', () => {
    const articlesPath = path.join(process.cwd(), 'src/app/[locale]/articles/page.tsx')
    
    if (!fs.existsSync(articlesPath)) {
      console.warn('Articles listing page not found, skipping test')
      return
    }
    
    const content = fs.readFileSync(articlesPath, 'utf-8')
    
    // Check for generateMetadata function
    expect(
      content.includes('generateMetadata'),
      'Articles listing page should export generateMetadata function'
    ).toBe(true)
    
    // Check for metadata utility import
    expect(
      content.includes('generatePageMetadata') || content.includes('@/lib/metadata'),
      'Articles listing page should use metadata utility functions'
    ).toBe(true)
  })
})
