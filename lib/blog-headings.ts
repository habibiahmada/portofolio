/**
 * Extract H2/H3 headings from markdown for table-of-contents navigation.
 */

export type BlogHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

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

/** Parse ## / ### headings (ignores code fences). */
export function extractBlogHeadings(markdown: string): BlogHeading[] {
  const lines = String(markdown || "").split(/\r?\n/);
  const headings: BlogHeading[] = [];
  const used = new Map<string, number>();
  let inFence = false;

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    const text = match[2].replace(/#+\s*$/, "").trim();
    if (!text) continue;

    let id = slugifyHeading(text);
    if (!id) continue;
    const count = used.get(id) ?? 0;
    used.set(id, count + 1);
    if (count > 0) id = `${id}-${count + 1}`;

    headings.push({ id, text, level });
  }

  return headings;
}
