import type { Metadata } from "next";

/** Shared portfolio identity for Habibi Ahmad Aziz */
export const SITE = {
  name: "Habibi Ahmad Aziz",
  shortName: "Habibi Ahmad",
  role: "Fullstack Developer",
  location: "Karawang, Indonesia",
  city: "Karawang",
  url: "https://www.habibiahmada.dev",
  email: "contact@habibiahmada.dev",
  siteName: "Habibi Ahmad Aziz | Fullstack Developer",
  ogImage: "/open-graph/og-image.png",
  profileImage: "/images/habibiahmada.webp",
  twitter: "@habibiahmad",
} as const;

export const SITE_COPY = {
  defaultTitle: `${SITE.name} | ${SITE.role} ${SITE.city}`,
  titleTemplate: `%s | ${SITE.name}`,
  defaultDescription: `${SITE.name} is a ${SITE.role} from ${SITE.location}. Building modern web apps with Next.js, React, Laravel, and WordPress.`,
  homeDescription: `${SITE.name}, ${SITE.role} from ${SITE.location}. High-performance web solutions with Next.js, React, Laravel, and WordPress for businesses that need to grow online.`,
  aboutDescription: `About ${SITE.name}, a ${SITE.role} from ${SITE.city}, graduate of SMKN 1 Karawang (RPL). Specializing in Next.js, React, Laravel, WordPress, and CMS development.`,
  aboutDescriptionId: `Kenali ${SITE.name}, ${SITE.role} dari ${SITE.city}, lulusan SMKN 1 Karawang jurusan RPL. Spesialis Next.js, React, Laravel, WordPress, dan CMS development.`,
  projectsDescription: `Selected web projects by ${SITE.name}, ${SITE.role}. Production apps and experiments across Next.js, React, Laravel, AI, and school management systems.`,
  projectsDescriptionId: `Portofolio proyek web oleh ${SITE.name}, ${SITE.role}. Aplikasi produksi hingga eksperimental: library, e-vote, AI, manajemen sekolah, dan lainnya.`,
  servicesDescription: `Web design, frontend, performance, APIs, and deployment by ${SITE.name}. End-to-end product work from UI to production.`,
  loginDescription: `Sign in to the admin panel for ${SITE.name}'s portfolio.`,
  ogAlt: `${SITE.name}, ${SITE.role} from ${SITE.city}`,
} as const;

type PageMetaInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  noIndex?: boolean;
};

/** Build complete page metadata (title, description, OG, Twitter, canonical). */
export function pageMetadata({
  title,
  description,
  path = "",
  image = SITE.ogImage,
  imageAlt = SITE_COPY.ogAlt,
  imageWidth = 1200,
  imageHeight = 630,
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = path ? `${SITE.url}${path}` : SITE.url;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      alternateLocale: ["en_US"],
      url,
      siteName: SITE.siteName,
      title: `${title} | ${SITE.name}`,
      description,
      images: [
        {
          url: image,
          width: imageWidth,
          height: imageHeight,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
      images: [image],
      creator: SITE.twitter,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}
