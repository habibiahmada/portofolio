import { AboutHero } from "@/components/sections/about-hero";
import { AboutIntro } from "@/components/sections/about-intro";
import { AboutTechStack } from "@/components/sections/about-tech-stack";
import { AboutTimeline } from "@/components/sections/about-timeline";

export default function Page() {
  return (
    <main className="noise-bg">
      <div className="w-full">
        <AboutHero />
        <AboutIntro />
        <AboutTechStack />
        <AboutTimeline />
      </div>
    </main>
  );
}
