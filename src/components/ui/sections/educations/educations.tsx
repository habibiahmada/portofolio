'use client';

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Briefcase, GraduationCap } from "lucide-react";
import useExperiences from "@/hooks/api/public/useExperiences";
import { useTranslations } from "next-intl";
import StickyNav from "./stickynav";
import TimelineCard from "./timelinecard";

export default function Education() {
  const { experiences, loading } = useExperiences();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"experience" | "education">("experience");
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const t = useTranslations("educations");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset active index saat ganti tab
  useEffect(() => {
    setActiveCardIndex(0);
  }, [activeTab]);

  // Scroll observer
  useEffect(() => {
    const handleScroll = () => {
      const cards = document.querySelectorAll('.timeline-card-wrapper');
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
      className={`w-full py-20 transition-colors duration-500 ${isDark ? "bg-[#0B1120]" : "bg-slate-50"
        }`}
    >
      <div className="max-w-[95rem] mx-auto">

        {/* HEADER */}
        <div className="relative mb-20 text-center space-y-4">
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <div className="w-[200px] h-[100px] bg-blue-500/20 blur-[100px] rounded-full" />
          </div>

          <h2 className={`text-4xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
            {t("titleLine1")}{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {t("titleLine2")}
            </span>
          </h2>

          <p className={`${isDark ? "text-slate-400" : "text-slate-600"} max-w-2xl mx-auto`}>
            {t("description1")}
          </p>
        </div>

        {/* TABS */}
        <div className="flex justify-center mb-16">
          <div className={`p-1.5 rounded-2xl flex gap-1 ${isDark ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-200"
            }`}>
            {(["experience", "education"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-3 text-sm font-bold transition-all cursor-pointer ${activeTab === tab
                    ? isDark
                      ? "text-white"
                      : "text-slate-800"
                    : isDark
                      ? "text-slate-500 hover:text-slate-300"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                {activeTab === tab && (
                  <div className={`absolute inset-0 ${isDark ? "bg-slate-800" : "bg-slate-100"
                    }`} />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {tab === "experience" ? <Briefcase size={16} /> : <GraduationCap size={16} />}
                  {t(`tabbuttons${tab}`)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="hidden md:block lg:col-span-3">
            <StickyNav
              items={filteredExperiences}
              activeIndex={activeCardIndex}
              isDark={isDark}
            />
          </div>

          <div className="lg:col-span-9 space-y-12 pb-24 relative">
            {filteredExperiences.map((exp, index) => (
              <div
                key={exp.id}
                className="timeline-card-wrapper relative px-12 lg:px-0"
              >
                <TimelineCard
                  data={exp}
                  isDark={isDark}
                  isActive={activeCardIndex === index}
                />
              </div>
            ))}

            {!loading && filteredExperiences.length === 0 && (
              <div className="text-center py-20 text-slate-400">
                No data available.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}