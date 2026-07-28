"use client";

import { cn } from "@/lib/utils";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800",
        className,
      )}
    />
  );
}

/** Skeleton for a single project card */
export function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-950 p-4 overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <div className="flex gap-2 mt-1">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
    </div>
  );
}

/** Grid of project card skeletons */
export function ProjectGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Skeleton for a certificate card */
export function CertificateCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-950 p-3 overflow-hidden">
      <Skeleton className="aspect-[3/2] w-full rounded-lg" />
    </div>
  );
}

/** Grid of certificate skeletons */
export function CertificateGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CertificateCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Skeleton for companies marquee */
export function CompanyLogoSkeleton() {
  return (
    <div className="flex items-center gap-8">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-24 rounded-lg" />
      ))}
    </div>
  );
}

/** Skeleton for a certificate modal */
export function CertificateModalSkeleton() {
  return (
    <div className="flex gap-6 p-6">
      <div className="flex-1 space-y-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="w-[55%] aspect-[4/3] rounded-xl" />
    </div>
  );
}
