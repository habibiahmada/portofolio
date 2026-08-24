"use client";

import Image from "next/image";

/** Prefer colored brand marks; monochrome logos use an explicit light color for dark UI. */
const techs = [
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  },
  {
    name: "Next.js",
    icon: "https://cdn.simpleicons.org/nextdotjs/ffffff",
  },
  {
    name: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  },
  {
    name: "PostgreSQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
  },
  {
    name: "Tailwind CSS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  },
  {
    name: "PHP",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg",
  },
  {
    name: "Laravel",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg",
  },
  {
    name: "WordPress",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/wordpress/wordpress-original.svg",
  },
  {
    name: "Elementor",
    icon: "https://cdn.simpleicons.org/elementor/92003B",
  },
  {
    name: "Astra",
    icon: "/icons/tech/astra.svg",
  },
  {
    name: "Git",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
  },
  {
    name: "GitHub",
    icon: "https://cdn.simpleicons.org/github/ffffff",
  },
  {
    name: "Bootstrap",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg",
  },
  {
    name: "Vercel",
    icon: "https://cdn.simpleicons.org/vercel/ffffff",
  },
  {
    name: "JavaScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  },
] as const;

type Tech = (typeof techs)[number];

const row1 = techs.slice(0, 8);
const row2 = techs.slice(8);

function TechIcon({ name, icon }: Tech) {
  return (
    <div className="relative w-16 h-16 shrink-0 cursor-pointer select-none transition-transform duration-500 hover:scale-110">
      <Image
        src={icon}
        alt={name}
        fill
        loading="lazy"
        unoptimized
        draggable={false}
        className="object-contain select-none"
        sizes="64px"
        title={name}
      />
    </div>
  );
}

/** One sequence + trailing gap so duplicated halves line up for -50% translate.
 *  Items are repeated so each half stays wider than typical viewports. */
function MarqueeTrack({
  items,
  prefix,
  "aria-hidden": ariaHidden,
}: {
  items: readonly Tech[];
  prefix: string;
  "aria-hidden"?: boolean;
}) {
  const sequence = [...items, ...items, ...items];
  return (
    <div
      className="flex shrink-0 items-center gap-16 pr-16"
      aria-hidden={ariaHidden || undefined}
    >
      {sequence.map((tech, i) => (
        <TechIcon key={`${prefix}-${tech.name}-${i}`} {...tech} />
      ))}
    </div>
  );
}

function InfiniteMarquee({
  items,
  animationClass,
}: {
  items: readonly Tech[];
  animationClass: string;
}) {
  return (
    <div className="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent_0,black_15%,black_85%,transparent_100%)]">
      <div className={`flex w-max ${animationClass}`}>
        <MarqueeTrack items={items} prefix="a" />
        <MarqueeTrack items={items} prefix="b" aria-hidden />
      </div>
    </div>
  );
}

export function AboutTechStack() {
  return (
    <section
      id="about-techstack"
      className="py-16 md:py-24 w-full bg-transparent overflow-hidden"
    >
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-7xl mb-14 space-y-3">
          <span className="text-xs font-mono tracking-widest text-brand uppercase block">
            Tech Stack
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
            Tools & Technologies
          </h2>
          <p className="text-sm md:text-base text-muted-foreground/80 leading-relaxed font-medium max-w-lg">
            The technologies I use daily to turn ideas into functional,
            high-performing digital reality.
          </p>
        </div>

        {/* Full-bleed marquees */}
        <div className="mb-10">
          <InfiniteMarquee
            items={row1}
            animationClass="animate-marquee-reverse py-5"
          />
        </div>
        <InfiniteMarquee
          items={row2}
          animationClass="animate-marquee-slow py-5"
        />
      </div>
    </section>
  );
}
