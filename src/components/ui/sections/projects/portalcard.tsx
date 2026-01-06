import { Project as DBProject } from "@/lib/types/database";
import { Github, ArrowUpRight, Cpu, Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Project extends DBProject {
    translation?: {
        title: string;
        description: string;
    };
}

export default function PortalCard({
    project,
    translation,
}: {
    project: Project;
    translation: { title: string; description: string };
}) {
    return (
        <div className="group relative h-[350px] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:scale-[1.02] hover:shadow-xl dark:hover:shadow-none hover:border-slate-300 dark:hover:border-indigo-500/30">
            {/* Image */}
            <div className="absolute inset-0 h-full w-full">
                {project.image_url ? (
                    <Image
                        src={project.image_url}
                        alt={translation.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Layers className="h-16 w-16 text-slate-300 dark:text-slate-800" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" />

            </div>

            {/* Actions */}
            <div className="absolute right-4 top-4 z-10 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                {project.github_url && (
                    <Link
                        href={project.github_url}
                        target="_blank"
                        className="h-10 w-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors"
                    >
                        <Github size={18} />
                    </Link>
                )}
                {project.live_url && (
                    <Link
                        href={project.live_url}
                        target="_blank"
                        className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-600 text-white hover:scale-110 transition-transform"
                    >
                        <ArrowUpRight size={18} />
                    </Link>
                )}
            </div>

            {/* Year */}
            <div className="absolute left-6 top-6 z-10">
                <span className="flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 text-xs text-slate-300">
                    <Cpu size={12} />
                    {project.year}
                </span>
            </div>

            {/* Content */}
            <div
                className="
          absolute bottom-0 z-10 p-6
          translate-y-56 opacity-90
          group-hover:translate-y-0 group-hover:opacity-100
          transition-all duration-700 ease-out
        "
            >
                <h3 className="mb-2 text-3xl font-bold text-white">
                    {translation.title}
                </h3>

                <p className="mb-4 text-sm text-slate-300 line-clamp-3">
                    {translation.description}
                </p>

                <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                        <span
                            key={tech}
                            className="rounded bg-white/10 px-2 py-1 text-[10px] uppercase text-white"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="mt-4 h-1 w-12 bg-slate-100 dark:bg-blue-800 group-hover:w-full transition-all duration-500" />
            </div>
        </div>
    );
}