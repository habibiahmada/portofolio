"use client";

import { useEffect, useRef } from "react";
import { Briefcase, GraduationCap, MapPin, Calendar } from "lucide-react";
import { Companies } from "./companies";

// ─── Data ─────────────────────────────────────────────────────────────────────

const timelineData = [
  {
    id: "a1b2c3d4",
    type: "experience" as const,
    company: "PT Webekspres Technology Indonesia",
    location: "Karawang, Jawa Barat",
    start_date: "2026-05-01",
    end_date: "2099-12-31",
    title: "Web Developer",
    highlight: "Current Position",
    description:
      "Building and maintaining web solutions for clients using WordPress, CMS platforms, and modern web technologies. Responsible for end-to-end development of company and client projects.",
    location_type: "On Site",
    skills: ["WordPress", "CMS", "Full-Stack Development", "Web Development"],
  },
  {
    id: "9cb78319",
    type: "experience" as const,
    company: "Yayasan Sagasitas Indonesia",
    location: "DKI Jakarta",
    start_date: "2025-06-01",
    end_date: "2025-08-31",
    title: "Cloud Computing Trainer Intern",
    highlight: null,
    description:
      "Teaching Cloud Computing and Generative AI in schools. Guiding practicals using AWS PartyRock, developing hands-on materials and labs, and liaising between teaching teams and schools.",
    location_type: "On Site",
    skills: ["Software Engineering", "Network Technology", "Programming"],
  },
  {
    id: "4bc9dcb4",
    type: "experience" as const,
    company: "Coding Camp powered by DBS Foundation",
    location: "Bandung, Jawa Barat",
    start_date: "2025-01-01",
    end_date: "2025-04-30",
    title: "Student Member",
    highlight: "Top 15 Achievement",
    description:
      "Deepening our understanding of Full-Stack Development & Web Development. The CultureConnect team's project made it to the Top 15 Best Capstone Projects.",
    location_type: "Remote",
    skills: [
      "Cloud Computing",
      "Generative AI",
      "AWS PartyRock",
      "Technical Teaching",
    ],
  },
  {
    id: "6a827630",
    type: "experience" as const,
    company: "CV. SmartPlus Indonesia",
    location: "Karawang, Jawa Barat",
    start_date: "2025-01-01",
    end_date: "2025-05-31",
    title: "Web Developer Intern",
    highlight: null,
    description:
      "Full-stack web developer specializing in website development for internal company projects. Focused on end-to-end development using modern technologies.",
    location_type: "Remote",
    skills: [
      "Full-Stack Development",
      "Team Collaboration",
      "Project Management",
    ],
  },
  {
    id: "c49b36f4",
    type: "education" as const,
    company: "SMK Negeri 1 Karawang",
    location: "Karawang, Jawa Barat",
    start_date: "2023-06-01",
    end_date: "2026-06-01",
    title: "Software Engineering",
    highlight: null,
    description:
      "Focuses on software development, programming, computer systems, and networking technologies. Active in various technology projects and competitions.",
    location_type: "On Site",
    skills: ["Academic Support", "Teaching Assistance", "Organization"],
  },
  {
    id: "767a322c",
    type: "education" as const,
    company: "MTSS Darunnadwah 01",
    location: "Karawang, Jawa Barat",
    start_date: "2020-07-01",
    end_date: "2023-06-30",
    title: "Arabic Language and Literature",
    highlight: null,
    description:
      "Learn Arabic language and literature with a focus on linguistic abilities and cultural understanding. Develop communication and text analysis skills.",
    location_type: "On Site",
    skills: ["Arabic Language", "Literature Analysis", "Cultural Studies"],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function isOngoing(end: string) {
  return new Date(end) > new Date();
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function TimelineCard({
  item,
  index,
}: {
  item: (typeof timelineData)[number];
  index: number;
}) {
  const isExp = item.type === "experience";
  const ongoing = isOngoing(item.end_date);

  return (
    <div
      className="relative flex gap-5 group mt-4"
    >
      {/* Icon column */}
      <div className="flex flex-col items-center shrink-0 pt-1">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center ring-4 z-10 transition-all duration-300 ${
            isExp
              ? "bg-[#ef4444]/10 ring-[#ef4444]/20 text-[#ef4444] group-hover:bg-[#ef4444]/20 group-hover:ring-[#ef4444]/40"
              : "bg-emerald-500/10 ring-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:ring-emerald-500/40"
          }`}
        >
          {isExp ? <Briefcase size={16} /> : <GraduationCap size={16} />}
        </div>
        {/* Connector */}
        <div className="w-px flex-1 min-h-8 bg-black/5 dark:bg-white/5 mt-2" />
      </div>

      {/* Card — same style as bento cards */}
      <div className="flex-1 pb-10">
        <div className="flex flex-col gap-4 rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-950 p-5 md:p-6 hover:border-black/10 dark:hover:border-white/10 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30 transition-all duration-500">
          {/* Top row */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-0.5">
              <h3 className="text-base md:text-lg font-bold text-foreground leading-snug">
                {item.title}
              </h3>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--navy-accent-text)" }}
              >
                {item.company}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              {item.highlight && (
                <span
                  className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                    isExp
                      ? "bg-[#ef4444]/8 text-[#ef4444] border-[#ef4444]/15 dark:bg-[#ef4444]/10 dark:text-[#ef4444] dark:border-[#ef4444]/20"
                      : "bg-emerald-500/8 text-emerald-600 border-emerald-500/15 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                  }`}
                >
                  {item.highlight}
                </span>
              )}
              {ongoing && (
                <span className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400 bg-emerald-500/8 dark:bg-emerald-500/10 border border-emerald-500/15 dark:border-emerald-500/20 px-2.5 py-1 rounded-full">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                  </span>
                  Present
                </span>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground/60">
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {formatDate(item.start_date)} —{" "}
              {ongoing ? "Present" : formatDate(item.end_date)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {item.location} · {item.location_type}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-muted-foreground/75 leading-relaxed">
            {item.description}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {item.skills.map((skill) => (
              <span
                key={skill}
                className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border border-black/5 dark:border-white/5 bg-black/2 dark:bg-white/2 text-muted-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function AboutTimeline() {
  const lineRef = useRef<HTMLDivElement>(null);

  // GSAP: animate the vertical progress line on scroll
  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;

    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        el,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        },
      );
    })();

    return () => { cancelled = true; };
  }, []);

  const experiences = timelineData.filter((d) => d.type === "experience");
  const education = timelineData.filter((d) => d.type === "education");

  return (
    <section
      id="about-timeline"
      className="py-16 md:py-24 w-full px-4 sm:px-6 md:px-8 lg:px-12 bg-transparent"
    >
      <div className="w-full space-y-16 md:space-y-20">
        {/* ── Experience ── */}
        <div className="space-y-12">
          <div
            className="space-y-3"
          >
            <span className="text-xs font-mono tracking-widest text-[#ef4444] dark:text-blue-400 uppercase block">
              // Experience
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
              My Journey
            </h2>
            <p className="text-sm md:text-base text-muted-foreground/80 leading-relaxed font-medium max-w-lg">
              Professional experience and programs that shaped how I build
              digital products.
            </p>
          </div>

          <div>
            {experiences.map((item, i) => (
              <TimelineCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px w-full bg-black/5 dark:bg-white/5" />
        <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12">
          <Companies />
        </div>
        <div className="h-px w-full bg-black/5 dark:bg-white/5" />

        {/* ── Education ── */}
        <div className="space-y-12">
          <div
            className="space-y-3"
          >
            <span className="text-xs font-mono tracking-widest text-emerald-500 uppercase block">
              // Education
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
              Academic Foundation
            </h2>
            <p className="text-sm md:text-base text-muted-foreground/80 leading-relaxed font-medium max-w-lg">
              The educational background that built my technical skills and
              shaped my approach to problem-solving.
            </p>
          </div>

          <div>
            {education.map((item, i) => (
              <TimelineCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
