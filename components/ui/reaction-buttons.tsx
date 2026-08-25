"use client";

import { useState, useCallback } from "react";

interface ReactionButtonsProps {
  postId: string;
  initialCounts?: Record<string, number>;
}

const REACTIONS = [
  {
    key: "like",
    label: "Like",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
  {
    key: "insightful",
    label: "Insightful",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7 7 0 0 0-7 7c0 3 2 5.5 4 7.5.8.8 1.5 1.5 2 2.5.5-1 1.2-1.7 2-2.5 2-2 4-4.5 4-7.5a7 7 0 0 0-7-7z" />
        <line x1="12" y1="18" x2="12" y2="22" />
      </svg>
    ),
  },
  {
    key: "useful",
    label: "Useful",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    ),
  },
] as const;

export function ReactionButtons({
  postId,
  initialCounts = {},
}: ReactionButtonsProps) {
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReact = useCallback(
    async (reaction: string) => {
      if (loading) return;
      setLoading(true);

      try {
        const res = await fetch(`/api/public/blog/${postId}/react`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reaction }),
        });

        const data = await res.json();

        if (data.success && data.data?.counts) {
          setCounts(data.data.counts);
          setSelected(reaction);
        }
      } catch {
        // Silently fail — reaction is non-critical
      } finally {
        setLoading(false);
      }
    },
    [postId, loading],
  );

  const totalReactions = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground/60">
        Reactions
      </span>

      <div className="flex flex-wrap gap-2">
        {REACTIONS.map(({ key, label, icon }) => {
          const count = counts[key] || 0;
          const isActive = selected === key;

          return (
            <button
              key={key}
              onClick={() => handleReact(key)}
              disabled={loading}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold border transition-all duration-200 ${
                isActive
                  ? "bg-brand/10 text-brand border-brand/30"
                  : "bg-white dark:bg-zinc-900 text-muted-foreground border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 hover:text-foreground"
              } disabled:opacity-50`}
              title={label}
            >
              {icon}
              <span>{label}</span>
              {count > 0 && (
                <span className="text-[10px] opacity-60">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {totalReactions > 0 && (
        <p className="text-[11px] text-muted-foreground/50">
          {totalReactions} reaction{totalReactions !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
