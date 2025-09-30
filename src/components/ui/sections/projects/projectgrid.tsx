import ProjectCard from "./projectcard";

interface Project {
  id: string;
  image_url: string;
  year: number;
  technologies: string[];
  live_url: string;
  github_url: string;
  projects_translations?: Array<{
    title: string;
    description: string;
  }>;
}

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
