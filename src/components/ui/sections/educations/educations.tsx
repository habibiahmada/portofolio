'use client';

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Briefcase, GraduationCap } from "lucide-react";
import useExperiences from "@/hooks/api/public/useExperiences";
import { useLocale, useTranslations } from "next-intl";
import StickyNav from "./stickynav";
import TimelineCard from "./timelinecard";
import SectionHeader from "../SectionHeader";
import TimelineCardSkeleton from "./timelinecardskeleton";
import StickyNavSkeleton from "./stickynavskeleton";

export default function Education() {
  const { experiences, loading } = useExperiences();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const locale = useLocale();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] =
    useState<"experience" | "education">("experience");
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const t = useTranslations("educations");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setActiveCardIndex(0);
  }, [activeTab]);

  useEffect(() => {
    const handleScroll = () => {
      const cards = document.querySelectorAll(".timeline-card-wrapper");
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
          setActiveCardIndex(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTab]);

  if (!mounted) return null;

  const filteredExperiences = experiences.filter(
    (item) => item.type === activeTab
  );

  return (
    <section
      id="experience"
      className={`w-full pt-20 transition-colors duration-500 ${isDark ? "bg-slate-900" : "bg-slate-50"
        }`}
    >
      <div className="container mx-auto px-4 relative">

        {/* HEADER */}
        <SectionHeader
          glow
          titleLine1={t("titleLine1")}
          titleLine2={t("titleLine2")}
          description={t("description1")}
        />

        {/* TABS */}
        <div className="flex justify-center my-14">
          <div
            className={`p-1.5 rounded-2xl flex items-center justify-center gap-1 border ${isDark
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-200"
              }`}
          >
            {(["experience", "education"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                aria-label={t(`tabbuttons${tab}`)}
                className={`relative px-4 py-3 text-sm font-semibold transition-all ${activeTab === tab
                  ? isDark
                    ? "text-white"
                    : "text-slate-900"
                  : isDark
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                {activeTab === tab && (
                  <div
                    className={`absolute inset-0 rounded-xl ${isDark ? "bg-slate-800" : "bg-slate-100"
                      }`}
                  />
                )}

                <span className="relative z-10 flex items-center gap-2">
                  {tab === "experience" ? (
                    <Briefcase size={16} />
                  ) : (
                    <GraduationCap size={16} />
                  )}
                  {t(`tabbuttons${tab}`)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="hidden md:block lg:col-span-3">
            {loading ? (
              <StickyNavSkeleton />
            ) : (
              <StickyNav
                items={filteredExperiences}
                activeIndex={activeCardIndex}
                isDark={isDark}
                locale={locale}
              />
            )}
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-9 space-y-12 pb-24 relative">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TimelineCardSkeleton key={i} isDark={isDark} />
              ))
            ) : filteredExperiences.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                No data available.
              </div>
            ) : (
              filteredExperiences.map((exp, index) => (
                <div key={exp.id} className="timeline-card-wrapper relative">
                  <TimelineCard
                    data={exp}
                    isDark={isDark}
                    isActive={activeCardIndex === index}
                  />
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </section>
  );
}