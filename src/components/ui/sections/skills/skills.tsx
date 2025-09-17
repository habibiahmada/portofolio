"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import SectionHeader from "../SectionHeader";

const techStack = [
  { name: "JavaScript", icon: "https://picsum.photos/100?random=1" },
  { name: "TypeScript", icon: "https://picsum.photos/100?random=2" },
  { name: "React", icon: "https://picsum.photos/100?random=3" },
  { name: "Next.js", icon: "https://picsum.photos/100?random=4" },
  { name: "Vue.js", icon: "https://picsum.photos/100?random=5" },
  { name: "Tailwind CSS", icon: "https://picsum.photos/100?random=6" },
  { name: "Node.js", icon: "https://picsum.photos/100?random=7" },
  { name: "Express", icon: "https://picsum.photos/100?random=8" },
  { name: "MongoDB", icon: "https://picsum.photos/100?random=9" },
  { name: "PostgreSQL", icon: "https://picsum.photos/100?random=10" },
];

export default function SkillsSection() {
  const t = useTranslations("skills")
  return (
    <section
      id="skills"
      className="bg-white dark:bg-slate-950 transition-colors duration-300 py-8 md:py-10 lg:py-12"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <SectionHeader
          title={t("titleLine1")}
          description={t("description1")}
          align="center"
          className="mb-12"
        />

        {/* Tech Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="p-6 rounded-2xl 
                         bg-slate-100 dark:bg-slate-900/50 
                         border border-slate-300 dark:border-slate-800/50 
                         hover:border-blue-500 transition-all duration-300 
                         hover:scale-105 cursor-pointer"
            >
              <div className="flex flex-col items-center">
                <Image
                  src={tech.icon}
                  alt={tech.name}
                  width={64}
                  height={64}
                  className="rounded-lg object-cover"
                />
                <h4 className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {tech.name}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}