import { TechItem } from "@/lib/types/database"
import { DynamicSiIcon } from "@/components/ui/dynamicsiicon"

export default function SkillCard({ tech }: { tech: TechItem }) {
  return (
    <div
      className="group relative flex items-center gap-4 p-4 pr-8 rounded-xl 
      bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm 
      border border-slate-200/60 dark:border-slate-800/60 
      hover:border-indigo-500/30 dark:hover:border-indigo-400/30
      hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.2)] 
      transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Subtle colorful glow background on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <DynamicSiIcon
        name={tech.key}
        size={40}
        color={tech.color}
      />

      <span className="relative z-10 text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
        {tech.name}
      </span>
    </div>
  )
}