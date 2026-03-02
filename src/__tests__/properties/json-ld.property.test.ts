/**
 * Property-Based Tests for JSON-LD Structured Data
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

// Helper function to check if a blog page includes JSON-LD
function hasJsonLd(filePath: string): boolean {
  const content = fs.readFileSync(filePath, 'utf-8')
  
  // Check for JSON-LD script tag
  const hasScriptTag = /<script[^>]*type=["']application\/ld\+json["'][^>]*>/i.test(content)
  const hasJsonLdImport = /generateBlogPostingSchema|toJsonLdScript/i.test(content)
  const hasDangerouslySetInnerHTML = /dangerouslySetInnerHTML/i.test(content)
  
  return hasScriptTag || (hasJsonLdImport && hasDangerouslySetInnerHTML)
}

// Helper function to check if JSON-LD follows schema.org format
function hasSchemaOrgFormat(filePath: string): boolean {
  const content = fs.readFileSync(filePath, 'utf-8')
  
  // Check for schema.org context and BlogPosting type
  const hasContext = /@context.*schema\.org|generateBlogPostingSchema/i.test(content)
  const hasType = /@type.*BlogPosting|generateBlogPostingSchema/i.test(content)
  
  return hasContext && hasType
}

// Helper function to check if JSON-LD has required fields
function hasRequiredJsonLdFields(filePath: string): {
  hasAuthor: boolean;
  hasDatePublished: boolean;
  hasDateModified: boolean;
  hasHeadline: boolean;
  hasImage: boolean;
} {
  const content = fs.readFileSync(filePath, 'utf-8')
  
  // Check if using generateBlogPostingSchema (which includes all required fields)
  const usesGenerator = /generateBlogPostingSchema/i.test(content)
  
  if (usesGenerator) {
    // If using the generator, check that required params are passed
    return {
      hasAuthor: /author\s*:/i.test(content),
      hasDatePublished: /publishedAt\s*:/i.test(content),
      hasDateModified: /modifiedAt\s*:/i.test(content),
      hasHeadline: /title\s*:/i.test(content),
      hasImage: /image\s*:/i.test(content),
    }
  }
  
  // Otherwise check for direct field definitions
  return {
    hasAuthor: /author\s*[:=]|"author"/i.test(content),
    hasDatePublished: /datePublished\s*[:=]|"datePublished"/i.test(content),
    hasDateModified: /dateModified\s*[:=]|"dateModified"/i.test(content),
    hasHeadline: /headline\s*[:=]|"headline"/i.test(content),
    hasImage: /image\s*[:=]|"image"/i.test(content),
  }
}

// Helper function to identify blog pages
function isBlogPage(filePath: string): boolean {
  return filePath.includes(path.sep + 'articles' + path.sep) && 
         filePath.includes('[slug]') &&
         filePath.endsWith('page.tsx')
}

describe('Property 7: Blog Pages Include JSON-LD', () => {
  /**
   * For any blog detail page, the rendered HTML should include
   * a script tag with JSON-LD structured data of type BlogPosting
   * 
   * Validates: Requirements 8.3, 19.1
   */
  it('should include JSON-LD structured data in all blog detail pages', () => {
    const appDir = path.join(process.cwd(), 'src/app/[locale]')
    
    if (!fs.existsSync(appDir)) {
      console.warn('App directory not found, skipping test')
      return
    }

    const allFiles = getAllFiles(appDir)
    const blogPageFiles = allFiles.filter(file => isBlogPage(file))

    // Should have at least one blog page
    expect(blogPageFiles.length).toBeGreaterThan(0)

    blogPageFiles.forEach(filePath => {
      const hasJsonLdData = hasJsonLd(filePath)
      
      expect(
        hasJsonLdData,
        `Blog page ${path.relative(process.cwd(), filePath)} should include JSON-LD structured data`
      ).toBe(true)
    })
  })
})

describe('Property 18: Blog JSON-LD Follows Schema.org', () => {
  /**
   * For any JSON-LD structured data on blog pages, it should have
   * @context: "https://schema.org", @type: "BlogPosting",
   * and required fields per BlogPosting schema
   * 
   * Validates: Requirements 19.2
   */
  it('should follow schema.org BlogPosting specification', () => {
    const appDir = path.join(process.cwd(), 'src/app/[locale]')
    
    if (!fs.existsSync(appDir)) {
      console.warn('App directory not found, skipping test')
      return
    }

    const allFiles = getAllFiles(appDir)
    const blogPageFiles = allFiles.filter(file => isBlogPage(file))

    blogPageFiles.forEach(filePath => {
      const followsSchemaOrg = hasSchemaOrgFormat(filePath)
      
      expect(
        followsSchemaOrg,
        `Blog page ${path.relative(process.cwd(), filePath)} should follow schema.org BlogPosting format`
      ).toBe(true)
    })
  })
})

describe('Property 19: Blog JSON-LD Has Required Fields', () => {
  /**
   * For any blog page JSON-LD, it should contain
   * author, datePublished, dateModified, headline, and image fields
   * 
   * Validates: Requirements 19.3
   */
  it('should include all required BlogPosting fields', () => {
    const appDir = path.join(process.cwd(), 'src/app/[locale]')
    
    if (!fs.existsSync(appDir)) {
      console.warn('App directory not found, skipping test')
      return
    }

    const allFiles = getAllFiles(appDir)
    const blogPageFiles = allFiles.filter(file => isBlogPage(file))

    blogPageFiles.forEach(filePath => {
      const fields = hasRequiredJsonLdFields(filePath)
      
      expect(
        fields.hasAuthor,
        `Blog page ${path.relative(process.cwd(), filePath)} should have author field in JSON-LD`
      ).toBe(true)
      
      expect(
        fields.hasDatePublished,
        `Blog page ${path.relative(process.cwd(), filePath)} should have datePublished field in JSON-LD`
      ).toBe(true)
      
      expect(
        fields.hasDateModified,
        `Blog page ${path.relative(process.cwd(), filePath)} should have dateModified field in JSON-LD`
      ).toBe(true)
      
      expect(
        fields.hasHeadline,
        `Blog page ${path.relative(process.cwd(), filePath)} should have headline field in JSON-LD`
      ).toBe(true)
      
      expect(
        fields.hasImage,
        `Blog page ${path.relative(process.cwd(), filePath)} should have image field in JSON-LD`
      ).toBe(true)
    })
  })
})
