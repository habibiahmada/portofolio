'use client';

import { CheckCircle, Clock, Users } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Stats() {
  const t = useTranslations();

  const stats = [
    { 
      icon: CheckCircle, count: 50, suffix: "+",
      label: t("stats.projects.label"), 
      description: t("stats.projects.description"),
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50",
    },
    { 
      icon: Clock, count: 5, suffix: "+",
      label: t("stats.experience.label"), 
      description: t("stats.experience.description"),
      color: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50",
    },
    { 
      icon: Users, count: 30, suffix: "+",
      label: t("stats.clients.label"), 
      description: t("stats.clients.description"),
      color: "from-purple-500 to-pink-600",
      bgColor: "from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50",
    },
  ];

  const companies = [
    { name: t("companies.techcorp"), logo: "TC" },
    { name: t("companies.innovatelab"), logo: "IL" },
    { name: t("companies.digitalflow"), logo: "DF" },
    { name: t("companies.cloudsync"), logo: "CS" },
    { name: t("companies.datavision"), logo: "DV" },
    { name: t("companies.systempro"), logo: "SP" },
  ];

  return (
    <section id="stats" className="relative py-28 sm:py-36 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-gray-50 to-slate-50 
        dark:from-slate-950 dark:via-gray-950 dark:to-slate-950" />

      <div className="absolute inset-0 bg-[size:40px_40px]
        bg-[linear-gradient(rgba(148,163,184,0.2)_1px,transparent_1px),
        linear-gradient(90deg,rgba(148,163,184,0.2)_1px,transparent_1px)]
        dark:bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),
        linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)]
        [mask-image:radial-gradient(ellipse_50%_45%_at_50%_50%,#000_70%,transparent_100%)]"
      />

      <div className="relative container mx-auto px-6 max-w-7xl">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="relative p-8 rounded-2xl border backdrop-blur-sm transition-all duration-500 hover:-translate-y-1"
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.bgColor} opacity-80`} />
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg mb-6`}>
                  <stat.icon size={24} />
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tabular-nums">
                    {stat.count}
                  </span>
                  <span className={`text-2xl font-semibold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.suffix}
                  </span>
                </div>
                <div className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  {stat.label}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Companies */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
            {t("stats.trustedBy")}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            {t("stats.trustedDescription")}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
            {companies.map((company, i) => (
              <div
                key={i}
                className="h-16 rounded-xl border border-slate-200/60 dark:border-slate-700/60 
                  bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-1 rounded bg-gradient-to-br from-slate-600 to-slate-800 
                    dark:from-slate-300 dark:to-slate-500 text-white dark:text-slate-900 text-xs font-bold 
                    flex items-center justify-center shadow-sm">
                    {company.logo}
                  </div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300 opacity-80">
                    {company.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}