import { cn } from '@/lib/utils'

interface ProjectTagProps {
  children: string
  className?: string
}

/**
 * Small mono‑spaced uppercase tag chip used on project cards.
 */
export function ProjectTag({ children, className }: ProjectTagProps) {
  return (
    <span
      className={cn(
        'text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full',
        'border border-black/5 dark:border-white/5',
        'bg-black/2 dark:bg-white/2 text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}
