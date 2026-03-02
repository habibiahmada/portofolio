/**
 * Unit Tests for JSON-LD Structured Data Generation
 * Feature: nextjs-performance-optimization
 */

import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'
import { generateBlogPostingSchema, toJsonLdScript } from '@/lib/metadata/structured-data'

describe('JSON-LD Structured Data', () => {
  /**
   * Example 24: JSON-LD Generated Statically
   * Test JSON-LD is rendered in the page component, not generated client-side
   * 
   * Validates: Requirements 19.5
   */
  it('should generate JSON-LD statically in blog detail pages', () => {
    const blogDetailPath = path.join(process.cwd(), 'src/app/[locale]/articles/[slug]/page.tsx')
    
    if (!fs.existsSync(blogDetailPath)) {
      console.warn('Blog detail page not found, skipping test')
      return
    }
    
    const content = fs.readFileSync(blogDetailPath, 'utf-8')
    
    // Check that JSON-LD is generated in server component (not client-side)
    expect(
      !content.includes("'use client'") && !content.includes('"use client"'),
      'Blog detail page should be a server component for static JSON-LD generation'
    ).toBe(true)
    
    // Check for JSON-LD script tag in JSX
    expect(
      content.includes('<script') && content.includes('application/ld+json'),
      'Blog detail page should include JSON-LD script tag'
    ).toBe(true)
    
    // Check for dangerouslySetInnerHTML (required for JSON-LD injection)
    expect(
      content.includes('dangerouslySetInnerHTML'),
      'Blog detail page should use dangerouslySetInnerHTML for JSON-LD'
    ).toBe(true)
    
    // Check for structured data generator import
    expect(
      content.includes('generateBlogPostingSchema') || content.includes('structured-data'),
      'Blog detail page should import structured data generator'
    ).toBe(true)
    
    // Check that JSON-LD is generated before return statement (static generation)
    const returnIndex = content.indexOf('return (')
    const jsonLdIndex = content.indexOf('generateBlogPostingSchema')
    
    if (jsonLdIndex !== -1 && returnIndex !== -1) {
      expect(
        jsonLdIndex < returnIndex,
        'JSON-LD should be generated before component return (static generation)'
      ).toBe(true)
    }
  })

  it('should have structured data generator utility', () => {
    const structuredDataPath = path.join(process.cwd(), 'src/lib/metadata/structured-data.ts')
    
    expect(fs.existsSync(structuredDataPath), 'Structured data utility file should exist').toBe(true)
    
    const content = fs.readFileSync(structuredDataPath, 'utf-8')
    
    // Check for generateBlogPostingSchema function
    expect(
      content.includes('generateBlogPostingSchema'),
      'Should export generateBlogPostingSchema function'
    ).toBe(true)
    
    // Check for schema.org context
    expect(
      content.includes('https://schema.org') || content.includes('schema.org'),
      'Should use schema.org context'
    ).toBe(true)
    
    // Check for BlogPosting type
    expect(
      content.includes('BlogPosting'),
      'Should use BlogPosting type'
    ).toBe(true)
    
    // Check for required fields
    expect(
      content.includes('headline') && 
      content.includes('author') && 
      content.includes('datePublished') && 
      content.includes('dateModified') && 
      content.includes('image'),
      'Should include all required BlogPosting fields'
    ).toBe(true)
    
    // Check for toJsonLdScript helper
    expect(
      content.includes('toJsonLdScript') || content.includes('JSON.stringify'),
      'Should have helper to convert schema to JSON-LD script'
    ).toBe(true)
  })

  it('should generate valid BlogPosting schema', () => {
    const schema = generateBlogPostingSchema({
      title: 'Test Article',
      description: 'Test description',
      author: 'Test Author',
      publishedAt: '2024-01-01T00:00:00Z',
      modifiedAt: '2024-01-02T00:00:00Z',
      image: '/images/test.jpg',
      url: 'https://example.com/articles/test',
      tags: ['test', 'article'],
    })

    // Check schema structure
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('BlogPosting')
    
    // Check required fields
    expect(schema.headline).toBe('Test Article')
    expect(schema.description).toBe('Test description')
    expect(schema.author).toEqual({ '@type': 'Person', name: 'Test Author' })
    expect(schema.datePublished).toBe('2024-01-01T00:00:00Z')
    expect(schema.dateModified).toBe('2024-01-02T00:00:00Z')
    expect(schema.image).toContain('/images/test.jpg')
    expect(schema.url).toBe('https://example.com/articles/test')
    
    // Check optional fields
    expect(schema.keywords).toBe('test, article')
  })

  it('should convert schema to JSON-LD script string', () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'Test',
    }

    const jsonLdString = toJsonLdScript(schema)
    
    // Should be valid JSON
    expect(() => JSON.parse(jsonLdString)).not.toThrow()
    
    // Should contain schema properties
    expect(jsonLdString).toContain('@context')
    expect(jsonLdString).toContain('https://schema.org')
    expect(jsonLdString).toContain('BlogPosting')
    expect(jsonLdString).toContain('Test')
  })

  it('should handle absolute and relative image URLs', () => {
    // Test with relative URL
    const schemaRelative = generateBlogPostingSchema({
      title: 'Test',
      description: 'Test',
      author: 'Test',
      publishedAt: '2024-01-01T00:00:00Z',
      modifiedAt: '2024-01-01T00:00:00Z',
      image: '/images/test.jpg',
    })
    
    expect(schemaRelative.image).toMatch(/^https?:\/\//)
    
    // Test with absolute URL
    const schemaAbsolute = generateBlogPostingSchema({
      title: 'Test',
      description: 'Test',
      author: 'Test',
      publishedAt: '2024-01-01T00:00:00Z',
      modifiedAt: '2024-01-01T00:00:00Z',
      image: 'https://example.com/images/test.jpg',
    })
    
    expect(schemaAbsolute.image).toBe('https://example.com/images/test.jpg')
  })

  it('should include author as Person schema', () => {
    const schema = generateBlogPostingSchema({
      title: 'Test',
      description: 'Test',
      author: 'John Doe',
      publishedAt: '2024-01-01T00:00:00Z',
      modifiedAt: '2024-01-01T00:00:00Z',
      image: '/test.jpg',
    })
    
    expect(schema.author).toEqual({
      '@type': 'Person',
      name: 'John Doe',
    })
  })

  it('should handle optional tags/keywords', () => {
    // With tags
    const schemaWithTags = generateBlogPostingSchema({
      title: 'Test',
      description: 'Test',
      author: 'Test',
      publishedAt: '2024-01-01T00:00:00Z',
      modifiedAt: '2024-01-01T00:00:00Z',
      image: '/test.jpg',
      tags: ['tag1', 'tag2', 'tag3'],
    })
    
    expect(schemaWithTags.keywords).toBe('tag1, tag2, tag3')
    
    // Without tags
    const schemaWithoutTags = generateBlogPostingSchema({
      title: 'Test',
      description: 'Test',
      author: 'Test',
      publishedAt: '2024-01-01T00:00:00Z',
      modifiedAt: '2024-01-01T00:00:00Z',
      image: '/test.jpg',
    })
    
    expect(schemaWithoutTags.keywords).toBeUndefined()
  })
})
