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

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: "item-1",
    question: "Berapa lama waktu pengerjaan proyek?",
    answer:
      "Waktu pengerjaan bervariasi tergantung kompleksitas proyek. Website sederhana membutuhkan 1-2 minggu, sementara aplikasi web kompleks bisa memakan waktu 4-8 minggu. Saya akan memberikan timeline yang jelas setelah analisis requirements awal.",
  },
  {
    id: "item-2",
    question: "Apakah saya menyediakan maintenance setelah project selesai?",
    answer:
      "Ya, saya menyediakan maintenance dan support selama 3 bulan pertama tanpa biaya tambahan. Setelah itu, tersedia paket maintenance bulanan yang mencakup bug fixes, security updates, dan minor improvements.",
  },
  {
    id: "item-3",
    question: "Teknologi apa yang paling saya rekomendasikan?",
    answer:
      "Untuk sebagian besar proyek, saya merekomendasikan React/Next.js karena performanya yang excellent dan ecosystem yang mature. Namun, pemilihan teknologi selalu disesuaikan dengan kebutuhan spesifik, budget, dan timeline proyek Anda.",
  },
  {
    id: "item-4",
    question: "Bagaimana sistem pembayaran?",
    answer:
      "Sistem pembayaran fleksibel: 50% di awal sebagai down payment, 50% sisanya setelah proyek selesai. Untuk proyek besar, bisa dibagi menjadi beberapa milestone. Pembayaran bisa melalui transfer bank atau e-wallet.",
  },
  {
    id: "item-5",
    question: "Apakah website yang dibuat SEO-friendly?",
    answer:
      "Absolutely! Semua website yang saya buat sudah dioptimasi untuk SEO dari awal. Ini termasuk proper meta tags, structured data, sitemap, optimasi kecepatan loading, dan mobile-friendly design. Saya juga bisa memberikan panduan SEO basic untuk konten.",
  },
];

const ModernFAQSection: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("faqs");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  const isDark = resolvedTheme === "dark";
  
  return (
    <section
        className={`
        relative overflow-hidden
        py-28 sm:py-36 lg:py-40
        ${
          isDark ? "bg-slate-950" : "bg-slate-50"
        }`} 
        >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-16">
          <SectionHeader
            title={t("titleLine1")}
            description={t("description1")}
            align="center"
          />
        </div>

        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          {faqData.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>
                    <p className="text-xl">
                        {faq.question}
                    </p>
              </AccordionTrigger>

              <AccordionContent>
                <p className="text-lg">
                    {faq.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div 
      className="absolute inset-0 opacity-[1] pointer-events-none bg-[size:40px_40px]
        bg-[linear-gradient(rgba(148,163,184,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.3)_1px,transparent_1px)]
        dark:bg-[linear-gradient(rgba(59,130,246,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.15)_1px,transparent_1px)]
        [mask-image:radial-gradient(ellipse_60%_40%_at_50%_0%,#000_70%,transparent_100%)]"
      />
    </section>
  );
};

export default ModernFAQSection;