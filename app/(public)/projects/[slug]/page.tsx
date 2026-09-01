import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import {
  getCaseStudy,
  getCaseStudySlugs,
  getAdjacentCaseStudies,
  type CaseStudy,
} from "@/lib/data/case-studies";
import { resolveStackIcons } from "@/lib/data/stack-icons";
import { getProjectById } from "@/lib/data/projects";
import {
  projects as staticProjects,
  getProjectTitle,
  hasPublicProjectUrl,
  type Project,
} from "@/lib/projects";
import { ProjectJsonLd } from "@/components/json-ld";
import { projectPageMetadata } from "@/lib/site-metadata";
import {
  getProjectTaxonomy,
  ORIGIN_LABEL,
} from "@/lib/data/project-taxonomy";
import { PAGE_PAD, PAGE_SHELL } from "@/components/ui/page-shell";
import { cn } from "@/lib/utils";
import { INTEL_AWARD_CERT_URL } from "@/lib/data/storage-urls";

type Props = { params: Promise<{ slug: string }> };

const DEFAULT_HOOKS = {
  opening: "Where it started",
  reality: "What boxed the work in",
  build: "How it came together",
  close: "What I can stand behind",
  realityLead:
    "These were the boundaries that shaped what we could ship and how honest the story had to stay.",
  buildLead:
    "How the pieces fit together in practice, not just on a stack diagram.",
  closeLead:
    "What actually shipped, what proof exists, and what I can defend in an interview.",
} as const;

const PANEL =
  "rounded-2xl border border-black/5 dark:border-white/8 bg-white/70 dark:bg-zinc-950/50 overflow-hidden";

const ASIDE_BY_SLUG: Record<
  string,
  { src: string; alt: string; caption: string; kind: "logo" | "document" }
> = {
  renshuu: {
    src: "/images/companies/smartplus.webp",
    alt: "CV Smartplus",
    caption: "PKL host · CV Smartplus",
    kind: "logo",
  },
  jepangku: {
    src: "/images/companies/webekspres.webp",
    alt: "PT Webekspres Teknologi Indonesia",
    caption: "Client work · Webekspres",
    kind: "logo",
  },
  terraju: {
    src: "/images/companies/webekspres.webp",
    alt: "PT Webekspres Teknologi Indonesia",
    caption: "Client work · Webekspres",
    kind: "logo",
  },
  miru: {
    src: "/images/companies/webekspres.webp",
    alt: "PT Webekspres Teknologi Indonesia",
    caption: "Client work · Webekspres",
    kind: "logo",
  },
  "luzins-academy": {
    src: "/images/companies/webekspres.webp",
    alt: "PT Webekspres Teknologi Indonesia",
    caption: "Client work · Webekspres",
    kind: "logo",
  },
  ptmgc: {
    src: "/images/companies/webekspres.webp",
    alt: "PT Webekspres Teknologi Indonesia",
    caption: "Client work · Webekspres",
    kind: "logo",
  },
  agrify: {
    src: INTEL_AWARD_CERT_URL,
    alt: "Intel AI country award certificate",
    caption: "Intel AI Festival · country award",
    kind: "document",
  },
  "culture-connect": {
    src: "/images/press/dicoding-coding-camp.png",
    alt: "Dicoding Coding Camp story",
    caption: "Coding Camp · DBS Foundation",
    kind: "document",
  },
};

type CatalogProject = {
  id: string;
  title: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  year?: number;
};

function displayTitle(full: string) {
  return full.includes(":") ? full.split(":")[0]!.trim() : full;
}

function catalogFromStatic(p: Project): CatalogProject {
  return {
    id: p.id,
    title: displayTitle(getProjectTitle(p, "en")),
    image: p.image,
    tags: p.tags,
    liveUrl: hasPublicProjectUrl(p.live_url) ? p.live_url : undefined,
    year: p.year,
  };
}

async function resolveCatalog(projectId: string): Promise<CatalogProject | null> {
  const row = await getProjectById(projectId);
  if (row) {
    const title =
      row.title_en ||
      row.title_id ||
      staticProjects.find((p) => p.id === projectId)?.title_en ||
      "Project";
    return {
      id: row.id,
      title: displayTitle(title),
      image: row.image,
      tags: row.tags ?? [],
      liveUrl: hasPublicProjectUrl(row.live_url) ? row.live_url : undefined,
      year: row.year,
    };
  }
  const fallback = staticProjects.find((p) => p.id === projectId);
  return fallback ? catalogFromStatic(fallback) : null;
}

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const catalog = await resolveCatalog(study.projectId);
  const attribution =
    getProjectTaxonomy(study.projectId)?.origin === "webekspres"
      ? "webekspres"
      : "solo";
  return projectPageMetadata({
    title: catalog?.title ?? slug,
    description: study.problem,
    slug: study.slug,
    image: catalog?.image,
    tags: catalog?.tags,
    year: catalog?.year,
    attribution,
  });
}

function hooksFor(study: CaseStudy) {
  return { ...DEFAULT_HOOKS, ...study.hooks };
}

function StackIcons({ stack }: { stack: string[] }) {
  const icons = resolveStackIcons(stack);
  if (icons.length === 0) return null;

  return (
    <ul
      className="flex flex-wrap items-center gap-2.5 list-none"
      aria-label="Tech stack"
    >
      {icons.map(({ name, src }) => (
        <li
          key={name}
          className="relative h-8 w-8 rounded-lg border border-black/5 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.03] p-1.5"
        >
          <Image
            src={src}
            alt={name}
            fill
            unoptimized
            className="object-contain p-0.5"
            sizes="32px"
            title={name}
          />
          <span className="sr-only">{name}</span>
        </li>
      ))}
    </ul>
  );
}

function CaseSection({
  label,
  title,
  lead,
  children,
}: {
  label: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/70">
          {label}
        </p>
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {lead && (
          <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed max-w-2xl">
            {lead}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function PanelList({ items }: { items: string[] }) {
  return (
    <div className={PANEL}>
      <ul className="divide-y divide-black/5 dark:divide-white/8">
        {items.map((item) => (
          <li
            key={item}
            className="px-4 py-4 md:px-5 text-sm md:text-[15px] leading-relaxed text-muted-foreground"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PanelBlocks({
  blocks,
}: {
  blocks: { title: string; body: string }[];
}) {
  return (
    <div className={PANEL}>
      <ul className="divide-y divide-black/5 dark:divide-white/8">
        {blocks.map((block) => (
          <li key={block.title} className="px-4 py-4 md:px-5 md:py-5 space-y-1.5">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              {block.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {block.body}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectMetaAside({
  aside,
  role,
  stack,
  year,
  originLabel,
}: {
  aside?: (typeof ASIDE_BY_SLUG)[string];
  role?: string;
  stack: string[];
  year?: number;
  originLabel?: string;
}) {
  const hasStack = resolveStackIcons(stack).length > 0;
  if (!aside && !role && !hasStack && !year && !originLabel) return null;

  return (
    <aside className="lg:col-span-4 lg:sticky lg:top-28">
      <div className={cn(PANEL, "p-5 md:p-6 space-y-5")}>
        {(originLabel || aside) && (
          <div className="flex items-start gap-3">
            {aside?.kind === "logo" && (
              <div className="relative h-10 w-10 shrink-0 rounded-lg border border-black/5 dark:border-white/8 bg-white dark:bg-zinc-900 p-1.5">
                <Image
                  src={aside.src}
                  alt={aside.alt}
                  fill
                  className="object-contain p-0.5"
                  sizes="40px"
                />
              </div>
            )}
            <div className="min-w-0 space-y-1">
              <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground/70">
                Context
              </p>
              {originLabel && (
                <p className="text-sm font-medium text-foreground">{originLabel}</p>
              )}
              {aside && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {aside.caption}
                </p>
              )}
            </div>
          </div>
        )}

        {aside?.kind === "document" && (
          <figure className="rounded-xl border border-black/5 dark:border-white/8 overflow-hidden bg-zinc-100/80 dark:bg-black/30">
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={aside.src}
                alt={aside.alt}
                fill
                className="object-contain object-center p-2"
                sizes="(max-width: 1024px) 100vw, 320px"
              />
            </div>
            <figcaption className="border-t border-black/5 dark:border-white/8 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground">
              {aside.caption}
            </figcaption>
          </figure>
        )}

        {role && (
          <div className="pt-1 border-t border-black/5 dark:border-white/8">
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground/70 mb-1.5">
              My role
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">{role}</p>
          </div>
        )}

        {hasStack && (
          <div className="pt-1 border-t border-black/5 dark:border-white/8">
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground/70 mb-2.5">
              Stack
            </p>
            <StackIcons stack={stack} />
          </div>
        )}

        {year != null && (
          <div className="pt-1 border-t border-black/5 dark:border-white/8">
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground/70 mb-1">
              Year
            </p>
            <p className="text-sm font-mono text-foreground">{year}</p>
          </div>
        )}
      </div>
    </aside>
  );
}

function neighborTitle(neighbor: CaseStudy | null) {
  if (!neighbor) return null;
  const p = staticProjects.find((x) => x.id === neighbor.projectId);
  if (!p) return neighbor.slug;
  return displayTitle(getProjectTitle(p, "en"));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const catalog = await resolveCatalog(study.projectId);
  if (!catalog) notFound();

  const { prev, next } = getAdjacentCaseStudies(slug);
  const hooks = hooksFor(study);
  const aside = ASIDE_BY_SLUG[slug];
  const taxonomy = getProjectTaxonomy(study.projectId);
  const originLabel = taxonomy ? ORIGIN_LABEL[taxonomy.origin] : undefined;
  const prevTitle = neighborTitle(prev);
  const nextTitle = neighborTitle(next);
  const showAside =
    Boolean(aside) ||
    Boolean(study.role) ||
    resolveStackIcons(catalog.tags).length > 0 ||
    catalog.year != null ||
    Boolean(originLabel);

  return (
    <main className="w-full overflow-x-hidden">
      <ProjectJsonLd
        slug={study.slug}
        title={catalog.title}
        description={study.problem}
        image={catalog.image}
        tags={catalog.tags}
        year={catalog.year}
        githubUrl={undefined}
        liveUrl={catalog.liveUrl}
        teamCredit={taxonomy?.origin === "webekspres"}
      />

      <div className={`${PAGE_PAD} pt-24 pb-8 md:pb-10`}>
        <div className={PAGE_SHELL}>
          <Link
            href="/projects"
            className="inline-flex text-xs font-mono tracking-widest text-muted-foreground hover:text-foreground transition-colors uppercase"
          >
            ← All projects
          </Link>

          <div className="mt-8 md:mt-10 flex flex-col gap-5 md:gap-6">
            <div className="flex flex-wrap items-center gap-2">
              {originLabel && (
                <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground/80 rounded-full border border-black/8 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] px-2.5 py-1">
                  {originLabel}
                </span>
              )}
              {catalog.year != null && (
                <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground/70">
                  {catalog.year}
                </span>
              )}
            </div>

            <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[0.95] text-balance">
              {catalog.title}
            </h1>

            {catalog.liveUrl ? (
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={catalog.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-black/10 dark:border-white/10 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.14em] text-foreground hover:border-brand/30 hover:text-brand transition-colors"
                >
                  Live site
                  <ArrowUpRight size={12} strokeWidth={1.6} />
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {catalog.image && (
        <div className={`${PAGE_PAD} pb-10 md:pb-12`}>
          <div className={PAGE_SHELL}>
            <div className="relative mx-auto w-full max-w-5xl aspect-16/10 md:aspect-[2/1] rounded-2xl overflow-hidden border border-black/5 dark:border-white/8 bg-zinc-100/80 dark:bg-zinc-950">
              <Image
                src={catalog.image}
                alt={`${catalog.title} product view`}
                fill
                priority
                className="object-contain object-center p-4 sm:p-6 md:p-8"
                sizes="(max-width: 1280px) 100vw, 1100px"
              />
            </div>
          </div>
        </div>
      )}

      <article className={`${PAGE_PAD} pb-14 md:pb-20`}>
        <div
          className={cn(
            PAGE_SHELL,
            "grid grid-cols-1 gap-10 lg:gap-12 items-start",
            showAside && "lg:grid-cols-12",
          )}
        >
          <div
            className={cn(
              "space-y-10 md:space-y-12 min-w-0",
              showAside ? "lg:col-span-8" : "max-w-3xl",
            )}
          >
            <CaseSection label="01 · Opening" title={hooks.opening}>
              <p className="text-base sm:text-lg text-foreground/90 leading-relaxed max-w-2xl">
                {study.problem}
              </p>
            </CaseSection>

            <CaseSection
              label="02 · Reality"
              title={hooks.reality}
              lead={hooks.realityLead}
            >
              <PanelList items={study.constraints} />
            </CaseSection>

            <CaseSection
              label="03 · Build"
              title={hooks.build}
              lead={hooks.buildLead}
            >
              <PanelBlocks blocks={study.architecture} />
            </CaseSection>

            <CaseSection
              label="04 · Close"
              title={hooks.close}
              lead={hooks.closeLead}
            >
              <PanelList items={study.outcomes} />
            </CaseSection>
          </div>

          {showAside && (
            <ProjectMetaAside
              aside={aside}
              role={study.role}
              stack={catalog.tags}
              year={catalog.year}
              originLabel={originLabel}
            />
          )}
        </div>
      </article>

      <div className={`${PAGE_PAD} pb-14 md:pb-20`}>
        <div className={PAGE_SHELL}>
          {(prev || next) && (
            <nav
              aria-label="Adjacent projects"
              className={cn(PANEL, "grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-black/5 dark:divide-white/8")}
            >
              {prev && prevTitle ? (
                <Link
                  href={`/projects/${prev.slug}`}
                  className="group px-5 py-4 md:px-6 md:py-5 space-y-1 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    Previous
                  </span>
                  <p className="text-base font-semibold text-foreground group-hover:text-brand transition-colors">
                    ← {prevTitle}
                  </p>
                </Link>
              ) : (
                <span className="hidden sm:block" />
              )}
              {next && nextTitle ? (
                <Link
                  href={`/projects/${next.slug}`}
                  className="group px-5 py-4 md:px-6 md:py-5 space-y-1 sm:text-right hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    Next
                  </span>
                  <p className="text-base font-semibold text-foreground group-hover:text-brand transition-colors">
                    {nextTitle} →
                  </p>
                </Link>
              ) : null}
            </nav>
          )}
        </div>
      </div>
    </main>
  );
}
