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
  

export default function MyService() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("service");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const isDark = resolvedTheme === "dark";

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
        <div className="text-center mb-20">
          <h2
            className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight block bg-gradient-to-r ${
              isDark
                ? "from-cyan-400 via-blue-400 to-cyan-400"
                : "from-blue-600 via-cyan-600 to-blue-600"
            } bg-clip-text text-transparent mb-5`}
          >
            {t("titleLine1")}
          </h2>
          <div className="flex justify-center gap-2 mb-5">
            <div
              className={`h-1 w-20 rounded-full ${
                isDark ? "bg-cyan-400" : "bg-blue-600"
              }`}
            />
            <div
              className={`h-1 w-8 rounded-full ${
                isDark ? "bg-blue-400" : "bg-cyan-600"
              } opacity-60`}
            />
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          {t("description1")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Frontend Development */}
          <ServiceCard
            icon={<Code2 className="w-8 h-8 text-white" />}
            title="Frontend Development"
            description="Pengembangan antarmuka web modern dengan React, Next.js, dan teknologi terdepan."
            bullets={[
              "Single Page Applications (SPA)",
              "Server-Side Rendering (SSR)",
              "Progressive Web Apps (PWA)",
              "Mobile-First Design",
            ]}
            color="from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500"
          />

          {/* Performance Optimization */}
          <ServiceCard
            icon={<Gauge className="w-8 h-8 text-white" />}
            title="Performance Optimization"
            description="Optimasi performa website untuk kecepatan loading maksimal dan SEO terbaik."
            bullets={[
              "Core Web Vitals Optimization",
              "Image & Asset Optimization",
              "Code Splitting & Lazy Loading",
              "SEO Technical Audit",
            ]}
            color="from-blue-500 to-slate-500 dark:from-blue-400 dark:to-slate-400"
          />

          {/* Responsive Development */}
          <ServiceCard
            icon={<Smartphone className="w-8 h-8 text-white" />}
            title="Responsive Development"
            description="Website responsif sempurna dan optimal di semua perangkat modern."
            bullets={[
              "Mobile-First Approach",
              "Cross-Browser Compatibility",
              "Touch-Friendly Interfaces",
              "Performance on Mobile",
            ]}
            color="from-slate-600 to-blue-500 dark:from-slate-500 dark:to-blue-400"
          />

          {/* Web App Development */}
          <ServiceCard
            icon={<Globe className="w-8 h-8 text-white" />}
            title="Web App Development"
            description="Pengembangan aplikasi web lengkap dan scalable dari konsep hingga production."
            bullets={[
              "Full-Stack Development",
              "API Integration",
              "Database Design",
              "Cloud Deployment",
            ]}
            color="from-blue-600 to-slate-600 dark:from-blue-500 dark:to-slate-500"
          />

          {/* Technical Consulting */}
          <ServiceCard
            icon={<Cog className="w-8 h-8 text-white" />}
            title="Technical Consulting"
            description="Konsultasi teknis profesional untuk arsitektur, stack teknologi, dan best practices."
            bullets={[
              "Technology Stack Planning",
              "Code Review & Audit",
              "Architecture Planning",
              "Team Training & Mentoring",
            ]}
            color="from-slate-500 to-blue-600 dark:from-slate-400 dark:to-blue-500"
          />
        </div>
      </div>
    </section>
  );
}