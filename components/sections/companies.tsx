"use client";

import Image from "next/image";
import { CompanyLogoSkeleton } from "@/components/ui/skeletons";
import { PageShell } from "@/components/ui/page-shell";
import { useCompanies } from "@/lib/hooks/use-api";
import type { Company } from "@/lib/supabase/types";

interface CompaniesProps {
  /** SSR first paint. Skips `/api/public/companies` when set. */
  initialData?: Company[];
}

function CompanyLogo({ company, decorative }: { company: Company; decorative: boolean }) {
  return (
    <div className="relative h-20 w-32 shrink-0 select-none">
      <Image
        src={company.logo}
        alt={decorative ? "" : company.name}
        fill
        loading="lazy"
        quality={60}
        draggable={false}
        className="object-contain select-none"
        sizes="128px"
      />
    </div>
  );
}

/** One sequence + trailing gap so duplicated halves line up for -50% translate. */
function MarqueeTrack({
  items,
  prefix,
  "aria-hidden": ariaHidden,
}: {
  items: Company[];
  prefix: string;
  "aria-hidden"?: boolean;
}) {
  const sequence = [...items, ...items, ...items];
  return (
    <div
      className="flex shrink-0 items-center gap-16 pr-16"
      aria-hidden={ariaHidden || undefined}
    >
      {sequence.map((company, i) => (
        <CompanyLogo
          key={`${prefix}-${company.id || company.name}-${i}`}
          company={company}
          // Only the first copy is announced; the rest exist to fill the loop.
          decorative={Boolean(ariaHidden) || i >= items.length}
        />
      ))}
    </div>
  );
}

export function Companies({ initialData }: CompaniesProps) {
  const { data, loading, error } = useCompanies(!initialData);

  const items = initialData ?? data ?? [];
  const showSkeleton = !initialData && loading;
  const showError = !initialData && error;

  return (
    <section
      id="companies"
      className="py-16 overflow-hidden w-full bg-transparent"
    >
      <PageShell wide>
        <h2 className="block w-full text-center font-mono text-xs sm:text-sm tracking-wider sm:tracking-widest text-muted-foreground uppercase mb-10 select-none px-2">
          Teams and schools I have built with
        </h2>

        {showSkeleton && (
          <div className="flex justify-center">
            <CompanyLogoSkeleton />
          </div>
        )}

        {showError && (
          <p className="text-center text-xs font-mono text-muted-foreground">
            Unable to load partners.
          </p>
        )}
      </PageShell>

      {/* Full-bleed marquee */}
      {!showSkeleton && !showError && items.length > 0 && (
        <div className="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent_0,black_15%,black_85%,transparent_100%)]">
          <div className="flex w-max animate-marquee py-4 hover:[animation-play-state:paused]">
            <MarqueeTrack items={items} prefix="a" />
            <MarqueeTrack items={items} prefix="b" aria-hidden />
          </div>
        </div>
      )}
    </section>
  );
}
