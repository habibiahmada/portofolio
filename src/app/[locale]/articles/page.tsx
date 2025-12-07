'use client';
import Navbar from "@/components/ui/navbar/main";
import Footer from "@/components/ui/footer/footer";

export default function Home() {
  return (
    <>
      <Navbar withNavigation={false}/>
        <main className="min-h-screen flex mx-auto justify-center items-center">
            ini bagian artikel
        </main>
      <Footer />
    </>
  );
}