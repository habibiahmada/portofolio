'use client';
import Navbar from "@/components/ui/navbar/main";
import Footer from "@/components/ui/footer/footer";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("articles");

  return (
    <>
      <Navbar withNavigation={false} />
      <main className="min-h-screen flex mx-auto justify-center items-center">
        {t("empty")}
      </main>
      <Footer />
    </>
  );
}