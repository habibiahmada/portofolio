import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { BlogHeading } from "@/lib/blog-headings";
import { createHeadingIdResolver } from "@/lib/blog-headings";

/**
 * Minimal Markdown render stack (Task 6.1–6.2).
 * - remark-gfm: tables, strikethrough, task lists.
 * - No rehype-raw → raw HTML in markdown is stripped (safe by default).
 * - Image URLs restricted to https-only (phase 1: block local / http).
 * - H2/H3 ids are matched to precomputed headings by text + level.
 */

function sanitizeUrl(url: string): string | null {
  if (url.startsWith("https://")) return url;
  return null;
}

function plainHeadingText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(plainHeadingText).join("");
  if (children && typeof children === "object" && "props" in children) {
    return plainHeadingText(
      (children as { props?: { children?: ReactNode } }).props?.children,
    );
  }
  return "";
}

interface MarkdownRendererProps {
  content: string;
  headings?: BlogHeading[];
}

export function MarkdownRenderer({ content, headings = [] }: MarkdownRendererProps) {
  const resolveHeadingId = createHeadingIdResolver(headings);

  return (
    <div className="blog-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2({ children, ...props }) {
            const id = resolveHeadingId(2, plainHeadingText(children));
            return (
              <h2 id={id} className="scroll-mt-28" {...props}>
                {children}
              </h2>
            );
          },
          h3({ children, ...props }) {
            const id = resolveHeadingId(3, plainHeadingText(children));
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
