import { useTranslations } from "next-intl";
import Image from "next/image";
import { useTheme } from "next-themes";
import "./stats.css";
import useCompanies from "@/hooks/useCompanies";
import { Company } from "@/lib/types/database";

export default function Companieslist() {
  const t = useTranslations();
  const { companies, loading, error } = useCompanies();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (error) return null;

  const companyList = companies as Company[] || [];
  const displayCompanies = [...companyList, ...companyList, ...companyList, ...companyList];

  return (
    <div className="w-full text-center">
      <div className="mb-8 space-y-2">
        <h3 className={`text-sm font-bold tracking-widest uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          {t("stats.trustedBy")}
        </h3>
        <div className={`h-1 w-12 mx-auto rounded-full ${isDark ? "bg-slate-700" : "bg-slate-300"}`} />
      </div>

      {/* Container dengan Fade Mask di kiri dan kanan */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">

        {loading ? (
          <div className="flex justify-center gap-8 opacity-50">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-12 w-32 rounded animate-pulse ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            ))}
          </div>
        ) : (
          <div className="flex animate-scroll hover:[animation-play-state:paused] py-4">
            {displayCompanies.map((company, i) => (
              <div
                key={`${company.name}-${i}`}
                className="flex items-center justify-center mx-8 min-w-[120px] group transition-all duration-300"
              >
                {/* Logo: Default Grayscale & Opacity rendah, Hover: Full Color & Opacity tinggi */}
                <div className={`relative h-12 w-auto transition-all duration-300 filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110`}>
                  <Image
                    src={company.logo || ""}
                    alt={company.name}
                    width={120}
                    height={60}
                    className="object-contain h-full w-auto"
                    style={{ width: "auto", height: "100%" }}
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