import { cn } from "@/lib/utils";

/** Horizontal pad for every public section. */
export const PAGE_PAD = "w-full px-4 sm:px-6 md:px-8 lg:px-12";

/** Single content width for public pages (aligns with nav). */
export const PAGE_SHELL = "mx-auto w-full max-w-7xl";

/** @deprecated Alias of PAGE_SHELL. Kept so older imports keep working. */
export const PAGE_SHELL_WIDE = PAGE_SHELL;

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
  /** Ignored: all shells use max-w-7xl. Kept for call-site compatibility. */
  wide?: boolean;
  /** Pad only, no max-width (hero / full-bleed). */
  full?: boolean;
  as?: "div" | "section";
};

/** Constrains content width. Pass `full` for pad-only full-bleed sections. */
export function PageShell({
  children,
  className,
  full = false,
  as: Tag = "div",
}: PageShellProps) {
  return (
    <Tag className={cn(PAGE_PAD, className)}>
      {full ? children : <div className={PAGE_SHELL}>{children}</div>}
    </Tag>
  );
}
