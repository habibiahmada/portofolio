import ProjectCard from "./projectcard";
import type { Project } from "@/lib/types/database";


export default function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
