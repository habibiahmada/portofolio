'use client';

import hljs from "highlight.js/lib/common";
import { cn } from "@/lib/utils";

interface HtmlRendererProps {
    content: string;
    className?: string;
}

export default function HtmlRenderer({ content, className }: HtmlRendererProps) {
    const decodeHtml = (value: string) =>
        value
            .replace(/&nbsp;/g, " ")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&amp;/g, "&");

    const highlightCodeBlocks = (html: string) =>
        html.replace(
            /<pre><code([^>]*)>([\s\S]*?)<\/code><\/pre>/gi,
            (match, attrs, code) => {
                if (/hljs-/.test(code) || /hljs/.test(attrs)) {
                    return match;
                }

                const classMatch = attrs.match(/class=["']([^"']+)["']/i);
                const classList = classMatch ? classMatch[1].split(/\s+/) : [];
                const langClass = classList.find(
                    (item: string) => item.startsWith("language-") || item.startsWith("lang-")
                );
                const lang = langClass
                    ? langClass.replace(/^language-/, "").replace(/^lang-/, "")
                    : "";

                const decoded = decodeHtml(code.replace(/<br\s*\/?>/gi, "\n"));
                const result =
                    lang && hljs.getLanguage(lang)
                        ? hljs.highlight(decoded, { language: lang, ignoreIllegals: true })
                        : hljs.highlightAuto(decoded);

                const languageClass = result.language ? `language-${result.language}` : lang ? `language-${lang}` : "";
                const mergedClasses = [
                    "hljs",
                    languageClass,
                    ...classList.filter(
                        (item: string) =>
                            item !== "hljs" &&
                            !item.startsWith("language-") &&
                            !item.startsWith("lang-")
                    ),
                ]
                    .filter(Boolean)
                    .join(" ");

                return `<pre><code class="${mergedClasses}">${result.value}</code></pre>`;
            }
        );

    const highlightedContent = highlightCodeBlocks(content);

    return (
        <>
            <div
                className={cn(
                    "prose prose-slate dark:prose-invert max-w-none",

                    // Headings
                    "prose-headings:font-bold prose-headings:tracking-tight",
                    "prose-headings:scroll-mt-28",
                    "prose-h1:text-5xl prose-h1:mb-6 prose-h1:mt-8",
                    "prose-h2:text-5xl prose-h2:mb-4 prose-h2:mt-6 prose-h2:border-b prose-h2:pb-2",
                    "prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-5",

                    // Paragraphs
                    "prose-p:leading-7 prose-p:mb-4",

                    // Links
                    "prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-blue-500",

                    // Lists
                    "prose-li:mb-1",
                    "prose-ul:list-disc prose-ul:ml-6",
                    "prose-ol:list-decimal prose-ol:ml-6",

                    // Blockquotes
                    "prose-blockquote:border-l-4 prose-blockquote:border-blue-500",
                    "prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-950/30",
                    "prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:italic",

                    // Inline code
                    "prose-code:text-slate-800 dark:prose-code:text-slate-100",
                    "prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded",
                    "prose-code:text-sm prose-code:font-mono",
                    "prose-code:before:content-none prose-code:after:content-none",

                    // Preformatted code block
                    "prose-pre:bg-slate-950 dark:prose-pre:bg-black",
                    "prose-pre:text-slate-100",
                    "prose-pre:border prose-pre:border-slate-800",
                    "prose-pre:rounded-lg prose-pre:overflow-x-auto",
                    "prose-pre:p-4 prose-pre:text-sm",

                    // Images
                    "prose-img:rounded-lg prose-img:shadow-md",

                    // HR
                    "prose-hr:my-8 prose-hr:border-slate-300 dark:prose-hr:border-slate-700",

                    // Strong
                    "prose-strong:font-semibold",

                    className
                )}
                dangerouslySetInnerHTML={{ __html: highlightedContent }}
            />
            <style jsx global>{`
                .hljs {
                    color: #e2e8f0;
                    background: transparent;
                }
                .hljs-comment,
                .hljs-quote {
                    color: #94a3b8;
                    font-style: italic;
                }
                .hljs-keyword,
                .hljs-selector-tag,
                .hljs-subst {
                    color: #c792ea;
                }
                .hljs-string,
                .hljs-title,
                .hljs-name,
                .hljs-type,
                .hljs-attribute,
                .hljs-symbol,
                .hljs-bullet,
                .hljs-built_in,
                .hljs-addition,
                .hljs-template-tag,
                .hljs-template-variable {
                    color: #f7a8b8;
                }
                .hljs-number,
                .hljs-literal,
                .hljs-variable,
                .hljs-params,
                .hljs-regexp,
                .hljs-link {
                    color: #fbbf24;
                }
                .hljs-function,
                .hljs-section,
                .hljs-meta,
                .hljs-attr {
                    color: #38bdf8;
                }
                .hljs-built_in {
                    color: #22c55e;
                }
                .hljs-emphasis {
                    font-style: italic;
                }
                .hljs-strong {
                    font-weight: 700;
                }
            `}</style>
        </>
    );
}
