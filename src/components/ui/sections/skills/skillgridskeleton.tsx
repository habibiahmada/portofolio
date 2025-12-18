export default function SkillGridSkeleton() {
  return (
    <div className="flex flex-col gap-6 opacity-50">
      {/* Baris 1 Skeleton */}
      <div className="flex gap-6 overflow-hidden mask-image-linear-gradient">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`skel-1-${i}`}
            className="w-[200px] h-[72px] shrink-0 rounded-xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 animate-pulse"
          />
        ))}
      </div>
       {/* Baris 2 Skeleton */}
       <div className="flex gap-6 overflow-hidden mask-image-linear-gradient translate-x-12">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`skel-2-${i}`}
            className="w-[200px] h-[72px] shrink-0 rounded-xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}