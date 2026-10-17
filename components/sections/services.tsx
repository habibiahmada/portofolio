"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { PageShell } from "@/components/ui/page-shell";
const VisualFallback = () => (
  <div className="w-full h-44 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5" />
);

const LayoutDesignerVisual = dynamic(
  () =>
    import("@/components/ui/layout-designer-visual").then(
      (m) => m.LayoutDesignerVisual,
    ),
  { ssr: false, loading: VisualFallback },
);
const CodeEditorVisual = dynamic(
  () =>
    import("@/components/ui/code-editor-visual").then((m) => m.CodeEditorVisual),
  { ssr: false, loading: VisualFallback },
);
const SpeedometerGaugeVisual = dynamic(
  () =>
    import("@/components/ui/speedometer-gauge-visual").then(
      (m) => m.SpeedometerGaugeVisual,
    ),
  { ssr: false, loading: VisualFallback },
);
const NodeGraphVisual = dynamic(
  () =>
    import("@/components/ui/node-graph-visual").then((m) => m.NodeGraphVisual),
  { ssr: false, loading: VisualFallback },
);
const CICDPipelineVisual = dynamic(
  () =>
    import("@/components/ui/cicd-pipeline-visual").then(
      (m) => m.CICDPipelineVisual,
    ),
  { ssr: false, loading: VisualFallback },
);

function InViewVisual({ Visual }: { Visual: ComponentType }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "80px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // Illustrations only; the card text carries the meaning.
    <div ref={ref} className="w-full h-44" aria-hidden>
      {show ? <Visual /> : (
        <div className="w-full h-44 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5" />
      )}
    </div>
  );
}

const CARDS = [
  {
    label: "01 / Design",
    title: "Responsive web design",
    description:
      "I lay pages out phone-first, then scale them up. Wireframes end up as real pages in code, not a Figma file nobody ships.",
    Visual: LayoutDesignerVisual,
    className: "sm:col-span-2 lg:col-span-2",
  },
  {
    label: "02 / Engineering",
    title: "Frontend in React and Next.js",
    description:
      "Small components, state kept close to where it is used, and loading, empty, and error states written before launch.",
    Visual: CodeEditorVisual,
  },
  {
    label: "03 / Performance",
    title: "Performance and SEO basics",
    description:
      "I run Lighthouse before and after a change and fix what the numbers point at: image weight, JavaScript size, metadata.",
    Visual: SpeedometerGaugeVisual,
  },
  {
    label: "04 / Backend",
    title: "APIs and databases",
    description:
      "REST APIs in Laravel or Node.js on relational databases, with validation at the boundary and roles that match who really uses the app.",
    Visual: NodeGraphVisual,
  },
  {
    label: "05 / DevOps",
    title: "Deployment",
    description:
      "Git-based deploys to Vercel, shared hosting, or a VPS with Docker, with preview builds so feedback lands before production.",
    Visual: CICDPipelineVisual,
  },
];

export function Services() {
  return (
    <section id="services" className="py-16 md:py-24 w-full bg-transparent">
      <PageShell wide>
        <div className="max-w-2xl mb-14 space-y-3">
          <span className="text-xs font-mono tracking-widest text-brand uppercase block">
            Services
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
            What I can build for you
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium max-w-lg">
            The same five jobs show up across my case studies, so you can check
            each one against shipped work before we talk.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CARDS.map((card) => (
            <div
              key={card.label}
              className={`flex flex-col gap-5 rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-950 p-5 md:p-6 hover:border-black/10 dark:hover:border-white/10 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30 transition-all duration-500 ${card.className || ""}`}
            >
              <div className="shrink-0">
                <InViewVisual Visual={card.Visual} />
              </div>
              <div className="space-y-1.5 flex-1">
                <span className="text-[10px] font-mono text-brand font-semibold uppercase tracking-widest block">
                  {card.label}
                </span>
                <h3 className="text-base font-bold text-foreground leading-snug">
                  {card.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </PageShell>
    </section>
  );
}
