'use client';

import Image from "next/image";
import { ChevronDown, Eye, Download } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import Link from "next/link";
import Ctabutton from "../ctabutton";
import TechIconsDecorations from "./techicon";
import Writertext from "./writertext";

export default function Hero() {
  const { resolvedTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('hero');

  useEffect(() => {
    setMounted(true);
    setIsVisible(true);

  }, []);

  if (!mounted) return null;
  
  const isDark = resolvedTheme === "dark";


  return (
    <section
    id="home"
    className={`relative overflow-hidden transition-all duration-700 
        min-h-screen flex items-center 
        pt-24 sm:pt-28 lg:pt-32 pb-24
        ${isDark
        ? "bg-gradient-to-br from-slate-950 to-slate-950"
        : "bg-gradient-to-br from-slate-50 via-white to-blue-50/30"
        }`}
    aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 -z-10">
        <div
          className={`absolute inset-0 opacity-30 ${
            isDark
              ? "bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)]"
              : "bg-[linear-gradient(rgba(148,163,184,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.2)_1px,transparent_1px)]"
          } bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_50%,#000_60%,transparent_100%)]`}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        {/* Text Content */}
        <div
          className={`space-y-8 transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
              {/* Intro */}
              <div className="space-y-2">
                <span className="text-lg font-medium tracking-wide text-blue-600 dark:text-blue-400">
                  {t('greeting')}
                </span>
                <h1
                  id="hero-heading"
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
                  style={{ minHeight: "10rem" }}
                >
                  <Writertext isDark={isDark} />
                </h1>

                <div
                  className={`h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 ${
                    isVisible ? "animate-pulse" : ""
                  }`}
                />
              </div>

              {/* Professional Description */}
              <p
                className={`text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-lg font-light ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {t('description')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {/* Projects */}
                <Ctabutton isDark={isDark} icon={Eye} text={t('buttons.viewProjects')} href="#projects"/>

                {/* Resume */}
                <Link
                  href="/cv.pdf"
                  download
                  className={`group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg border-2 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 ${
                    isDark
                      ? "bg-white/5 border-white/20 text-slate-200 hover:bg-white/10 hover:border-blue-500/50 focus:ring-white/20"
                      : "bg-white/70 border-slate-200 text-slate-700 hover:bg-white hover:border-blue-400 focus:ring-slate-300"
                  }`}
                >
                  <Download size={20} className="group-hover:animate-bounce" />
                  {t('buttons.downloadCV')}
                </Link>
              </div>
        </div>

        {/* Image Section with Decorative Elements */}
        <div
          className={`relative transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Decorative rings behind image */}
          <div className="absolute inset-0 -z-10">
            <div
              className={`absolute hidden sm:block top-14 left-16 transform -translate-x-1 -translate-y-1/2 w-80 h-80 rounded-full border-2 opacity-20 ${
                isDark ? "border-blue-400" : "border-blue-500"
              }`}
            />
            <div
              className={`absolute hidden sm:block top-1 left-1 transform -translate-x-1 -translate-y-1/2 w-96 h-96 rounded-full border opacity-10 ${
                isDark ? "border-cyan-400" : "border-cyan-500"
              }`}
            />
          </div>

          {/* Main image */}
          <div className="relative">
            {/* Unique hexagonal background */}
            <div className="absolute -inset-8">
                <div 
                    className={`w-full h-full opacity-20 ${
                        isDark ? "bg-blue-500/20" : "bg-blue-400/30"
                    }`}
                    style={{
                        clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                        transform: "scale(1.1)",
                    }}
                />
            </div>
              <Image
                src="/self-photo-habibi-ahmad-aziz.webp"
                alt={t('imageAlt')}
                width={600}
                height={600}
                className="w-full select-none max-w-sm sm:max-w-md lg:max-w-lg mx-auto rounded-3xl drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)] transition-transform duration-700 hover:scale-105"
                draggable={false}
                priority={true}
                sizes="(max-width: 768px) 100vw, 600px"
                blurDataURL="/self-photo-habibi-ahmad-aziz-small.webp"
              />
          </div>

          {/* Tech Icons Decoration */}
          <TechIconsDecorations isDark={isDark} />

          {/* Floating accent elements */}
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 animate-pulse-slow" />
          <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 animate-pulse-slow delay-1000" />
          
          {/* Code-like decorative elements */}
              <div
                className={`absolute -top-8 left-4 px-3 py-1 rounded-lg text-xs font-mono ${
                  isDark ? "bg-slate-800/80 text-green-400" : "bg-slate-100/80 text-green-600"
                } backdrop-blur-sm`}
              >
                {t('codeElements.developer')}
              </div>
              
              <div
                className={`absolute top-0 right-2 px-3 py-1 lg:top-20 rounded-lg text-xs font-mono ${
                  isDark ? "bg-slate-800/80 text-blue-400" : "bg-slate-100/80 text-blue-600"
                } backdrop-blur-sm`}
              >
                console.log(&quot;{t('codeElements.console')}&quot;)
              </div>
        </div>
      </div>

      {/* Scroll Indicator */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
          <div
            className={`flex flex-col items-center gap-2 transition-colors duration-300 ${
              isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-500 hover:text-blue-600"
            }`}
          >
            <span className="text-xs font-medium tracking-widest opacity-80">
              {t('scrollIndicator')}
            </span>
            <ChevronDown size={20} className="animate-bounce" />
          </div>
        </div>
      
      <div 
        className="absolute inset-0 opacity-[1] bg-[size:40px_40px]
          bg-[linear-gradient(rgba(148,163,184,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.3)_1px,transparent_1px)]
          dark:bg-[linear-gradient(rgba(59,130,246,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.15)_1px,transparent_1px)]
          [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
      />
    </section>
  );
}