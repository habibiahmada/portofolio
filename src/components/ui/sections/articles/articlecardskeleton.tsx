"use client";

import React from "react";

const ArticleCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm bg-white dark:bg-slate-900 animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 w-full bg-gray-200 dark:bg-gray-700" />

      <div className="p-6 space-y-4">
        {/* Date + Read time */}
        <div className="flex items-center space-x-3">
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        {/* Title */}
        <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />

        {/* Excerpt */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ArticleCardSkeleton;
