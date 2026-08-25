"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Minimal Markdown render stack (Task 6.1–6.2).
 * - remark-gfm: tables, strikethrough, task lists.
 * - No rehype-raw → raw HTML in markdown is stripped (safe by default).
 * - Image URLs restricted to https-only (phase 1: block local / http).
 */

function sanitizeUrl(url: string): string | null {
  // Phase 1 / Task 6.2: https-only remote images (block http and relative).
  if (url.startsWith("https://")) return url;
  return null;
}

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="blog-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
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
