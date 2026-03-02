/**
 * Unit Tests for Bundle Analysis Configuration
 * 
 * These tests verify that bundle analysis is properly configured
 * according to requirements 6.3, 13.1, and 13.2
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Bundle Analysis Configuration', () => {
  /**
   * Example 12: Bundle Analyzer Configured
   * Validates: Requirements 6.3, 13.1
   * 
   * Verifies that @next/bundle-analyzer is in devDependencies
   * and configured in next.config.ts
   */
  it('should have @next/bundle-analyzer in devDependencies', () => {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    expect(packageJson.devDependencies).toBeDefined();
    expect(packageJson.devDependencies['@next/bundle-analyzer']).toBeDefined();
  });

  it('should configure bundle analyzer in next.config.ts', () => {
    const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
    const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf-8');

    // Check that bundle analyzer is imported
    expect(nextConfigContent).toContain('@next/bundle-analyzer');
    
    // Check that it's configured with ANALYZE environment variable
    expect(nextConfigContent).toContain('ANALYZE');
    
    // Check that withBundleAnalyzer is used in the export
    expect(nextConfigContent).toContain('withBundleAnalyzer');
  });

  /**
   * Example 17: Bundle Analysis Script Exists
   * Validates: Requirements 13.2
   * 
   * Verifies that package.json has a script command to run bundle analysis
   */
  it('should have analyze script in package.json', () => {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    expect(packageJson.scripts).toBeDefined();
    expect(packageJson.scripts.analyze).toBeDefined();
    
    // Verify the script sets ANALYZE=true and runs next build
    expect(packageJson.scripts.analyze).toContain('ANALYZE=true');
    expect(packageJson.scripts.analyze).toContain('next build');
  });

  it('should enable bundle analyzer only when ANALYZE is true', () => {
    const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
    const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf-8');

    // Check that bundle analyzer is conditionally enabled
    expect(nextConfigContent).toMatch(/enabled:\s*process\.env\.ANALYZE\s*===\s*['"]true['"]/);
  });
});
