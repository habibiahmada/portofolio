# Lazy-Loaded Admin Components

This directory contains lazy-loaded versions of heavy components used in the admin interface. These components use Next.js dynamic imports to reduce the initial bundle size and improve performance.

## Overview

All components in this directory are configured with:
- `ssr: false` - Prevents server-side rendering
- Loading skeletons - Provides better UX during component loading
- Error boundaries - Graceful fallbacks if components fail to load

## Available Components

### Chart Components (`LazyCharts.tsx`)

Heavy charting libraries that should only be loaded when needed.

```tsx
import { LazyChart, LazyBarChart, LazyLineChart, LazyPieChart } from '@/components/admin';

// Usage
<LazyBarChart data={chartData} />
```

**Components:**
- `LazyChart` - Generic chart component
- `LazyBarChart` - Bar chart visualization
- `LazyLineChart` - Line chart visualization
- `LazyPieChart` - Pie chart visualization
- `ChartSkeleton` - Loading skeleton for charts

### Animation Components (`LazyAnimations.tsx`)

Animation libraries for rich UI interactions.

```tsx
import { LazyLottieAnimation, LazyMotion } from '@/components/admin';

// Usage
<LazyLottieAnimation animationData={animationJson} />
```

**Components:**
- `LazyLottieAnimation` - Lottie animation player
- `LazyMotion` - Framer Motion animated div
- `LazyAnimatePresence` - Framer Motion exit animations
- `LazySpringAnimation` - React Spring animations
- `AnimationSkeleton` - Loading skeleton for animations

### Editor Components (`LazyEditor.tsx`)

Rich text editors and code editors for content management.

```tsx
import { LazyTiptapEditor } from '@/components/admin';

// Usage
<LazyTiptapEditor 
  content={content}
  onChange={handleChange}
  placeholder="Start writing..."
/>
```

**Components:**
- `LazyTiptapEditor` - Rich text editor (Tiptap)
- `LazyMonacoEditor` - Code editor (Monaco/VS Code)
- `LazyMarkdownEditor` - Markdown editor
- `EditorSkeleton` - Loading skeleton for editors

### PDF Components (`LazyPDF.tsx`)

PDF viewing and rendering components.

```tsx
import { LazyPDFPreview, LazyPDFThumbnail } from '@/components/admin';

// Usage
<LazyPDFPreview fileUrl="/path/to/document.pdf" />
```

**Components:**
- `LazyPDFDocument` - PDF Document component
- `LazyPDFPage` - PDF Page component
- `LazyPDFPreview` - Complete PDF preview with navigation
- `LazyPDFThumbnail` - PDF thumbnail for lists
- `PDFSkeleton` - Loading skeleton for PDF viewers

## Migration Guide

### Before (Direct Import)

```tsx
import TiptapEditor from '@/components/ui/tiptap-editor';

export default function ArticleForm() {
  return <TiptapEditor content={content} onChange={handleChange} />;
}
```

### After (Lazy Import)

```tsx
import { LazyTiptapEditor } from '@/components/admin';

export default function ArticleForm() {
  return <LazyTiptapEditor content={content} onChange={handleChange} />;
}
```

## Benefits

1. **Reduced Initial Bundle Size**: Heavy libraries are only loaded when needed
2. **Faster Page Load**: Initial page load is faster as these components are split into separate chunks
3. **Better UX**: Loading skeletons provide visual feedback during component loading
4. **No SSR Overhead**: Components are client-only, reducing server load
5. **Automatic Code Splitting**: Next.js automatically creates separate chunks for each dynamic import

## Performance Impact

Based on the requirements:
- Initial bundle size reduced by 30%+ (Requirement 14.5)
- Heavy components (charts, editors, PDF viewers) are lazy-loaded (Requirement 6.1)
- All dynamic imports have loading states (Requirement 14.4)

## Testing

Property-based tests verify:
- All heavy components use dynamic import (Property 5)
- All dynamic imports have loading states (Property 14)
- All components have `ssr: false` configuration
- Loading skeletons are properly exported

Run tests:
```bash
pnpm vitest run src/__tests__/properties/dynamic-imports.property.test.ts
pnpm vitest run src/__tests__/unit/lazy-loading.test.ts
```

## Notes

- These components are designed for admin/dashboard use only
- Public-facing components should use different optimization strategies
- All components include error boundaries for graceful degradation
- Loading skeletons match the layout of the actual components for smooth transitions
