'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Loading skeleton for chart components
 * Displays a placeholder while the chart library is being loaded
 */
export function ChartSkeleton() {
  return (
    <div className="w-full h-100 flex flex-col gap-4 p-4 border rounded-lg bg-muted/30">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="flex-1 w-full" />
      <div className="flex gap-2 justify-center">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

/**
 * Lazy-loaded chart component using dynamic import
 * Configured with ssr: false to prevent server-side rendering
 * Includes loading skeleton for better UX
 *
 * Note: Requires chart components to be implemented
 */
export const LazyChart = dynamic(
  () => Promise.resolve({
    default: () => (
      <div className="w-full h-100 flex items-center justify-center border rounded-lg">
        <p className="text-muted-foreground">Chart component not yet configured</p>
      </div>
    ),
  }),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

/**
 * Lazy-loaded bar chart component
 */
export const LazyBarChart = dynamic(
  () => Promise.resolve({
    default: () => (
      <div className="w-full h-100 flex items-center justify-center border rounded-lg">
        <p className="text-muted-foreground">Bar chart component not yet configured</p>
      </div>
    ),
  }),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

/**
 * Lazy-loaded line chart component
 */
export const LazyLineChart = dynamic(
  () => Promise.resolve({
    default: () => (
      <div className="w-full h-100 flex items-center justify-center border rounded-lg">
        <p className="text-muted-foreground">Line chart component not yet configured</p>
      </div>
    ),
  }),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

/**
 * Lazy-loaded pie chart component
 */
export const LazyPieChart = dynamic(
  () => Promise.resolve({
    default: () => (
      <div className="w-full h-100 flex items-center justify-center border rounded-lg">
        <p className="text-muted-foreground">Pie chart component not yet configured</p>
      </div>
    ),
  }),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);
