"use client";

import Image from "next/image";

const techs = [
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    invert: false,
  },
  {
    name: "Next.js",
    icon: "https://cdn.simpleicons.org/nextdotjs",
    invert: false,
  },
  {
    name: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    invert: false,
  },
  {
    name: "TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    invert: false,
  },
  {
    name: "PostgreSQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    invert: false,
  },
  {
    name: "Tailwind CSS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    invert: false,
  },
  {
    name: "PHP",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    invert: false,
  },
  {
    name: "Laravel",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg",
    invert: false,
  },
  {
    name: "WordPress",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg",
    invert: false,
  },
  {
    name: "Elementor",
    icon: "https://cdn.simpleicons.org/elementor",
    invert: false,
  },
  {
    name: "Astra",
    icon: "https://cdn.simpleicons.org/astra",
    invert: false,
  },
  {
    name: "Git",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    invert: false,
  },
  {
    name: "GitHub",
    icon: "https://cdn.simpleicons.org/github",
    invert: false,
  },
  {
    name: "Bootstrap",
    icon: "https://cdn.simpleicons.org/bootstrap",
    invert: false,
  },
  {
    name: "Vercel",
    icon: "https://cdn.simpleicons.org/vercel",
    invert: false,
  },
  {
    name: "JavaScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    invert: false,
  },
];

// Split techs into two separate groups — no overlap between rows
const row1 = techs.slice(0, 8);
const row2 = techs.slice(8);

// Duplicate each row for seamless infinite scrolling
const marqueeRow1 = [...row1, ...row1];
const marqueeRow2 = [...row2, ...row2];

export function AboutTechStack() {
  return (
    <section
      id="about-techstack"
      className="py-24 w-full bg-transparent overflow-hidden"
    >
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div className="max-w-2xl mb-14 space-y-3">
          <span className="text-xs font-mono tracking-widest text-[#ef4444] dark:text-blue-400 uppercase block">
            // Tech Stack
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
            Tools & Technologies
          </h2>
          <p className="text-sm md:text-base text-muted-foreground/80 leading-relaxed font-medium max-w-lg">
            The technologies I use daily to turn ideas into functional,
            high-performing digital reality.
          </p>
        </div>

        {/* ── Marquee Row 1 — left to right ── */}
        <div className="relative w-full overflow-hidden mb-10 mask-[linear-gradient(to_right,transparent_0,black_15%,black_85%,transparent_100%)]">
          <div className="flex gap-16 py-5 animate-marquee-reverse items-center">
            {marqueeRow1.map((tech, i) => (
              <div
                key={`r1-${tech.name}-${i}`}
                className="relative w-16 h-16 shrink-0 opacity-30 hover:opacity-100 transition-all duration-500"
              >
                <Image
                  src={tech.icon}
                  alt=""
                  fill
                  loading="lazy"
                  quality={60}
                  draggable={false}
                  className={`object-contain select-none`}
                  sizes="64px"
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Marquee Row 2 — right to left ── */}
        <div className="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent_0,black_15%,black_85%,transparent_100%)]">
          <div className="flex gap-16 py-5 animate-marquee-slow items-center">
            {marqueeRow2.map((tech, i) => (
              <div
                key={`r2-${tech.name}-${i}`}
                className="relative w-16 h-16 shrink-0 opacity-30 hover:opacity-100 transition-all duration-500"
              >
                <Image
                  src={tech.icon}
                  alt=""
                  fill
                  loading="lazy"
                  quality={60}
                  draggable={false}
                  className={`object-contain select-none`}
                  sizes="64px"
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
