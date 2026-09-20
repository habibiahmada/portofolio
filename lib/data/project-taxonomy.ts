import { FEATURED_PROJECT_IDS } from "./featured-ids"

/** Archive groups on /projects. Order follows the Webekspres portfolio analysis. */
export type ProjectCategory =
  | "web-app"
  | "website"
  | "catalog"

export type ProjectOrigin = "webekspres" | "personal" | "internship"

export const ORIGIN_LABEL: Record<ProjectOrigin, string> = {
  webekspres: "Webekspres",
  personal: "Personal",
  internship: "Internship",
}

export type ProjectTaxonomy = {
  slug?: string
  category: ProjectCategory
  origin: ProjectOrigin
  company?: string
}

export const ARCHIVE_GROUPS: {
  id: ProjectCategory
  label: string
  blurb: string
}[] = [
  {
    id: "web-app",
    label: "Web applications",
    blurb: "Full-stack apps with real workflows, APIs, and roles — school systems, internships, and capstones.",
  },
  {
    id: "website",
    label: "Business websites",
    blurb: "Company profiles, service sites, landing pages, and school sites shipped for clients.",
  },
  {
    id: "catalog",
    label: "Catalogs and directories",
    blurb: "Product and service catalogs and content portals with clear enquiry paths.",
  },
]

const WEBEKSPRES = "PT Webekspres Teknologi Indonesia"

/** Client work at Webekspres (ids match projects.json). */
const WEBEKSPRES_TAXONOMY: Record<string, ProjectTaxonomy> = {
  "36b5bfa0-db1f-51cd-8861-8eac729f2afb": {
    slug: "jepangku",
    category: "catalog",
    origin: "webekspres",
    company: WEBEKSPRES,
  },
  "2ca2341f-449d-5b44-a919-f628586fed79": {
    slug: "sumbawa-tourism-land",
    category: "website",
    origin: "webekspres",
    company: WEBEKSPRES,
  },
  "ecbcd798-00c0-5c63-8b51-4a3ad1708fff": {
    slug: "luzins-academy",
    category: "website",
    origin: "webekspres",
    company: WEBEKSPRES,
  },
  "ebd04466-7e2e-55a3-9705-e41d013a359f": {
    slug: "forklift-listrik",
    category: "catalog",
    origin: "webekspres",
    company: WEBEKSPRES,
  },
  "d62e4264-031d-5926-8b5f-a8c67bb2daac": {
    slug: "terraju",
    category: "catalog",
    origin: "webekspres",
    company: WEBEKSPRES,
  },
  "4c336b3b-5898-5ad5-bed3-239f972f5814": {
    slug: "razka",
    category: "website",
    origin: "webekspres",
    company: WEBEKSPRES,
  },
  "e2c181c4-e4c2-5546-8303-a14f27aaa90a": {
    slug: "giftara-souvenir",
    category: "catalog",
    origin: "webekspres",
    company: WEBEKSPRES,
  },
  "ea4a35c1-5f60-5c8d-94d7-f0877fb2bfd1": {
    slug: "indatu",
    category: "website",
    origin: "webekspres",
    company: WEBEKSPRES,
  },
  "dfd144d5-84d7-5f1f-be03-1554dee928b1": {
    slug: "miru-bank-sampah",
    category: "web-app",
    origin: "webekspres",
    company: WEBEKSPRES,
  },
  "69aeb916-9cfc-56b0-976b-88ee634f93b6": {
    slug: "karya-yudita-barokah",
    category: "website",
    origin: "webekspres",
    company: WEBEKSPRES,
  },
  "73038783-8389-5626-8ab0-473f0b5284ae": {
    slug: "hatta",
    category: "website",
    origin: "webekspres",
    company: WEBEKSPRES,
  },
  "243b5551-81aa-598a-991d-4b55dbbfc259": {
    slug: "jual-beli-besi-tua",
    category: "website",
    origin: "webekspres",
    company: WEBEKSPRES,
  },
  "9e5f8eb2-4964-5c5f-84d2-93c3b0a9bc1d": {
    slug: "aisyncraft",
    category: "catalog",
    origin: "webekspres",
    company: WEBEKSPRES,
  },
  "20479cf8-542e-5223-8ff5-350d001e19a7": {
    slug: "soraya-spa",
    category: "website",
    origin: "webekspres",
    company: WEBEKSPRES,
  },
  "c21994a4-0ab1-55e0-bab9-1d1d200f0a6f": {
    slug: "ittihadiyah-tanreassona",
    category: "website",
    origin: "webekspres",
    company: WEBEKSPRES,
  },
  "00f837eb-3fa1-5848-bce3-b2d35d4dc9f2": {
    slug: "eduglobal",
    category: "website",
    origin: "webekspres",
    company: WEBEKSPRES,
  },
  "25d41ace-dab0-5ddf-8e3b-3b8024ee4e27": {
    slug: "anugrah-tour",
    category: "website",
    origin: "webekspres",
    company: WEBEKSPRES,
  },
  "d7401d61-cd67-5430-a574-122d35e61cc4": {
    slug: "ptmgc",
    category: "website",
    origin: "webekspres",
    company: WEBEKSPRES,
  },
  "0178ba6c-a506-5401-819e-1bb3d2a1c397": {
    slug: "aspalindo-hotmix",
    category: "website",
    origin: "webekspres",
    company: WEBEKSPRES,
  },
  "67978780-65a3-4a1a-94e6-60a0bd354b72": {
    slug: "triply",
    category: "website",
    origin: "webekspres",
    company: WEBEKSPRES,
  },
  "1636bd61-2b93-4fb0-b6ea-d6456dbf77ea": {
    slug: "subulussalam-insan-global",
    category: "website",
    origin: "webekspres",
    company: WEBEKSPRES,
  },
}

const PERSONAL_TAXONOMY: Record<string, ProjectTaxonomy> = {
  "1408a39d-9eee-47a3-b939-27f48e868030": { category: "web-app", origin: "personal" },
  "f77d37fe-acaa-4491-8d47-2b9f434149a9": { category: "web-app", origin: "personal" },
  "be97de22-b78b-4fed-8a3a-88dc23994d6c": { category: "web-app", origin: "personal" },
  "fd57265a-c96e-40fe-98c4-4ace2a52b80c": { category: "web-app", origin: "personal" },
  "169275ea-ca4a-4701-857f-1417fc4fec23": { category: "web-app", origin: "personal" },
  "1dd8ca69-4921-4ca7-80e3-56177efaf499": { category: "web-app", origin: "personal" },
  "bde24764-8fcf-4d67-8bb2-697cb57fb66d": { category: "web-app", origin: "personal" },
  "ff98b3c6-e267-4ee0-9059-9444858eacf4": { category: "web-app", origin: "personal" },
  "13e602b8-c324-44e6-9c61-e9e40f388394": { category: "web-app", origin: "personal" },
  "f5c13a15-1bc6-4e82-8d62-d1196894d189": {
    category: "web-app",
    origin: "internship",
    company: "CV Smartplus",
  },
}

const TAXONOMY: Record<string, ProjectTaxonomy> = {
  ...WEBEKSPRES_TAXONOMY,
  ...PERSONAL_TAXONOMY,
}

export function getProjectTaxonomy(id: string): ProjectTaxonomy | undefined {
  return TAXONOMY[id]
}

/** Reverse lookup: taxonomy slug → project id. */
export function getProjectIdBySlug(slug: string): string | undefined {
  const hit = Object.entries(TAXONOMY).find(([, t]) => t.slug === slug)
  return hit?.[0]
}

/** Every taxonomy slug (webekspres client sites). Personal ships use case-study slugs. */
export function getAllTaxonomySlugs(): string[] {
  return Object.values(TAXONOMY)
    .map((t) => t.slug)
    .filter((s): s is string => Boolean(s))
}

export const PROJECT_STATS = {
  clientSites: Object.keys(WEBEKSPRES_TAXONOMY).length,
  monthsAtWebekspres: 4,
  categories: ARCHIVE_GROUPS.length,
  personalShips: Object.keys(PERSONAL_TAXONOMY).length,
  featured: FEATURED_PROJECT_IDS.length,
  total: Object.keys(WEBEKSPRES_TAXONOMY).length + Object.keys(PERSONAL_TAXONOMY).length,
} as const

export function isFeaturedId(id: string) {
  return (FEATURED_PROJECT_IDS as readonly string[]).includes(id)
}

export function groupProjectsForArchive<T extends { id: string }>(projects: T[]) {
  const featuredIds = new Set<string>(FEATURED_PROJECT_IDS)
  const featured = FEATURED_PROJECT_IDS.map(
    (id) => projects.find((p) => p.id === id),
  ).filter((p): p is T => Boolean(p))

  const rest = projects.filter((p) => !featuredIds.has(p.id))
  const groups = ARCHIVE_GROUPS.map((group) => ({
    ...group,
    items: rest.filter((p) => getProjectTaxonomy(p.id)?.category === group.id),
  })).filter((g) => g.items.length > 0)

  const groupedIds = new Set(groups.flatMap((g) => g.items.map((p) => p.id)))
  const leftover = rest.filter((p) => !groupedIds.has(p.id))
  if (leftover.length > 0) {
    groups.push({
      id: "web-app",
      label: "Other",
      blurb: "Ships that do not sit in the groups above.",
      items: leftover,
    })
  }

  return { featured, groups }
}
