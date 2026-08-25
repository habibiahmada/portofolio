"use client";

import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { slugifyHeading } from "@/lib/blog-headings";

/**
 * Minimal Markdown render stack (Task 6.1–6.2).
 * - remark-gfm: tables, strikethrough, task lists.
 * - No rehype-raw → raw HTML in markdown is stripped (safe by default).
 * - Image URLs restricted to https-only (phase 1: block local / http).
 * - H2/H3 get stable ids for sticky TOC anchors.
 */

function sanitizeUrl(url: string): string | null {
  if (url.startsWith("https://")) return url;
  return null;
}

function headingText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(headingText).join("");
  if (children && typeof children === "object" && "props" in (children as object)) {
    return headingText((children as { props?: { children?: ReactNode } }).props?.children);
  }
  return "";
}

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const usedIds = new Map<string, number>();

  const headingId = (raw: string) => {
    let id = slugifyHeading(raw);
    if (!id) id = "section";
    const count = usedIds.get(id) ?? 0;
    usedIds.set(id, count + 1);
    return count > 0 ? `${id}-${count + 1}` : id;
  };

  return (
    <div className="blog-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2({ children, ...props }) {
            const text = headingText(children);
            const id = headingId(text);
            return (
              <h2 id={id} className="scroll-mt-28" {...props}>
                {children}
              </h2>
            );
          },
          h3({ children, ...props }) {
            const text = headingText(children);
            const id = headingId(text);
            return (
              <h3 id={id} className="scroll-mt-28" {...props}>
                {children}
              </h3>
            );
          },
          img({ src, alt, ...props }) {
            const safe = src && typeof src === "string" ? sanitizeUrl(src) : null;
            if (!safe) return null;
            // eslint-disable-next-line @next/next/no-img-element
            return <img src={safe} alt={alt ?? ""} loading="lazy" {...props} />;
          },
          a({ href, children, ...props }) {
            if (href && !href.startsWith("http") && !href.startsWith("/")) {
              return null;
            }
            return (
              <a href={href} {...props}>
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
