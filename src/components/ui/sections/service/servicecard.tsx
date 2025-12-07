
interface ServiceCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    bullets: string[];
    color?: string;
  }

export default function ServiceCard({ icon, title, description, bullets, color } : ServiceCardProps ) {
    return (
      <div className="group relative bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-8 hover:bg-white dark:hover:bg-slate-800/70 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-slate-500/5 dark:from-blue-400/10 dark:to-slate-400/10 rounded-3xl opacity-0 group-hover:opacity-100  duration-500"></div>
        <div className="relative">
          <div
            className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110`}
          >
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            {title}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            {description}
          </p>
          <div className="space-y-3 mb-8">
            {bullets.map((item, i) => (
              <div
                key={i}
                className="flex items-center text-sm text-slate-500 dark:text-slate-400"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }