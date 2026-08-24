"use client";

import { PageShell } from "@/components/ui/page-shell";
import { NodeNetworkLazy } from "@/components/ui/node-network-lazy";

export function CTA() {
  return (
    <section
      id="cta"
      className="relative py-20 md:py-28 w-full bg-transparent overflow-hidden"
    >
      <NodeNetworkLazy />

      <PageShell className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-end border-t border-black/5 dark:border-white/10 pt-12 md:pt-16">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-mono tracking-widest text-brand uppercase block">
              Contact
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black tracking-tight text-foreground leading-[1.05] text-balance">
              Need a web product that actually ships in the next{" "}
              <span className="text-brand">90 days</span>?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
              Open to freelance and full-time. Remote (WIB). Write to{" "}
              <a
                href="mailto:contact@habibiahmada.dev"
                className="text-foreground font-medium underline underline-offset-4 decoration-brand/40 hover:decoration-brand transition-colors"
              >
                contact@habibiahmada.dev
              </a>
              . I usually reply within 48 hours.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 sm:gap-4 lg:items-stretch">
            <a
              href="mailto:contact@habibiahmada.dev"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-full font-bold text-sm hover:opacity-90 transition-opacity text-center"
            >
              Let&apos;s talk
            </a>
            <a
              href="/projects"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full font-bold text-sm border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 text-foreground transition-colors text-center"
            >
              Browse projects
            </a>
          </div>
        </div>
      </PageShell>
    </section>
  );
}
