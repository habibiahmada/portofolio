"use client";

import Image from "next/image";
import { GlitchText } from "@/components/ui/glitch-text";
import { CompanyLogoSkeleton } from "@/components/ui/skeletons";
import { useCompanies } from "@/lib/hooks/use-api";
import type { Company } from "@/lib/supabase/types";

interface CompaniesProps {
  /** SSR first paint — skips `/api/public/companies` when set. */
  initialData?: Company[];
}

export function Companies({ initialData }: CompaniesProps) {
  const { data, loading, error } = useCompanies(!initialData);

  const items = initialData ?? data ?? [];
  const showSkeleton = !initialData && loading;
  const showError = !initialData && error;
  const marqueeItems = [...items, ...items];

  return (
    <section
      id="companies"
      className="py-16 overflow-hidden w-full bg-transparent"
    >
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
        <GlitchText
          as="h2"
          className="block w-full text-center font-mono tracking-widest text-muted-foreground/60 uppercase mb-10 select-none"
          interval={4500}
          duration={300}
        >
          // Collaborations & Trusted By
        </GlitchText>

        {/* Loading state */}
        {showSkeleton && (
          <div className="flex justify-center">
            <CompanyLogoSkeleton />
          </div>
        )}

        {/* Error state — fallback to empty */}
        {showError && (
          <p className="text-center text-xs font-mono text-muted-foreground/40">
            Unable to load partners.
          </p>
        )}

        {/* Companies marquee */}
        {!loading && !error && items.length > 0 && (
          <div className="relative w-full overflow-hidden flex items-center mask-[linear-gradient(to_right,transparent_0,black_20%,black_20%,transparent_100%)]">
            <div className="flex gap-16 py-4 animate-marquee whitespace-nowrap">
              {marqueeItems.map((company, index) => (
                <div
                  key={`${company.id || company.name}-${index}`}
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
        )}
      </div>
    </section>
  );
}
