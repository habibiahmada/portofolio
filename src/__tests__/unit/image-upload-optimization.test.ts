import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Example 28: Image Upload Includes Optimization
 * Test that image upload API routes include optimization logic (Sharp, compression).
 * Validates: Requirements 22.4
 */
describe('Example 28: Image Upload Includes Optimization', () => {
  it('should have image optimization in upload/image route', () => {
    const routePath = join(process.cwd(), 'src', 'app', 'api', 'upload', 'image', 'route.ts');
    const content = readFileSync(routePath, 'utf-8');
    
    // Check for image-optimizer import
    expect(content).toContain('from "@/lib/image-optimizer"');
    
    // Check for optimizeImage function call
    expect(content).toContain('optimizeImage');
    
    // Check for optimization options
    expect(content).toMatch(/maxWidth|maxHeight|quality|format/);
    
    console.log('✓ Image upload route includes optimization logic');
  });
  
  it('should have image optimization in upload/avatar route', () => {
    const routePath = join(process.cwd(), 'src', 'app', 'api', 'upload', 'avatar', 'route.ts');
    const content = readFileSync(routePath, 'utf-8');
    
    // Check for image-optimizer import
    expect(content).toContain('from "@/lib/image-optimizer"');
    
    // Check for optimizeImage function call
    expect(content).toContain('optimizeImage');
    
    console.log('✓ Avatar upload route includes optimization logic');
  });
  
  it('should have image optimization in upload/company route', () => {
    const routePath = join(process.cwd(), 'src', 'app', 'api', 'upload', 'company', 'route.ts');
    const content = readFileSync(routePath, 'utf-8');
    
    // Check for image-optimizer import
    expect(content).toContain('from "@/lib/image-optimizer"');
    
    // Check for optimizeImage function call
    expect(content).toContain('optimizeImage');
    
    console.log('✓ Company upload route includes optimization logic');
  });
  
  it('should have image-optimizer utility with Sharp', () => {
    const utilPath = join(process.cwd(), 'src', 'lib', 'image-optimizer.ts');
    const content = readFileSync(utilPath, 'utf-8');
    
    // Check for Sharp import
    expect(content).toContain("import sharp from 'sharp'");
    
    // Check for optimization function
    expect(content).toContain('export async function optimizeImage');
    
    // Check for format conversion support
    expect(content).toMatch(/webp|avif|jpeg|png/);
    
    // Check for compression/quality settings
    expect(content).toContain('quality');
    
    // Check for resize logic
    expect(content).toContain('resize');
    
    console.log('✓ Image optimizer utility exists with Sharp and compression logic');
  });
});
