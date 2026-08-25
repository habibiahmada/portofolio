"use client";

import { useState, useCallback } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
  /** Compact stacked layout for sticky sidebar */
  layout?: "row" | "stack";
}

export function ShareButtons({ url, title, layout = "row" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  const handleNativeShare = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled or error — ignore
      }
    }
  }, [title, url]);

  const btnBase =
    "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-full border border-black/10 dark:border-white/10 text-muted-foreground hover:border-black/30 dark:hover:border-white/30 hover:text-foreground transition-all duration-200";

  const buttons = (
    <>
      <button type="button" onClick={handleCopy} className={btnBase}>
        {copied ? "Copied" : "Copy link"}
      </button>
      <button
        type="button"
        onClick={handleNativeShare}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-full bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:opacity-90 transition-opacity"
      >
        Share
      </button>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btnBase}
      >
        Tweet
      </a>
    </>
  );

  if (layout === "stack") {
    return (
      <div className="space-y-3">
        <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/60">
          Share
        </p>
        <div className="flex flex-col gap-2">{buttons}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground/60">
        Share
      </span>
      <div className="flex flex-wrap items-center gap-2">{buttons}</div>
    </div>
  );
}
