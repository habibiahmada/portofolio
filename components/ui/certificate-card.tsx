"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Pin } from "lucide-react";

interface CertificateCardProps {
  id: string;
  title: string;
  org: string;
  thumb: string;
  isPinned: boolean;
  index: number;
  onOpen: () => void;
}

export function CertificateCard({
  id,
  title,
  thumb,
  isPinned,
  index,
  onOpen,
}: CertificateCardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      style={{ animationDelay: `${index * 50}ms` }}
      className={cn(
        "group relative flex flex-col overflow-hidden text-left cursor-pointer",
        "border border-black/5 dark:border-white/5",
        "bg-white/60 dark:bg-zinc-950/40",
        "backdrop-blur-sm",
        "hover:border-black/15 dark:hover:border-white/15",
        "hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/40",
        "transition-all duration-500",
        "animate-fade-in-up",
        isPinned && "ring-1 ring-brand/20",
      )}
    >
      {/* Pinned badge */}
      {isPinned && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand/10 backdrop-blur-md border border-brand/20">
          <Pin className="w-2.5 h-2.5 text-brand" />
          <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-brand">
            Pinned
          </span>
        </div>
      )}

      {/* Image - full card */}
      <div className="relative aspect-3/2 overflow-hidden flex-1">
        <Image
          src={thumb}
          alt={title}
          fill
          className="object-contain transition-all duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </button>
  );
}
