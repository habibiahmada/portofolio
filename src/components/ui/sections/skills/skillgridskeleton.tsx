export default function SkillGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-950/50 
            border border-slate-300 dark:border-slate-800/50 animate-pulse"
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="mt-4 h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}