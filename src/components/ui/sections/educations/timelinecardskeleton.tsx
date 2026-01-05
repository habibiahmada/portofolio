import { Skeleton } from "@/components/ui/skeleton"

export default function TimelineCardSkeleton({ isDark }: { isDark: boolean }) {
  return (
    <div
      className={`border p-6 sm:p-8 animate-pulse ${
        isDark
          ? "bg-slate-900/50 border-slate-700"
          : "bg-white border-slate-200"
      }`}
    >
      {/* Title */}
      <Skeleton className="h-6 w-2/3 mb-3" />

      {/* Company */}
      <Skeleton className="h-4 w-1/2 mb-2" />

      {/* Location */}
      <Skeleton className="h-4 w-1/3 mb-4" />

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>

      {/* Skills */}
      <div className="flex gap-2 mt-6 pt-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-5 w-14 rounded-md" />
        ))}
      </div>
    </div>
  )
}
