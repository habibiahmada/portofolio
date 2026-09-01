import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { hasPublicProjectUrl } from "@/lib/projects";

interface ProjectLinksProps {
  liveUrl: string;
  /** @deprecated Repository links are not shown on the public site. */
  githubUrl?: string;
  showGithub?: boolean;
  /** Show hover backgrounds (used in list/page layout) */
  hover?: boolean;
  className?: string;
}

/**
 * Live site link for project cards. Renders nothing when no valid URL is available.
 */
export function ProjectLinks({
  liveUrl,
  hover = false,
  className,
}: ProjectLinksProps) {
  const showLive = hasPublicProjectUrl(liveUrl);
  if (!showLive) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Live"
          className={cn(
            "inline-flex items-center gap-1 text-[11px] font-mono font-semibold transition-colors",
            "text-brand hover:opacity-90",
            hover &&
              "px-2 py-1 rounded-md hover:bg-brand/5",
          )}
        >
          Live
          <ArrowUpRight size={11} strokeWidth={1.75} />
      </a>
    </div>
  );
}
