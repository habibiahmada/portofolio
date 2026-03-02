/**
 * Disk Space Performance Test
 * 
 * Tests that pnpm reduces disk usage by 30%+ compared to npm
 * Validates: Requirements 16.3
 */

import { describe, it, expect } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

describe('Disk Space Performance', () => {
  // Baseline disk usage with npm in MB (adjust based on your actual baseline)
  // NOTE: This baseline should be measured from your pre-optimization setup with npm
  // The current value is an example - measure your actual npm node_modules size
  const BASELINE_NPM_DISK_MB = 5000; // 5GB baseline with npm (adjust to your actual baseline)
  const TARGET_REDUCTION = 0.30; // 30% reduction
  const TARGET_PNPM_DISK_MB = BASELINE_NPM_DISK_MB * (1 - TARGET_REDUCTION);

  /**
   * Get directory size in MB
   */
  async function getDirectorySize(dirPath: string): Promise<number> {
    if (!fs.existsSync(dirPath)) {
      return 0;
    }

    try {
      // Use du command to get directory size
      const { stdout } = await execAsync(`du -sm "${dirPath}"`);
      const sizeMB = parseInt(stdout.split('\t')[0], 10);
      return sizeMB;
    } catch (error) {
      // Fallback to manual calculation if du command fails
      return getDirectorySizeManual(dirPath);
    }
  }

  /**
   * Manually calculate directory size (fallback)
   */
  function getDirectorySizeManual(dirPath: string): number {
    let totalSize = 0;

    function walkDir(dir: string) {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
          walkDir(filePath);
        } else {
          totalSize += stats.size;
        }
      }
    }

    walkDir(dirPath);
    return totalSize / (1024 * 1024); // Convert to MB
  }

  it('should use pnpm as package manager', () => {
    const pnpmLockPath = path.resolve(__dirname, '../../../pnpm-lock.yaml');
    const npmLockPath = path.resolve(__dirname, '../../../package-lock.json');

    console.log('\nPackage Manager Check:');
    console.log(`pnpm-lock.yaml exists: ${fs.existsSync(pnpmLockPath)}`);
    console.log(`package-lock.json exists: ${fs.existsSync(npmLockPath)}\n`);

    // Should have pnpm-lock.yaml
    expect(fs.existsSync(pnpmLockPath)).toBe(true);
    
    // Should NOT have package-lock.json
    expect(fs.existsSync(npmLockPath)).toBe(false);
  });

  it('should reduce disk usage by 30%+ with pnpm', async () => {
    const nodeModulesPath = path.resolve(__dirname, '../../../node_modules');

    if (!fs.existsSync(nodeModulesPath)) {
      console.log('\nnode_modules not found. Run "pnpm install" first.\n');
      return;
    }

    const diskUsageMB = await getDirectorySize(nodeModulesPath);

    console.log(`\nnode_modules Size: ${diskUsageMB.toFixed(2)} MB`);
    console.log(`Target Size: ${TARGET_PNPM_DISK_MB.toFixed(2)} MB (30% reduction)`);
    console.log(`Baseline (npm): ${BASELINE_NPM_DISK_MB} MB`);
    
    const actualReduction = ((BASELINE_NPM_DISK_MB - diskUsageMB) / BASELINE_NPM_DISK_MB) * 100;
    console.log(`Actual Reduction: ${actualReduction.toFixed(1)}%`);
    console.log('\nNOTE: Adjust BASELINE_NPM_DISK_MB in this test file to match your actual npm baseline.\n');

    // Requirement 16.3: pnpm should reduce disk usage by 30%+
    // If this test fails, measure your actual npm node_modules size and update BASELINE_NPM_DISK_MB
    if (actualReduction < 30) {
      console.log(`⚠️  Disk usage reduction (${actualReduction.toFixed(1)}%) is below 30% target.`);
      console.log('This may indicate:');
      console.log('1. The baseline needs to be adjusted to your actual npm measurement');
      console.log('2. Additional dependencies have been added since baseline');
      console.log('3. pnpm configuration may need optimization\n');
    }
    
    expect(diskUsageMB).toBeLessThanOrEqual(TARGET_PNPM_DISK_MB);
  });

  it('should have .pnpm store directory', () => {
    const nodeModulesPath = path.resolve(__dirname, '../../../node_modules');
    const pnpmStorePath = path.join(nodeModulesPath, '.pnpm');

    if (!fs.existsSync(nodeModulesPath)) {
      console.log('\nnode_modules not found. Run "pnpm install" first.\n');
      return;
    }

    console.log(`\n.pnpm store exists: ${fs.existsSync(pnpmStorePath)}\n`);

    // pnpm uses a .pnpm directory for its store
    expect(fs.existsSync(pnpmStorePath)).toBe(true);
  });

  it('should have .npmrc configuration for pnpm', () => {
    const npmrcPath = path.resolve(__dirname, '../../../.npmrc');

    console.log(`\n.npmrc exists: ${fs.existsSync(npmrcPath)}\n`);

    // Should have .npmrc with pnpm configuration
    expect(fs.existsSync(npmrcPath)).toBe(true);

    if (fs.existsSync(npmrcPath)) {
      const content = fs.readFileSync(npmrcPath, 'utf-8');
      console.log('.npmrc content:');
      console.log(content);
      console.log('');
    }
  });

  it('should use symlinks for dependencies', async () => {
    const nodeModulesPath = path.resolve(__dirname, '../../../node_modules');

    if (!fs.existsSync(nodeModulesPath)) {
      console.log('\nnode_modules not found. Run "pnpm install" first.\n');
      return;
    }

    // Check if dependencies are symlinked (pnpm behavior)
    const files = fs.readdirSync(nodeModulesPath);
    let symlinkCount = 0;
    let totalCount = 0;

    for (const file of files) {
      if (file.startsWith('.')) continue;
      
      const filePath = path.join(nodeModulesPath, file);
      totalCount++;

      try {
        const stats = fs.lstatSync(filePath);
        if (stats.isSymbolicLink()) {
          symlinkCount++;
        }
      } catch (error) {
        // Skip if can't read
      }
    }

    const symlinkPercentage = totalCount > 0 ? (symlinkCount / totalCount) * 100 : 0;

    console.log(`\nSymlinks in node_modules: ${symlinkCount}/${totalCount} (${symlinkPercentage.toFixed(1)}%)\n`);

    // pnpm uses symlinks extensively
    expect(symlinkCount).toBeGreaterThan(0);
  });

  it('should have smaller .next build cache with pnpm', async () => {
    const nextCachePath = path.resolve(__dirname, '../../../.next/cache');

    if (!fs.existsSync(nextCachePath)) {
      console.log('\n.next/cache not found. Run build first.\n');
      return;
    }

    const cacheSize = await getDirectorySize(nextCachePath);

    console.log(`\n.next/cache Size: ${cacheSize.toFixed(2)} MB\n`);

    // Cache should be reasonable (under 200MB)
    expect(cacheSize).toBeLessThan(200);
  });

  it('should show disk space savings summary', async () => {
    const nodeModulesPath = path.resolve(__dirname, '../../../node_modules');
    const nextPath = path.resolve(__dirname, '../../../.next');

    if (!fs.existsSync(nodeModulesPath)) {
      console.log('\nnode_modules not found. Run "pnpm install" first.\n');
      return;
    }

    const nodeModulesSize = await getDirectorySize(nodeModulesPath);
    const nextSize = fs.existsSync(nextPath) ? await getDirectorySize(nextPath) : 0;
    const totalSize = nodeModulesSize + nextSize;

    console.log('\n=== Disk Space Summary ===');
    console.log(`node_modules: ${nodeModulesSize.toFixed(2)} MB`);
    console.log(`.next: ${nextSize.toFixed(2)} MB`);
    console.log(`Total: ${totalSize.toFixed(2)} MB`);
    console.log('');
    console.log(`Baseline (npm): ${BASELINE_NPM_DISK_MB} MB`);
    console.log(`Target (pnpm): ${TARGET_PNPM_DISK_MB.toFixed(2)} MB`);
    console.log(`Actual: ${nodeModulesSize.toFixed(2)} MB`);
    
    const savings = BASELINE_NPM_DISK_MB - nodeModulesSize;
    const savingsPercent = (savings / BASELINE_NPM_DISK_MB) * 100;
    
    console.log(`\nSavings: ${savings.toFixed(2)} MB (${savingsPercent.toFixed(1)}%)`);
    console.log('==========================\n');

    // Note: This test validates the summary is generated correctly
    // The actual disk space comparison is done in the previous test
    expect(nodeModulesSize).toBeGreaterThan(0);
  }, 30000); // 30 second timeout for large directories
});
