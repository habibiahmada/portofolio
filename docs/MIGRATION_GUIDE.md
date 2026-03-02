# Migration Guide

This guide provides step-by-step instructions for migrating the Next.js portfolio application to use optimized dependencies and configurations.

## Overview

This migration includes:
1. **pnpm Migration**: Switch from npm to pnpm for better performance
2. **Dependency Replacement**: Replace heavy libraries with lightweight alternatives
3. **Testing Procedures**: Verify everything works after migration

## Prerequisites

Before starting the migration:

- [ ] Backup your project (commit all changes to git)
- [ ] Ensure you have Node.js 18+ installed
- [ ] Close all running development servers
- [ ] Document current performance baseline

```bash
# Create backup branch
git checkout -b backup/pre-migration
git push origin backup/pre-migration

# Return to main branch
git checkout main
```

## Part 1: pnpm Migration

### Why pnpm?

Benefits of pnpm over npm:
- **30-50% less disk space**: Shared dependency storage
- **Faster installs**: Parallel downloads and hard linking
- **Stricter**: Prevents phantom dependencies
- **Better monorepo support**: Workspace features

### Step 1: Install pnpm

#### Windows
```bash
# Using npm
npm install -g pnpm

# Or using PowerShell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

#### macOS/Linux
```bash
# Using npm
npm install -g pnpm

# Or using curl
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

Verify installation:
```bash
pnpm --version
# Should output: 8.x.x or higher
```

### Step 2: Create .npmrc Configuration

Create `.npmrc` file in project root:

```bash
# .npmrc
# Use pnpm for package management
package-manager=pnpm

# Hoist dependencies to root node_modules
shamefully-hoist=false

# Strict peer dependencies
strict-peer-dependencies=false

# Auto install peers
auto-install-peers=true

# Store directory (optional, for custom location)
# store-dir=~/.pnpm-store

# Lockfile settings
lockfile=true
prefer-frozen-lockfile=true

# Registry (use default or custom)
registry=https://registry.npmjs.org/
```

### Step 3: Remove Old Package Manager Files

```bash
# Remove npm files
rm -rf node_modules
rm package-lock.json

# Remove yarn files (if present)
rm yarn.lock
rm -rf .yarn
```

On Windows (PowerShell):
```powershell
# Remove npm files
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Remove yarn files (if present)
Remove-Item yarn.lock -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .yarn -ErrorAction SilentlyContinue
```

### Step 4: Install Dependencies with pnpm

```bash
# Install all dependencies
pnpm install

# This will:
# 1. Read package.json
# 2. Resolve dependencies
# 3. Create pnpm-lock.yaml
# 4. Install to node_modules
```

Expected output:
```
Packages: +XXX
++++++++++++++++++++++++++++++++++++++++++
Progress: resolved XXX, reused XXX, downloaded X, added XXX, done
```

### Step 5: Update Scripts (if needed)

Most scripts work as-is, but update any npm-specific commands:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "analyze": "ANALYZE=true pnpm build",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:performance": "vitest run --config vitest.config.ts src/__tests__/performance"
  }
}
```

### Step 6: Update .gitignore

Ensure `.gitignore` includes pnpm files:

```bash
# .gitignore

# Dependencies
node_modules/
.pnpm-store/

# Lock files (keep pnpm-lock.yaml, ignore others)
package-lock.json
yarn.lock

# Build outputs
.next/
out/
dist/
build/

# Environment
.env.local
.env.production.local

# Testing
coverage/

# Misc
.DS_Store
*.log
```

### Step 7: Verify Installation

```bash
# Check installed packages
pnpm list

# Check for issues
pnpm audit

# Run development server
pnpm dev
```

### Step 8: Update CI/CD Configuration

Update GitHub Actions or other CI configs:

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      # Setup pnpm
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      # Setup Node.js with pnpm cache
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      # Install dependencies
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      # Build
      - name: Build
        run: pnpm build
      
      # Test
      - name: Test
        run: pnpm test
```

### Step 9: Team Communication

Inform your team:

```markdown
## Migration to pnpm

We've migrated to pnpm for better performance and disk space usage.

### What you need to do:

1. Install pnpm globally:
   ```bash
   npm install -g pnpm
   ```

2. Pull latest changes:
   ```bash
   git pull
   ```

3. Remove old node_modules:
   ```bash
   rm -rf node_modules package-lock.json
   ```

4. Install with pnpm:
   ```bash
   pnpm install
   ```

5. Use pnpm for all commands:
   ```bash
   pnpm dev
   pnpm build
   pnpm add <package>
   ```

### Common commands:

| npm | pnpm |
|-----|------|
| npm install | pnpm install |
| npm install <pkg> | pnpm add <pkg> |
| npm uninstall <pkg> | pnpm remove <pkg> |
| npm run <script> | pnpm <script> |
```

## Part 2: Dependency Replacement

### Replace moment.js with dayjs

#### Why Replace?

- **moment.js**: ~200 KB minified
- **dayjs**: ~7 KB minified
- **Savings**: ~193 KB (96% reduction)

#### Step 1: Install dayjs

```bash
pnpm add dayjs
```

#### Step 2: Find moment.js Usage

```bash
# Search for moment imports
grep -r "from 'moment'" src/
grep -r "require('moment')" src/

# Or use your IDE's search feature
```

#### Step 3: Replace Imports

```typescript
// Before (moment.js)
import moment from 'moment';

const date = moment();
const formatted = moment(date).format('YYYY-MM-DD');
const relative = moment(date).fromNow();

// After (dayjs)
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const date = dayjs();
const formatted = dayjs(date).format('YYYY-MM-DD');
const relative = dayjs(date).fromNow();
```

#### Step 4: Common Conversions

| moment.js | dayjs |
|-----------|-------|
| `moment()` | `dayjs()` |
| `moment(date)` | `dayjs(date)` |
| `moment().format('YYYY-MM-DD')` | `dayjs().format('YYYY-MM-DD')` |
| `moment().add(7, 'days')` | `dayjs().add(7, 'day')` |
| `moment().subtract(1, 'month')` | `dayjs().subtract(1, 'month')` |
| `moment().startOf('day')` | `dayjs().startOf('day')` |
| `moment().endOf('month')` | `dayjs().endOf('month')` |
| `moment().fromNow()` | `dayjs().fromNow()` (requires plugin) |
| `moment().isBefore(date)` | `dayjs().isBefore(date)` |
| `moment().isAfter(date)` | `dayjs().isAfter(date)` |

#### Step 5: Handle Plugins

dayjs uses plugins for extended functionality:

```typescript
// Relative time
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

// UTC
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

// Timezone
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(timezone);

// Custom parse format
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
```

#### Step 6: Test Date Operations

Create test file to verify conversions:

```typescript
// src/__tests__/date-migration.test.ts
import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';

describe('Date Operations', () => {
  it('formats dates correctly', () => {
    const date = dayjs('2024-03-15');
    expect(date.format('YYYY-MM-DD')).toBe('2024-03-15');
  });

  it('adds days correctly', () => {
    const date = dayjs('2024-03-15');
    const future = date.add(7, 'day');
    expect(future.format('YYYY-MM-DD')).toBe('2024-03-22');
  });

  it('compares dates correctly', () => {
    const date1 = dayjs('2024-03-15');
    const date2 = dayjs('2024-03-20');
    expect(date1.isBefore(date2)).toBe(true);
  });
});
```

Run tests:
```bash
pnpm test src/__tests__/date-migration.test.ts
```

#### Step 7: Remove moment.js

```bash
# Remove moment.js
pnpm remove moment

# Verify it's gone
pnpm list moment
# Should show: (empty)
```

### Replace lodash with lodash-es

#### Why Replace?

- **lodash**: Full library, hard to tree-shake
- **lodash-es**: ES modules, tree-shakeable
- **Savings**: ~50-100 KB depending on usage

#### Step 1: Install lodash-es

```bash
pnpm add lodash-es
pnpm add -D @types/lodash-es
```

#### Step 2: Find lodash Usage

```bash
# Search for lodash imports
grep -r "from 'lodash'" src/
grep -r "require('lodash')" src/
```

#### Step 3: Replace Imports

```typescript
// Before (full lodash)
import _ from 'lodash';

const result = _.debounce(fn, 300);
const sorted = _.sortBy(array, 'name');
const grouped = _.groupBy(array, 'category');

// After (lodash-es with tree-shaking)
import { debounce, sortBy, groupBy } from 'lodash-es';

const result = debounce(fn, 300);
const sorted = sortBy(array, 'name');
const grouped = groupBy(array, 'category');
```

#### Step 4: Common Conversions

| Before | After |
|--------|-------|
| `import _ from 'lodash'` | `import { fn } from 'lodash-es'` |
| `_.debounce(fn, 300)` | `import { debounce } from 'lodash-es'` |
| `_.throttle(fn, 300)` | `import { throttle } from 'lodash-es'` |
| `_.cloneDeep(obj)` | `import { cloneDeep } from 'lodash-es'` |
| `_.merge(obj1, obj2)` | `import { merge } from 'lodash-es'` |
| `_.isEmpty(value)` | `import { isEmpty } from 'lodash-es'` |

#### Step 5: Update TypeScript Config

Ensure TypeScript can resolve lodash-es:

```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

#### Step 6: Test Utility Functions

```typescript
// src/__tests__/lodash-migration.test.ts
import { describe, it, expect } from 'vitest';
import { debounce, sortBy, groupBy } from 'lodash-es';

describe('Lodash Utilities', () => {
  it('debounces function calls', async () => {
    let count = 0;
    const fn = debounce(() => count++, 100);
    
    fn();
    fn();
    fn();
    
    await new Promise(resolve => setTimeout(resolve, 150));
    expect(count).toBe(1);
  });

  it('sorts arrays correctly', () => {
    const data = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];
    const sorted = sortBy(data, 'name');
    expect(sorted[0].name).toBe('Alice');
  });

  it('groups arrays correctly', () => {
    const data = [
      { category: 'A', value: 1 },
      { category: 'B', value: 2 },
      { category: 'A', value: 3 }
    ];
    const grouped = groupBy(data, 'category');
    expect(grouped.A).toHaveLength(2);
  });
});
```

Run tests:
```bash
pnpm test src/__tests__/lodash-migration.test.ts
```

#### Step 7: Remove lodash

```bash
# Remove full lodash
pnpm remove lodash

# Verify it's gone
pnpm list lodash
# Should show: (empty)
```

#### Step 8: Verify Bundle Size Reduction

```bash
# Analyze bundle before and after
ANALYZE=true pnpm build

# Compare bundle sizes
# lodash-es should show only imported functions
```

## Part 3: Testing Procedures

### Comprehensive Testing Checklist

After migration, test all functionality:

#### 1. Unit Tests

```bash
# Run all unit tests
pnpm test

# Run with coverage
pnpm test --coverage

# Expected: All tests pass
```

#### 2. Integration Tests

```bash
# Run integration tests
pnpm test:integration

# Expected: All integrations work
```

#### 3. Property-Based Tests

```bash
# Run property tests
pnpm test src/__tests__/properties

# Expected: All properties hold
```

#### 4. Performance Tests

```bash
# Run performance tests
pnpm test:performance

# Expected: Metrics within thresholds
```

#### 5. Build Test

```bash
# Test production build
pnpm build

# Expected: Build succeeds without errors
# Check build output for warnings
```

#### 6. Development Server Test

```bash
# Start dev server
pnpm dev

# Test:
# - Hot reload works
# - Pages load correctly
# - No console errors
# - Memory usage acceptable
```

#### 7. Production Server Test

```bash
# Build and start production server
pnpm build
pnpm start

# Test:
# - All pages load
# - Static pages work
# - ISR pages work
# - API routes work
```

#### 8. Visual Regression Test

```bash
# Take screenshots before migration
# Take screenshots after migration
# Compare for visual differences

# Manual testing:
# - Homepage
# - Blog pages
# - Project pages
# - Admin dashboard
```

#### 9. Lighthouse Audit

```bash
# Run Lighthouse audit
pnpm lighthouse http://localhost:3000

# Expected scores:
# - Performance: ≥ 90
# - SEO: ≥ 95
# - Accessibility: ≥ 90
# - Best Practices: ≥ 90
```

#### 10. Bundle Analysis

```bash
# Analyze bundle
ANALYZE=true pnpm build

# Verify:
# - moment.js not in bundle
# - Only used lodash functions in bundle
# - Total bundle size reduced by 20%+
```

### Automated Test Script

Create comprehensive test script:

```bash
#!/bin/bash
# scripts/test-migration.sh

echo "🧪 Running Migration Tests..."

# 1. Unit tests
echo "1️⃣ Running unit tests..."
pnpm test || exit 1

# 2. Build test
echo "2️⃣ Testing build..."
pnpm build || exit 1

# 3. Performance tests
echo "3️⃣ Running performance tests..."
pnpm test:performance || exit 1

# 4. Bundle analysis
echo "4️⃣ Analyzing bundle..."
ANALYZE=true pnpm build

# 5. Check for old dependencies
echo "5️⃣ Checking for old dependencies..."
if pnpm list moment | grep -q "moment"; then
  echo "❌ moment.js still in dependencies!"
  exit 1
fi

if pnpm list lodash | grep -q "lodash@"; then
  echo "❌ Full lodash still in dependencies!"
  exit 1
fi

echo "✅ All migration tests passed!"
```

Make executable and run:
```bash
chmod +x scripts/test-migration.sh
./scripts/test-migration.sh
```

## Rollback Procedure

If migration fails, rollback:

```bash
# 1. Checkout backup branch
git checkout backup/pre-migration

# 2. Restore node_modules
rm -rf node_modules
npm install

# 3. Restart dev server
npm run dev

# 4. Investigate issues
# - Check error logs
# - Review failed tests
# - Identify problematic changes

# 5. Fix issues and retry migration
```

## Post-Migration Checklist

- [ ] All tests pass
- [ ] Build succeeds
- [ ] Dev server runs smoothly
- [ ] Production build works
- [ ] Bundle size reduced
- [ ] Lighthouse scores maintained
- [ ] No console errors
- [ ] Team informed
- [ ] Documentation updated
- [ ] CI/CD updated
- [ ] Backup branch created

## Common Issues and Solutions

### Issue: pnpm install fails

**Solution:**
```bash
# Clear pnpm cache
pnpm store prune

# Remove node_modules and retry
rm -rf node_modules
pnpm install
```

### Issue: Module not found after migration

**Solution:**
```bash
# Check if package is installed
pnpm list <package-name>

# Reinstall if missing
pnpm add <package-name>

# Check import paths
# Ensure using correct module specifier
```

### Issue: TypeScript errors with lodash-es

**Solution:**
```bash
# Install type definitions
pnpm add -D @types/lodash-es

# Update tsconfig.json
# Add "esModuleInterop": true
```

### Issue: dayjs plugin not working

**Solution:**
```typescript
// Ensure plugin is extended before use
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Must extend before using
dayjs.extend(relativeTime);

// Now can use
dayjs().fromNow();
```

### Issue: Build time increased

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Clear pnpm cache
pnpm store prune

# Rebuild
pnpm build
```

## Performance Comparison

Expected improvements after migration:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Install time | 60s | 30s | 50% faster |
| Disk space | 500 MB | 350 MB | 30% less |
| Bundle size | 600 KB | 480 KB | 20% smaller |
| Build time | 120s | 100s | 17% faster |
| Dev memory | 4.5 GB | 3.5 GB | 22% less |

## Next Steps

After successful migration:

1. **Monitor Performance**
   - Track metrics for 1 week
   - Compare with baseline
   - Document improvements

2. **Update Documentation**
   - Update README with pnpm commands
   - Update contributing guide
   - Update CI/CD docs

3. **Team Training**
   - Share migration guide
   - Conduct team walkthrough
   - Answer questions

4. **Continuous Optimization**
   - Regular bundle analysis
   - Dependency audits
   - Performance monitoring

## Related Documentation

- [Development vs Production Configuration](./DEVELOPMENT_VS_PRODUCTION.md)
- [Performance Monitoring](./PERFORMANCE_MONITORING.md)
- [Build Cache](./BUILD_CACHE.md)
- [Configuration](./CONFIGURATION.md)
