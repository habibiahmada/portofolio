"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import PortalCard from "@/components/ui/sections/projects/portalcard";
import { ProjectData } from "@/services/api/public/projects";

const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

interface ProjectsClientProps {
  projects: ProjectData[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const t = useTranslations("projects");
  const [activeFilter, setActiveFilter] = useState("All");

  // ================= CATEGORIES =================
  const categories = useMemo(() => {
    const techSet = new Set<string>();

    projects.forEach((project) => {
      project.technologies?.forEach((tech) => {
        techSet.add(tech);
      });
    });

    return ["All", ...Array.from(techSet).sort()];
  }, [projects]);

  // ================= FILTERED PROJECTS =================
  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;

    return projects.filter((project) =>
      project.technologies?.includes(activeFilter)
    );
  }, [projects, activeFilter]);

  return (
    <>
      {/* ================= FILTER SECTION ================= */}
      <section className="px-6 pb-12">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={cn(
                  "relative px-5 py-2 rounded-full text-sm font-medium transition-all",
                  activeFilter === cat
                    ? "bg-slate-900 text-white dark:bg-white dark:text-black"
                    : "border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <span className="flex items-center gap-2">
                  {cat}
                  {activeFilter === cat && (
                    <Sparkles size={12} className="text-blue-600" />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROJECT GRID ================= */}
      <section className="px-6 pb-32">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.length === 0 && (
              <div className="col-span-full text-center py-24 text-slate-400">
                No projects found for this category.
              </div>
            )}

            {filteredProjects.map((project) => (
              <PortalCard
                key={project.id}
                project={project}
                translation={
                  project.translation || {
                    title: "",
                    description: "",
                  }
                }
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
