import React from 'react';
import { Card } from '../../card';

const TestimonialCardSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <Card className="relative p-8 lg:p-12 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-slate-200/50 dark:border-slate-700/50">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 animate-pulse">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-1 mb-6">
              <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-11/12" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-10/12" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-9/12" />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="space-y-2 w-full">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                </div>
              </div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TestimonialCardSkeleton;


