"use client";

import { Project } from "@/lib/types/database";
import { ArrowUpRight, Github } from "lucide-react";
import { getTagColor } from "./utils";
import ProjectActionButton from "./projectactionbutton";
import Image from "next/image";


export default function ProjectRow({
    project,
    index,
}: {
    project: Project;
    index: number;
}) {
    const translation = project.projects_translations?.[0];
    const isEven = index % 2 === 0;

    return (
        <div
            className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-32 last:mb-0 ${!isEven ? "lg:flex-row-reverse" : ""
                }`}
        >
            {/* Image */}
            <div className="w-full lg:w-6/12 group">
                <div className="relative overflow-hidden shadow-xl bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all duration-500 ">
                    <div className="aspect-[12/6] relative overflow-hidden">
                        <Image
                            src={project.image_url}
                            alt={translation?.title || "Untitled Project"}
                            width={450}
                            height={450}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors" />
                    </div>

                    <div className="absolute top-6 left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2 rounded-full text-sm font-bold">
                        {project.year}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="w-full lg:w-5/12 space-y-8">
                <div className="space-y-4">
                    <h3 className="text-3xl lg:text-4xl font-bold">
                        {translation?.title || "Untitled Project"}
                    </h3>

                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                        {translation?.description || ""}
                    </p>

                </div>

                {/* Tech */}
                <div className="flex flex-wrap gap-3">
                    {project.technologies.map((tech) => (
                        <span
                            key={tech}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${getTagColor(
                                tech
                            )}`}
                        >
                            {tech}
                        </span>
                    ))}
                </div>
                {/* Actions */}
                <div className="flex flex-wrap gap-4 pt-4">
                    {project.live_url && (
                        <ProjectActionButton
                            href={project.live_url}
                            label="Lihat Live"
                            icon={ArrowUpRight}
                            variant="primary"
                        />
                    )}

                    {project.github_url && (
                        <ProjectActionButton
                            href={project.github_url}
                            label="Source"
                            icon={Github}
                            variant="secondary"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}