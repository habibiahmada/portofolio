import { Skeleton } from "@/components/ui/skeleton"

export default function StickyNavSkeleton() {
  return (
    <div className="sticky top-32 flex flex-col gap-6 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-px w-10" />
          <Skeleton className="h-4 w-28" />
        </div>
      ))}
    </div>
  )
}
