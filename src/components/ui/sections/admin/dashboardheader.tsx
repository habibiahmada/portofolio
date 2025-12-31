"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionIcon?: ReactNode;
  href?: string;        
  onClick?: () => void;   
}

export default function DashboardHeader({
  title,
  description,
  actionLabel,
  actionIcon,
  href,
  onClick,
}: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center bg-card border rounded-xl p-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted-foreground text-sm mt-1">
            {description}
          </p>
        )}
      </div>

      {actionLabel && (
        href ? (
          <Link href={href}>
            <Button aria-label={actionLabel}>
              {actionIcon}
              {actionLabel}
            </Button>
          </Link>
        ) : (
          <Button onClick={onClick} aria-label={actionLabel}>
            {actionIcon}
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}
