"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface ProjectActionButtonProps {
  href: string;
  label: string;
  icon?: LucideIcon;
  variant?: "primary" | "secondary";
}

export default function ProjectActionButton({
  href,
  label,
  icon: Icon,
  variant = "primary",
}: ProjectActionButtonProps) {
  const base =
    "group inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all";

  const variants = {
    primary:
      "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-500",
    secondary:
      "border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-900 dark:hover:border-white hover:text-slate-900 dark:hover:text-white",
  };

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${variants[variant]}`}
    >
      <span>{label}</span>
      {Icon && (
        <Icon className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      )}
    </Link>
  );
}
