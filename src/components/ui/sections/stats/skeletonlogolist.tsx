import { Skeleton } from "../../skeleton";

interface Props{
    i: number;
    isDark: boolean;
}

export default function Skeletonlogolist({i, isDark}: Props){
    return(
        <div
        key={i}
        className={`h-40 py-6 min-w-[150px] rounded-xl border backdrop-blur-sm flex items-center justify-center px-4 animate-pulse
          ${
            isDark
              ? "border-slate-700/60 bg-slate-800/40"
              : "border-slate-200/60 bg-white/60"
          }`}
      >
        <div className="flex flex-col items-center gap-2 w-full">
          {/* logo placeholder */}
          <Skeleton
            className={`w-20 h-20 rounded-md ${
              isDark ? "bg-slate-700/50" : "bg-slate-200/70"
            }`}
          />
          {/* name placeholder */}
          <Skeleton
            className={`w-16 h-3 rounded ${
              isDark ? "bg-slate-700/50" : "bg-slate-200/70"
            }`}
          />
        </div>
      </div>
    )
}