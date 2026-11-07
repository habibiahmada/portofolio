/**
 * The one line a project card shows under its title. It is the part of
 * `title_en` after the colon, except where that part is a slogan or missing;
 * those get a descriptive line taken from the project's own overview.
 */
const OVERRIDES: Record<string, string> = {
  "f5c13a15-1bc6-4e82-8d62-d1196894d189": "job-search app for vocational students, built during an internship", // Renshuu
  "1dd8ca69-4921-4ca7-80e3-56177efaf499": "digital OSIS election system for SMKN 1 Karawang", // E-Vote
  "1408a39d-9eee-47a3-b939-27f48e868030": "library management for a school: books, loans, and returns", // Aksara Pustaka
  "bde24764-8fcf-4d67-8bb2-697cb57fb66d": "sensor and model output turned into advice farmers can act on", // Smartfarm AI
  "ff98b3c6-e267-4ee0-9059-9444858eacf4": "travel platform recommending community-aware cultural experiences", // CultureConnect
}

export function getCardSubtitle(project: { id: string; title_en: string }): string {
  const override = OVERRIDES[project.id]
  if (override) return override
  const colon = project.title_en.indexOf(":")
  return colon === -1 ? "" : project.title_en.slice(colon + 1).trim()
}
