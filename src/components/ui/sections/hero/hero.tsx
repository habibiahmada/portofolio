'use client';

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { ChevronDown, Eye, Mouse, FileText } from "lucide-react";
import { DecorativeCode, BackgroundGrid } from "../../decorativeelement";
import useHero from "@/hooks/api/public/useHero";
import HeroImage from "./heroimage";
import Ctabutton from "../ctabutton";
import Writertext from "./writertext";
import HeroSkeleton from "./heroskeleton";
import CVPreviewModal from "./cvpreviewmodal";
import TechIconsDecorations from "./techicon";

export default function Hero({ blurDataURL }: { blurDataURL: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);
  const t = useTranslations("hero");

  const { heroData, loading, error } = useHero();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!loading && heroData) {
      setIsVisible(true);
    }
  }, [loading, heroData]);

  const isLoading = loading || !mounted;
  const isDark = resolvedTheme === "dark" || !mounted;

  if (isLoading) return <HeroSkeleton />;
  if (error) return null;

  return (
    <>
      <section
        id="home"
        className={`relative overflow-hidden flex items-center 
          pt-24 sm:pt-28 lg:pt-36 pb-24 transition-colors duration-300 min-h-[50rem]
          ${isDark
            ? "bg-gradient-to-br from-gray-950 to-gray-950"
            : "bg-gradient-to-br from-gray-50 via-white to-gray-50/30"
          }`}
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0 -z-10">
          <BackgroundGrid isDark={isDark} />
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          {/* Text Content */}
          <div
            className={`space-y-8 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
          >
            <div className="space-y-2">
              <span className="text-lg font-medium tracking-wide text-blue-600 dark:text-blue-400">
                {heroData?.greeting || t("hello", { default: "Hello, I'm..." })}
              </span>
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
                style={{ minHeight: "10rem" }}
              >
                <Writertext isDark={isDark} texts={heroData?.typewriter_texts || t.raw("fallbackTypewriter")} />
              </h1>
              <div
                className={`h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 ${isVisible ? "animate-pulse" : ""
                  }`}
              />
            </div>

            <p
              className={`text-md sm:text-lg lg:text-xl leading-relaxed max-w-lg font-light ${isDark ? "text-slate-300" : "text-slate-600"
                }`}
            >
              {heroData?.description || t("fallbackDescription", { default: "Building modern web applications." })}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Ctabutton isDark={isDark} icon={Eye} text={t("viewProjects", { default: "View Projects" })} href="#projects" />

              <button
                onClick={() => setShowCVModal(true)}
                className={`inline-flex items-center justify-center gap-3 px-5 py-2 rounded-full font-semibold text-lg border-2 backdrop-blur-sm transform focus:outline-none focus:ring-4 transition-all cursor-pointer ${isDark
                  ? "bg-white/5 border-white/20 text-slate-200 hover:bg-white/10 hover:border-blue-500/50 focus:ring-white/20"
                  : "bg-white/70 border-slate-200 text-slate-700 hover:bg-white hover:border-blue-400 focus:ring-slate-300"
                  }`}
              >
                <FileText size={20} />
                {t("viewCV", { default: "View CV" })}
              </button>
            </div>
          </div>

          {/* Image Section with Decorative Elements */}
          <div
            className={`relative delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
          >

            <HeroImage
              isDark={isDark}
              imageAlt={heroData?.greeting || "Profile Photo"}
              imageUrl="/images/self-photo-habibi-ahmad-aziz.webp"
              blurDataURL={blurDataURL}
            />

            <TechIconsDecorations isDark={isDark} />

            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 animate-pulse-slow" />
            <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 animate-pulse-slow delay-1000" />
            <DecorativeCode isDark={isDark} developerTag={heroData?.developer_tag} consoleTag={heroData?.console_tag} />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 animate-bounce duration-1000 ease-in-out">
          <div
            className={`flex flex-col items-center gap-2 ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-500 hover:text-blue-600"
              }`}
          >
            <span className="text-xs font-medium tracking-widest opacity-80">
              <Mouse className="w-4 h-4 rotate-180" />
            </span>
            <ChevronDown size={20} />
          </div>
        </div>
        <div
          className="absolute inset-0 opacity-[1] bg-[size:40px_40px]
          bg-[linear-gradient(rgba(148,163,184,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.3)_1px,transparent_1px)]
          dark:bg-[linear-gradient(rgba(59,130,246,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.15)_1px,transparent_1px)]
          [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
        />
      </section>

      {/* CV Preview Modal */}
      <CVPreviewModal
        isOpen={showCVModal}
        onClose={() => setShowCVModal(false)}
        cvUrl={heroData?.cv_url || "#"}
        isDark={isDark}
      />
    </>
  );
}