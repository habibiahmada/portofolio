'use client';
import Image from "next/image";

export default function HeroImage({
  isDark,
  imageAlt,
  imageUrl,
  blurDataURL,
}: {
  isDark: boolean;
  imageAlt: string;
  imageUrl?: string;
  blurDataURL: string;
}) {
  return (
    <div className="relative">
      <div className="absolute -inset-8">
        <div
          className={`w-full h-full opacity-20 ${
            isDark ? "bg-blue-500/20" : "bg-blue-400/30"
          }`}
          style={{
            clipPath:
              "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
            transform: "scale(1.1)",
          }}
        />
      </div>

      <Image
        src={imageUrl || "/images/self-photo-habibi-ahmad-aziz.webp"}
        alt={imageAlt}
        width={600}
        height={600}
        placeholder="blur"
        blurDataURL={blurDataURL}
        className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto rounded-3xl drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)] object-cover"
      />
    </div>
  );
}
