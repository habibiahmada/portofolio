"use client";

import { useTheme } from "next-themes";

type SectionHeaderProps = {
  id?: string;

  // title biasa
  title?: string;

  // title terpisah (opsional)
  titleLine1?: string;
  titleLine2?: string;

  description?: string;

  align?: "left" | "center" | "right";
  className?: string;

  underline?: boolean;
  glow?: boolean;
};

export default function SectionHeader({
  id,
  title,
  titleLine1,
  titleLine2,
  description,
  align = "center",
  className,
  underline = true,
  glow = false,
}: SectionHeaderProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const alignment =
    align === "left"
      ? "text-left items-start"
      : align === "right"
      ? "text-right items-end"
      : "text-center items-center";

  const underlineAlign =
    align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center";

  return (
    <div
      className={`relative w-full flex flex-col gap-4 ${alignment} ${className ?? ""}`}
    >
      {/* Glow background */}
      {glow && (
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <div className="w-[220px] h-[120px] bg-blue-500/20 blur-[100px] rounded-full" />
        </div>
      )}

      {/* Title */}
      <h2
        id={id}
        className="text-4xl lg:text-5xl font-extrabold leading-tight"
      >
        {title ? (
          <span
            className={`block bg-gradient-to-r ${
              isDark
                ? "from-cyan-400 via-blue-400 to-cyan-400"
                : "from-blue-600 via-cyan-600 to-blue-600"
            } bg-clip-text text-transparent`}
          >
            {title}
          </span>
        ) : (
          <>
            <span className={isDark ? "text-white" : "text-slate-900"}>
              {titleLine1}{" "}
            </span>
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {titleLine2}
            </span>
          </>
        )}
      </h2>

      {/* Description */}
      {description && (
        <p
          className={`max-w-3xl leading-relaxed sm:text-lg ${
            isDark ? "text-slate-400" : "text-slate-600"
          } ${align === "center" ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      )}

      {/* Underline */}
      {underline && (
        <div className={`flex ${underlineAlign} gap-2`}>
          <div className={`h-1 w-20 rounded-full ${isDark ? "bg-cyan-400" : "bg-blue-600"}`} />
          <div className={`h-1 w-8 rounded-full ${isDark ? "bg-blue-400" : "bg-cyan-600"} opacity-60`} />
        </div>
      )}
    </div>
  );
}