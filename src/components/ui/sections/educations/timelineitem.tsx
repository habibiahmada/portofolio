import { useState } from "react";
import { ModernCard } from "./educationcard";
import { Experience } from "@/lib/types/database";

export default function TimelineItem({
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

  const isLeft = index % 2 == 0;

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
                ? `${
                    isHovered
                      ? "bg-cyan-400 scale-1.3 shadow-lg shadow-cyan-400/50"
                      : "bg-blue-500"
                  } ring-4 ring-slate-900`
                : `${
                    isHovered
                      ? "bg-cyan-500 scale-1.3 shadow-lg shadow-cyan-500/50"
                      : "bg-blue-600"
                  } ring-4 ring-white`
            }`}
          />
        </div>

        {/* Left Side */}
        <div className="w-1/2 pr-8 xl:pr-12">
          {isLeft && (
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
          {!isLeft && (
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
                ? `${
                    isHovered ? "bg-cyan-400 scale-125" : "bg-blue-500"
                  } ring-2 sm:ring-4 ring-slate-900`
                : `${
                    isHovered ? "bg-cyan-500 scale-125" : "bg-blue-600"
                  } ring-2 sm:ring-4 ring-white`
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
