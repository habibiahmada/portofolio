'use client';

import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import SectionHeader from "../SectionHeader";
import Ctabutton from "../ctabutton";

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
      className={`relative overflow-hidden py-28 lg:py-36 transition-colors duration-300 ease-in-out 
        ${isDark ? "bg-slate-950" : "bg-gradient-to-t from-slate-50 via-gray-50 to-slate-50"}`}
    >
      {/* Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-1/4 -left-20 w-80 h-80 rounded-full blur-3xl opacity-10 ${isDark ? "bg-blue-500" : "bg-blue-300"
            } animate-blob`}
        />
        <div
          className={`absolute bottom-1/4 -right-20 w-72 h-72 rounded-full blur-3xl opacity-10 ${isDark ? "bg-cyan-500" : "bg-cyan-300"
            } animate-blob animation-delay-2000`}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Image Section */}
          <div
            className={`order-2 lg:order-1 ${isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-10 opacity-0"
              }`}
          >
            <div className="relative group">
              <div className={`absolute inset-0 z-10 opacity-20 group-hover:opacity-20 transition-opacity duration-500 
                  bg-gradient-to-tr from-blue-600 to-transparent mix-blend-overlay`} />
              <Image
                src="/images/about-photo.png"
                alt="Habibi Ahmad Aziz - Web Developer"
                width={800}
                height={800}
                placeholder="blur"
                blurDataURL="/images/about-photo-blur.png"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                draggable={false}
              />

              {/* Decorative Elements */}
              <div
                className={`absolute -bottom-4 -left-4 w-12 h-12 rounded-full ${isDark ? "bg-blue-400/30" : "bg-blue-500/40"
                  } animate-bounce-slow`}
              />
              <div className={`absolute -top-6 -right-6 w-24 h-24 opacity-20 pointer-events-none ${isDark ? "text-cyan-400" : "text-blue-500"}`}>
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div
            className={`order-1 lg:order-2 space-y-8 ${isVisible
              ? "translate-x-0 opacity-100"
              : "translate-x-10 opacity-0"
              }`}
          >
            {/* Title */}
            <SectionHeader
              title={`${t("titleLine1")} ${t("titleLine2")}`}
              align="left"
              className="lg:text-left"
            />

            {/* Short Description */}
            <div className={`space-y-6 text-lg leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              <p className="transition-opacity hover:opacity-100 opacity-90">
                {t("description1")}
              </p>

              {/* Highlighted Quote Box */}
              <div className={`relative pl-6 py-2 border-l-4 ${isDark ? "border-blue-500/50 bg-blue-500/5" : "border-blue-500 bg-blue-50"}`}>
                <p className={`italic font-medium ${isDark ? "text-blue-200" : "text-blue-800"}`}>
                  &ldquo;{t("description2")}&rdquo;
                </p>
              </div>

              <p className="opacity-90">
                {t("description3")}
              </p>
            </div>

            {/* CTA */}
            <div className="pt-6">
              <Ctabutton isDark={isDark} text={t("cta")} href="#contact" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}