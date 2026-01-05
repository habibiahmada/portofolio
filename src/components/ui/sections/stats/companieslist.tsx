import { useTranslations } from "next-intl";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import useCompanies from "@/hooks/api/public/useCompanies";
import Skeletonlogolist from "./skeletonlogolist";

export default function Companieslist() {
  const t = useTranslations();
  const { companies, loading, error } = useCompanies();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark" || !mounted;

  if (error) return null;

  const isLoading = loading || !mounted;

  const companyList = companies ?? [];
  const displayCompanies = [
    ...companyList,
    ...companyList,
    ...companyList,
    ...companyList,
  ];

  return (
    <div className="w-full text-center">
      {/* Title */}
      <div className="mb-8 space-y-2">
        <h3 className={`text-sm font-bold tracking-widest uppercase
          ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          {t("stats.trustedBy")}
        </h3>

        <div className={`h-1 w-12 mx-auto rounded-full
          ${isDark ? "bg-slate-600" : "bg-slate-400"}`} />
      </div>

      {/* Logos */}
      <div
        className="relative w-full overflow-hidden
        [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        {isLoading ? (
          <div className="flex animate-pulse py-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeletonlogolist key={i} i={i}/>
            ))}
          </div>
        ) : (
          <div className="flex animate-scroll hover:[animation-play-state:paused] py-4">
            {displayCompanies.map((company, i) => (
              <div
                key={`${company.name}-${i}`}
                className="flex items-center justify-center mx-8 min-w-[120px] group transition-all duration-300"
              >
                <div className="relative h-12 transition-all duration-300 grayscale opacity-70
                  group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110">
                  <Image
                    src={company.logo || ""}
                    alt={company.name}
                    width={120}
                    height={60}
                    className="object-contain h-full w-auto"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
