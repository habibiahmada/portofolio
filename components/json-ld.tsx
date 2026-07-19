import type { Metadata } from "next";

/**
 * JSON-LD structured data for rich search results.
 * Drop <JsonLd /> into any layout or page to inject script tags.
 */

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Habibi Ahmad Aziz",
  givenName: "Habibi",
  familyName: "Aziz",
  additionalName: "Ahmad",
  alternateName: "Habibi Ahmad",
  url: "https://www.habibiahmada.dev",
  image: "https://www.habibiahmada.dev/images/habibiahmada.webp",
  jobTitle: "Full-Stack Web Developer",
  description:
    "Full-stack web developer from Karawang, Indonesia. Specializing in Next.js, React, Laravel, WordPress, and modern web technologies. Building performant, accessible, and beautifully animated digital experiences.",
  knowsAbout: [
    "Web Development",
    "Frontend Development",
    "Backend Development",
    "Full-Stack Development",
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
      addressLocality: "Karawang",
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
    addressLocality: "Karawang",
    addressRegion: "Jawa Barat",
    addressCountry: "ID",
  },
  sameAs: [
    "https://github.com/habibiahmada",
    "https://linkedin.com/in/habibiahmada",
    "https://www.habibiahmada.dev",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Habibi Ahmad — Full-Stack Web Developer",
  url: "https://www.habibiahmada.dev",
  description:
    "Portfolio of Habibi Ahmad Aziz, a full-stack web developer from Karawang offering web design, frontend & backend development, CMS solutions, and web performance optimization.",
  inLanguage: ["en", "id"],
  copyrightYear: new Date().getFullYear(),
  author: {
    "@type": "Person",
    name: "Habibi Ahmad Aziz",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Habibi Ahmad — Web Developer Karawang",
  description:
    "Jasa pembuatan website profesional di Karawang. Layanan web development meliputi frontend, backend, CMS (WordPress, Laravel), optimasi SEO, dan performa website.",
  url: "https://www.habibiahmada.dev",
  image: "https://www.habibiahmada.dev/images/habibiahmada.webp",
  telephone: "",
  email: "contact@habibiahmada.dev",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Karawang",
    addressRegion: "Jawa Barat",
    addressCountry: "ID",
  },
  areaServed: [
    {
      "@type": "City",
      name: "Karawang",
    },
    {
      "@type": "State",
      name: "Jawa Barat",
    },
    {
      "@type": "Country",
      name: "Indonesia",
    },
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
    provider: { "@type": "Person", name: "Habibi Ahmad Aziz" },
    areaServed: { "@type": "City", name: "Karawang" },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Frontend Web Development (React & Next.js)",
    description:
      "High-quality user interfaces built with React, Next.js, and TypeScript. Clean components, reusable logic, and fluid state management.",
    provider: { "@type": "Person", name: "Habibi Ahmad Aziz" },
    areaServed: { "@type": "City", name: "Karawang" },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Backend API & Database Development",
    description:
      "Robust REST APIs, relational databases (MySQL, PostgreSQL), authentication systems, and scalable server architecture using Laravel and Node.js.",
    provider: { "@type": "Person", name: "Habibi Ahmad Aziz" },
    areaServed: { "@type": "City", name: "Karawang" },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "CMS & WordPress Development",
    description:
      "Custom WordPress themes, plugins, and CMS platforms built with Laravel or Elementor. Managed content systems for businesses and organizations.",
    provider: { "@type": "Person", name: "Habibi Ahmad Aziz" },
    areaServed: { "@type": "City", name: "Karawang" },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Web Performance & SEO Optimization",
    description:
      "Core Web Vitals optimization, Lighthouse score improvement, SEO-ready architecture, and performance auditing for faster load times and better rankings.",
    provider: { "@type": "Person", name: "Habibi Ahmad Aziz" },
    areaServed: { "@type": "City", name: "Karawang" },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "CI/CD & Deployment",
    description:
      "Automated deployment pipelines, container-ready applications, serverless hosting, Vercel/Netlify deployment, and zero-downtime production releases.",
    provider: { "@type": "Person", name: "Habibi Ahmad Aziz" },
    areaServed: { "@type": "City", name: "Karawang" },
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.habibiahmada.dev" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://www.habibiahmada.dev/about" },
    { "@type": "ListItem", position: 3, name: "Projects", item: "https://www.habibiahmada.dev/projects" },
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
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(allSchemas, null, 2),
      }}
    />
  );
}

/**
 * Supercharged metadata for the root layout.
 */
export const rootMetadata: Metadata = {
  metadataBase: new URL("https://www.habibiahmada.dev"),
  title: {
    default:
      "Habibi Ahmad Aziz | Web Developer Karawang — Full-Stack Developer Indonesia",
    template: "%s | Habibi Ahmad — Web Developer Karawang",
  },
  description:
    "Habibi Ahmad Aziz — Full-stack web developer dari Karawang, Jawa Barat. Spesialis pembuatan website dengan Next.js, React, Laravel, WordPress, dan CMS. Jasa web development profesional untuk bisnis, UMKM, sekolah, dan organisasi di Indonesia. 🚀",
  keywords: [
    // ── Name / personal ──
    "Habibi Ahmad",
    "Habibi Ahmad Aziz",
    "Habibi Ahmad Karawang",
    "web developer Karawang",
    // ── Location ──
    "web developer karawang",
    "web developer Karawang",
    "website karawang",
    "pembuatan website karawang",
    "jasa website karawang",
    "programmer karawang",
    "developer karawang",
    "web developer jawa barat",
    "web developer indonesia",
    "full stack developer indonesia",
    // ── Services ──
    "jasa pembuatan website",
    "jasa web development",
    "pembuatan website profesional",
    "jasa website murah",
    "web developer freelance",
    "freelance web developer indonesia",
    "web designer karawang",
    "jasa landing page",
    "jasa company profile website",
    "jasa web UMKM",
    "pembuatan website sekolah",
    "pembuatan website organisasi",
    // ── Tech stack ──
    "website next.js",
    "website react",
    "website laravel",
    "jasa laravel",
    "jasa next.js",
    "jasa react",
    "wordpress developer karawang",
    "jasa wordpress",
    "pembuatan website wordpress",
    "cms development",
    "php developer",
    "node.js developer",
    "typescript developer",
    // ── Skills ──
    "full stack developer",
    "frontend developer",
    "backend developer",
    "web programmer",
    "website developer",
    "web engineer",
    "software engineer indonesia",
    "IT karawang",
    "digital karawang",
    // ── English keywords ──
    "web developer Indonesia",
    "full-stack developer",
    "full stack web developer",
    "React developer",
    "Next.js developer",
    "Laravel developer",
    "WordPress developer",
    "CMS developer",
    "frontend engineer",
    "backend engineer",
    "web development services",
    "custom website development",
    "web application developer",
    // ── Services English ──
    "web design services",
    "web development company",
    "website builder",
    "professional web developer",
    "freelance web developer",
    "hire web developer",
    "hire react developer",
    "hire nextjs developer",
  ],
  authors: [
    { name: "Habibi Ahmad Aziz", url: "https://www.habibiahmada.dev" },
  ],
  creator: "Habibi Ahmad Aziz",
  publisher: "Habibi Ahmad Aziz",
  category: "Technology",
  classification: "Web Development Portfolio",
  alternates: {
    canonical: "https://www.habibiahmada.dev",
    languages: {
      en: "https://www.habibiahmada.dev",
      id: "https://www.habibiahmada.dev",
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    url: "https://www.habibiahmada.dev",
    siteName: "Habibi Ahmad — Web Developer Karawang",
    title:
      "Habibi Ahmad Aziz | Web Developer Karawang — Full-Stack Developer Indonesia",
    description:
      "Full-stack web developer dari Karawang, spesialis Next.js, React, Laravel, WordPress. Jasa pembuatan website profesional untuk bisnis, UMKM, sekolah, dan organisasi. 🚀",
    images: [
      {
        url: "/open-graph/og-image.png",
        width: 1200,
        height: 630,
        alt: "Habibi Ahmad Aziz — Full-Stack Web Developer Karawang",
      },
    ],
    countryName: "Indonesia",
    emails: ["contact@habibiahmada.dev"],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Habibi Ahmad Aziz | Web Developer Karawang — Full-Stack Developer Indonesia",
    description:
      "Full-stack web developer dari Karawang. Jasa pembuatan website profesional dengan Next.js, React, Laravel, WordPress.",
    images: ["/open-graph/og-image.png"],
    creator: "@habibiahmad",
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
  verification: {
    google: "",
  },
  appleWebApp: {
    capable: true,
    title: "Habibi Ahmad",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  other: {
    "geo.region": "ID-JB",
    "geo.placename": "Karawang",
    "geo.position": "-6.3227;107.3376",
    ICBM: "-6.3227, 107.3376",
  },
};
