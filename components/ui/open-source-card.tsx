import { ArrowUpRight } from "lucide-react";
import { CopyCommand } from "@/components/ui/copy-command";
import type { OpenSourceProject } from "@/lib/data/open-source";
import { cn } from "@/lib/utils";

/** GitHub's language colours, so the dot reads like a repo listing. */
const LANGUAGE_COLOR: Record<string, string> = {
  JavaScript: "#f1e05a",
  Go: "#00add8",
  "C + GTK3": "#a8b9cc",
};

const linkClass =
  "inline-flex min-h-9 items-center gap-1 rounded-full border border-black/15 dark:border-white/15 px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground transition-colors hover:border-brand/60";

/**
 * Repo-style card: text first, no screenshot. What it is, why it exists,
 * a few facts, and the command to try it.
 */
export function OpenSourceCard({
  project,
  className,
}: {
  project: OpenSourceProject;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex h-full flex-col gap-4 rounded-2xl p-5 md:p-6",
        "border border-black/10 bg-white dark:border-white/10 dark:bg-zinc-950",
        "transition-colors duration-300 hover:border-brand/40",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        <span className="text-brand">{project.kind}</span>
        <span>{project.license}</span>
      </div>

      <div className="space-y-2">
        <h3 className="font-mono text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {project.name}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        {project.forkOf && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Security-hardened fork of{" "}
            <a
              href={project.forkOf.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline decoration-black/20 underline-offset-2 hover:decoration-brand dark:decoration-white/25"
            >
              {project.forkOf.name}
            </a>
            .
          </p>
        )}
      </div>

      <ul className="flex flex-wrap gap-2" aria-label={`${project.name} at a glance`}>
        {project.facts.map((fact) => (
          <li
            key={fact}
            className="rounded-full border border-black/10 bg-black/3 px-2.5 py-1 text-[11px] font-medium text-foreground dark:border-white/10 dark:bg-white/5"
          >
            {fact}
          </li>
        ))}
      </ul>

      <div className="mt-auto space-y-4 pt-1">
        {project.install && <CopyCommand command={project.install} />}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10 dark:ring-white/15"
              style={{ backgroundColor: LANGUAGE_COLOR[project.language] ?? "currentColor" }}
            />
            {project.language}
          </span>

          <div className="flex items-center gap-2">
            {project.siteUrl && (
              <a
                href={project.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} ${project.siteLabel ?? "site"}`}
                className={linkClass}
              >
                {project.siteLabel ?? "Site"}
                <ArrowUpRight size={11} strokeWidth={1.8} aria-hidden />
              </a>
            )}
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.name} source on GitHub`}
              className={linkClass}
            >
              Source
              <ArrowUpRight size={11} strokeWidth={1.8} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
