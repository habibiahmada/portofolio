"use client";

import { useTheme } from "next-themes";

type SectionHeaderProps = {
  id?: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
  className?: string;
};

export default function SectionHeader({
  id,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const alignmentClasses =
    align === "left"
      ? "text-left items-start"
      : align === "right"
      ? "text-right items-end"
      : "text-center items-center";

  const underlineWrapperAlignment =
    align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center";

  return (
    <div className={`w-full flex flex-col gap-4 ${alignmentClasses} ${className ?? ""}`}>
      <h2 id={id} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
        <span className={`block bg-gradient-to-r ${
                    isDark
                      ? "from-cyan-400 via-blue-400 to-cyan-400"
                      : "from-blue-600 via-cyan-600 to-blue-600"
                  } bg-clip-text text-transparent`}>{title}</span>
      </h2>
      {description ? (
        <p
          className={`text-base sm:text-lg lg:text-xl max-w-3xl leading-relaxed ${
            isDark ? "text-slate-300" : "text-slate-600"
          } ${align === "center" ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      ) : null}
      <div className={`flex ${underlineWrapperAlignment} gap-2`}>
        <div className={`h-1 w-20 rounded-full ${isDark ? "bg-cyan-400" : "bg-blue-600"}`} />
        <div className={`h-1 w-8 rounded-full ${isDark ? "bg-blue-400" : "bg-cyan-600"} opacity-60`} />
      </div>
    </div>
  );
}


