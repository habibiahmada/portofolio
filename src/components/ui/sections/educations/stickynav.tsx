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
        const date = new Date(item.start_date);
        const monthName = date.toLocaleString("id-ID", {
          month: "long",
        });

        const active = idx === activeIndex;

        return (
          <div
            key={item.id}
            className={`flex items-center gap-4 transition ${active ? "opacity-100 translate-x-2" : "opacity-70"
              }`}
          >
            <span
              className={`font-mono text-sm font-medium ${active
                  ? isDark
                    ? "text-cyan-300"
                    : "text-blue-700"
                  : isDark
                    ? "text-slate-200"
                    : "text-slate-600"
                }`}
            >
              {monthName}
            </span>

            <span
              className={`h-px w-10 ${active
                  ? isDark
                    ? "bg-cyan-400"
                    : "bg-blue-600"
                  : "bg-slate-300"
                }`}
            />

            <span
              className={`text-sm truncate max-w-[140px] ${isDark ? "text-slate-300" : "text-slate-700"
                }`}
            >
              {item.company}
            </span>
          </div>
        );
      })}
    </div>
  );
}