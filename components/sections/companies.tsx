"use client";

import Image from "next/image";
import { GlitchText } from "@/components/ui/glitch-text";

const companies = [
  { name: "Neskar", logo: "/images/companies/neskar.png" },
  { name: "PPLG", logo: "/images/companies/pplg.png" },
  { name: "Sagasitas", logo: "/images/companies/sagasitas.png" },
  { name: "Smartplus", logo: "/images/companies/smartplus.png" },
  { name: "Webekspres", logo: "/images/companies/webekspres.png" },
];

// Duplicate marquee items for a seamless scrolling loop
const marqueeItems = [...companies, ...companies, ...companies];

export function Companies() {
  return (
    <section
      id="companies"
      className="py-16 overflow-hidden w-full bg-transparent"
    >
      <div className="w-full  mx-auto px-6 md:px-12 lg:px-16">
        {/* Modern minimal label */}
        <GlitchText
          as="h2"
          className="block w-full text-center font-mono tracking-widest text-muted-foreground/60 uppercase mb-10 select-none"
          interval={4500}
          duration={300}
        >
          // Collaborations & Trusted By
        </GlitchText>

        {/* Fade-masked marquee container */}
        <div className="relative w-full overflow-hidden flex items-center mask-[linear-gradient(to_right,transparent_0,black_20%,black_20%,transparent_100%)]">
          <div className="flex gap-16 py-4 animate-marquee whitespace-nowrap">
            {marqueeItems.map((company, index) => (
              <div
                key={`${company.name}-${index}`}
                className="relative h-20 w-32 shrink-0 opacity-40 hover:opacity-200 transition-all duration-500 cursor-pointer select-none"
              >
                <Image
                  src={company.logo}
                  alt={company.name}
                  fill
                  loading="lazy"
                  quality={60}
                  draggable={false}
                  className="object-contain select-none"
                  sizes="120px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
