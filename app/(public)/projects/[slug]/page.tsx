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
  type Project,
} from "@/lib/projects";
import { ProjectJsonLd } from "@/components/json-ld";
import { projectPageMetadata } from "@/lib/site-metadata";
import { PAGE_PAD, PAGE_SHELL } from "@/components/ui/page-shell";

type Props = { params: Promise<{ slug: string }> };

const DEFAULT_HOOKS = {
  opening: "Where it started",
  reality: "What boxed the work in",
  build: "How it came together",
  close: "What I can stand behind",
} as const;

/**
 * Only clearly matching context images. Omit a slug = no aside image.
 * Certificates / press use contain so nothing is cropped.
 */
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
  agrify: {
    src: "/data/certificates/intel/country-award-winner-agrify-indonesia-13-17-years-habibi-ahmad-aziz/country-award-winner-agrify-indonesia-13-17-years-habibi-ahmad-aziz.webp",
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
  githubUrl?: string;
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
    liveUrl: p.live_url && p.live_url !== "#" ? p.live_url : undefined,
    githubUrl: p.github_url && p.github_url !== "#" ? p.github_url : undefined,
    year: p.year,
  };
}

async function resolveCatalog(projectId: string): Promise<CatalogProject | null> {
  const row = await getProjectById(projectId);
  if (row) {
    const title =
      row.title_en || row.title_id || staticProjects.find((p) => p.id === projectId)?.title_en || "Project";
    return {
      id: row.id,
      title: displayTitle(title),
      image: row.image,
      tags: row.tags ?? [],
      liveUrl: row.live_url && row.live_url !== "#" ? row.live_url : undefined,
      githubUrl:
        row.github_url && row.github_url !== "#" ? row.github_url : undefined,
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
  return projectPageMetadata({
    title: catalog?.title ?? slug,
    description: study.problem,
    slug: study.slug,
    image: catalog?.image,
    tags: catalog?.tags,
    year: catalog?.year,
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
      className="flex flex-wrap items-center gap-3 list-none"
      aria-label="Tech stack"
    >
      {icons.map(({ name, src }) => (
        <li key={name} className="relative h-9 w-9 sm:h-10 sm:w-10">
          <Image
            src={src}
            alt={name}
            fill
            unoptimized
            className="object-contain"
            sizes="40px"
            title={name}
          />
          <span className="sr-only">{name}</span>
        </li>
      ))}
    </ul>
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
  const stackIcons = resolveStackIcons(catalog.tags);
  const prevTitle = neighborTitle(prev);
  const nextTitle = neighborTitle(next);

  return (
    <main className="w-full overflow-x-hidden">
      <ProjectJsonLd
        slug={study.slug}
        title={catalog.title}
        description={study.problem}
        image={catalog.image}
        tags={catalog.tags}
        year={catalog.year}
        githubUrl={catalog.githubUrl}
        liveUrl={catalog.liveUrl}
      />
      <div className={`${PAGE_PAD} pt-24 pb-10`}>
        <div className={PAGE_SHELL}>
          <Link
            href="/projects"
            className="inline-flex text-xs font-mono tracking-widest text-muted-foreground hover:text-foreground transition-colors uppercase"
          >
            ← All projects
          </Link>

          <div className="mt-10 flex flex-col gap-6 md:gap-8">
            <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[0.95] text-balance">
              {catalog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <StackIcons stack={catalog.tags} />
              <div className="flex flex-wrap gap-4">
                {catalog.liveUrl && (
                  <a
                    href={catalog.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.16em] text-foreground hover:text-brand transition-colors"
                  >
                    Live site
                    <ArrowUpRight size={13} strokeWidth={1.6} />
                  </a>
                )}
                {catalog.githubUrl && (
                  <a
                    href={catalog.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Source
                    <ArrowUpRight size={13} strokeWidth={1.6} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {catalog.image && (
        <div className="relative w-full bg-zinc-950 dark:bg-black border-y border-white/5">
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            aria-hidden
          >
            <div className="absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-brand/25 blur-3xl" />
            <div className="absolute bottom-0 right-1/5 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
          </div>
          <div className={`${PAGE_PAD} relative py-10 md:py-14`}>
            <div className={PAGE_SHELL}>
              <div className="relative mx-auto w-full max-w-5xl aspect-16/10 md:aspect-2/1">
                <Image
                  src={catalog.image}
                  alt={`${catalog.title} product view`}
                  fill
                  priority
                  className="object-contain object-center drop-shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
                  sizes="(max-width: 1280px) 100vw, 1100px"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <article className={`${PAGE_PAD} py-14 md:py-20`}>
        <div
          className={`${PAGE_SHELL} grid grid-cols-1 ${
            aside || stackIcons.length > 0 ? "lg:grid-cols-12" : ""
          } gap-10 lg:gap-14 items-start`}
        >
          <div
            className={`space-y-14 md:space-y-16 min-w-0 ${
              aside || stackIcons.length > 0 ? "lg:col-span-7" : "max-w-3xl"
            }`}
          >
            <section id="opening" className="space-y-4">
              <h2 className="text-sm sm:text-base font-semibold tracking-tight text-brand">
                {hooks.opening}
              </h2>
              <p className="text-xl sm:text-2xl font-medium tracking-tight text-foreground leading-snug text-balance">
                {study.problem}
              </p>
            </section>

            <section id="reality" className="space-y-5">
              <h2 className="text-sm sm:text-base font-semibold tracking-tight text-brand">
                {hooks.reality}
              </h2>
              <ul className="space-y-3">
                {study.constraints.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-zinc-950/70 px-4 py-4 text-sm md:text-[15px] leading-relaxed text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section id="build" className="space-y-5">
              <h2 className="text-sm sm:text-base font-semibold tracking-tight text-brand">
                {hooks.build}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {study.architecture.map((block) => (
                  <div
                    key={block.title}
                    className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-950 p-4 md:p-5 space-y-2"
                  >
                    <h3 className="text-sm font-bold tracking-tight text-foreground">
                      {block.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {block.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section id="close" className="space-y-5">
              <h2 className="text-sm sm:text-base font-semibold tracking-tight text-brand">
                {hooks.close}
              </h2>
              <ul className="space-y-3">
                {study.outcomes.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm md:text-[15px] leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {(aside || stackIcons.length > 0) && (
            <aside className="lg:col-span-5 lg:sticky lg:top-28 space-y-4">
              {aside && (
                <figure className="rounded-2xl border border-black/5 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 overflow-hidden">
                  {aside.kind === "document" ? (
                    <div className="relative w-full aspect-[4/3] bg-zinc-200/50 dark:bg-black/40">
                      <Image
                        src={aside.src}
                        alt={aside.alt}
                        fill
                        className="object-contain object-center p-3 sm:p-4"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                      />
                    </div>
                  ) : (
                    <div className="relative w-full aspect-square">
                      <Image
                        src={aside.src}
                        alt={aside.alt}
                        fill
                        className="object-contain object-center p-10 sm:p-12"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                      />
                    </div>
                  )}
                  <figcaption className="border-t border-black/5 dark:border-white/10 px-4 py-3 text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                    {aside.caption}
                  </figcaption>
                </figure>
              )}

              {stackIcons.length > 0 && (
                <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-zinc-950/60 p-4 space-y-3">
                  <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground/70">
                    Stack
                  </p>
                  <StackIcons stack={catalog.tags} />
                  {study.role && (
                    <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                      My role: {study.role}
                    </p>
                  )}
                </div>
              )}
            </aside>
          )}
        </div>
      </article>

      <div className={`${PAGE_PAD} pb-14 md:pb-20`}>
        <div className={PAGE_SHELL}>
          {(prev || next) && (
            <nav
              aria-label="Adjacent projects"
              className="pt-2 border-t border-black/5 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-8"
            >
              {prev && prevTitle ? (
                <Link
                  href={`/projects/${prev.slug}`}
                  className="group space-y-1"
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    Previous
                  </span>
                  <p className="text-base font-semibold text-foreground group-hover:text-brand transition-colors">
                    ← {prevTitle}
                  </p>
                </Link>
              ) : (
                <span />
              )}
              {next && nextTitle ? (
                <Link
                  href={`/projects/${next.slug}`}
                  className="group space-y-1 sm:text-right"
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
