'use client';

import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import "./about.css";

export default function About() {
  const { resolvedTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("about");

  useEffect(() => {
    setMounted(true);
    setIsVisible(true);
  }, []);

  if (!mounted) return null;
  const isDark = resolvedTheme === "dark";

  return (
    <section
      id="about"
      className={`relative overflow-hidden transition-all duration-700 py-28 sm:py-36 lg:py-40
        ${isDark ? "bg-slate-950" : "bg-gradient-to-t from-slate-50 via-gray-50 to-slate-50"}`}
    >
      {/* Background Shapes */}
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

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Image Section */}
          <div
            className={`order-2 lg:order-1 transition-all duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <div className="relative group">
              <Image
                src="/about-illustration.webp"
                alt="Habibi Ahmad Aziz - Web Developer"
                width={600}
                height={600}
                className="relative w-90 max-w-sm sm:max-w-md lg:max-w-lg mx-auto transition-all duration-700 group-hover:scale-[1.02] drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)]"
                draggable={false}
              />
              {/* Decorative Elements */}
              <div
                className={`absolute -top-6 -right-6 w-16 h-16 border-4 rotate-45 ${
                  isDark ? "border-cyan-400/40" : "border-cyan-500/60"
                } animate-pulse`}
              />
              <div
                className={`absolute -bottom-4 -left-4 w-12 h-12 rounded-full ${
                  isDark ? "bg-blue-400/30" : "bg-blue-500/40"
                } animate-bounce-slow`}
              />
            </div>
          </div>

          {/* Content Section */}
          <div
            className={`order-1 lg:order-2 space-y-8 transition-all duration-1000 delay-200 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            }`}
          >
            {/* Title */}
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                <span className={isDark ? "text-white" : "text-slate-900"}>
                  {t("titleLine1")}
                </span>
                <span
                  className={`block bg-gradient-to-r ${
                    isDark
                      ? "from-cyan-400 via-blue-400 to-cyan-400"
                      : "from-blue-600 via-cyan-600 to-blue-600"
                  } bg-clip-text text-transparent`}
                >
                  {t("titleLine2")}
                </span>
              </h2>
              <div className="flex justify-center lg:justify-start gap-2">
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
            </div>

            {/* Short Description */}
            <div className="space-y-4">
              <p
                className={`text-lg sm:text-xl leading-relaxed ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                {t("description1")}
              </p>
              <p
                className={`text-base leading-relaxed ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {t("description2")}
              </p>
              <p
                className={`text-base leading-relaxed ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {t("description3")}
              </p>
            </div>

            {/* CTA */}
            <div className="pt-6">
              <button
                className={`group relative px-8 py-4 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-xl hover:shadow-blue-500/25"
                    : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-400/25"
                }`}
              >
                <span className="relative z-10">{t("cta")}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}