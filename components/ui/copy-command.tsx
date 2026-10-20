"use client";

import { useCallback, useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** A shell command that copies itself on click. */
export function CopyCommand({ command, className }: { command: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      const input = document.createElement("input");
      input.value = command;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [command]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied to clipboard" : `Copy ${command}`}
      className={cn(
        "group flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/2 dark:bg-white/2 px-3 py-2.5 font-mono text-xs sm:text-sm text-muted-foreground hover:border-black/20 dark:hover:border-white/20 hover:text-foreground transition-all duration-200 cursor-pointer",
        className,
      )}
    >
      <code className="truncate text-left">
        <span className="text-brand/80 select-none">$ </span>
        {command}
      </code>
      <span className="shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
        {copied ? (
          <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
        ) : (
          <Copy className="h-4 w-4" aria-hidden />
        )}
      </span>
    </button>
  );
}
