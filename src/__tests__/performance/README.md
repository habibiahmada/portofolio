# Performance Testing Suite

This directory contains comprehensive performance tests for the Next.js portfolio application optimization project.

## Overview

The performance testing suite validates that all optimization requirements are met:

- **Build Time**: Build completes within 50% of baseline
- **Bundle Size**: Total bundle reduced by 20%+, initial bundle by 30%+
- **Memory Footprint**: Dev server stays under 4GB, stable over 2+ hours
- **Lighthouse Scores**: Performance ≥90, SEO ≥95, Accessibility ≥90, Best Practices ≥90
- **Disk Space**: pnpm reduces disk usage by 30%+

## Test Files

### 1. build-time.test.ts
Tests build performance and completion time.

**Requirements Validated**: 6.4

**Tests**:
- Build completes within 50% of baseline time
- Build manifest is generated
- Static pages are generated

**Usage**:
```bash
# Run build time test
pnpm test build-time.test.ts

# Skip in CI
SKIP_BUILD_TEST=true pnpm test build-time.test.ts
```

### 2. bundle-size.test.ts
Tests bundle size reduction and code splitting.

**Requirements Validated**: 7.4, 14.5

**Tests**:
- Total bundle size reduced by 20%+
- Initial bundle reduced by 30%+ after dynamic imports
- Separate chunks for dynamic imports
- CSS bundle under 50KB
- Bundle analysis data generation

**Usage**:
```bash
# Run bundle size tests (requires build first)
pnpm run build
pnpm test bundle-size.test.ts

# Generate bundle analysis
pnpm run analyze
```

### 3. memory-footprint.test.ts
Tests memory usage and stability.

**Requirements Validated**: 5.5, 25.5

**Tests**:
- Dev server memory under 4GB
- Memory stability over 2+ hours
- Memory leak prevention
- Hot reload resource cleanup
- File watcher exclusions

**Usage**:
```bash
# Run memory tests (requires dev server running)
pnpm run dev  # In another terminal
pnpm test memory-footprint.test.ts

# Run long-running stability test (2+ hours)
LONG_RUNNING_TEST=true pnpm test memory-footprint.test.ts
```

### 4. lighthouse.test.ts
Tests Lighthouse performance scores.

**Requirements Validated**: 11.2, 11.3

**Tests**:
- Performance score ≥90
- SEO score ≥95
- Accessibility score ≥90
- Best Practices score ≥90
- First Contentful Paint < 1.8s
- Largest Contentful Paint < 2.5s
- Total Blocking Time < 200ms
- Cumulative Layout Shift < 0.1

**Usage**:
```bash
# Option 1: Run Lighthouse manually first
pnpm run build && pnpm run start  # In another terminal
npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json
pnpm test lighthouse.test.ts

# Option 2: Let test run Lighthouse
pnpm run build && pnpm run start  # In another terminal
LIGHTHOUSE_URL=http://localhost:3000 pnpm test lighthouse.test.ts
```

### 5. disk-space.test.ts
Tests disk space usage with pnpm.

**Requirements Validated**: 16.3

**Tests**:
- pnpm is used as package manager
- Disk usage reduced by 30%+ vs npm
- .pnpm store directory exists
- .npmrc configuration exists
- Symlinks are used for dependencies
- Build cache size is reasonable

**Usage**:
```bash
# Run disk space tests
pnpm install  # Ensure dependencies are installed
pnpm test disk-space.test.ts
```

## Running All Performance Tests

```bash
# Run all performance tests
pnpm test src/__tests__/performance/

# Run specific test file
pnpm test build-time.test.ts
pnpm test bundle-size.test.ts
pnpm test memory-footprint.test.ts
pnpm test lighthouse.test.ts
pnpm test disk-space.test.ts
```

## Test Configuration

### Baseline Values

The tests use baseline values that should be adjusted based on your pre-optimization measurements:

**build-time.test.ts**:
- `BASELINE_BUILD_TIME_MS`: 120000 (2 minutes)

**bundle-size.test.ts**:
- `BASELINE_TOTAL_BUNDLE_KB`: 1000 (1MB)
- `BASELINE_INITIAL_BUNDLE_KB`: 500 (500KB)

**disk-space.test.ts**:
- `BASELINE_NPM_DISK_MB`: 500 (500MB)

### Environment Variables

- `SKIP_BUILD_TEST`: Skip build time test (useful in CI)
- `LONG_RUNNING_TEST`: Enable 2+ hour memory stability test
- `LIGHTHOUSE_URL`: URL to test with Lighthouse

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Performance Tests

on: [push, pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run build time test
        run: pnpm test build-time.test.ts
      
      - name: Run bundle size test
        run: pnpm test bundle-size.test.ts
      
      - name: Run disk space test
        run: pnpm test disk-space.test.ts
      
      - name: Build for production
        run: pnpm run build
      
      - name: Start server
        run: pnpm run start &
        
      - name: Wait for server
        run: sleep 10
      
      - name: Run Lighthouse test
        run: LIGHTHOUSE_URL=http://localhost:3000 pnpm test lighthouse.test.ts
```

## Interpreting Results

### Build Time
- **Target**: 50% faster than baseline
- **Good**: Build completes in under 1 minute
- **Action**: If failing, check for unnecessary dependencies or build steps

### Bundle Size
- **Target**: 20% total reduction, 30% initial reduction
- **Good**: Total bundle < 500KB, initial < 200KB
- **Action**: If failing, check for missing dynamic imports or large dependencies

### Memory Footprint
- **Target**: Under 4GB, stable over time
- **Good**: Under 2GB, < 5% increase over 2 hours
- **Action**: If failing, check for memory leaks in event listeners or timers

### Lighthouse Scores
- **Target**: Performance ≥90, SEO ≥95, Accessibility ≥90, Best Practices ≥90
- **Good**: All scores ≥95
- **Action**: If failing, check specific audit failures in Lighthouse report

### Disk Space
- **Target**: 30% reduction vs npm
- **Good**: node_modules < 300MB
- **Action**: If failing, verify pnpm is configured correctly

## Troubleshooting

### Build Time Test Fails
- Ensure no other processes are consuming CPU
- Check if Turbopack is enabled (may affect build time)
- Verify all optimizations are applied

### Bundle Size Test Fails
- Run `pnpm run analyze` to see bundle composition
- Check if dynamic imports are working
- Verify tree-shaking is enabled

### Memory Test Fails
- Check for memory leaks in components
- Verify file watcher exclusions are configured
- Monitor memory over time with `ps` or Activity Monitor

### Lighthouse Test Fails
- Ensure production build is used
- Check network conditions (use throttling)
- Review specific audit failures in report

### Disk Space Test Fails
- Verify pnpm-lock.yaml exists
- Check .npmrc configuration
- Ensure pnpm store is being used

## Performance Monitoring

### Continuous Monitoring

Set up performance monitoring in your CI/CD pipeline:

1. Run performance tests on every PR
2. Store baseline metrics
3. Compare against baseline
4. Fail if regression detected

### Performance Budgets

Define performance budgets in your project:

```json
{
  "budgets": {
    "buildTime": "60s",
    "bundleSize": "500KB",
    "initialBundle": "200KB",
    "memory": "2GB",
    "lighthouse": {
      "performance": 90,
      "seo": 95,
      "accessibility": 90,
      "bestPractices": 90
    }
  }
}
```

## Related Documentation

- [Performance Monitor Library](../../lib/performance/monitor.ts)
- [Performance Check Script](../../../scripts/performance-check.ts)
- [Build Cache Documentation](../../../docs/BUILD_CACHE.md)
- [Configuration Documentation](../../../docs/CONFIGURATION.md)

## Contributing

When adding new performance tests:

1. Follow the existing test structure
2. Include clear documentation
3. Reference specific requirements
4. Add usage examples
5. Update this README
