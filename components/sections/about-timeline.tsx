"use client";

import { Companies } from "./companies";

const timelineData = [
  {
    id: "a1b2c3d4",
    type: "experience" as const,
    company: "PT Webekspres Teknologi Indonesia",
    location: "Karawang · On site",
    start_date: "2026-05-01",
    end_date: "2099-12-31",
    title: "Web Developer",
    highlight: "Current",
    description:
      "Delivered 19 client websites in about four months with the Webekspres team: corporate sites, news portals, landing pages, catalogs, and integrated apps.",
    skills: ["WordPress", "Next.js", "React", "Laravel"],
  },
  {
    id: "9cb78319",
    type: "experience" as const,
    company: "Yayasan Sagasitas Indonesia",
    location: "Jakarta · On site",
    start_date: "2025-06-01",
    end_date: "2025-08-31",
    title: "Cloud Computing Trainer Intern",
    highlight: null,
    description:
      "Taught Cloud Computing and Generative AI in schools. Built AWS PartyRock labs and kept teaching teams aligned with partner schools.",
    skills: ["Cloud", "GenAI", "Teaching"],
  },
  {
    id: "4bc9dcb4",
    type: "experience" as const,
    company: "Coding Camp powered by DBS Foundation",
    location: "Bandung · Remote",
    start_date: "2025-01-01",
    end_date: "2025-04-30",
    title: "Student Member",
    highlight: "Top 15 Capstone",
    description:
      "Full-stack track under real deadlines. CultureConnect landed in the Top 15 Best Capstone Projects.",
    skills: ["Full-stack", "Capstone"],
  },
  {
    id: "6a827630",
    type: "experience" as const,
    company: "CV. SmartPlus Indonesia",
    location: "Karawang · Remote",
    start_date: "2025-01-01",
    end_date: "2025-05-31",
    title: "Web Developer Intern",
    highlight: null,
    description:
      "Full-stack intern on internal company web projects. Shipped features end to end with modern stacks.",
    skills: ["Full-stack", "Internal tools"],
  },
  {
    id: "c49b36f4",
    type: "education" as const,
    company: "SMK Negeri 1 Karawang",
    location: "Karawang",
    start_date: "2023-06-01",
    end_date: "2026-06-01",
    title: "Software Engineering",
    highlight: null,
    description:
      "Software development, programming, systems, and networking. Active in tech projects and competitions.",
    skills: [],
  },
  {
    id: "767a322c",
    type: "education" as const,
    company: "MTSS Darunnadwah 01",
    location: "Karawang",
    start_date: "2020-07-01",
    end_date: "2023-06-30",
    title: "Arabic Language and Literature",
    highlight: null,
    description:
      "Arabic language and literature with a focus on communication and text analysis.",
    skills: [],
  },
];

type Entry = (typeof timelineData)[number];

function monthLabel(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short" });
}

function periodLabel(start: string, end: string) {
  const ongoing = new Date(end) > new Date();
  if (ongoing) return `${monthLabel(start)} ${new Date(start).getFullYear()} – Now`;
  const ys = new Date(start).getFullYear();
  const ye = new Date(end).getFullYear();
  if (ys === ye) return `${monthLabel(start)} – ${monthLabel(end)}`;
  return `${monthLabel(start)} ${ys} – ${monthLabel(end)} ${ye}`;
}

function groupByYear(items: Entry[]) {
  const map = new Map<number, Entry[]>();
  for (const item of items) {
    const y = new Date(item.start_date).getFullYear();
    const list = map.get(y) ?? [];
    list.push(item);
    map.set(y, list);
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0]);
}

function ExperienceItem({ item, index }: { item: Entry; index: number }) {
  const ongoing = new Date(item.end_date) > new Date();

  return (
    <article className="group grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 py-6 sm:py-7 first:pt-0">
      <div className="sm:col-span-3 flex sm:flex-col gap-2 sm:gap-1 items-baseline sm:items-start">
        <span className="text-[10px] font-mono text-muted-foreground/40 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground/70">
          {periodLabel(item.start_date, item.end_date)}
        </span>
      </div>

      <div className="sm:col-span-9 space-y-2.5 min-w-0 border-l border-transparent sm:border-black/5 dark:sm:border-white/10 sm:pl-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground leading-snug">
            {item.title}
          </h3>
          {item.highlight && (
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-brand border border-brand/25 px-2 py-0.5 rounded-full">
              {item.highlight}
            </span>
          )}
          {ongoing && (
            <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-500">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              Present
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-brand">{item.company}</p>
        <p className="text-xs text-muted-foreground/55">{item.location}</p>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl pt-0.5">
          {item.description}
        </p>
        {item.skills.length > 0 && (
          <ul className="flex flex-wrap gap-x-4 gap-y-1 list-none pt-1">
            {item.skills.map((skill) => (
              <li
                key={skill}
                className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground/50"
              >
                {skill}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

function EducationTile({ item }: { item: Entry }) {
  const ys = new Date(item.start_date).getFullYear();
  const ye = new Date(item.end_date).getFullYear();

  return (
    <article className="space-y-2 py-1">
      <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground/55">
        {ys} – {ye}
      </p>
      <h3 className="text-lg font-bold tracking-tight text-foreground leading-snug">
        {item.title}
      </h3>
      <p className="text-sm font-medium text-emerald-500">{item.company}</p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {item.description}
      </p>
    </article>
  );
}

export function AboutTimeline() {
  const experiences = timelineData.filter((d) => d.type === "experience");
  const education = timelineData.filter((d) => d.type === "education");
  const grouped = groupByYear(experiences).map(([year, items], gi, all) => {
    const offset = all
      .slice(0, gi)
      .reduce((sum, [, list]) => sum + list.length, 0);
    return { year, items, offset };
  });

  return (
    <section
      id="about-timeline"
      className="py-16 md:py-24 w-full bg-transparent"
    >
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-7xl space-y-20 md:space-y-28">
          <div>
            <div className="max-w-2xl mb-12 md:mb-14 space-y-3">
              <span className="text-xs font-mono tracking-widest text-brand uppercase block">
                Experience
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                Path so far
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium max-w-lg">
                Roles and programs that taught me to scope, ship, and explain the
                trade-offs.
              </p>
            </div>

            <div className="space-y-10 md:space-y-14">
              {grouped.map(({ year, items, offset }) => (
                <div
                  key={year}
                  className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10"
                >
                  <div className="md:col-span-2">
                    <p className="text-sm font-mono font-semibold tracking-widest text-brand sticky top-28">
                      {year}
                    </p>
                  </div>
                  <div className="md:col-span-10 divide-y divide-black/5 dark:divide-white/10 border-y border-black/5 dark:border-white/10">
                    {items.map((item, i) => (
                      <ExperienceItem
                        key={item.id}
                        item={item}
                        index={offset + i}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12">
            <Companies />
          </div>

          <div>
            <div className="max-w-2xl mb-10 space-y-3">
              <span className="text-xs font-mono tracking-widest text-emerald-500 uppercase block">
                Education
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                Foundations
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-12 md:gap-16">
              {education.map((item) => (
                <EducationTile key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
