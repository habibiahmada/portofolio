'use client';

import { CheckCircle, Clock, Users, LucideIcon } from "lucide-react";
import Companieslist from "./companieslist";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import useStats from "@/hooks/api/public/useStats";

const IconList: LucideIcon[] = [Users, CheckCircle, Clock];

const gradientColors = [
  'from-indigo-500 to-blue-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-yellow-500 to-amber-500',
];

export default function Stats() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { stats, loading, error } = useStats();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a stable wrapper even during loading
  const isDark = resolvedTheme === "dark" || !mounted;

  if (error) return null;

  return (
    <section id="stats" className="relative py-20 overflow-hidden">
      <h2 className="sr-only">Platform statistics</h2>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative container mx-auto px-6 max-w-7xl">
        <div
          className={`relative border overflow-hidden transition-all duration-300 mb-12
            ${isDark
              ? "bg-slate-900/70 border-slate-800 shadow-[0_0_50px_-12px_rgba(0,0,0,0.6)]"
              : "bg-white/90 border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)]"
            } backdrop-blur-xl min-h-[500px] md:min-h-[200px]`}
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x dark:divide-slate-800 divide-slate-300/60 h-full">
            {loading || !mounted ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-10 flex flex-col items-center justify-center gap-4 animate-pulse"
                >
                  <div className="h-16 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-6 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              ))
            ) : (
              stats.map((stat, i) => {
                const Icon = IconList[i % IconList.length];
                const gradient = gradientColors[i % gradientColors.length];

                return (
                  <div
                    key={i}
                    className="group relative p-6 flex flex-col items-center text-center transition-colors duration-300 hover:bg-slate-500/5"
                  >
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${gradient}`}
                    />

                    <div className="relative z-10 flex flex-col items-center">
                      {/* Icon */}
                      <div
                        className={`inline-flex p-3 bg-gradient-to-r ${gradient} text-white mb-3`}
                      >
                        <Icon size={24} />
                      </div>

                      {/* Number */}
                      <div className="flex items-baseline gap-1 mb-2">
                        <span
                          className={`
                            text-3xl md:text-4xl font-bold tracking-tight
                            ${isDark ? "text-slate-100" : "text-slate-900"}
                            supports-[background-clip:text]:bg-clip-text
                            supports-[background-clip:text]:text-transparent
                            supports-[background-clip:text]:bg-gradient-to-b
                            ${isDark
                              ? "supports-[background-clip:text]:from-white supports-[background-clip:text]:via-slate-200 supports-[background-clip:text]:to-slate-400"
                              : "supports-[background-clip:text]:from-slate-900 supports-[background-clip:text]:via-slate-700 supports-[background-clip:text]:to-slate-500"
                            }
                          `}
                        >
                          {stat.count}
                        </span>

                        <span
                          className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
                        >
                          {stat.suffix}
                        </span>
                      </div>

                      {/* Label */}
                      <p
                        role="heading"
                        aria-level={3}
                        className={`text-lg font-semibold tracking-wide uppercase mb-2
                                    ${isDark ? "text-slate-300" : "text-slate-700"}`}
                      >
                        {stat.label}
                      </p>


                      {/* Description */}
                      <p
                        className={`max-w-[200px] leading-relaxed
                          ${isDark ? "text-slate-400" : "text-slate-600"}`}
                      >
                        {stat.description}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="relative">
          <Companieslist />
        </div>
      </div>
    </section>
  );
}
