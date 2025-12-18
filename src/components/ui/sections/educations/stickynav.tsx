import { Experience } from "@/lib/types/database";

export default function StickyNav({
  items,
  activeIndex,
  isDark,
}: {
  items: Experience[];
  activeIndex: number;
  isDark: boolean;
}) {
  return (
    <div className="sticky top-32 flex flex-col gap-6">
      {items.map((item, idx) => {
        const active = idx === activeIndex;
        return (
          <div
            key={item.id}
            className={`flex items-center gap-4 transition ${
              active ? "opacity-100 translate-x-2" : "opacity-50"
            }`}
          >
            <span className={`font-mono text-sm ${
              active
                ? isDark ? "text-cyan-400" : "text-blue-600"
                : "text-slate-400"
            }`}>
              {item.start_date}
            </span>

            <span className={`h-px w-10 ${
              active
                ? isDark ? "bg-cyan-400" : "bg-blue-600"
                : "bg-slate-300"
            }`} />

            <span className="text-sm truncate max-w-[140px]">
              {item.company}
            </span>
          </div>
        );
      })}
    </div>
  );
}