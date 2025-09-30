"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "../../skeleton";

export default function SkeletonProjectCard() {
  return (
    <Card className="rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <Skeleton className="w-full h-70 bg-slate-200 dark:bg-slate-700" />

      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-md" />
        <Skeleton className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-md" />
        <Skeleton className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded-md" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <Skeleton className="h-6 w-12 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
