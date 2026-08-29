"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";

const FEATURES = [
  {
    label: "01 / Origin",
    source: "Dicoding Blog",
    title: "From zero tech background to shipping under real deadlines.",
    description:
      "Coding Camp did not hand me confidence. It forced me to build, present, and intern at the same time. That pressure is still how I work: clear scope, thin vertical slice, ship.",
    href: "https://www.dicoding.com/blog/lulus-coding-camp-bentuk-keyakinan-habibi-untuk-melangkah-di-dunia-teknologi/",
    meta: "May 2025",
    image: "/images/press/dicoding-coding-camp.png",
    imageAlt: "Habibi featured in the Dicoding Coding Camp story",
    cta: "Read the Dicoding story",
  },
  {
    label: "02 / Receipt",
    source: "Intel AI Festival",
    title: "Indonesia country award for Agrify at a global AI festival.",
    description:
      "Our team built Agrify for AI Changemakers. I owned the product surface: turn model output into advice a farmer can act on, not another pretty dashboard.",
    href: "https://www.intel.com/content/www/us/en/corporate/artificial-intelligence/winner2025.html",
    meta: "2025 · Indonesia",
    image:
      "/data/certificates/intel/country-award-winner-agrify-indonesia-13-17-years-habibi-ahmad-aziz/country-award-winner-agrify-indonesia-13-17-years-habibi-ahmad-aziz.webp",
    imageAlt: "Intel AI for Youth country award certificate for Agrify",
    cta: "See the Intel winners list",
  },
] as const;

export function Press() {
  return (
    <section id="press" className="py-16 md:py-24 w-full bg-transparent">
      <PageShell wide>
        <div className="max-w-2xl mb-12 md:mb-16 space-y-3">
          <span className="text-xs font-mono tracking-widest text-brand uppercase block">
            Spotlights
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
            Stories that{" "}
            <span className="text-brand">prove the work</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium max-w-xl">
            Two public receipts: how I learned to ship under pressure, and the
            award my team earned when Agrify reached farmers, not just judges.
          </p>
        </div>

        <div className="flex flex-col gap-14 md:gap-20">
          {FEATURES.map((item, i) => {
            const reverse = i % 2 === 1;
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center"
              >
                <div
                  className={`md:col-span-7 relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 aspect-16/10 ${
                    reverse ? "md:order-2" : ""
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 58vw"
                  />
                </div>

                <div
                  className={`md:col-span-5 flex flex-col justify-center gap-3 md:gap-4 ${
                    reverse ? "md:order-1" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-mono text-brand font-semibold uppercase tracking-widest">
                      {item.label}
                    </span>
                    <ArrowUpRight
                      size={18}
                      strokeWidth={1.75}
                      className="shrink-0 text-muted-foreground/40 transition-all duration-300 group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </div>
                  <p className="text-xs font-mono text-muted-foreground tracking-wide">
                    {item.source}
                    <span className="mx-2 text-muted-foreground/30">·</span>
                    {item.meta}
                  </p>
                  <h3 className="text-xl sm:text-2xl md:text-[1.65rem] font-bold text-foreground leading-snug text-balance group-hover:text-brand transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                  <span className="text-xs font-mono font-semibold text-foreground/70 group-hover:text-foreground transition-colors pt-1">
                    {item.cta} →
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </PageShell>
    </section>
  );
}
