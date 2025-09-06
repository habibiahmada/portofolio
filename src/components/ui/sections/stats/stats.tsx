import { useEffect, useState } from "react";
import { CheckCircle, Clock, Users, Award, TrendingUp } from "lucide-react";
import './stats.css'

const stats = [
  { 
    icon: CheckCircle, 
    count: 50, 
    suffix: "+",
    label: "Proyek Selesai", 
    description: "Berhasil diselesaikan",
    color: "from-emerald-500 to-teal-600",
    bgColor: "from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50",
    delay: "0s" 
  },
  { 
    icon: Clock, 
    count: 5, 
    suffix: "+",
    label: "Tahun Pengalaman", 
    description: "Dalam industri tech",
    color: "from-blue-500 to-indigo-600",
    bgColor: "from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50",
    delay: "0.1s" 
  },
  { 
    icon: Users, 
    count: 30, 
    suffix: "+",
    label: "Klien Puas", 
    description: "Rating kepuasan tinggi",
    color: "from-purple-500 to-pink-600",
    bgColor: "from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50",
    delay: "0.2s" 
  },
];

const companies = [
  { name: "TechCorp", logo: "TC" },
  { name: "InnovateLab", logo: "IL" },
  { name: "DigitalFlow", logo: "DF" },
  { name: "CloudSync", logo: "CS" },
  { name: "DataVision", logo: "DV" },
  { name: "SystemPro", logo: "SP" },
];

export default function Stats() {
  const [mounted, setMounted] = useState(false);
  const [countingStats, setCountingStats] = useState(stats.map(() => 0));

  useEffect(() => {
    setMounted(true);
    
    // Animated counters
    const timers = stats.map((stat, index) => {
      return setTimeout(() => {
        const duration = 2000;
        const steps = 60;
        const increment = stat.count / steps;
        let current = 0;
        
        const counter = setInterval(() => {
          current += increment;
          if (current >= stat.count) {
            current = stat.count;
            clearInterval(counter);
          }
          
          setCountingStats(prev => {
            const newStats = [...prev];
            newStats[index] = Math.floor(current);
            return newStats;
          });
        }, duration / steps);
      }, index * 200);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Advanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:from-slate-950 dark:via-slate-900/95 dark:to-blue-950/30" />
      
      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.1),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.2),transparent)]" />
      
      {/* Subtle Grid */}
      <div 
        className="absolute inset-0 opacity-[1] bg-[size:40px_40px]
            bg-[linear-gradient(rgba(148,163,184,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.3)_1px,transparent_1px)]
            dark:bg-[linear-gradient(rgba(59,130,246,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.15)_1px,transparent_1px)]
            [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_70%,transparent_100%)]"
        />


      <div className="relative container mx-auto px-6 max-w-7xl">
         {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`group relative p-8 rounded-2xl border backdrop-blur-sm transition-all duration-500 hover:scale-101 hover:-translate-y-1 opacity-0 translate-y-8`}
              style={{ 
                animationDelay: stat.delay,
                animation: `fadeInUp 0.6s ease-out forwards ${stat.delay}`
              }}
            >
              {/* Card Background */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.bgColor} opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="absolute inset-0 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-sm" />
              
              {/* Glow Effect */}
              <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 blur transition-opacity duration-300`} />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg shadow-black/10 group-hover:shadow-xl transition-all duration-300 group-hover:rotate-6 mb-6`}>
                  <stat.icon size={24} />
                </div>

                {/* Number */}
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tabular-nums">
                    {countingStats[i]}
                  </span>
                  <span className={`text-2xl font-semibold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.suffix}
                  </span>
                </div>

                {/* Label */}
                <div className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  {stat.label}
                </div>
                
                {/* Description */}
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Client Trust Section */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
            Dipercaya oleh perusahaan terdepan
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Bergabung dengan klien yang telah merasakan hasil terbaik
          </p>

          {/* Company Logos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
            {companies.map((company, i) => (
              <div
                key={i}
                className="group h-16 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center"
                style={{
                  animationDelay: `${0.5 + i * 0.1}s`,
                  animation: `fadeInUp 0.6s ease-out forwards ${0.5 + i * 0.1}s`,
                  opacity: 0
                }}
              >
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-1 rounded bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-300 dark:to-slate-500 text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center shadow-sm">
                    {company.logo}
                  </div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300 opacity-80 group-hover:opacity-100 transition-opacity">
                    {company.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}