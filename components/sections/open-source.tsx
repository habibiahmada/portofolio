import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";
import { OpenSourceCard } from "@/components/ui/open-source-card";
import { GITHUB_PROFILE_URL, OPEN_SOURCE_PROJECTS } from "@/lib/data/open-source";

export function OpenSource() {
  return (
    <section id="open-source" className="relative py-16 md:py-24 w-full bg-transparent">
      <PageShell wide>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 md:mb-14 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-mono tracking-widest text-brand uppercase block">
              Open source
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
              Built in public,{" "}
              <span className="text-brand">free to fork</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
              Tools I maintain on GitHub under the MIT license. Read the code, try
              it, or open an issue when it breaks.
            </p>
          </div>
          <a
            href={GITHUB_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-black/10 bg-black/5 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground transition-all duration-300 hover:border-black/20 hover:text-foreground dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 sm:self-auto"
          >
            GitHub profile
            <ArrowUpRight size={12} strokeWidth={1.8} aria-hidden />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {OPEN_SOURCE_PROJECTS.map((project) => (
            <OpenSourceCard key={project.id} project={project} />
          ))}
        </div>
      </PageShell>
    </section>
  );
}
