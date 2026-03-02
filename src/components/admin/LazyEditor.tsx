'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Loading skeleton for the Tiptap editor
 * Mimics the editor's layout while loading
 */
export function EditorSkeleton() {
  return (
    <div className="border rounded-md bg-background">
      {/* Toolbar skeleton */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/30 rounded-t-md">
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-8" />
        ))}
      </div>

      {/* Editor content skeleton */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="pt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
}

/**
 * Lazy-loaded Tiptap editor component
 * Configured with ssr: false to prevent server-side rendering
 * The Tiptap editor is a heavy component with many dependencies
 * that should only be loaded when needed in the admin interface
 */
export const LazyTiptapEditor = dynamic(
  () => Promise.resolve({
    default: () => (
      <div className="border rounded-md bg-background p-4">
        <p className="text-muted-foreground">Tiptap editor not yet configured</p>
      </div>
    ),
  }),
  {
    loading: () => <EditorSkeleton />,
    ssr: false,
  }
);

/**
 * Alternative: Lazy-loaded Monaco editor (VS Code editor)
 * For code editing in admin interface
 *
 * Note: Requires '@monaco-editor/react' package to be installed
 */
export const LazyMonacoEditor = dynamic(
  () => Promise.resolve({
    default: () => (
      <div className="w-full h-100 flex items-center justify-center border rounded-lg">
        <p className="text-muted-foreground">Code editor not yet configured</p>
      </div>
    ),
  }),
  {
    loading: () => (
      <div className="border rounded-md bg-background p-4">
        <Skeleton className="h-100 w-full" />
      </div>
    ),
    ssr: false,
  }
);

/**
 * Lazy-loaded Markdown editor
 * For markdown content editing
 *
 * Note: Requires '@uiw/react-md-editor' package to be installed
 */
export const LazyMarkdownEditor = dynamic(
  () => Promise.resolve({
    default: () => (
      <div className="w-full h-100 flex items-center justify-center border rounded-lg">
        <p className="text-muted-foreground">Markdown editor not yet configured</p>
      </div>
    ),
  }),
  {
    loading: () => <EditorSkeleton />,
    ssr: false,
  }
);
