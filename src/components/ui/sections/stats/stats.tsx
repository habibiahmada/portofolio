'use client';

import { CheckCircle, Clock, Users, LucideIcon } from "lucide-react";
import Companieslist from "./companieslist";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useLocale } from "next-intl";

// Local icon list and color palettes to avoid relying on DB-provided icon/color
const IconList: LucideIcon[] = [Users, CheckCircle, Clock];

const IconMap: { [key: string]: LucideIcon } = {
  // kept for compatibility but will not be used to read values from DB
  CheckCircle,
  Clock,
  Users,
  default: CheckCircle,
};

const gradientColors = [
  'from-indigo-500 to-blue-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-yellow-500 to-amber-500',
];

const bgOverlayLight = [
  'from-indigo-50 to-white',
  'from-emerald-50 to-white',
  'from-rose-50 to-white',
  'from-yellow-50 to-white',
];

const bgOverlayDark = [
  'from-indigo-900 to-slate-950',
  'from-emerald-900 to-slate-950',
  'from-rose-900 to-slate-950',
  'from-yellow-900 to-slate-950',
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
    <section
      id="stats"
      className="relative py-28 sm:py-36 lg:py-40 overflow-hidden"
    >
      {/* Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-b transition-colors duration-300 ease-in-out ${isDark
            ? "from-slate-950 via-gray-950 to-slate-950"
            : "from-slate-50 via-gray-50 to-slate-50"
          }`}
      />

      <div
        className={`absolute inset-0 opacity-[1] bg-[size:40px_40px]
          [mask-image:radial-gradient(ellipse_50%_45%_at_50%_50%,#000_70%,transparent_100%)]
          ${isDark
            ? "bg-[linear-gradient(rgba(59,130,246,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.15)_1px,transparent_1px)]"
            : "bg-[linear-gradient(rgba(148,163,184,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.3)_1px,transparent_1px)]"
          }`}
      />

      <div className="relative container mx-auto px-6 max-w-7xl">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20">
          {loading ? (
            // Skeleton loading
            [1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl border bg-muted/10 animate-pulse border-border/50"></div>
            ))
          ) : (
            stats.map((stat, i) => {
              // Choose icon and color based on index so UI is consistent and
              // does not depend on values stored in the database.
              const Icon = IconList[i % IconList.length] || IconList[0];
              const colorClass = gradientColors[i % gradientColors.length];
              const overlayLight = bgOverlayLight[i % bgOverlayLight.length];
              const overlayDark = bgOverlayDark[i % bgOverlayDark.length];
              return (
                <div
                  key={i}
                  className={`relative p-8 rounded-2xl border backdrop-blur-sm hover:-translate-y-1 transition-all duration-300 ${isDark ? "border-slate-700/60" : "border-slate-200/60"
                    }`}
                >
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${isDark ? overlayDark : overlayLight} opacity-80`}
                  />
                  <div className="relative z-10">
                    <div
                      className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${colorClass} text-white shadow-lg mb-6`}
                    >
                      <Icon size={24} />
                    </div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span
                        className={`text-4xl md:text-5xl font-bold tabular-nums ${isDark ? "text-white" : "text-slate-900"}`}
                      >
                        {stat.count}
                      </span>
                      <span
                        className={`text-2xl font-semibold bg-gradient-to-r ${colorClass} bg-clip-text text-transparent`}
                      >
                        {stat.suffix}
                      </span>
                    </div>
                    <div
                      className={`text-lg font-semibold mb-1 ${isDark ? "text-slate-200" : "text-slate-800"}`}
                    >
                      {stat.label}
                    </div>
                    <p
                      className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}
                    >
                      {stat.description}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Companies dengan animasi geser */}
        <Companieslist />
      </div>
    </section>
  );
}
