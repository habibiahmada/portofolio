import { Experience } from "@/lib/types/database";
import { Building2, Calendar, GraduationCap, MapPin, Star } from "lucide-react";


export function ModernCard({ 
  exp, 
  isDark, 
  type, 
  isHovered 
}: { 
  exp: Experience; 
  isDark: boolean; 
  type: "experience" | "education";
  isHovered: boolean;
}) {
  const translation = exp.experience_translations?.[0];
  const period = `${exp.start_date} - ${exp.end_date}`;

  return (
    <div
      className={`group relative rounded-xl sm:rounded-2xl transition-all duration-500 transform hover:translate-y-1 w-full  ${
        isDark
          ? "bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-lg border border-slate-700/50"
          : "bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-lg border border-slate-200/50"
      } ${isHovered ? "shadow-xl shadow-blue-500/10 scale-1.01" : "shadow-xl"}`}
    >
      {/* Highlight Badge */}
      {translation?.highlight && (
        <div className="absolute -top-2 sm:-top-3 left-4 sm:left-6 z-10">
          <div className="flex items-center gap-1 px-2 py-1 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold shadow-lg">
            <Star className="w-2 h-2 sm:w-3 sm:h-3" />
            <span className="text-xs">{translation?.highlight}</span>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-md ${
                type === "experience"
                  ? "bg-gradient-to-br from-blue-600 to-cyan-600"
                  : "bg-gradient-to-br from-slate-600 to-blue-600"
              }`}
            >
              {type === "experience" ? (
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              ) : (
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className={`w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                <span
                  className={`text-xs sm:text-sm font-medium truncate ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {period}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 sm:space-y-4">
          <div>
            <h3
              className={`text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 leading-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {translation?.title}
            </h3>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span
                className={`font-semibold text-base sm:text-lg ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {exp.company}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <MapPin className={`w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
              <span
                className={`text-xs sm:text-sm ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {exp.location} • {translation?.location_type}
              </span>
            </div>
          </div>

          <p
            className={`text-sm sm:text-base leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            {translation?.description}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-4 sm:pt-6">
            {exp.skills.map((skill, i) => (
              <span
                key={i}
                className={`px-2.5 py-1 sm:px-3 lg:px-4 sm:py-1.5 lg:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? "bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-300 border border-blue-500/30"
                    : "bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-700 border border-blue-200/50"
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
