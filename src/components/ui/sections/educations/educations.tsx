'use client';

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Building2, GraduationCap } from "lucide-react";
import useExperiences from "@/hooks/useExperiences";
import "./education.css";
import { useTranslations } from "next-intl";
import SectionHeader from "../SectionHeader";
import TabButton from "./tabbutton";
import CollapsibleTimeline from "./callapsibletimeline";

export default function Education() {
  const {experiences, loading} = useExperiences();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("experience");
  const t = useTranslations("educations");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  const isDark = resolvedTheme === "dark";


  const experienceList = experiences.filter((exp) =>
    ["experience", "pengalaman"].includes(exp.type)
  );
  
  const educationList = experiences.filter((exp) =>
    ["education", "pendidikan"].includes(exp.type)
  );


  return (
    <section
      id="experience"
      className={`relative min-h-screen pt-28 sm:pt-36 lg:pt-40 pb-10 overflow-hidden ${
        isDark ? "bg-slate-950" : "bg-gradient-to-t from-white to-slate-50"
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-50 -right-20 sm:top-70 sm:-right-40 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl ${
            isDark ? "bg-blue-600/15" : "bg-blue-400/15"
          }`}
          style={{ animation: "float 8s ease-in-out infinite" }}
        />
        <div
          className={`absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-48 h-48 sm:w-80 sm:h-80 rounded-full blur-3xl ${
            isDark ? "bg-slate-600/15" : "bg-slate-400/15"
          }`}
          style={{ 
            animation: "float 10s ease-in-out infinite reverse", 
            animationDelay: "2s" 
          }}
        />
        <div
          className={`absolute top-1/2 left-1/2 w-32 h-32 sm:w-64 sm:h-64 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 ${
            isDark ? "bg-cyan-600/10" : "bg-cyan-400/10"
          }`}
          style={{ 
            animation: "pulse-slow 1s ease-in-out infinite", 
            animationDelay: "1s" 
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <SectionHeader
            title={`${t("titleLine1")} ${t("titleLine2")}`}
            description={t("description1")}
            align="center"
          />
        </div>

        {/* Tabs */}
        <div className="w-full">
          {/* Tab Buttons */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <div
              className={`flex gap-3 w-full max-w-md rounded-2xl p-1.5 ${
                isDark
                  ? "bg-slate-800/70 backdrop-blur-md border border-slate-700/60"
                  : "bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm"
              }`}
            >
              {/* Experience Button */}
              <TabButton
                isActive={activeTab === "experience"}
                onClick={() => setActiveTab("experience")}
                icon={<Building2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                label={t("tabbuttons1")}
                isDark={isDark}
              />

              {/* Education Button */}
              <TabButton
                isActive={activeTab === "education"}
                onClick={() => setActiveTab("education")}
                icon={<GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />}
                label={t("tabbuttons2")}
                isDark={isDark}
              />
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-0">
            <CollapsibleTimeline
              items={activeTab === "experience" ? experienceList : educationList}
              isDark={isDark}
              type={activeTab as "experience" | "education"}
              t={t}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </section>
  );
}