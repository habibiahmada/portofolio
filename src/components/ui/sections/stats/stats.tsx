'use client';

import { CheckCircle, Clock, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import Companieslist from "./companieslist";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function Stats() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  const isDark = resolvedTheme === "dark";

  const stats = [
    {
      icon: CheckCircle,
      count: 50,
      suffix: "+",
      label: t("stats.projects.label"),
      description: t("stats.projects.description"),
      color: "from-emerald-500 to-teal-600",
      bgColorLight: "from-emerald-50 to-teal-50",
      bgColorDark: "from-emerald-950/50 to-teal-950/50"
    },
    {
      icon: Clock,
      count: 5,
      suffix: "+",
      label: t("stats.experience.label"),
      description: t("stats.experience.description"),
      color: "from-blue-500 to-indigo-600",
      bgColorLight: "from-blue-50 to-indigo-50",
      bgColorDark: "from-blue-950/50 to-indigo-950/50"
    },
    {
      icon: Users,
      count: 30,
      suffix: "+",
      label: t("stats.clients.label"),
      description: t("stats.clients.description"),
      color: "from-purple-500 to-pink-600",
      bgColorLight: "from-purple-50 to-pink-50",
      bgColorDark: "from-purple-950/50 to-pink-950/50"
    },
  ];

  return (
    <section
      id="stats"
      className="relative py-28 sm:py-36 lg:py-40 overflow-hidden"
    >
      {/* Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${
          isDark
            ? "from-slate-950 via-gray-950 to-slate-950"
            : "from-slate-50 via-gray-50 to-slate-50"
        }`}
      />

      <div
        className={`absolute inset-0 opacity-[1] bg-[size:40px_40px]
          [mask-image:radial-gradient(ellipse_50%_45%_at_50%_50%,#000_70%,transparent_100%)]
          ${
            isDark
              ? "bg-[linear-gradient(rgba(59,130,246,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.15)_1px,transparent_1px)]"
              : "bg-[linear-gradient(rgba(148,163,184,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.3)_1px,transparent_1px)]"
          }`}
      />

      <div className="relative container mx-auto px-6 max-w-7xl">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`relative p-8 rounded-2xl border backdrop-blur-sm hover:-translate-y-1 ${
                isDark ? "border-slate-700/60" : "border-slate-200/60"
              }`}
            >
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${
                  isDark ? stat.bgColorDark : stat.bgColorLight
                } opacity-80`}
              />
              <div className="relative z-10">
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg mb-6`}
                >
                  <stat.icon size={24} />
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span
                    className={`text-4xl md:text-5xl font-bold tabular-nums ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {stat.count}
                  </span>
                  <span
                    className={`text-2xl font-semibold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  >
                    {stat.suffix}
                  </span>
                </div>
                <div
                  className={`text-lg font-semibold mb-1 ${
                    isDark ? "text-slate-200" : "text-slate-800"
                  }`}
                >
                  {stat.label}
                </div>
                <p
                  className={`text-sm ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Companies dengan animasi geser */}
        <Companieslist />
      </div>
    </section>
  );
}
