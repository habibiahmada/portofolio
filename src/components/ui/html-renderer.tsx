'use client';

import { cn } from '@/lib/utils';

interface HtmlRendererProps {
    content: string;
    className?: string;
}

export default function HtmlRenderer({ content, className }: HtmlRendererProps) {
    return (
        <div
            className={cn(
                'prose prose-slate dark:prose-invert max-w-none',

                // Headings
                'prose-headings:font-bold prose-headings:tracking-tight',
                'prose-h1:text-5xl prose-h1:mb-6 prose-h1:mt-8',
                'prose-h2:text-5xl prose-h2:mb-4 prose-h2:mt-6 prose-h2:border-b prose-h2:pb-2',
                'prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-5',

                // Paragraphs
                'prose-p:leading-7 prose-p:mb-4',

                // Links
                'prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-blue-500',

                // Lists
                'prose-li:mb-1',
                'prose-ul:list-disc prose-ul:ml-6',
                'prose-ol:list-decimal prose-ol:ml-6',

                // Blockquotes
                'prose-blockquote:border-l-4 prose-blockquote:border-blue-500',
                'prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-950/30',
                'prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:italic',

                // Inline code (FIX UTAMA)
                'prose-code:bg-slate-100 dark:prose-code:bg-slate-700/60',
                'prose-code:text-slate-800 dark:prose-code:text-slate-100',
                'prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded',
                'prose-code:text-sm prose-code:font-mono',
                'prose-code:border prose-code:border-slate-200 dark:prose-code:border-slate-600',
                'prose-code:before:content-none prose-code:after:content-none',

                // Preformatted code block
                'prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950',
                'prose-pre:text-slate-100',
                'prose-pre:border prose-pre:border-slate-800',
                'prose-pre:rounded-lg prose-pre:overflow-x-auto',
                'prose-pre:p-4 prose-pre:text-sm',

                // Images
                'prose-img:rounded-lg prose-img:shadow-md',

                // HR
                'prose-hr:my-8 prose-hr:border-slate-300 dark:prose-hr:border-slate-700',

                // Strong
                'prose-strong:font-semibold',

                className
            )}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
