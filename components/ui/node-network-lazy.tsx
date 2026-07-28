"use client";

import dynamic from "next/dynamic";
import type { NodeNetworkProps } from "@/components/ui/node-network";

/** Lazy canvas — not in SSR / first JS payload. */
export const NodeNetworkLazy = dynamic(
  () =>
    import("@/components/ui/node-network").then((m) => m.NodeNetwork),
  { ssr: false },
);

export type { NodeNetworkProps };
