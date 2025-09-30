"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import SectionHeader from "../SectionHeader";

import useProjects from "@/hooks/useProjects";
import ProjectFilters from "./projectfilter";
import ProjectSearch from "./projectsearch";
import ProjectGrid from "./projectgrid";
import SkeletonProjectCard from "./skeletonprojectcard";
import { SearchX } from "lucide-react";

export default function Projects() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("projects");

  
  const { projects, loading } = useProjects();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    setMounted(true);
  }, []);

  
  if (!mounted) return null;
  
  const isDark = resolvedTheme === "dark";

  const filteredProjects = projects.filter((project) => {
    const translation = project.projects_translations?.[0];
    const matchesFilter =
      activeFilter === "all" || project.category === activeFilter;
    const matchesSearch =
      translation?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      translation?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some((tag: string) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesFilter && matchesSearch;
  });

  return (
    <section
      id="projects"
      className={`relative overflow-hidden transition-all duration-700 py-28 sm:py-36 lg:py-40 pb-5 
        ${isDark ? "bg-slate-950" : "bg-gradient-to-b from-white to-slate-50"}`}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-16">
          <SectionHeader
            title={t("titleLine1")}
            description={t("description1")}
            align="center"
          />
        </div>

        {/* Filters */}
        <ProjectFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

        {/* Search */}
        <ProjectSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonProjectCard key={i} />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 dark:text-slate-400">
            <SearchX className="h-16 w-16 mb-4 text-slate-400"/>
            <p className="text-lg font-medium">
              {t("noProjectsTitle", { defaultValue: "No projects found" })}
            </p>
            <p className="text-sm">
              {t("noProjectsDescription", {
                defaultValue: "Try adjusting your filters or search query.",
              })}
            </p>
          </div>
        ) : (
          <ProjectGrid projects={filteredProjects} />
        )}
      </div>
    </section>
  );
}
