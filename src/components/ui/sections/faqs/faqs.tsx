"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";
import SectionHeader from "../SectionHeader";
import { useTheme } from "next-themes";
import useFaqs from "@/hooks/api/public/useFaqs";



const ModernFAQSection: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("faqs");

  const { faqs, loading } = useFaqs();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <section
      className={`
        relative overflow-hidden
        py-24 sm:py-36 lg:py-40 transition-colors duration-300
        ${isDark ? "bg-slate-950" : "bg-slate-50"}
      `}
    >
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="mb-16">
          <SectionHeader
            title={t("titleLine1")}
            description={t("description1")}
            align="center"
          />
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">
            Loading FAQs...
          </p>
        ) : (
          <Accordion
            type="single"
            collapsible
            defaultValue={faqs[0]?.id}
            className="w-full"
          >
            {faqs.map((faq) => {
              const translation = faq.faq_translations[0];
              if (!translation) return null;

              return (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>
                    <p className="text-lg text-left">
                      {translation.question}
                    </p>
                  </AccordionTrigger>

                  <AccordionContent>
                    <p className="text-md text-muted-foreground">
                      {translation.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>

      {/* Background Pattern */}
      <div
        className="absolute inset-0 pointer-events-none bg-[size:40px_40px]
        bg-[linear-gradient(rgba(148,163,184,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.3)_1px,transparent_1px)]
        dark:bg-[linear-gradient(rgba(59,130,246,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.15)_1px,transparent_1px)]
        [mask-image:radial-gradient(ellipse_60%_40%_at_50%_0%,#000_70%,transparent_100%)]"
      />
    </section>
  );
};

export default ModernFAQSection;