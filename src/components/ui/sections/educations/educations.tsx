import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Building2, ChevronDown, GraduationCap } from "lucide-react";
import { Experience, ModernCard } from "./educationcard";
import { experiences } from "@/lib/data/dummy/experienceslist";
import "./education.css";
import { useTranslations } from "next-intl";
import { Button } from "../../button";

export default function Education() {
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("experience");
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("educations");

  // Pastikan component sudah mounted untuk menghindari hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Gunakan fallback theme jika belum mounted atau theme belum resolved
  const isDark = mounted ? resolvedTheme === "dark" : false;

  const experienceList = experiences.filter((exp) =>
    ["experience", "pengalaman"].includes(exp.type)
  );
  
  const educationList = experiences.filter((exp) =>
    ["education", "pendidikan"].includes(exp.type)
  );

  if (!mounted) return null

  return (
    <section
      id="experience"
      className={`relative min-h-screen py-28 sm:py-36 lg:py-40 overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-slate-950" : "bg-gradient-to-t from-white to-slate-50"
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-50 -right-20 sm:top-70 sm:-right-40 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl transition-colors duration-500 ${
            isDark ? "bg-blue-600/15" : "bg-blue-400/15"
          }`}
          style={{ animation: "float 8s ease-in-out infinite" }}
        />
        <div
          className={`absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-48 h-48 sm:w-80 sm:h-80 rounded-full blur-3xl transition-colors duration-500 ${
            isDark ? "bg-slate-600/15" : "bg-slate-400/15"
          }`}
          style={{ 
            animation: "float 10s ease-in-out infinite reverse", 
            animationDelay: "2s" 
          }}
        />
        <div
          className={`absolute top-1/2 left-1/2 w-32 h-32 sm:w-64 sm:h-64 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-500 ${
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
        <div className="text-center mb-12 sm:mb-16 transition-all duration-1000">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight">
            <span 
              className={`block transition-colors duration-300 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {t("titleLine1")}
            </span>
            <span className="block bg-gradient-to-r from-blue-600 via-cyan-600 to-slate-600 bg-clip-text text-transparent">
              {t("titleLine2")}
            </span>
          </h2>
          
          <p 
            className={`text-base sm:text-lg lg:text-xl max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4 transition-colors duration-300 ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {t("description1")}
          </p>
        </div>

        {/* Tabs */}
        <div className="w-full">
          {/* Tab Buttons */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <div
              className={`flex gap-3 w-full max-w-md rounded-2xl p-1.5 transition-all duration-300 ${
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
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// Tab Button Component
function TabButton({ 
  isActive, 
  onClick, 
  icon, 
  label, 
  isDark 
}: {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  isDark: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base cursor-pointer transform hover:scale-[1.02] ${
        isActive
          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105"
          : isDark
          ? "text-slate-300 hover:text-white hover:bg-slate-700/60"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{label}</span>
    </button>
  );
}

// Collapsible Timeline Component
function CollapsibleTimeline({
  items,
  isDark,
  type,
  t,
}: {
  items: Experience[];
  isDark: boolean;
  type: "experience" | "education";
  t: ReturnType<typeof useTranslations>;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxInitialItems = 2;
  const shouldShowCollapseButton = items.length > maxInitialItems;
  const displayItems = isExpanded ? items : items.slice(0, maxInitialItems);

  return (
    <div className="relative mx-auto">
      {/* Timeline Content */}
      <div 
        className={`relative transition-all duration-700 ease-in-out ${
          !isExpanded && shouldShowCollapseButton ? 'max-h-[1000px] pt-5 overflow-hidden' : ''
        }`}
      >
        <Timeline items={displayItems} isDark={isDark} type={type} />

        {/* Blur Overlay when collapsed */}
        {!isExpanded && shouldShowCollapseButton && (
          <div 
            className={`absolute inset-x-0 bottom-0 h-32 pointer-events-none transition-colors duration-300 ${
              isDark 
                ? "bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"
                : "bg-gradient-to-t from-white via-slate-50/80 to-transparent"
            }`} 
          />
        )}
      </div>

      {/* Expand/Collapse Button */}
      {shouldShowCollapseButton && (
      <div className="flex justify-center mt-2 sm:mt-5">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant={isDark ? "outline" : "secondary"}
          size="lg"
          className={`group flex items-center gap-3 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 transform backdrop-blur-md
            ${
              isDark
                ? "bg-slate-800/70 hover:bg-slate-700/80 text-slate-200 hover:text-white border border-slate-700/60 hover:border-slate-600"
                : "bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
            }`}
        >
          <span>
            {isExpanded
              ? t("showLess") || "Show Less"
              : t("showMore") || `Show All ${items.length} Items`}
          </span>
          <div
            className={`transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </Button>
      </div>
    )}
    </div>
  );
}

// Timeline Component
function Timeline({
  items,
  isDark,
  type,
}: {
  items: Experience[];
  isDark: boolean;
  type: "experience" | "education";
}) {
  return (
    <div className="relative mx-auto">
      {/* Desktop Timeline Line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 hidden lg:block">
        <div 
          className={`w-1 h-full rounded-full transition-colors duration-300 ${
            isDark
              ? "bg-gradient-to-b from-blue-500/30 via-cyan-500/40 to-slate-500/30"
              : "bg-gradient-to-b from-blue-400/40 via-cyan-400/50 to-slate-400/40"
          }`}
        />
      </div>

      {/* Mobile Timeline Line */}
      <div className="absolute left-6 top-0 bottom-0 block lg:hidden">
        <div 
          className={`w-0.5 h-full rounded-full transition-colors duration-300 ${
            isDark
              ? "bg-gradient-to-b from-blue-500/30 via-cyan-500/40 to-slate-500/30"
              : "bg-gradient-to-b from-blue-400/40 via-cyan-400/50 to-slate-400/40"
          }`}
        />
      </div>

      <div className="space-y-8 sm:space-y-12 lg:space-y-16">
        {items.map((exp, index) => (
          <TimelineItem 
            key={`${exp.company || exp.type}-${index}`}
            exp={exp} 
            index={index} 
            isDark={isDark} 
            type={type}
          />
        ))}
      </div>
    </div>
  );
}

// Timeline Item Component
function TimelineItem({
  exp,
  isDark,
  index,
  type,
}: {
  exp: Experience;
  isDark: boolean;
  index: number;
  type: "experience" | "education";
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative transition-all duration-1000"
      style={{ transitionDelay: `${index * 200}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center">
        {/* Timeline Dot */}
        <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
          <div 
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              isDark
                ? `${isHovered ? "bg-cyan-400 scale-1.3 shadow-lg shadow-cyan-400/50" : "bg-blue-500"} ring-4 ring-slate-900`
                : `${isHovered ? "bg-cyan-500 scale-1.3 shadow-lg shadow-cyan-500/50" : "bg-blue-600"} ring-4 ring-white`
            }`} 
          />
        </div>

        {/* Left Side */}
        <div className="w-1/2 pr-8 xl:pr-12">
          {exp.side === "left" && (
            <div className="flex justify-end">
              <ModernCard 
                exp={exp} 
                isDark={isDark} 
                type={type} 
                isHovered={isHovered} 
              />
            </div>
          )}
        </div>
        
        {/* Right Side */}
        <div className="w-1/2 pl-8 xl:pl-12">
          {exp.side === "right" && (
            <ModernCard 
              exp={exp} 
              isDark={isDark} 
              type={type} 
              isHovered={isHovered} 
            />
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block lg:hidden">
        {/* Mobile Timeline Dot */}
        <div className="absolute left-6 transform -translate-x-1/2 z-20">
          <div 
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
              isDark
                ? `${isHovered ? "bg-cyan-400 scale-125" : "bg-blue-500"} ring-2 sm:ring-4 ring-slate-900`
                : `${isHovered ? "bg-cyan-500 scale-125" : "bg-blue-600"} ring-2 sm:ring-4 ring-white`
            }`} 
          />
        </div>

        <div className="ml-12 sm:ml-16">
          <ModernCard 
            exp={exp} 
            isDark={isDark} 
            type={type} 
            isHovered={isHovered} 
          />
        </div>
      </div>
    </div>
  );
}