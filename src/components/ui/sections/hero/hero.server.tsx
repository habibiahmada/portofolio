import Hero from "./hero";
import { getBlurData } from "@/lib/getBlurData";

export default async function HeroServer() {
  const blurDataURL = await getBlurData(
    "/images/self-photo-habibi-ahmad-aziz.webp"
  );

  return (
    <Hero blurDataURL={blurDataURL} />
  );
}
