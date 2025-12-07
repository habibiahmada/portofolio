import Image from "next/image";
import { Eye, ExternalLink, Github, Calendar } from "lucide-react";
import { getTagColor } from "./utils";
import type { Project } from "@/lib/types/database";

export default function ProjectCard({ project }: { project: Project }) {
  const translation = project.projects_translations?.[0];

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-500 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:shadow-blue-600/10 dark:hover:shadow-blue-400/10 transform hover:-translate-y-2">
      {/* Image */}
      <div className="relative overflow-hidden">
        <Image
          src={project.image_url}
          alt={translation?.title || "Project"}
          width={600}
          height={400}
          className="w-full h-48 object-cover group-hover:scale-105 duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-4 left-4">
          <div className="inline-flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {project.year}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {translation?.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          {translation?.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tag: string) => (
            <span
              key={tag}
              className={`px-3 py-1 rounded-full text-sm font-medium ${getTagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">
            <Eye className="w-4 h-4" />
            Lihat Detail
          </button>
          <div className="flex items-center gap-3">
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 flex items-center justify-center"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 flex items-center justify-center"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
