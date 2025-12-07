import { TechItem } from "@/lib/types/database";
import * as SiIcons from "react-icons/si";

// Types
type IconComponent = React.ComponentType<{ size?: number; color?: string }>;


export default function SkillCard({ tech }: { tech: TechItem }) {
    const Icon = (SiIcons as Record<string, IconComponent>)[tech.key];
    if (!Icon) return null;
  
    return (
      <div
        className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900/50 border border-slate-300 
        dark:border-slate-800/50 hover:border-blue-500  
        hover:scale-105 cursor-pointer transition-transform duration-300"
      >
        <div className="flex flex-col items-center">
          <div className="p-5 rounded-full bg-white dark:bg-slate-700">
            <Icon size={38} color={tech.color} />
          </div>
          <h4 className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
            {tech.name}
          </h4>
        </div>
      </div>
    );
  }