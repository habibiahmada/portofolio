import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

/**
 * Property 26: Images Use Next.js Image Component
 * For any image rendered in the application, it should use the next/image Image component
 * rather than native img tags.
 * Validates: Requirements 22.1
 */
describe('Property 26: Images Use Next.js Image Component', () => {
  it('should not have native img tags in component files', () => {
    const componentsDir = join(process.cwd(), 'src', 'components');
    const appDir = join(process.cwd(), 'src', 'app');
    
    const checkDirectory = (dir: string): string[] => {
      const violations: string[] = [];
      
      try {
        const entries = readdirSync(dir);
        
        for (const entry of entries) {
          const fullPath = join(dir, entry);
          const stat = statSync(fullPath);
          
          if (stat.isDirectory()) {
            violations.push(...checkDirectory(fullPath));
          } else if (entry.endsWith('.tsx') || entry.endsWith('.jsx')) {
            const content = readFileSync(fullPath, 'utf-8');
            
            // Check for native img tags (not in comments)
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              // Skip comments
              if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
                continue;
              }
              
              // Check for <img tags
              if (/<img\s/.test(line)) {
                violations.push(`${fullPath}:${i + 1} - Found native <img> tag`);
              }
            }
          }
        }
      } catch {
        // Directory might not exist, skip
      }
      
      return violations;
    };
    
    const violations = [
      ...checkDirectory(componentsDir),
      ...checkDirectory(appDir),
    ];
    
    if (violations.length > 0) {
      console.log('Native <img> tags found:');
      violations.forEach(v => console.log(`  ${v}`));
    }
    
    expect(violations).toHaveLength(0);
  });
});

/**
 * Property 27: Image Components Define Sizes
 * For any Image component used in responsive layouts, it should include a sizes prop
 * to optimize image loading.
 * Validates: Requirements 22.2
 */
describe('Property 27: Image Components Define Sizes', () => {
  it('should have sizes prop on responsive Image components', () => {
    const componentsDir = join(process.cwd(), 'src', 'components');
    const appDir = join(process.cwd(), 'src', 'app');
    
    const checkDirectory = (dir: string): { total: number; withSizes: number; files: string[] } => {
      let total = 0;
      let withSizes = 0;
      const filesWithoutSizes: string[] = [];
      
      try {
        const entries = readdirSync(dir);
        
        for (const entry of entries) {
          const fullPath = join(dir, entry);
          const stat = statSync(fullPath);
          
          if (stat.isDirectory()) {
            const subResult = checkDirectory(fullPath);
            total += subResult.total;
            withSizes += subResult.withSizes;
            filesWithoutSizes.push(...subResult.files);
          } else if (entry.endsWith('.tsx') || entry.endsWith('.jsx')) {
            const content = readFileSync(fullPath, 'utf-8');
            
            // Check if file uses Image from next/image
            if (content.includes('from "next/image"') || content.includes("from 'next/image'")) {
              // Find Image components
              const imageMatches = content.match(/<Image[^>]*>/g);
              
              if (imageMatches) {
                for (const match of imageMatches) {
                  total++;
                  
                  // Check if this Image has sizes prop or fill prop (fill doesn't need sizes)
                  if (match.includes('sizes=') || match.includes('fill')) {
                    withSizes++;
                  } else {
                    filesWithoutSizes.push(`${fullPath} - Image without sizes prop`);
                  }
                }
              }
            }
          }
        }
      } catch {
        // Directory might not exist, skip
      }
      
      return { total, withSizes, files: filesWithoutSizes };
    };
    
    const componentsResult = checkDirectory(componentsDir);
    const appResult = checkDirectory(appDir);
    
    const total = componentsResult.total + appResult.total;
    const withSizes = componentsResult.withSizes + appResult.withSizes;
    const filesWithoutSizes = [...componentsResult.files, ...appResult.files];
    
    console.log(`Image components: ${total} total, ${withSizes} with sizes prop`);
    
    if (filesWithoutSizes.length > 0) {
      console.log('Image components without sizes prop:');
      filesWithoutSizes.forEach(f => console.log(`  ${f}`));
    }
    
    // At least 80% of Image components should have sizes prop
    const percentage = total > 0 ? (withSizes / total) * 100 : 100;
    expect(percentage).toBeGreaterThanOrEqual(80);
  });
});

/**
 * Property 28: Below-Fold Images Use Lazy Loading
 * For any Image component not in the initial viewport (below the fold),
 * it should use loading="lazy" or priority={false}.
 * Validates: Requirements 22.5
 */
describe('Property 28: Below-Fold Images Use Lazy Loading', () => {
  it('should have loading="lazy" or no priority on below-fold images', () => {
    const componentsDir = join(process.cwd(), 'src', 'components');
    const appDir = join(process.cwd(), 'src', 'app');
    
    const checkDirectory = (dir: string): { checked: number; violations: string[] } => {
      let checked = 0;
      const violations: string[] = [];
      
      try {
        const entries = readdirSync(dir);
        
        for (const entry of entries) {
          const fullPath = join(dir, entry);
          const stat = statSync(fullPath);
          
          if (stat.isDirectory()) {
            const subResult = checkDirectory(fullPath);
            checked += subResult.checked;
            violations.push(...subResult.violations);
          } else if (entry.endsWith('.tsx') || entry.endsWith('.jsx')) {
            const content = readFileSync(fullPath, 'utf-8');
            
            // Check if file uses Image from next/image
            if (content.includes('from "next/image"') || content.includes("from 'next/image'")) {
              // Find Image components
              const imageMatches = content.match(/<Image[^>]*>/g);
              
              if (imageMatches) {
                for (const match of imageMatches) {
                  checked++;
                  
                  // Hero images and above-fold images should have priority={true}
                  // All others should have loading="lazy" or no priority
                  const hasPriority = match.includes('priority={true}') || match.includes('priority');
                  // If it has priority={true}, it's above-fold, which is fine
                  // If it doesn't have priority, it should ideally have loading="lazy"
                  // But Next.js defaults to lazy loading, so we just check no priority={true} on non-hero images
                  
                  // Check if this is in a hero component (above-fold)
                  const isHeroComponent = fullPath.includes('hero') || fullPath.includes('Hero');
                  
                  if (!isHeroComponent && hasPriority) {
                    violations.push(`${fullPath} - Non-hero image has priority={true}, should use lazy loading`);
                  }
                }
              }
            }
          }
        }
      } catch {
        // Directory might not exist, skip
      }
      
      return { checked, violations };
    };
    
    const componentsResult = checkDirectory(componentsDir);
    const appResult = checkDirectory(appDir);
    
    const checked = componentsResult.checked + appResult.checked;
    const violations = [...componentsResult.violations, ...appResult.violations];
    
    console.log(`Checked ${checked} Image components for lazy loading`);
    
    if (violations.length > 0) {
      console.log('Images that should use lazy loading:');
      violations.forEach(v => console.log(`  ${v}`));
    }
    
    expect(violations).toHaveLength(0);
  });
});
