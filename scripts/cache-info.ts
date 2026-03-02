#!/usr/bin/env tsx
/**
 * Build Cache Information Script
 * 
 * This script provides information about the Next.js build cache
 * and helps verify cache invalidation behavior.
 */

import { existsSync, statSync, readdirSync } from 'fs';
import { join } from 'path';

const CACHE_DIR = '.next/cache';
const NEXT_DIR = '.next';

interface CacheStats {
  exists: boolean;
  size?: number;
  files?: number;
  subdirectories?: string[];
  lastModified?: Date;
}

function getDirectorySize(dirPath: string): number {
  let totalSize = 0;

  try {
    const files = readdirSync(dirPath, { withFileTypes: true });

    for (const file of files) {
      const filePath = join(dirPath, file.name);

      if (file.isDirectory()) {
        totalSize += getDirectorySize(filePath);
      } else {
        const stats = statSync(filePath);
        totalSize += stats.size;
      }
    }
  } catch (error) {
    // Ignore errors for inaccessible directories
  }

  return totalSize;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function getCacheStats(): CacheStats {
  if (!existsSync(CACHE_DIR)) {
    return { exists: false };
  }

  const stats = statSync(CACHE_DIR);
  const size = getDirectorySize(CACHE_DIR);
  const subdirectories = readdirSync(CACHE_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  return {
    exists: true,
    size,
    subdirectories,
    lastModified: stats.mtime,
  };
}

function countFiles(dirPath: string): number {
  let count = 0;

  try {
    const files = readdirSync(dirPath, { withFileTypes: true });

    for (const file of files) {
      const filePath = join(dirPath, file.name);

      if (file.isDirectory()) {
        count += countFiles(filePath);
      } else {
        count++;
      }
    }
  } catch (error) {
    // Ignore errors
  }

  return count;
}

function main() {
  console.log('=== Next.js Build Cache Information ===\n');

  // Check if .next directory exists
  if (!existsSync(NEXT_DIR)) {
    console.log('❌ .next directory does not exist');
    console.log('   Run "pnpm build" to create it\n');
    return;
  }

  console.log('✅ .next directory exists\n');

  // Get cache stats
  const cacheStats = getCacheStats();

  if (!cacheStats.exists) {
    console.log('❌ Build cache directory does not exist');
    console.log('   Cache will be created on next build\n');
    return;
  }

  console.log('✅ Build cache directory exists\n');

  // Display cache information
  console.log('Cache Location:', CACHE_DIR);
  console.log('Cache Size:', formatBytes(cacheStats.size || 0));
  console.log('Files Cached:', countFiles(CACHE_DIR));
  console.log('Last Modified:', cacheStats.lastModified?.toLocaleString());
  console.log('\nCache Subdirectories:');
  
  if (cacheStats.subdirectories && cacheStats.subdirectories.length > 0) {
    cacheStats.subdirectories.forEach(dir => {
      const dirPath = join(CACHE_DIR, dir);
      const dirSize = getDirectorySize(dirPath);
      const fileCount = countFiles(dirPath);
      console.log(`  - ${dir}: ${formatBytes(dirSize)} (${fileCount} files)`);
    });
  } else {
    console.log('  (none)');
  }

  console.log('\n=== Cache Invalidation Triggers ===\n');
  console.log('Cache is automatically invalidated when:');
  console.log('  ✓ Source files are modified');
  console.log('  ✓ Dependencies change (package.json, pnpm-lock.yaml)');
  console.log('  ✓ Configuration changes (next.config.ts)');
  console.log('  ✓ Environment variables change (.env files)');
  console.log('  ✓ Build target changes (dev vs production)');

  console.log('\n=== Manual Cache Management ===\n');
  console.log('Clear cache:        pnpm clean:cache');
  console.log('Clear all builds:   pnpm clean');
  console.log('Clean build:        pnpm clean:build');

  console.log('\n=== Cache Performance ===\n');
  console.log('To measure cache effectiveness:');
  console.log('  1. Clear cache: pnpm clean');
  console.log('  2. First build: time pnpm build');
  console.log('  3. Second build: time pnpm build');
  console.log('  → Second build should be 50-80% faster\n');
}

main();
