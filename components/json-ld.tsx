import type { Metadata } from "next";
import { SITE, SITE_COPY } from "@/lib/site-metadata";

/**
 * JSON-LD structured data for rich search results.
 * Drop <JsonLd /> into any layout or page to inject script tags.
 */

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  givenName: "Habibi",
  familyName: "Aziz",
  additionalName: "Ahmad",
  alternateName: SITE.shortName,
  url: SITE.url,
  image: `${SITE.url}${SITE.profileImage}`,
  jobTitle: SITE.role,
  description: SITE_COPY.defaultDescription,
  knowsAbout: [
    "Web Development",
    "Frontend Development",
    "Backend Development",
    "Fullstack Development",
    "React",
    "Next.js",
    "Laravel",
    "Node.js",
    "TypeScript",
    "JavaScript",
    "WordPress",
    "CMS Development",
    "REST API",
    "Database Design",
    "UI/UX Design",
    "SEO",
    "Web Performance Optimization",
  ],
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "SMKN 1 Karawang",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressRegion: "Jawa Barat",
      addressCountry: "ID",
    },
  },
  worksFor: {
    "@type": "Organization",
    name: "PT Webekspres Teknologi Indonesia",
    url: "https://webekspres.com",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.city,
    addressRegion: "Jawa Barat",
    addressCountry: "ID",
  },
  sameAs: [
    "https://github.com/habibiahmada",
    "https://linkedin.com/in/habibiahmada",
    SITE.url,
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.siteName,
  url: SITE.url,
  description: SITE_COPY.defaultDescription,
  inLanguage: ["en", "id"],
  copyrightYear: new Date().getFullYear(),
  author: {
    "@type": "Person",
    name: SITE.name,
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: `${SITE.shortName} | ${SITE.role} ${SITE.city}`,
  description:
    "Jasa pembuatan website profesional di Karawang. Layanan web development meliputi frontend, backend, CMS (WordPress, Laravel), optimasi SEO, dan performa website.",
  url: SITE.url,
  image: `${SITE.url}${SITE.profileImage}`,
  telephone: "",
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.city,
    addressRegion: "Jawa Barat",
    addressCountry: "ID",
  },
  areaServed: [
    { "@type": "City", name: SITE.city },
    { "@type": "State", name: "Jawa Barat" },
    { "@type": "Country", name: "Indonesia" },
  ],
  priceRange: "$$",
  availableLanguage: ["English", "Indonesia"],
  serviceType: [
    "Web Development",
    "Frontend Development",
    "Backend Development",
    "CMS Development",
    "WordPress Development",
    "Laravel Development",
    "Website Design",
    "Web Performance Optimization",
    "SEO Optimization",
    "API Development",
    "Database Design",
  ],
};

const serviceSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Web Design & Mobile-First Development",
    description:
      "Pixel-perfect responsive interfaces from wireframes to production-ready layouts optimized for every device.",
    provider: { "@type": "Person", name: SITE.name },
    areaServed: { "@type": "City", name: SITE.city },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Frontend Web Development (React & Next.js)",
    description:
      "High-quality user interfaces built with React, Next.js, and TypeScript. Clean components, reusable logic, and fluid state management.",
    provider: { "@type": "Person", name: SITE.name },
    areaServed: { "@type": "City", name: SITE.city },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Backend API & Database Development",
    description:
      "Robust REST APIs, relational databases (MySQL, PostgreSQL), authentication systems, and scalable server architecture using Laravel and Node.js.",
    provider: { "@type": "Person", name: SITE.name },
    areaServed: { "@type": "City", name: SITE.city },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "CMS & WordPress Development",
    description:
      "Custom WordPress themes, plugins, and CMS platforms built with Laravel or Elementor. Managed content systems for businesses and organizations.",
    provider: { "@type": "Person", name: SITE.name },
    areaServed: { "@type": "City", name: SITE.city },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Web Performance & SEO Optimization",
    description:
      "Core Web Vitals optimization, Lighthouse score improvement, SEO-ready architecture, and performance auditing for faster load times and better rankings.",
    provider: { "@type": "Person", name: SITE.name },
    areaServed: { "@type": "City", name: SITE.city },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "CI/CD & Deployment",
    description:
      "Automated deployment pipelines, container-ready applications, serverless hosting, Vercel/Netlify deployment, and zero-downtime production releases.",
    provider: { "@type": "Person", name: SITE.name },
    areaServed: { "@type": "City", name: SITE.city },
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE.url,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "About",
      item: `${SITE.url}/about`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Projects",
      item: `${SITE.url}/projects`,
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Services",
      item: `${SITE.url}/services`,
    },
  ],
};

const allSchemas = [
  personSchema,
  websiteSchema,
  localBusinessSchema,
  breadcrumbSchema,
  ...serviceSchemas,
];

export function JsonLd() {
  const json = JSON.stringify(allSchemas).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

/** Root layout metadata for Habibi Ahmad Aziz portfolio */
export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE_COPY.defaultTitle,
    template: SITE_COPY.titleTemplate,
  },
  description: SITE_COPY.defaultDescription,
  keywords: [
    "Habibi Ahmad",
    "Habibi Ahmad Aziz",
    "Habibi Ahmad Karawang",
    "fullstack developer Karawang",
    "full stack developer Karawang",
    "web developer karawang",
    "website karawang",
    "pembuatan website karawang",
    "jasa website karawang",
    "programmer karawang",
    "developer karawang",
    "web developer jawa barat",
    "web developer indonesia",
    "full stack developer indonesia",
    "jasa pembuatan website",
    "jasa web development",
    "pembuatan website profesional",
    "web developer freelance",
    "freelance web developer indonesia",
    "jasa landing page",
    "jasa company profile website",
    "website next.js",
    "website react",
    "website laravel",
    "jasa laravel",
    "jasa next.js",
    "jasa react",
    "wordpress developer karawang",
    "jasa wordpress",
    "cms development",
    "php developer",
    "node.js developer",
    "typescript developer",
    "fullstack developer",
    "full stack developer",
    "frontend developer",
    "backend developer",
    "web programmer",
    "software engineer indonesia",
    "React developer",
    "Next.js developer",
    "Laravel developer",
    "WordPress developer",
    "hire fullstack developer",
    "hire nextjs developer",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "Technology",
  classification: "Fullstack Developer Portfolio",
  alternates: {
    canonical: SITE.url,
    languages: {
      en: SITE.url,
      id: SITE.url,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    url: SITE.url,
    siteName: SITE.siteName,
    title: SITE_COPY.defaultTitle,
    description: SITE_COPY.defaultDescription,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_COPY.ogAlt,
      },
    ],
    countryName: "Indonesia",
    emails: [SITE.email],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_COPY.defaultTitle,
    description: SITE_COPY.defaultDescription,
    images: [SITE.ogImage],
    creator: SITE.twitter,
  },
  icons: {
    icon: [
      { url: "/icons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  robots: {
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
  appleWebApp: {
    capable: true,
    title: SITE.shortName,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  other: {
    "geo.region": "ID-JB",
    "geo.placename": SITE.city,
    "geo.position": "-6.3227;107.3376",
    ICBM: "-6.3227, 107.3376",
  },
};
