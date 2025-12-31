export const DecorativeCode = ({ isDark, developerTag, consoleTag }: { isDark: boolean; developerTag?: string; consoleTag?: string }) => (
  <>
    <div
      className={`absolute -top-8 left-4 px-3 py-1 rounded-lg text-xs font-mono ${isDark ? "bg-slate-800/80 text-green-400" : "bg-slate-100/80 text-green-600"
        } backdrop-blur-sm`}
    >
      {developerTag || "<Developer />"}
    </div>
    <div
      className={`absolute top-0 right-2 px-3 py-1 lg:top-20 rounded-lg text-xs font-mono ${isDark ? "bg-slate-800/80 text-blue-400" : "bg-slate-100/80 text-blue-600"
        } backdrop-blur-sm z-0`}
    >
      console.log(&quot;{consoleTag || "Hello World!"}&quot;)
    </div>
  </>
);

export const BackgroundGrid = ({ isDark }: { isDark: boolean }) => (
  <div
    className={`absolute inset-0 opacity-30 ${isDark
      ? "bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)]"
      : "bg-[linear-gradient(rgba(148,163,184,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.2)_1px,transparent_1px)]"
      } bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_50%,#000_60%,transparent_100%)]`}
  />
);


export const HexagonalShape = ({ isDark }: { isDark: boolean }) => (
  <div
    className={`w-full h-full opacity-20 ${isDark ? "bg-blue-500/20" : "bg-blue-400/30"
      }`}
    style={{
      clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
      transform: "scale(1.1)",
    }}
  />
);

export const FloatingShapes = ({ isDark }: { isDark: boolean }) => (
  <>
    <div className={`absolute top-10 right-10 w-32 h-32 border ${isDark ? 'border-blue-700' : 'border-blue-300'} rounded-lg rotate-12 opacity-30 pointer-events-none`} />
    <div className={`absolute bottom-20 left-10 w-24 h-24 border ${isDark ? 'border-cyan-700' : 'border-cyan-300'} rounded-full opacity-30 pointer-events-none`} />
    <div className="absolute top-20 left-1/4 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg opacity-20 rotate-45 pointer-events-none" />
  </>
);