import type { Metadata } from "next";

/** Shared portfolio identity for Habibi Ahmad Aziz */
export const SITE = {
  name: "Habibi Ahmad Aziz",
  shortName: "Habibi Ahmad",
  role: "Fullstack Developer",
  location: "Karawang, Indonesia",
  city: "Karawang",
  region: "Jawa Barat",
  country: "Indonesia",
  url: "https://www.habibiahmada.dev",
  email: "contact@habibiahmada.dev",
  siteName: "Habibi Ahmad Aziz | Fullstack Developer",
  ogImage: "/open-graph/og-image.png",
  profileImage: "/images/habibiahmada.webp",
  twitter: "@habibiahmad",
  github: "https://github.com/habibiahmada",
  linkedin: "https://linkedin.com/in/habibiahmada",
  employer: {
    name: "PT Webekspres Teknologi Indonesia",
    url: "https://webekspres.com",
  },
  school: "SMKN 1 Karawang",
} as const;

export const SITE_COPY = {
  defaultTitle: `${SITE.name} | ${SITE.role} ${SITE.city}`,
  titleTemplate: `%s | ${SITE.name}`,
  defaultDescription: `${SITE.name} is a ${SITE.role} from ${SITE.location}. Web Developer at ${SITE.employer.name}. He contributes to client sites (corporate, news, landing, catalogs, and integrated apps) plus school systems and award-winning AI product work.`,
  homeDescription: `${SITE.name}, ${SITE.role} from ${SITE.location}. Open to freelance and full-time. Featured work: E-Vote for SMKN 1 Karawang, JepangKu and Terraju with the Webekspres team, CultureConnect, BagiBerkah, and Intel AI Festival country award (Agrify / Smartfarm).`,
  aboutDescription: `About ${SITE.name}: ${SITE.role} from ${SITE.city}, graduate of ${SITE.school} (Software Engineering). Currently a Web Developer at ${SITE.employer.name}, contributing to 19 client sites in about four months. Stack: Next.js, React, Laravel, WordPress, APIs, and measurable performance.`,
  aboutDescriptionId: `Tentang ${SITE.name}: ${SITE.role} dari ${SITE.city}, lulusan ${SITE.school} (RPL). Web Developer di ${SITE.employer.name}, berkontribusi pada 19 situs klien dalam sekitar empat bulan. Spesialis Next.js, React, Laravel, WordPress, API, dan performa web.`,
  projectsDescription: `Projects by ${SITE.name}: featured case studies and a full archive of school systems, AI products, and client work from his current role. Role and credit on each card.`,
  projectsDescriptionId: `Proyek ${SITE.name}: case study unggulan dan arsip lengkap sistem sekolah, produk AI, dan pekerjaan klien dari peran kerjanya sekarang. Role dan kredit ada di setiap kartu.`,
  servicesDescription: `Services by ${SITE.name}: web design, React/Next.js frontend, APIs and databases, WordPress/CMS, performance, SEO, and deployment. Remote (WIB), open to freelance and full-time.`,
  loginDescription: `Sign in to the admin panel for ${SITE.name}'s portfolio.`,
  ogAlt: `${SITE.name}, ${SITE.role} from ${SITE.city}, Indonesia`,
} as const;

export const IDENTITY_KEYWORDS = [
  "Habibi Ahmad Aziz",
  "Habibi Ahmad",
  "Habibi Ahmad Karawang",
  "habibiahmada",
  "habibiahmada.dev",
  "fullstack developer Karawang",
  "web developer Karawang",
  "programmer Karawang",
  "jasa website Karawang",
  "pembuatan website Karawang",
  "web developer Jawa Barat",
  "full stack developer Indonesia",
  "Next.js developer Indonesia",
  "Laravel developer Karawang",
  "WordPress developer Karawang",
  "freelance web developer Indonesia",
  "SMKN 1 Karawang RPL",
  "Webekspres",
  "Intel AI Festival Agrify",
  "E-Vote SMKN 1 Karawang",
] as const;

type PageMetaInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  noIndex?: boolean;
  /** Absolute title (skip root template duplication). */
  absoluteTitle?: boolean;
  keywords?: string[];
  ogType?: "website" | "article" | "profile";
};

function absoluteAssetUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export { absoluteAssetUrl };

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
  absoluteTitle = false,
  keywords = [],
  ogType = "website",
}: PageMetaInput): Metadata {
  const url = path ? `${SITE.url}${path}` : SITE.url;
  const ogTitle = absoluteTitle ? title : `${title} | ${SITE.name}`;
  const imageUrl = absoluteAssetUrl(image);
  const mergedKeywords = [...new Set([...IDENTITY_KEYWORDS, ...keywords])];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: mergedKeywords,
    authors: [{ name: SITE.name, url: SITE.url }],
    creator: SITE.name,
    publisher: SITE.name,
    alternates: {
      canonical: url,
      languages: {
        en: url,
        id: url,
        "x-default": url,
      },
    },
    openGraph: {
      type: ogType,
      locale: "id_ID",
      alternateLocale: ["en_US"],
      url,
      siteName: SITE.siteName,
      title: ogTitle,
      description,
      images: [
        {
          url: imageUrl,
          width: imageWidth,
          height: imageHeight,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [imageUrl],
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

/** Project / case-study metadata tied to Habibi's identity. */
export function projectPageMetadata(input: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  tags?: string[];
  year?: number;
  attribution?: "solo" | "webekspres";
}): Metadata {
  const { title, description, slug, image, tags = [], year } = input;
  const pageTitle = `${title} case study`;
  const desc =
    description.length > 155
      ? `${description.slice(0, 152)}...`
      : description;
  const credit =
    input.attribution === "webekspres"
      ? `Developed with the Webekspres team by ${SITE.name}, ${SITE.role} from ${SITE.city}.`
      : `Built by ${SITE.name}, ${SITE.role} from ${SITE.city}.`;
  const enriched = `${desc} ${credit}`;

  return pageMetadata({
    title: pageTitle,
    description: enriched.slice(0, 160),
    path: `/projects/${slug}`,
    image: image ?? SITE.ogImage,
    imageAlt: `${title} by ${SITE.name}`,
    keywords: [
      title,
      `${title} ${SITE.name}`,
      `${SITE.name} ${title}`,
      ...tags,
      ...(year != null ? [String(year)] : []),
      "case study",
      "portfolio project",
    ],
    ogType: "article",
  });
}
