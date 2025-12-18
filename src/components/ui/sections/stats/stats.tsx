'use client';

import { CheckCircle, Clock, Users, LucideIcon } from "lucide-react";
import Companieslist from "./companieslist";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useLocale } from "next-intl";

// Local icon list and color palettes to avoid relying on DB-provided icon/color
const IconList: LucideIcon[] = [Users, CheckCircle, Clock];

// IconMap removed — component uses local IconList for rendering consistency

const gradientColors = [
  'from-indigo-500 to-blue-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-yellow-500 to-amber-500',
];


interface StatItem {
  key: string;
  count: number;
  icon: string;
  suffix: string;
  label: string;
  description: string;
  color: string;
  bgColorLight: string;
  bgColorDark: string;
}


export default function Stats() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();

  useEffect(() => {
    setMounted(true);

    async function fetchStats() {
      try {
        const res = await fetch(`/api/stats?lang=${locale}`);
        const result = await res.json();
        if (result.data) {
          setStats(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [locale]);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <section id="stats" className="relative py-20 overflow-hidden">
      <div className="absolute top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative container mx-auto px-6 max-w-7xl">
        
        <div 
          className={`relative border overflow-hidden transition-all duration-300 mb-12
            ${isDark 
              ? "bg-slate-900/40 border-slate-800 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]" 
              : "bg-white/60 border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
            } backdrop-blur-xl`}
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x dark:divide-slate-800 divide-slate-300/50">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="p-10 flex flex-col items-center justify-center gap-4 animate-pulse">
                  <div className="h-12 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                  <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
              ))
            ) : (
              stats.map((stat, i) => {
              const Icon = IconList[i % IconList.length] || IconList[0];
              const colorClass = gradientColors[i % gradientColors.length];
                
                return (
                  <div 
                    key={i} 
                    className="group relative p-6 flex flex-col items-center text-center transition-colors duration-300 hover:bg-slate-500/5"
                  >
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${gradientColors[i % gradientColors.length]}`} />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center">
                 <div
                      className={`inline-flex p-3 bg-gradient-to-r ${colorClass} text-white mb-3`}
                    >
                      <Icon size={24} />
                    </div>  

                      <div className="flex items-baseline gap-1 mb-2">
                        <span className={`text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b
                          ${isDark 
                            ? "from-white via-slate-200 to-slate-400" 
                            : "from-slate-900 via-slate-700 to-slate-500"}`}
                        >
                          {stat.count}
                        </span>
                        <span className={`text-3xl font-bold bg-gradient-to-r ${gradientColors[i % gradientColors.length]} bg-clip-text text-transparent`}>
                          {stat.suffix}
                        </span>
                      </div>

                      <h3 className={`text-lg font-semibold tracking-wide uppercase mb-2
                        ${isDark ? "text-slate-300" : "text-slate-600"}`}
                      >
                        {stat.label}
                      </h3>
                      
                      <p className={`text-sm max-w-[200px] leading-relaxed
                        ${isDark ? "text-slate-500" : "text-slate-400"}`}
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

        {/* Companies Section */}
        <div className="relative">
          <Companieslist />
        </div>
      </div>
    </section>
  );
}