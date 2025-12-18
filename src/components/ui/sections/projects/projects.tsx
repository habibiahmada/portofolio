"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";

import useProjects from "@/hooks/useProjects";
import ProjectRow from "./projectrow";
import Link from "next/link";
import SectionHeader from "../SectionHeader";



export default function Projects() {
  const { resolvedTheme } = useTheme();
  const t = useTranslations("projects");

  const [mounted, setMounted] = useState(false);
  const { projects, loading } = useProjects();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <section
      id="projects"
      className={`relative py-32 overflow-hidden transition-colors duration-500
        ${isDark ? "bg-slate-950" : "bg-slate-50"}`}
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-16 border-b border-slate-200 dark:border-slate-800 pb-8">
          <SectionHeader
            title={t("titleLine1")}
            description={t("description1")}
            align="left"
            underline={false}
          />
          <div>
            <Link
              href="https://github.com/habibiahmada"
              target="_blank"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {"selengkapnya"}
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-32 animate-pulse">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-col lg:flex-row gap-12 items-center"
              >
                <div className="w-full lg:w-7/12 aspect-[16/10] bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]" />
                <div className="w-full lg:w-5/12 space-y-4">
                  <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col">
            {projects.map((project, index) => (
              <ProjectRow
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}