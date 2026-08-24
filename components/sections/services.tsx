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
    <div ref={ref} className="w-full h-44">
      {show ? <Visual /> : (
        <div className="w-full h-44 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5" />
      )}
    </div>
  );
}

const CARDS = [
  {
    label: "01 / Design",
    title: "Web Design & Mobile-First",
    description:
      "Translating ideas into pixel-perfect responsive interfaces. Wireframes to production-ready layouts that feel intuitive on every device.",
    Visual: LayoutDesignerVisual,
    className: "sm:col-span-2 lg:col-span-2",
  },
  {
    label: "02 / Engineering",
    title: "Frontend Development",
    description:
      "High-quality UIs with React & Next.js. Clean components, reusable logic, and fluid state management.",
    Visual: CodeEditorVisual,
  },
  {
    label: "03 / Performance",
    title: "Web Performance",
    description:
      "Core Web Vitals optimization for instant load. SEO-ready architecture that ranks and converts.",
    Visual: SpeedometerGaugeVisual,
  },
  {
    label: "04 / Backend",
    title: "APIs & Databases",
    description:
      "Robust REST APIs, relational databases, and secure auth systems built to scale with your product.",
    Visual: NodeGraphVisual,
  },
  {
    label: "05 / DevOps",
    title: "CI/CD & Deployment",
    description:
      "Automated pipelines, container-ready apps, serverless hosting, and zero-downtime production deploys.",
    Visual: CICDPipelineVisual,
  },
];

export function Services() {
  return (
    <section id="services" className="py-16 md:py-24 w-full bg-transparent">
      <PageShell wide>
        <div className="max-w-2xl mb-14 space-y-3">
          <span className="text-xs font-mono tracking-widest text-brand uppercase block">
            My Services
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
            Comprehensive
            <br className="sm:hidden" /> Solutions
          </h2>
          <p className="text-sm md:text-base text-muted-foreground/80 leading-relaxed font-medium max-w-lg">
            From wireframe concepts to fully animated frontends and scalable
            servers. I build performant products that stand out.
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
                <p className="text-xs text-muted-foreground/75 leading-relaxed">
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
