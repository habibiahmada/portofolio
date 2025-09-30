import { Button } from "../../button";

export default function TabButton({ 
    isActive, 
    onClick, 
    icon, 
    label, 
    isDark 
  }: {
    isActive: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    isDark: boolean;
  }) {
    return (
      <Button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base cursor-pointer transform hover:scale-[1.02] ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105"
            : isDark
            ? "text-slate-700/120 bg-slate-700/50 hover:bg-slate-700/60"
            : "text-slate-600 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-100/60"
        }`}
      >
        {icon}
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">{label}</span>
      </Button>
    );
  }
  