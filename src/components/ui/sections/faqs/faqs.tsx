// components/ModernFAQSection.tsx
"use client";

import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("faqs")
  return (
    <section
        className="
        relative overflow-hidden
        py-28 sm:py-36 lg:py-40
        dark:bg-slate-950" 
        >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
            <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight block bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-5" 
            >
                {t("titleLine1")}
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                {t("description1")}
            </p>
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
    </section>
  );
};

export default ModernFAQSection;