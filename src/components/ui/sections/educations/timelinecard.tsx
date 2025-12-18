import { Experience } from "@/lib/types/database";
import { Briefcase, MapPin } from "lucide-react";
import { useRef, useState } from "react";

const Badge = ({ children, isDark }: { children: React.ReactNode; isDark: boolean }) => (
  <span className={`px-2.5 py-0.5 text-xs rounded-md border ${
    isDark
      ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
      : "bg-blue-50 text-blue-700 border-blue-200"
  }`}>
    {children}
  </span>
);

export default function TimelineCard({
  data,
  isDark,
  isActive,
}: {
  data: Experience;
  isDark: boolean;
  isActive: boolean;
}) {
  const t = data.experience_translations?.[0];
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  if (!t) return null;

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      className={`relative border overflow-hidden transition ${
        isDark
          ? "bg-slate-900/40 border-slate-800"
          : "bg-white border-slate-200"
      } ${isActive ? "ring-1 ring-cyan-500/30" : ""}`}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition"
        style={{
          background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, ${
            isDark ? "rgba(6,182,212,0.1)" : "rgba(59,130,246,0.08)"
          }, transparent 40%)`,
        }}
      />

      <div className="p-6 sm:p-8 relative">
        <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
          {t.title}
        </h3>

        <div className="flex items-center gap-2 mt-2 text-sm">
          <Briefcase size={16} />
          {data.company}
        </div>

        <div className="flex items-center gap-2 text-sm mt-1">
          <MapPin size={16} />
          {data.location} ({t.location_type})
        </div>

        <p className="mt-4 text-sm text-slate-500">{t.description}</p>

        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-dashed border-slate-500/30">
          {data.skills.map((skill, i) => (
            <Badge key={i} isDark={isDark}>{skill}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}