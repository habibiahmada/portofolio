# Next.js Build Cache Documentation

## Overview

Next.js automatically caches build outputs to speed up subsequent builds. This document explains how the build cache works and how to manage it effectively.

## Cache Location

The build cache is stored in the `.next/cache` directory. This directory contains:

- **webpack/**: Webpack compilation cache
- **swc/**: SWC compilation cache (for TypeScript/JavaScript transformation)
- **fetch-cache/**: Cached fetch responses from build-time data fetching
- **images/**: Optimized image cache

## Cache Behavior

### Automatic Caching

Next.js automatically caches:
- Compiled pages and components
- Static assets and optimizations
- Build-time fetch responses
- Image optimizations

### Cache Reuse

The build process reuses cached results when:
- Source files haven't changed
- Dependencies haven't changed
- Configuration hasn't changed
- Environment variables haven't changed

### Cache Invalidation

The cache is automatically invalidated when:
- Source files are modified
- Dependencies are added, removed, or updated (package.json changes)
- Next.js configuration changes (next.config.ts)
- Environment variables change
- Build target changes (development vs production)

## Cache Management

### Viewing Cache

To check if the cache directory exists:
```bash
ls -la .next/cache
```

### Clearing Cache

To clear the build cache manually:
```bash
# Remove the entire .next directory
rm -rf .next

# Or just the cache subdirectory
rm -rf .next/cache

# Using npm scripts
pnpm clean        # Remove entire .next directory
pnpm clean:cache  # Remove only cache subdirectory
pnpm clean:build  # Clean and rebuild
```

### Build Commands

```bash
# Normal build (uses cache)
pnpm build

# Clean build (no cache)
rm -rf .next && pnpm build
```

## Performance Impact

### With Cache
- Subsequent builds are 50-80% faster
- Only changed files are recompiled
- Unchanged pages reuse previous build outputs

### Without Cache
- Full compilation of all files
- All optimizations run from scratch
- Significantly longer build times

## Best Practices

1. **Keep Cache in CI/CD**: Configure your CI/CD pipeline to cache the `.next/cache` directory between builds
2. **Clear on Major Changes**: Clear cache after major dependency updates or Next.js version upgrades
3. **Monitor Cache Size**: The cache directory can grow large; consider periodic cleanup in long-running projects
4. **Don't Commit Cache**: The `.next` directory (including cache) is in `.gitignore` and should never be committed

## Troubleshooting

### Build Issues After Updates

If you experience build issues after updating dependencies:
```bash
rm -rf .next node_modules
pnpm install
pnpm build
```

### Stale Cache Symptoms

Signs that cache might be stale:
- Build outputs don't reflect recent code changes
- Unexpected build errors
- Missing or outdated static files

**Solution**: Clear the cache and rebuild:
```bash
rm -rf .next
pnpm build
```

### Cache Not Working

If builds are always slow:
1. Check that `.next/cache` directory is being created
2. Verify file permissions allow writing to `.next/cache`
3. Check disk space availability
4. Ensure no antivirus software is blocking cache writes

## Configuration

### Current Configuration

The build cache is enabled by default in Next.js. Our configuration in `next.config.ts` supports optimal caching:

- **Development mode**: Fast refresh with minimal optimizations
- **Production mode**: Full optimizations with aggressive caching
- **Incremental builds**: Only changed files are recompiled

### Cache Invalidation Strategy

Our cache invalidation strategy:

1. **Dependency Changes**: Detected via `package.json` and `pnpm-lock.yaml` changes
2. **Source Changes**: Detected via file modification timestamps
3. **Config Changes**: Detected via `next.config.ts` modifications
4. **Environment Changes**: Detected via `.env` file changes

## Monitoring

To monitor cache effectiveness:

```bash
# First build (no cache)
time pnpm build

# Second build (with cache)
time pnpm build
```

The second build should be significantly faster if caching is working properly.

## Related Documentation

- [Next.js Caching Documentation](https://nextjs.org/docs/app/building-your-application/caching)
- [Build Optimization Guide](./CONFIGURATION.md)
- [Performance Monitoring](../scripts/performance-check.ts)
