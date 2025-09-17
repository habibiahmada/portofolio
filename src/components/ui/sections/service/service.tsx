import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import {
  Code2,
  Gauge,
  Smartphone,
  Globe,
  Cog,
} from "lucide-react";
import { useTranslations } from "next-intl";
import ServiceCard from "./servicecard";
import SectionHeader from "../SectionHeader";

export default function MyService() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("service");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const isDark = resolvedTheme === "dark";

  // Service data with translations
  const services = [
    {
      icon: <Code2 className="w-8 h-8 text-white" />,
      title: t("frontend.title"),
      description: t("frontend.description"),
      bullets: [
        t("frontend.bullets.spa"),
        t("frontend.bullets.ssr"),
        t("frontend.bullets.pwa"),
        t("frontend.bullets.mobile"),
      ],
      color: "from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500"
    },
    {
      icon: <Gauge className="w-8 h-8 text-white" />,
      title: t("performance.title"),
      description: t("performance.description"),
      bullets: [
        t("performance.bullets.vitals"),
        t("performance.bullets.assets"),
        t("performance.bullets.splitting"),
        t("performance.bullets.seo"),
      ],
      color: "from-blue-500 to-slate-500 dark:from-blue-400 dark:to-slate-400"
    },
    {
      icon: <Smartphone className="w-8 h-8 text-white" />,
      title: t("responsive.title"),
      description: t("responsive.description"),
      bullets: [
        t("responsive.bullets.mobile"),
        t("responsive.bullets.compatibility"),
        t("responsive.bullets.touch"),
        t("responsive.bullets.performance"),
      ],
      color: "from-slate-600 to-blue-500 dark:from-slate-500 dark:to-blue-400"
    },
    {
      icon: <Globe className="w-8 h-8 text-white" />,
      title: t("webapp.title"),
      description: t("webapp.description"),
      bullets: [
        t("webapp.bullets.fullstack"),
        t("webapp.bullets.api"),
        t("webapp.bullets.database"),
        t("webapp.bullets.cloud"),
      ],
      color: "from-blue-600 to-slate-600 dark:from-blue-500 dark:to-slate-500"
    },
    {
      icon: <Cog className="w-8 h-8 text-white" />,
      title: t("consulting.title"),
      description: t("consulting.description"),
      bullets: [
        t("consulting.bullets.planning"),
        t("consulting.bullets.review"),
        t("consulting.bullets.architecture"),
        t("consulting.bullets.mentoring"),
      ],
      color: "from-slate-500 to-blue-600 dark:from-slate-400 dark:to-blue-500"
    }
  ];

  return (
    <section
      id="services"
      className={`relative overflow-hidden transition-all duration-700 pt-28 sm:pt-36 lg:pt-40 pb-5
        ${isDark ? "bg-slate-950" : "bg-gradient-to-b from-white to-slate-50"}`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-1/4 -left-20 w-80 h-80 rounded-full blur-3xl opacity-10 ${
            isDark ? "bg-blue-500" : "bg-blue-300"
          } animate-blob`}
        />
        <div
          className={`absolute bottom-1/4 -right-20 w-72 h-72 rounded-full blur-3xl opacity-10 ${
            isDark ? "bg-cyan-500" : "bg-cyan-300"
          } animate-blob animation-delay-2000`}
        />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative">
        {/* Header */}
        <div className="mb-20">
          <SectionHeader
            title={t("titleLine1")}
            description={t("description1")}
            align="center"
          />
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              bullets={service.bullets}
              color={service.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}