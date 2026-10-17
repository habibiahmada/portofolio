'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import { Check, Copy, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'

const SHELL_COMMANDS = [
  { label: 'npx', value: 'npx habibiahmada' },
  { label: 'ssh', value: 'ssh ssh.habibiahmada.dev' },
] as const

function CopyCommandRow({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const input = document.createElement('input')
      input.value = value
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }, [value])

  return (
    <div className="group/cmd flex items-center gap-2 rounded-md border border-black/8 dark:border-white/10 bg-black/3 dark:bg-white/4 px-2.5 py-2 sm:px-3">
      <code className="min-w-0 flex-1 truncate font-mono text-[11px] sm:text-xs text-foreground/90">
        <span className="text-[var(--navy-accent-text)]">$</span>{' '}
        {value}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? `Copied ${value}` : `Copy ${value}`}
        className="inline-flex h-11 w-11 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md border border-black/8 dark:border-white/10 text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
        ) : (
          <Copy className="h-3.5 w-3.5" aria-hidden />
        )}
      </button>
    </div>
  )
}

export function TerminalShellWidget() {
  const [expanded, setExpanded] = useState(false)
  const panelId = useId()

  const toggle = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])

  useEffect(() => {
    if (!expanded) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpanded(false)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [expanded])

  return (
    <div
      className="fixed bottom-4 right-4 z-30 pointer-events-none pb-[env(safe-area-inset-bottom,0px)] pr-[env(safe-area-inset-right,0px)]"
    >
      <div className="pointer-events-auto flex flex-col items-end gap-2 max-w-[min(calc(100vw-2rem),18rem)] sm:max-w-xs">
        <div
          id={panelId}
          role="region"
          aria-label="Shell commands"
          hidden={!expanded}
          className={cn(
            'w-full origin-bottom-right rounded-xl border border-black/10 dark:border-white/10',
            'bg-background shadow-lg shadow-black/10 dark:shadow-black/40',
            'p-3 space-y-2',
            'transition-[opacity,transform] duration-200 ease-out',
            expanded
              ? 'opacity-100 translate-y-0 scale-100'
              : 'pointer-events-none opacity-0 translate-y-2 scale-[0.98]',
          )}
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Run in your terminal
          </p>
          {SHELL_COMMANDS.map((cmd) => (
            <CopyCommandRow key={cmd.value} value={cmd.value} />
          ))}
        </div>

        <button
          type="button"
          aria-label="Check in your shell: show terminal commands"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={toggle}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border font-mono text-xs',
            'border-black/10 dark:border-white/10 bg-background',
            'shadow-md shadow-black/8 dark:shadow-black/30',
            'text-foreground/90 transition-all duration-300',
            'hover:border-brand/40',
            'min-h-11 px-2.5 py-2 sm:px-3.5 sm:py-2.5',
          )}
        >
          <span className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/4 dark:bg-white/6">
            <Terminal
              className="h-3.5 w-3.5 text-[var(--navy-accent-text)]"
              aria-hidden
            />
          </span>

          <span className="hidden sm:inline truncate max-w-[9rem] md:max-w-none text-[11px] sm:text-xs">
            check in your shell!
            <span
              className="ml-0.5 inline-block w-[0.45em] bg-[var(--navy-accent-text)] motion-safe:animate-[terminal-cursor-blink_1.1s_step-end_infinite]"
              aria-hidden
            >
              &nbsp;
            </span>
          </span>
        </button>
      </div>
    </div>
  )
}
