import type { Metadata } from "next";
import {
  SITE,
  SITE_COPY,
  IDENTITY_KEYWORDS,
  absoluteAssetUrl,
} from "@/lib/site-metadata";
import { getLinkedCaseStudies } from "@/lib/data/case-studies";
import { projects as staticProjects, getProjectTitle } from "@/lib/projects";

const PERSON_ID = `${SITE.url}/#person`;

function projectDisplayTitle(projectId: string, fallback: string) {
  const p = staticProjects.find((x) => x.id === projectId);
  if (!p) return fallback;
  const full = getProjectTitle(p, "en");
  return full.includes(":") ? full.split(":")[0]!.trim() : full;
}

const workExamples = getLinkedCaseStudies().map((study) => {
  const name = projectDisplayTitle(study.projectId, study.slug);
  return {
    "@type": "CreativeWork" as const,
    name,
    url: `${SITE.url}/projects/${study.slug}`,
    author: { "@id": PERSON_ID },
    creator: { "@id": PERSON_ID },
  };
});

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: SITE.name,
  givenName: "Habibi",
  familyName: "Aziz",
  additionalName: "Ahmad",
  alternateName: [SITE.shortName, "habibiahmada"],
  url: SITE.url,
  image: `${SITE.url}${SITE.profileImage}`,
  email: SITE.email,
  jobTitle: SITE.role,
  description: SITE_COPY.defaultDescription,
  nationality: {
    "@type": "Country",
    name: SITE.country,
  },
  knowsLanguage: ["id", "en"],
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
    "Web Performance Optimization",
    "SEO",
  ],
  alumniOf: {
    "@type": "EducationalOrganization",
    name: SITE.school,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      addressCountry: "ID",
    },
  },
  worksFor: {
    "@type": "Organization",
    name: SITE.employer.name,
    url: SITE.employer.url,
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.city,
    addressRegion: SITE.region,
    addressCountry: "ID",
  },
  homeLocation: {
    "@type": "Place",
    name: `${SITE.city}, ${SITE.region}, ${SITE.country}`,
  },
  award: [
    "Indonesia Country Award, Intel AI Global Impact Festival 2025 (Agrify / AI Changemakers)",
  ],
  sameAs: [SITE.github, SITE.linkedin, SITE.url],
  workExample: workExamples,
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.url}/#website`,
  name: SITE.siteName,
  url: SITE.url,
  description: SITE_COPY.defaultDescription,
  inLanguage: ["en", "id"],
  copyrightYear: new Date().getFullYear(),
  publisher: { "@id": PERSON_ID },
  author: { "@id": PERSON_ID },
};

const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE.url}/#services`,
  name: `${SITE.name} Web Development`,
  description: SITE_COPY.servicesDescription,
  url: `${SITE.url}/services`,
  image: `${SITE.url}${SITE.profileImage}`,
  email: SITE.email,
  founder: { "@id": PERSON_ID },
  employee: { "@id": PERSON_ID },
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.city,
    addressRegion: SITE.region,
    addressCountry: "ID",
  },
  areaServed: [
    { "@type": "City", name: SITE.city },
    { "@type": "State", name: SITE.region },
    { "@type": "Country", name: SITE.country },
  ],
  availableLanguage: ["English", "Indonesian"],
  priceRange: "$$",
  knowsAbout: [
    "Web Development",
    "Next.js",
    "React",
    "Laravel",
    "WordPress",
    "SEO",
    "Web Performance",
  ],
};

const projectListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE.url}/projects#list`,
  name: `Projects by ${SITE.name}`,
  description: SITE_COPY.projectsDescription,
  numberOfItems: workExamples.length,
  itemListElement: workExamples.map((work, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: work.url,
    name: work.name,
  })),
};

const serviceSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Web Design & Mobile-First Development",
    description:
      "Responsive interfaces from wireframes to production-ready layouts optimized for every device.",
    provider: { "@id": PERSON_ID },
    areaServed: { "@type": "City", name: SITE.city },
    url: `${SITE.url}/services`,
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Frontend Web Development (React & Next.js)",
    description:
      "High-quality interfaces with React, Next.js, and TypeScript. Clean components and measurable performance.",
    provider: { "@id": PERSON_ID },
    areaServed: { "@type": "City", name: SITE.city },
    url: `${SITE.url}/services`,
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Backend API & Database Development",
    description:
      "REST APIs, relational databases, authentication, and scalable server architecture with Laravel and Node.js.",
    provider: { "@id": PERSON_ID },
    areaServed: { "@type": "City", name: SITE.city },
    url: `${SITE.url}/services`,
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "CMS & WordPress Development",
    description:
      "Custom WordPress themes, plugins, and CMS platforms for businesses and organizations.",
    provider: { "@id": PERSON_ID },
    areaServed: { "@type": "City", name: SITE.city },
    url: `${SITE.url}/services`,
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Web Performance & SEO Optimization",
    description:
      "Core Web Vitals, Lighthouse improvements, and SEO-ready architecture for faster load times and clearer rankings.",
    provider: { "@id": PERSON_ID },
    areaServed: { "@type": "City", name: SITE.city },
    url: `${SITE.url}/services`,
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "CI/CD & Deployment",
    description:
      "Automated deployment pipelines, serverless hosting, and production releases with minimal downtime.",
    provider: { "@id": PERSON_ID },
    areaServed: { "@type": "City", name: SITE.city },
    url: `${SITE.url}/services`,
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
  professionalServiceSchema,
  projectListSchema,
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

/** Per-project CreativeWork + Breadcrumb JSON-LD for case study pages. */
export function ProjectJsonLd({
  slug,
  title,
  description,
  image,
  tags,
  year,
  githubUrl,
  liveUrl,
}: {
  slug: string;
  title: string;
  description: string;
  image?: string;
  tags?: string[];
  year?: number;
  githubUrl?: string;
  liveUrl?: string;
}) {
  const pageUrl = `${SITE.url}/projects/${slug}`;
  const schemas = [
    {
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
          name: "Projects",
          item: `${SITE.url}/projects`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: title,
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": ["CreativeWork", "SoftwareSourceCode"],
      "@id": `${pageUrl}#work`,
      name: title,
      headline: `${title} by ${SITE.name}`,
      description,
      url: pageUrl,
      image: image ? absoluteAssetUrl(image) : undefined,
      dateCreated: year != null ? String(year) : undefined,
      keywords: tags?.join(", "),
      inLanguage: ["en", "id"],
      author: { "@id": PERSON_ID },
      creator: { "@id": PERSON_ID },
      copyrightHolder: { "@id": PERSON_ID },
      codeRepository: githubUrl,
      programmingLanguage: tags,
      sameAs: [liveUrl, githubUrl].filter(Boolean),
    },
  ];

  const json = JSON.stringify(schemas).replace(/</g, "\\u003c");
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
  keywords: [...IDENTITY_KEYWORDS],
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
    countryName: SITE.country,
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
  manifest: "/site.webmanifest",
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
    title: SITE.name,
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
