'use client';

import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  count?: number;
};

export default function CertificationSkeleton({ count = 6 }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="group relative bg-white dark:bg-slate-950 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700"
        >
          {/* Preview */}
          <div className="h-48 w-full">
            <Skeleton className="h-full w-full rounded-none" />
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-14 rounded-md" />
            </div>

            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
