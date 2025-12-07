import { useTranslations } from "next-intl";
import Image from "next/image";
import { useTheme } from "next-themes";
import "./stats.css";
import Skeletonlogolist from "./skeletonlogolist";
import useCompanies from "@/hooks/useCompanies";
import { Company } from "@/lib/types/database";

export default function Companieslist() {
  const t = useTranslations();
  const { companies, loading, error } = useCompanies();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const skeletons = Array.from({ length: 6 });

  return (
    <div className="text-center">
      <h3
        className={`text-xl font-semibold mb-2 ${
          isDark ? "text-slate-200" : "text-slate-800"
        }`}
      >
        {t("stats.trustedBy")}
      </h3>
      <p className={`${isDark ? "text-slate-400" : "text-slate-600"} mb-8`}>
        {t("stats.trustedDescription")}
      </p>

      <div className="overflow-hidden relative">
        <div className="md:flex gap-6 justify-center">
          {loading ? (
            skeletons.map((_, i) => (
              <Skeletonlogolist key={i} i={i} isDark={isDark} />
            ))
          ) : error ? (
            <div className="text-red-500 text-sm">
              {t("stats.loadError", { default: "Failed to load companies" })}
            </div>
          ) : (
            (companies as Company[]).map((company, i) => (
              <div
                key={i}
                className={`h-30 py-6 my-2 min-w-[150px] rounded-xl border backdrop-blur-sm flex items-center justify-center px-4 z-10 
                  ${
                    isDark
                      ? "border-slate-700/60 bg-slate-800/40"
                      : "border-slate-200/60 bg-white/60"
                  }`}
              >
                <div className="text-center flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center justify-center">
                    <Image
                      src={company.logo}
                      alt={company.name}
                      width={80}
                      height={80}
                      className="object-contain max-h-full max-w-full"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </div>
                  <div
                    className={`text-xs font-medium opacity-80 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    {company.name}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
