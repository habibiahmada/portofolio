import { Code2, Cpu, Zap, Globe } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  isDark: boolean;
}

export default function TechIconsDecorations({ isDark }: Props) {

  const t = useTranslations('hero');

  const techIcons = [
    { icon: Code2, label: t('techIcons.fullStack'), delay: "0s" },
    { icon: Cpu, label: t('techIcons.aiMl'), delay: "0.2s" },
    { icon: Zap, label: t('techIcons.performance'), delay: "0.4s" },
    { icon: Globe, label: t('techIcons.cloud'), delay: "0.6s" }
  ];


  return (
    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-sm">
      <div
        className={`backdrop-blur-lg rounded-2xl p-4 border ${isDark
          ? "bg-white/5 border-white/10"
          : "bg-white/80 border-white/50"
          } shadow-lg`}
      >
        <div className="grid grid-cols-4 gap-4">
          {techIcons.map((tech, index) => {
            const IconComponent = tech.icon;
            return (
              <div
                key={index}
                className="group flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300"
                style={{ animationDelay: tech.delay }}
              >
                <div
                  className={`p-3 rounded-xl group-hover:shadow-lg ${isDark
                    ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-200 group-hover:from-blue-500/30 group-hover:to-cyan-500/30"
                    : "bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 group-hover:from-blue-200 group-hover:to-cyan-200"
                    }`}
                >
                  <IconComponent size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <span
                  className={`text-xs font-medium ${isDark ? "text-slate-400 group-hover:text-slate-300" : "text-slate-600 group-hover:text-slate-700"
                    }`}
                >
                  {tech.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}