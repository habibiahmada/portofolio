#!/usr/bin/env node

/**
 * Baseline Measurement Script
 * 
 * This script helps measure baseline metrics for performance testing.
 * Run this script BEFORE optimization to establish baseline values.
 * 
 * Usage:
 *   pnpm tsx scripts/measure-baseline.ts
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

interface BaselineMetrics {
  timestamp: string;
  buildTime: number; // milliseconds
  bundleSize: {
    total: number; // KB
    initial: number; // KB
    css: number; // KB
  };
  diskSpace: {
    nodeModules: number; // MB
    packageManager: 'npm' | 'pnpm' | 'yarn';
  };
  memory: {
    devServer: number; // MB
  };
}

async function getDirectorySize(dirPath: string): Promise<number> {
  if (!fs.existsSync(dirPath)) {
    return 0;
  }

  try {
    const { stdout } = await execAsync(`du -sm "${dirPath}"`);
    const sizeMB = parseInt(stdout.split('\t')[0], 10);
    return sizeMB;
  } catch {
    // Fallback to manual calculation
    let totalSize = 0;

    function walkDir(dir: string) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        try {
          const stats = fs.statSync(filePath);
          if (stats.isDirectory()) {
            walkDir(filePath);
          } else {
            totalSize += stats.size;
          }
        } catch {
          // Skip files that can't be accessed
          continue;
        }
      }
    }

    walkDir(dirPath);
    return totalSize / (1024 * 1024);
  }
}

function detectPackageManager(): 'npm' | 'pnpm' | 'yarn' {
  if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
  if (fs.existsSync('yarn.lock')) return 'yarn';
  return 'npm';
}

async function measureBuildTime(): Promise<number> {
  console.log('Measuring build time...');
  console.log('Running: pnpm run build\n');

  const startTime = Date.now();
  
  try {
    await execAsync('pnpm run build', {
      maxBuffer: 10 * 1024 * 1024,
    });
    
    const buildTime = Date.now() - startTime;
    console.log(`✓ Build completed in ${(buildTime / 1000).toFixed(2)}s\n`);
    return buildTime;
  } catch {
    console.error('✗ Build failed');
    return 0;
  }
}

async function measureBundleSize(): Promise<{ total: number; initial: number; css: number }> {
  console.log('Measuring bundle size...');

  const buildDir = path.resolve(process.cwd(), '.next');
  
  if (!fs.existsSync(buildDir)) {
    console.log('✗ Build directory not found. Run build first.\n');
    return { total: 0, initial: 0, css: 0 };
  }

  // Measure JS bundle size
  const staticDir = path.join(buildDir, 'static/chunks');
  let totalSize = 0;
  let initialSize = 0;

  if (fs.existsSync(staticDir)) {
    const files = fs.readdirSync(staticDir, { recursive: true });
    
    for (const file of files) {
      if (typeof file === 'string' && file.endsWith('.js')) {
        const filePath = path.join(staticDir, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
        
        if (file.includes('main') || file.includes('webpack') || file.includes('framework')) {
          initialSize += stats.size;
        }
      }
    }
  }

  // Measure CSS bundle size
  const cssDir = path.join(buildDir, 'static/css');
  let cssSize = 0;

  if (fs.existsSync(cssDir)) {
    const files = fs.readdirSync(cssDir, { recursive: true });
    
    for (const file of files) {
      if (typeof file === 'string' && file.endsWith('.css')) {
        const filePath = path.join(cssDir, file);
        const stats = fs.statSync(filePath);
        cssSize += stats.size;
      }
    }
  }

  console.log(`✓ Total JS: ${(totalSize / 1024).toFixed(2)} KB`);
  console.log(`✓ Initial JS: ${(initialSize / 1024).toFixed(2)} KB`);
  console.log(`✓ Total CSS: ${(cssSize / 1024).toFixed(2)} KB\n`);

  return {
    total: totalSize / 1024,
    initial: initialSize / 1024,
    css: cssSize / 1024,
  };
}

async function measureDiskSpace(): Promise<{ nodeModules: number; packageManager: 'npm' | 'pnpm' | 'yarn' }> {
  console.log('Measuring disk space...');

  const nodeModulesPath = path.resolve(process.cwd(), 'node_modules');
  const packageManager = detectPackageManager();

  if (!fs.existsSync(nodeModulesPath)) {
    console.log('✗ node_modules not found. Run install first.\n');
    return { nodeModules: 0, packageManager };
  }

  const size = await getDirectorySize(nodeModulesPath);
  
  console.log(`✓ node_modules: ${size.toFixed(2)} MB`);
  console.log(`✓ Package manager: ${packageManager}\n`);

  return { nodeModules: size, packageManager };
}

async function measureMemory(): Promise<{ devServer: number }> {
  console.log('Measuring memory usage...');
  console.log('Note: Start dev server in another terminal to measure memory.\n');

  try {
    const { stdout } = await execAsync('ps aux | grep "next dev" | grep -v grep');
    const lines = stdout.trim().split('\n');
    
    if (lines.length === 0 || lines[0] === '') {
      console.log('✗ Dev server not running. Start with: pnpm run dev\n');
      return { devServer: 0 };
    }

    const firstLine = lines[0];
    const parts = firstLine.split(/\s+/);
    const pid = parseInt(parts[1], 10);

    const { stdout: memOutput } = await execAsync(`ps -p ${pid} -o rss=`);
    const memoryKB = parseInt(memOutput.trim(), 10);
    const memoryMB = memoryKB / 1024;

    console.log(`✓ Dev server memory: ${memoryMB.toFixed(2)} MB\n`);

    return { devServer: memoryMB };
  } catch {
    console.log('✗ Could not measure dev server memory.\n');
    return { devServer: 0 };
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('Performance Baseline Measurement');
  console.log('='.repeat(60));
  console.log('\nThis script measures baseline metrics for performance testing.');
  console.log('Run this BEFORE optimization to establish baseline values.\n');

  const metrics: BaselineMetrics = {
    timestamp: new Date().toISOString(),
    buildTime: 0,
    bundleSize: { total: 0, initial: 0, css: 0 },
    diskSpace: { nodeModules: 0, packageManager: 'npm' },
    memory: { devServer: 0 },
  };

  // Measure disk space (doesn't require build)
  metrics.diskSpace = await measureDiskSpace();

  // Measure build time and bundle size
  metrics.buildTime = await measureBuildTime();
  metrics.bundleSize = await measureBundleSize();

  // Measure memory (optional, requires dev server)
  metrics.memory = await measureMemory();

  // Save baseline
  const baselinePath = path.resolve(process.cwd(), 'performance-baseline.json');
  fs.writeFileSync(baselinePath, JSON.stringify(metrics, null, 2));

  console.log('='.repeat(60));
  console.log('Baseline Metrics Summary');
  console.log('='.repeat(60));
  console.log(`\nTimestamp: ${metrics.timestamp}`);
  console.log(`\nBuild Time: ${(metrics.buildTime / 1000).toFixed(2)}s`);
  console.log(`\nBundle Size:`);
  console.log(`  Total JS: ${metrics.bundleSize.total.toFixed(2)} KB`);
  console.log(`  Initial JS: ${metrics.bundleSize.initial.toFixed(2)} KB`);
  console.log(`  Total CSS: ${metrics.bundleSize.css.toFixed(2)} KB`);
  console.log(`\nDisk Space:`);
  console.log(`  node_modules: ${metrics.diskSpace.nodeModules.toFixed(2)} MB`);
  console.log(`  Package Manager: ${metrics.diskSpace.packageManager}`);
  console.log(`\nMemory:`);
  console.log(`  Dev Server: ${metrics.memory.devServer.toFixed(2)} MB`);
  console.log(`\nBaseline saved to: ${baselinePath}`);
  console.log('\nNext steps:');
  console.log('1. Update test files with these baseline values');
  console.log('2. Apply optimizations');
  console.log('3. Run performance tests to verify improvements');
  console.log('='.repeat(60));
}

main().catch(() => {
  process.exit(1);
});
