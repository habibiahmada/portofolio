/**
 * Shared heading helpers for blog TOC + markdown rendering.
 * Keep this file free of remark/unified so client components can import it safely.
 */

export type BlogHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function normalizeHeadingText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function slugifyHeading(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

/** Match rendered heading text to precomputed ids (handles duplicate titles). */
export function createHeadingIdResolver(headings: BlogHeading[]) {
  const pool = headings.map((heading) => ({ ...heading, used: false }));

  return (level: 2 | 3, rawText: string) => {
    const text = normalizeHeadingText(rawText);

    let match = pool.find(
      (heading) =>
        !heading.used &&
        heading.level === level &&
        normalizeHeadingText(heading.text) === text,
    );

    if (!match) {
      match = pool.find((heading) => !heading.used && heading.level === level);
    }

    if (match) {
      match.used = true;
      return match.id;
    }

    const fallback = slugifyHeading(text);
    return fallback || `section-${level}`;
  };
}
