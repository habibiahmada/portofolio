'use client';

import { useTranslations } from "next-intl";
import { Button } from "../../button";
import { Experience } from "@/lib/types/database";
import { useState } from "react";
import Timeline from "./timeline";
import { ChevronDown } from "lucide-react";

export default function CollapsibleTimeline({
    items,
    isDark,
    type,
    t,
    loading
  }: {
    items: Experience[];
    isDark: boolean;
    type: "experience" | "education";
    t: ReturnType<typeof useTranslations>;
    loading: boolean;
  }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxInitialItems = 2;
    const shouldShowCollapseButton = items.length > maxInitialItems;
    const displayItems = isExpanded ? items : items.slice(0, maxInitialItems);
  
    return (
      <div className="relative mx-auto">
        {/* Timeline Content */}
        <div 
          className={`relative ease-in-out ${
            !isExpanded && shouldShowCollapseButton ? 'max-h-[800px] pt-5 overflow-hidden' : ''
          }`}
        >
          <Timeline items={displayItems} isDark={isDark} type={type} loading={loading}/>
  
          {/* Blur Overlay when collapsed */}
          {!isExpanded && shouldShowCollapseButton && (
            <div 
              className={`absolute inset-x-0 bottom-0 h-32 pointer-events-none ${
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
            className={`group flex items-center gap-3 rounded-2xl font-semibold text-sm sm:text-base hover:scale-105 transform backdrop-blur-md
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
              className={`${
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