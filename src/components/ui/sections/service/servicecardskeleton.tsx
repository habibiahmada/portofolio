import { Skeleton } from "@/components/ui/skeleton"

export default function ServiceCardSkeleton() {
  return (
    <div className="group relative bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-slate-500/5 dark:from-blue-400/10 dark:to-slate-400/10 rounded-3xl opacity-0" />
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-2xl flex items-center justify-center mb-6">
          <Skeleton className="w-8 h-8 rounded" />
        </div>
        <Skeleton className="h-7 w-3/4 mb-4" />
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-5/6 mb-6" />
        <div className="space-y-3 mb-8">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full mr-3" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full mr-3" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full mr-3" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  )
}


