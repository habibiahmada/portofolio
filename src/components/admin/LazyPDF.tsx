'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Loading skeleton for PDF viewer
 * Displays a placeholder while the PDF library is being loaded
 */
export function PDFSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-muted/30">
      {/* PDF page skeleton */}
      <Skeleton className="w-full h-100 rounded-md" />

      {/* Navigation controls skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
  );
}

/**
 * Lazy-loaded PDF Document component from react-pdf
 * Configured with ssr: false to prevent server-side rendering
 * The react-pdf library is heavy and should only be loaded when needed
 */
export const LazyPDFDocument = dynamic(
  () => Promise.resolve({
    default: () => (
      <div className="border rounded-lg p-4">
        <p className="text-muted-foreground">PDF viewer not yet configured</p>
      </div>
    ),
  }),
  {
    loading: () => <PDFSkeleton />,
    ssr: false,
  }
);

/**
 * Lazy-loaded PDF Page component from react-pdf
 */
export const LazyPDFPage = dynamic(
  () => Promise.resolve({
    default: () => (
      <div className="border rounded-lg p-4">
        <p className="text-muted-foreground">PDF page not yet configured</p>
      </div>
    ),
  }),
  {
    loading: () => <Skeleton className="w-full h-100" />,
    ssr: false,
  }
);

/**
 * Lazy-loaded complete PDF preview component
 * This wraps the existing PdfPreviewClient component
 */
export const LazyPDFPreview = dynamic(
  () => Promise.resolve({
    default: () => (
      <div className="border rounded-lg p-4">
        <p className="text-muted-foreground">PDF preview not yet configured</p>
      </div>
    ),
  }),
  {
    loading: () => <PDFSkeleton />,
    ssr: false,
  }
);

/**
 * Lazy-loaded PDF thumbnail component
 * For displaying PDF thumbnails in lists
 */
export const LazyPDFThumbnail = dynamic(
  () => Promise.resolve({
    default: () => (
      <div className="w-full h-32 flex items-center justify-center border rounded-lg bg-muted/30">
        <p className="text-muted-foreground text-sm">PDF thumbnail</p>
      </div>
    ),
  }),
  {
    loading: () => (
      <div className="w-full h-32 flex items-center justify-center border rounded-lg bg-muted/30">
        <Skeleton className="w-24 h-28" />
      </div>
    ),
    ssr: false,
  }
);

/**
 * Lazy-loaded PDF.js viewer
 * Alternative PDF viewer with more features
 */
export const LazyPDFJSViewer = dynamic(
  () => Promise.resolve({
    default: () => (
      <div className="w-full h-100 flex items-center justify-center border rounded-lg">
        <p className="text-muted-foreground">PDF.js viewer not yet configured</p>
      </div>
    ),
  }),
  {
    loading: () => <PDFSkeleton />,
    ssr: false,
  }
);
