# Performance Monitoring Guide

This document explains how to monitor and maintain optimal performance for the Next.js portfolio application.

## Overview

Performance monitoring is essential to prevent regressions and ensure the application maintains high standards for user experience and SEO. This guide covers:

1. Running Lighthouse audits
2. Running bundle analysis
3. Performance regression prevention workflow
4. Continuous monitoring strategies

## Lighthouse Audits

### What is Lighthouse?

Lighthouse is an automated tool for improving web page quality. It audits:
- **Performance**: Page load speed, interactivity, visual stability
- **SEO**: Search engine optimization best practices
- **Accessibility**: WCAG compliance and usability
- **Best Practices**: Security, modern web standards

### Running Lighthouse Audits

#### Method 1: Chrome DevTools (Recommended for Development)

1. Open your application in Chrome
2. Open DevTools (F12 or Ctrl+Shift+I)
3. Navigate to the "Lighthouse" tab
4. Select categories to audit:
   - ✅ Performance
   - ✅ SEO
   - ✅ Accessibility
   - ✅ Best Practices
5. Choose device: Mobile or Desktop
6. Click "Analyze page load"

#### Method 2: Lighthouse CI (Recommended for CI/CD)

Install Lighthouse CI:
```bash
pnpm add -D @lhci/cli
```

Create configuration file `lighthouserc.js`:
```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

Run Lighthouse CI:
```bash
# Start production build
pnpm build
pnpm start &

# Run Lighthouse CI
pnpm lhci autorun

# Stop the server
kill %1
```

#### Method 3: Lighthouse CLI

Install Lighthouse CLI:
```bash
pnpm add -D lighthouse
```

Run audit:
```bash
# Start production build
pnpm build
pnpm start &

# Run Lighthouse
pnpm lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html --preset desktop

# View report
start lighthouse-report.html  # Windows
open lighthouse-report.html   # macOS
xdg-open lighthouse-report.html  # Linux
```

### Performance Thresholds

The application must maintain these minimum scores:

| Category | Minimum Score | Target Score |
|----------|--------------|--------------|
| Performance | 90 | 95+ |
| SEO | 95 | 98+ |
| Accessibility | 90 | 95+ |
| Best Practices | 90 | 95+ |

### Key Metrics to Monitor

#### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s (Good)
- **FID (First Input Delay)**: < 100ms (Good)
- **CLS (Cumulative Layout Shift)**: < 0.1 (Good)

#### Other Important Metrics
- **FCP (First Contentful Paint)**: < 1.8s
- **TTI (Time to Interactive)**: < 3.8s
- **TBT (Total Blocking Time)**: < 200ms
- **Speed Index**: < 3.4s

### Interpreting Lighthouse Results

#### Performance Score Breakdown
- **0-49**: Poor (Red) - Immediate action required
- **50-89**: Needs Improvement (Orange) - Optimization recommended
- **90-100**: Good (Green) - Meets standards

#### Common Performance Issues

**Slow LCP:**
- Large images not optimized
- Render-blocking resources
- Slow server response time

**Solution:**
```typescript
// Use Next.js Image component with priority
<Image
  src="/hero-image.jpg"
  alt="Hero"
  priority
  width={1200}
  height={600}
/>
```

**High CLS:**
- Images without dimensions
- Dynamic content insertion
- Web fonts causing layout shift

**Solution:**
```typescript
// Always specify image dimensions
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
/>
```

**Long TBT:**
- Large JavaScript bundles
- Heavy computations on main thread
- Unoptimized third-party scripts

**Solution:**
```typescript
// Use dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false
});
```

## Bundle Analysis

### What is Bundle Analysis?

Bundle analysis helps you understand:
- Total bundle size
- Size per route/page
- Size per chunk
- Duplicate dependencies
- Largest modules

### Running Bundle Analysis

#### Setup

The bundle analyzer is already configured in `next.config.ts`:

```typescript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... other config
});
```

#### Run Analysis

```bash
# Analyze production bundle
ANALYZE=true pnpm build

# This will:
# 1. Build the production bundle
# 2. Generate analysis reports
# 3. Open interactive visualizations in browser
```

#### Understanding the Bundle Report

The analyzer opens three HTML reports:

1. **Client Bundle** (`client.html`)
   - JavaScript sent to browser
   - Most important for performance
   - Target: < 200 KB initial bundle

2. **Server Bundle** (`server.html`)
   - Server-side code
   - Less critical for client performance
   - Important for build time

3. **Edge Bundle** (`edge.html`)
   - Edge runtime code
   - Minimal size requirements

### Bundle Size Targets

| Bundle Type | Target Size | Maximum Size |
|------------|-------------|--------------|
| Initial JS | < 150 KB | 200 KB |
| Total JS | < 500 KB | 700 KB |
| CSS | < 50 KB | 75 KB |
| Images (per page) | < 500 KB | 1 MB |

### Analyzing Bundle Results

#### Identifying Large Dependencies

Look for:
- **Red/Orange blocks**: Largest modules
- **Duplicate modules**: Same library included multiple times
- **Unexpected dependencies**: Libraries you didn't intend to include

#### Common Bundle Bloat Issues

**Issue 1: Full Library Import**
```typescript
// ❌ Bad: Imports entire library
import _ from 'lodash';

// ✅ Good: Import specific functions
import { debounce, throttle } from 'lodash-es';
```

**Issue 2: Heavy Date Library**
```typescript
// ❌ Bad: moment.js is 200+ KB
import moment from 'moment';

// ✅ Good: dayjs is ~7 KB
import dayjs from 'dayjs';
```

**Issue 3: Unnecessary Polyfills**
```typescript
// Check browserslist in package.json
{
  "browserslist": [
    ">0.3%",
    "not dead",
    "not op_mini all"
  ]
}
```

### Bundle Optimization Strategies

#### 1. Dynamic Imports
```typescript
// Lazy load heavy components
const ChartComponent = dynamic(() => import('./Chart'), {
  loading: () => <Skeleton />,
  ssr: false
});
```

#### 2. Tree Shaking
```typescript
// Use ES modules for tree shaking
import { specific } from 'library-es';

// Avoid CommonJS
// const library = require('library'); // ❌
```

#### 3. Code Splitting
```typescript
// Next.js automatically splits by route
// Additional splitting with dynamic imports
const Modal = dynamic(() => import('./Modal'));
```

#### 4. Remove Unused Dependencies
```bash
# Find unused dependencies
pnpm dlx depcheck

# Remove unused packages
pnpm remove unused-package
```

## Performance Regression Prevention Workflow

### 1. Baseline Measurement

Before making changes, establish baseline metrics:

```bash
# Run baseline tests
pnpm test:performance

# Save baseline results
pnpm run measure-baseline
```

This creates `performance-baseline.json`:
```json
{
  "buildTime": 85000,
  "bundleSize": {
    "total": 450000,
    "initial": 180000
  },
  "lighthouse": {
    "performance": 92,
    "seo": 97,
    "accessibility": 94
  }
}
```

### 2. Development Workflow

For each feature or change:

1. **Create feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Implement changes**
   ```bash
   # Make your changes
   ```

3. **Run performance checks**
   ```bash
   # Check bundle size
   ANALYZE=true pnpm build
   
   # Run Lighthouse
   pnpm test:lighthouse
   
   # Run performance tests
   pnpm test:performance
   ```

4. **Compare with baseline**
   ```bash
   pnpm run performance-check
   ```

5. **Review results**
   - Bundle size increase: < 5% acceptable
   - Lighthouse scores: Must meet thresholds
   - Build time increase: < 10% acceptable

### 3. Pre-Commit Checks

Add performance checks to git hooks using Husky:

```bash
# Install Husky
pnpm add -D husky

# Create pre-commit hook
npx husky add .husky/pre-commit "pnpm run performance-check"
```

### 4. CI/CD Integration

Add performance checks to CI pipeline:

```yaml
# .github/workflows/performance.yml
name: Performance Check

on: [pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build
      
      - name: Run Lighthouse CI
        run: pnpm lhci autorun
      
      - name: Check bundle size
        run: pnpm run bundle-check
      
      - name: Performance tests
        run: pnpm test:performance
```

### 5. Monitoring Dashboard

Track performance metrics over time:

```typescript
// scripts/performance-dashboard.ts
import { readFileSync } from 'fs';

const baseline = JSON.parse(readFileSync('performance-baseline.json', 'utf-8'));
const current = JSON.parse(readFileSync('performance-current.json', 'utf-8'));

console.table({
  'Build Time': {
    baseline: `${baseline.buildTime}ms`,
    current: `${current.buildTime}ms`,
    change: `${((current.buildTime - baseline.buildTime) / baseline.buildTime * 100).toFixed(1)}%`
  },
  'Bundle Size': {
    baseline: `${(baseline.bundleSize.total / 1024).toFixed(1)} KB`,
    current: `${(current.bundleSize.total / 1024).toFixed(1)} KB`,
    change: `${((current.bundleSize.total - baseline.bundleSize.total) / baseline.bundleSize.total * 100).toFixed(1)}%`
  },
  'Lighthouse Performance': {
    baseline: baseline.lighthouse.performance,
    current: current.lighthouse.performance,
    change: current.lighthouse.performance - baseline.lighthouse.performance
  }
});
```

## Continuous Monitoring

### Weekly Performance Review

1. **Run full audit suite**
   ```bash
   pnpm run audit:full
   ```

2. **Review metrics trends**
   - Check if scores are declining
   - Identify new performance issues
   - Update baseline if improvements made

3. **Update documentation**
   - Document new optimizations
   - Update performance targets
   - Share findings with team

### Monthly Performance Report

Generate monthly report:

```bash
pnpm run performance-report --month=2024-03
```

Report includes:
- Performance score trends
- Bundle size changes
- Build time evolution
- Core Web Vitals metrics
- Recommendations for improvements

## Tools and Resources

### Recommended Tools

1. **Lighthouse CI**: Automated audits in CI/CD
2. **Bundle Analyzer**: Visualize bundle composition
3. **Chrome DevTools**: Real-time performance profiling
4. **WebPageTest**: Detailed performance analysis
5. **PageSpeed Insights**: Google's performance tool

### Useful Commands

```bash
# Quick performance check
pnpm run perf:check

# Full performance audit
pnpm run perf:audit

# Bundle analysis
pnpm run analyze

# Lighthouse audit
pnpm run lighthouse

# Performance tests
pnpm test:performance

# Update baseline
pnpm run perf:baseline
```

## Troubleshooting

### Lighthouse Scores Dropped

1. Check recent changes
2. Run bundle analysis
3. Profile with Chrome DevTools
4. Review Core Web Vitals
5. Check third-party scripts

### Bundle Size Increased

1. Run bundle analyzer
2. Check for new dependencies
3. Look for duplicate modules
4. Verify tree shaking works
5. Check dynamic imports

### Build Time Increased

1. Check file watcher configuration
2. Review build cache
3. Check for new heavy dependencies
4. Profile build process
5. Consider incremental builds

## Related Documentation

- [Development vs Production Configuration](./DEVELOPMENT_VS_PRODUCTION.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Build Cache](./BUILD_CACHE.md)
