"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import useProjects from "@/hooks/api/public/useProjects";
import Footer from "@/components/ui/footer/footer";
import PortalCard from "@/components/ui/sections/projects/portalcard";
import PortalCardSkeleton from "@/components/ui/sections/projects/portalcardskeleton";
import Navbar from "@/components/ui/navbar/main";

import { Project as DBProject } from "@/lib/types/database";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Project extends DBProject {
    translation?: {
        title: string;
        description: string;
    };
}

const cn = (...classes: (string | false | null | undefined)[]) =>
    classes.filter(Boolean).join(" ");

export default function ProjectsPage() {
    const t = useTranslations("projects");
    useTheme();

    const { projects, loading, error } = useProjects();
    const [mounted, setMounted] = useState(false);
    const [activeFilter, setActiveFilter] = useState("All");

    useEffect(() => {
        setMounted(true);
    }, []);

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

    if (!mounted) return null;


    return (
        <>
            <Navbar withNavigation={false} />

            <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-800 dark:text-slate-200 overflow-x-hidden transition-colors duration-300">
                {/* ================= HERO / HEADER ================= */}
                <section className="relative pt-32 pb-16 px-6 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
                    </div>

                    <div className="container mx-auto relative">
                        <div className="max-w-3xl">
                            <Breadcrumb className="mb-4">
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/">
                                            {t("breadcrumb.home")}
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>

                                    <BreadcrumbSeparator />

                                    <BreadcrumbItem>
                                        <BreadcrumbPage>
                                            {t("breadcrumb.projects")}
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>

                            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                                {t("allTitle1")}{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">
                                    {t("allTitle2")}
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-400 leading-relaxed">
                                {t("allDescription")}
                            </p>
                        </div>
                    </div>
                </section>

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
                            {loading && <PortalCardSkeleton />}

                            {error && (
                                <div className="col-span-full text-center text-red-400">
                                    Failed to load projects.
                                </div>
                            )}

                            {!loading && !error && filteredProjects.length === 0 && (
                                <div className="col-span-full text-center py-24 text-slate-400">
                                    No projects found for this category.
                                </div>
                            )}

                            {!loading &&
                                !error &&
                                filteredProjects.map((project: Project) => (
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
            </main>

            <Footer />
        </>
    );
}