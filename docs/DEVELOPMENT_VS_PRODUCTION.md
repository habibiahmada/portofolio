# Development vs Production Configuration

This document explains the differences between development and production configurations in the Next.js portfolio application, along with the optimization trade-offs for each environment.

## Overview

The application uses different configurations for development and production environments to optimize for different goals:

- **Development**: Fast feedback loop, quick hot reload, easier debugging
- **Production**: Maximum performance, smallest bundle size, optimal user experience

## Configuration Differences

### 1. Build Optimizations

#### Development
```typescript
// next.config.ts (development)
{
  swcMinify: false,           // Disabled for faster builds
  compress: false,            // No compression for faster serving
  productionBrowserSourceMaps: true,  // Source maps for debugging
}
```

**Trade-offs:**
- ✅ Faster build times (50-70% faster)
- ✅ Easier debugging with source maps
- ✅ Faster hot reload
- ❌ Larger bundle sizes
- ❌ Slower page loads

#### Production
```typescript
// next.config.ts (production)
{
  swcMinify: true,            // Minification enabled
  compress: true,             // Gzip compression enabled
  productionBrowserSourceMaps: false,  // No source maps
}
```

**Trade-offs:**
- ✅ Smallest possible bundle size (20-30% reduction)
- ✅ Fastest page loads
- ✅ Better SEO scores
- ❌ Slower build times
- ❌ Harder to debug production issues

### 2. Image Optimization

#### Development
```typescript
{
  images: {
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  }
}
```

**Trade-offs:**
- ✅ Realistic image loading behavior
- ✅ Catches image optimization issues early
- ❌ Slower initial image loads in dev

#### Production
```typescript
{
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  }
}
```

**Trade-offs:**
- ✅ Modern image formats (WebP, AVIF)
- ✅ Optimal caching strategy
- ✅ Multiple device sizes for responsive images
- ❌ More complex image pipeline

### 3. File Watching

#### Development
```typescript
{
  watchOptions: {
    ignored: [
      '**/node_modules/**',
      '**/.next/**',
      '**/.git/**',
      '**/dist/**',
      '**/build/**',
    ],
  }
}
```

**Trade-offs:**
- ✅ Reduced memory footprint (saves ~500MB-1GB)
- ✅ Faster file system operations
- ✅ More stable dev server
- ❌ Won't detect changes in ignored directories

#### Production
File watching is not used in production builds.

### 4. Caching Strategy

#### Development
```typescript
// Minimal caching for fresh data
export const revalidate = 0;  // No caching in dev
```

**Trade-offs:**
- ✅ Always see latest changes
- ✅ No stale data issues
- ❌ Slower page loads
- ❌ More database queries

#### Production
```typescript
// Aggressive caching for performance
export const revalidate = 180;  // 3 minutes for ISR
// Static pages cached indefinitely
```

**Trade-offs:**
- ✅ Fastest possible page loads
- ✅ Reduced database load
- ✅ Better scalability
- ❌ Potential stale data (mitigated by ISR)

### 5. Bundle Analysis

#### Development
```bash
# Bundle analyzer disabled by default
ANALYZE=false npm run dev
```

**Trade-offs:**
- ✅ Faster dev server startup
- ✅ Less memory usage
- ❌ Can't analyze bundle in dev mode

#### Production
```bash
# Bundle analyzer available on demand
ANALYZE=true npm run build
```

**Trade-offs:**
- ✅ Detailed bundle analysis
- ✅ Identify optimization opportunities
- ❌ Slower build when enabled

### 6. Error Handling

#### Development
```typescript
// Detailed error messages
if (process.env.NODE_ENV === 'development') {
  console.error('Detailed error:', error.stack);
}
```

**Trade-offs:**
- ✅ Easier debugging
- ✅ Full stack traces
- ❌ Exposes internal details

#### Production
```typescript
// Generic error messages
if (process.env.NODE_ENV === 'production') {
  console.error('Error occurred');
  // Log to monitoring service
}
```

**Trade-offs:**
- ✅ Security (no internal details exposed)
- ✅ Better user experience
- ❌ Harder to debug production issues

## Environment Variables

### Development (.env.local)
```bash
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
ANALYZE=false
```

### Production (.env.production)
```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://yourdomain.com
ANALYZE=false
```

## Memory Usage Comparison

| Environment | Dev Server | Build Process | Runtime |
|------------|-----------|---------------|---------|
| Development | 2-4 GB | N/A | N/A |
| Production | N/A | 4-6 GB | 512 MB - 1 GB |

## Build Time Comparison

| Environment | Initial Build | Incremental Build |
|------------|---------------|-------------------|
| Development | 10-20s | 1-3s (hot reload) |
| Production | 60-120s | 60-120s (full rebuild) |

## Recommendations

### For Development
1. **Use pnpm** for faster installs and less disk space
2. **Disable Turbopack** if experiencing stability issues
3. **Exclude unnecessary directories** from file watching
4. **Use source maps** for easier debugging
5. **Keep dev server running** to benefit from hot reload

### For Production
1. **Enable all optimizations** (minification, compression, tree-shaking)
2. **Use ISR** for dynamic content (60-300s revalidate)
3. **Generate static pages** at build time where possible
4. **Monitor bundle size** regularly with analyzer
5. **Test production build locally** before deploying

## Switching Between Environments

### Development
```bash
pnpm dev
```

### Production Build
```bash
pnpm build
pnpm start
```

### Production Build with Analysis
```bash
ANALYZE=true pnpm build
```

## Common Issues

### Development Server Out of Memory
**Solution:** Increase Node.js memory limit
```bash
NODE_OPTIONS="--max-old-space-size=4096" pnpm dev
```

### Slow Hot Reload
**Solution:** Reduce watched files
```typescript
// next.config.ts
watchOptions: {
  ignored: ['**/node_modules/**', '**/.next/**']
}
```

### Production Build Fails
**Solution:** Check for development-only code
```typescript
// Remove or guard development-only imports
if (process.env.NODE_ENV === 'development') {
  // Development-only code
}
```

## Performance Metrics

### Development Goals
- Dev server startup: < 20 seconds
- Hot reload: < 3 seconds
- Memory usage: < 4 GB

### Production Goals
- Build time: < 2 minutes
- Lighthouse Performance: ≥ 90
- Lighthouse SEO: ≥ 95
- Bundle size reduction: ≥ 20% from baseline

## Related Documentation

- [Performance Monitoring](./PERFORMANCE_MONITORING.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Build Cache](./BUILD_CACHE.md)
- [Configuration](./CONFIGURATION.md)
