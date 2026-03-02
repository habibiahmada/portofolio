/**
 * Property-Based Tests for CSS Optimization
 * Feature: nextjs-performance-optimization
 */

import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

// Helper function to get all files in a directory recursively with exclusions
function getAllFiles(dirPath: string, arrayOfFiles: string[] = [], depth: number = 0): string[] {
  if (!fs.existsSync(dirPath)) return arrayOfFiles
  
  // Limit recursion depth to prevent excessive scanning
  if (depth > 10) return arrayOfFiles

  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    // Skip common directories that don't need scanning
    if (file === 'node_modules' || file === '.next' || file === '.git' || file === 'dist' || file === 'build') {
      return
    }
    
    const filePath = path.join(dirPath, file)
    try {
      const stat = fs.statSync(filePath)
      if (stat.isDirectory()) {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles, depth + 1)
      } else {
        arrayOfFiles.push(filePath)
      }
    } catch (err) {
      // Skip files that can't be accessed
      return
    }
  })

  return arrayOfFiles
}

describe('Property 34: Custom CSS Uses Modules', () => {
  /**
   * For any custom CSS file (non-Tailwind), it should use the .module.css extension for CSS Modules
   * 
   * Validates: Requirements 26.3
   */
  it('should use CSS modules for all custom CSS files', { timeout: 5000 }, () => {
    const srcDir = path.join(process.cwd(), 'src')
    
    if (!fs.existsSync(srcDir)) {
      console.warn('src directory not found, skipping test')
      return
    }

    const allFiles = getAllFiles(srcDir)
    const cssFiles = allFiles.filter(file => 
      file.endsWith('.css') && 
      !file.includes('node_modules') &&
      !file.includes('globals.css') // globals.css is allowed
    )

    // All custom CSS files should use .module.css extension
    const nonModuleCssFiles = cssFiles.filter(file => !file.endsWith('.module.css'))

    expect(
      nonModuleCssFiles,
      `Found custom CSS files not using CSS modules: ${nonModuleCssFiles.map(f => path.relative(process.cwd(), f)).join(', ')}. ` +
      `All custom CSS should use .module.css extension for proper scoping.`
    ).toHaveLength(0)
  })

  it('should import CSS modules correctly in components', { timeout: 5000 }, () => {
    const srcDir = path.join(process.cwd(), 'src')
    
    if (!fs.existsSync(srcDir)) {
      console.warn('src directory not found, skipping test')
      return
    }

    const allFiles = getAllFiles(srcDir)
    const moduleCssFiles = allFiles.filter(file => file.endsWith('.module.css'))

    // For each CSS module, check if it's imported correctly
    moduleCssFiles.forEach(cssFile => {
      const cssFileName = path.basename(cssFile, '.module.css')
      const componentDir = path.dirname(cssFile)
      
      // Find potential component files in the same directory
      const componentFiles = fs.readdirSync(componentDir).filter(file => 
        (file.endsWith('.tsx') || file.endsWith('.ts')) && 
        !file.includes('.test.')
      )

      // Check if at least one component imports this CSS module
      let isImported = false
      componentFiles.forEach(componentFile => {
        const componentPath = path.join(componentDir, componentFile)
        const content = fs.readFileSync(componentPath, 'utf-8')
        
        // Check for CSS module import pattern
        const importPattern = new RegExp(`import\\s+\\w+\\s+from\\s+['"]\\.\\/${cssFileName}\\.module\\.css['"]`)
        if (importPattern.test(content)) {
          isImported = true
        }
      })

      expect(
        isImported,
        `CSS module ${path.relative(process.cwd(), cssFile)} should be imported in a component`
      ).toBe(true)
    })
  })

  it('should use CSS module classes correctly in JSX', { timeout: 5000 }, () => {
    const srcDir = path.join(process.cwd(), 'src')
    
    if (!fs.existsSync(srcDir)) {
      console.warn('src directory not found, skipping test')
      return
    }

    const allFiles = getAllFiles(srcDir)
    const componentFiles = allFiles.filter(file => 
      file.endsWith('.tsx') && 
      !file.includes('.test.') &&
      !file.includes('node_modules')
    )

    componentFiles.forEach(componentFile => {
      const content = fs.readFileSync(componentFile, 'utf-8')
      
      // Check if component imports CSS module
      const cssModuleImport = /import\s+(\w+)\s+from\s+['"]\.\/[\w-]+\.module\.css['"]/
      const match = content.match(cssModuleImport)
      
      if (match) {
        const stylesVarName = match[1]
        
        // Check if the imported styles are used in className
        const usesStyles = new RegExp(`${stylesVarName}\\.\\w+`).test(content)
        
        expect(
          usesStyles,
          `Component ${path.relative(process.cwd(), componentFile)} imports CSS module but doesn't use it`
        ).toBe(true)
      }
    })
  })

  it('should not have direct CSS class names from custom CSS in components', { timeout: 5000 }, () => {
    const srcDir = path.join(process.cwd(), 'src')
    
    if (!fs.existsSync(srcDir)) {
      console.warn('src directory not found, skipping test')
      return
    }

    // Get all CSS module files and extract their class names
    const allFiles = getAllFiles(srcDir)
    const moduleCssFiles = allFiles.filter(file => file.endsWith('.module.css'))
    
    const customClassNames = new Set<string>()
    moduleCssFiles.forEach(cssFile => {
      const content = fs.readFileSync(cssFile, 'utf-8')
      
      // Extract class names (camelCase from CSS modules)
      const classMatches = content.matchAll(/\.(\w+)\s*{/g)
      for (const match of classMatches) {
        customClassNames.add(match[1])
      }
    })

    // Check component files for direct usage of these class names
    const componentFiles = allFiles.filter(file => 
      file.endsWith('.tsx') && 
      !file.includes('.test.') &&
      !file.includes('node_modules')
    )

    const violations: string[] = []
    componentFiles.forEach(componentFile => {
      const content = fs.readFileSync(componentFile, 'utf-8')
      
      // Skip if component properly imports CSS module
      if (/import\s+\w+\s+from\s+['"]\.\/[\w-]+\.module\.css['"]/.test(content)) {
        return
      }

      // Check for direct usage of custom class names
      customClassNames.forEach(className => {
        // Look for className="customClass" or className='customClass'
        const directUsagePattern = new RegExp(`className=["'](?:[^"']*\\s)?${className}(?:\\s[^"']*)?["']`)
        if (directUsagePattern.test(content)) {
          violations.push(`${path.relative(process.cwd(), componentFile)} uses "${className}" directly without CSS module import`)
        }
      })
    })

    expect(
      violations,
      `Found components using custom CSS classes directly without CSS modules: ${violations.join(', ')}`
    ).toHaveLength(0)
  })
})
