import { TechItem } from "@/lib/types/database"
import { DynamicSiIcon } from "@/components/ui/dynamicsiicon"

export default function SkillCard({ tech }: { tech: TechItem }) {
  return (
    <div
      className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900/50 border border-slate-300 
      dark:border-slate-800/50 hover:border-blue-500  
      hover:scale-105 cursor-pointer transition-transform duration-300"
    >
      <div className="flex flex-col items-center">
        <div className="p-5 rounded-full bg-white dark:bg-slate-700">
          <DynamicSiIcon
            name={tech.key} 
            size={38}
            color={tech.color}
          />
        </div>

        <h4 className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
          {tech.name}
        </h4>
      </div>
    </div>
  )
}
