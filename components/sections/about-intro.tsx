"use client";

import { CpuArchitecture } from "@/components/ui/cpu-architecture";

export function AboutIntro() {
  return (
    <section
      id="about-intro"
      className="py-14 w-full bg-transparent overflow-hidden"
    >
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT — CPU Architecture Visual */}
          <div className="lg:col-span-5 flex justify-center lg:self-center">
            <div className="w-full pt-2 flex justify-center">
              <CpuArchitecture
                text="DEV"
                animateText
                showCpuConnections
                className="w-full h-full max-w-100 text-zinc-600 dark:text-zinc-300"
              />
            </div>
          </div>
          {/* RIGHT — Narrative */}
          <div className="lg:col-span-7 space-y-8">
            {/* Section label */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-brand font-semibold">
                // About
              </span>
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tighter text-foreground leading-[1.02]">
                A Glimpse Into
                <br />
                <span className="text-brand">
                  Who I Am
                </span>
              </h2>
            </div>

            {/* Bio */}
            <div className="space-y-5 mt-5">
              <p className="text-base md:text-lg text-foreground/85 leading-relaxed">
                As a{" "}
                <span className="text-foreground font-semibold">
                  Software Engineering
                </span>{" "}
                graduate from{" "}
                <span className="text-foreground font-semibold">
                  SMKN 1 Karawang
                </span>
                , I work as a{" "}
                <span className="text-foreground font-semibold">
                  Web Developer
                </span>{" "}
                building sites and apps for real clients: 19 of them in about
                four months, from WordPress catalogs to custom Next.js and React
                apps. I also ship school systems and award-winning AI product
                work.
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                I care most about the parts that keep a site standing after
                launch: a clear scope, validation where data comes in, and
                empty and error states a non-engineer can read. Motion and
                polish come once the page is fast on a mid-range phone.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <a
                href="#about-timeline"
                className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-black/10 dark:border-white/10 hover:border-brand/30 bg-black/3 dark:bg-white/3 hover:bg-brand/5 transition-all duration-300 text-sm font-semibold text-foreground"
              >
                View my journey
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
