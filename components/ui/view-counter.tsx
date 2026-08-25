"use client";

import { useEffect, useState } from "react";

interface ViewCounterProps {
  postId: string;
  initialCount: number;
}

function formatViews(n: number): string {
  if (n < 1000) return String(n);
  if (n < 10_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${Math.round(n / 1000)}k`;
}

export function ViewCounter({ postId, initialCount }: ViewCounterProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    let cancelled = false;
    const key = `blog-viewed:${postId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // private mode — still count once per mount
    }

    fetch(`/api/public/blog/${postId}/view`, { method: "POST" })
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        if (cancelled || !body?.success) return;
        const next = Number(body.data?.view_count);
        if (Number.isFinite(next)) setCount(next);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [postId]);

  return (
    <p className="text-[11px] font-mono text-muted-foreground/70 tabular-nums">
      {formatViews(count)} view{count === 1 ? "" : "s"}
    </p>
  );
}
