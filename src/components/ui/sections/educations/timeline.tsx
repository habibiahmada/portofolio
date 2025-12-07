import { Experience } from "@/lib/types/database";
import TimelineItem from "./timelineitem";
import { TimelineItemSkeleton } from "./timelineitemskeleton";

// Timeline Component
export default function Timeline({
  items,
  isDark,
  type,
  loading,
}: {
  items: Experience[];
  isDark: boolean;
  type: "experience" | "education";
  loading: boolean;
}) {
  return (
    <div className="relative mx-auto">
      {/* Desktop Timeline Line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 hidden lg:block">
        <div
          className={`w-1 h-full rounded-full ${
            isDark
              ? "bg-gradient-to-b from-blue-500/30 via-cyan-500/40 to-slate-500/30"
              : "bg-gradient-to-b from-blue-400/40 via-cyan-400/50 to-slate-400/40"
          }`}
        />
      </div>

      {/* Mobile Timeline Line */}
      <div className="absolute left-6 top-0 bottom-0 block lg:hidden">
        <div
          className={`w-0.5 h-full rounded-full ${
            isDark
              ? "bg-gradient-to-b from-blue-500/30 via-cyan-500/40 to-slate-500/30"
              : "bg-gradient-to-b from-blue-400/40 via-cyan-400/50 to-slate-400/40"
          }`}
        />
      </div>

      <div className="space-y-8 sm:space-y-12 lg:space-y-16">
        {loading
          ? // 🔹 Render skeleton saat loading
            [...Array(4)].map((_, index) => (
              <TimelineItemSkeleton key={`skeleton-${index}`} index={index} />
            ))
          : // 🔹 Render data asli
            items.map((exp, index) => (
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
