import type { Metadata } from "next";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { CTA } from "@/components/sections/cta";
import { pageMetadata, SITE_COPY } from "@/lib/site-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Services by Habibi Ahmad Aziz",
  description: SITE_COPY.servicesDescription,
  path: "/services",
  absoluteTitle: true,
  keywords: [
    "web development services Karawang",
    "hire Habibi Ahmad Aziz",
    "Next.js freelance",
    "Laravel freelance",
  ],
});

export default function ServicesPage() {
  return (
    <main className="w-full overflow-x-hidden">
      <div className="pt-8 md:pt-12" />
      <Services />
      <Process />
      <CTA />
    </main>
  );
}
