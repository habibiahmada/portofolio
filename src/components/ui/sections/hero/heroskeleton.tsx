'use client';

export default function HeroSkeleton() {
  return (
  <section
    id="home"
    className="relative overflow-hidden min-h-screen flex items-center pt-24 sm:pt-28 lg:pt-32 pb-24 bg-slate-50 dark:bg-slate-950"
  >
    <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      {/* Left Column - Text skeleton */}
      <div className="space-y-6 animate-pulse">
        <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-10 sm:h-12 lg:h-14 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-10 sm:h-12 lg:h-14 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-5 sm:h-6 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-5 sm:h-6 w-4/6 bg-slate-200 dark:bg-slate-800 rounded" />

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <div className="h-12 w-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-12 w-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* Right Column - Image skeleton */}
      <div className="relative animate-pulse">
        <div className="mx-auto w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-3xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  </section>
  );
}
