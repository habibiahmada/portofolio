import { ArrowUpRight, GitFork } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectLinksProps {
  githubUrl: string;
  liveUrl: string;
  /** Show hover backgrounds (used in list/page layout) */
  hover?: boolean;
  className?: string;
}

/**
 * Shared Source + Live link buttons for project cards.
 * Renders nothing when both URLs are `'#'`.
 */
export function ProjectLinks({
  githubUrl,
  liveUrl,
  hover = false,
  className,
}: ProjectLinksProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {githubUrl !== "#" && (
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Source"
          className={cn(
            "inline-flex items-center gap-1 text-[10px] font-mono transition-colors",
            "text-muted-foreground hover:text-foreground",
            hover &&
              "px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5",
          )}
        >
          <GitFork size={11} strokeWidth={1.5} />
          Source
        </a>
      )}
      {liveUrl !== "#" && (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Live"
          className={cn(
            "inline-flex items-center gap-1 text-[10px] font-mono font-semibold transition-colors",
            "text-[#ef4444] hover:text-[#ff3333] dark:text-blue-400 dark:hover:text-blue-300",
            hover &&
              "px-2 py-1 rounded-md hover:bg-red-500/5 dark:hover:bg-blue-400/5",
          )}
        >
          Live
          <ArrowUpRight size={11} strokeWidth={1.75} />
        </a>
      )}
    </div>
  );
}
