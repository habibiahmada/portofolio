/**
 * Server-only markdown heading extraction (remark + GFM).
 * Import only from Server Components / route handlers.
 */

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import type { Heading } from "mdast";
import {
  normalizeHeadingText,
  slugifyHeading,
  type BlogHeading,
} from "@/lib/blog-headings";

function assignHeadingId(text: string, used: Map<string, number>): string {
  let id = slugifyHeading(text);
  if (!id) return "";
  const count = used.get(id) ?? 0;
  used.set(id, count + 1);
  return count > 0 ? `${id}-${count + 1}` : id;
}

/** Parse markdown AST for ## / ### headings (same rules as react-markdown). */
export function extractBlogHeadings(markdown: string): BlogHeading[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
  const headings: BlogHeading[] = [];
  const used = new Map<string, number>();

  visit(tree, "heading", (node: Heading) => {
    if (node.depth !== 2 && node.depth !== 3) return;

    const text = normalizeHeadingText(toString(node));
    if (!text) return;

    const id = assignHeadingId(text, used);
    if (!id) return;

    headings.push({ id, text, level: node.depth as 2 | 3 });
  });

  return headings;
}
