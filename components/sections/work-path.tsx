/**
 * The delivery path in one line, from the experience timeline and project
 * data on this site. Horizontal from 640px, a short list below that.
 */
const STEPS = [
  { year: "2023", text: "SMK Negeri 1 Karawang, Software Engineering" },
  { year: "2025", text: "Internship, Coding Camp Top 15, Intel AI country award" },
  { year: "2026", text: "Webekspres: client sites to systems (MIRU, HK GOLD VIP)" },
  { year: "2026", text: "CI/CD platform and open source" },
] as const;

export function WorkPath() {
  return (
    <ol aria-label="How the work grew" className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:gap-0">
      {STEPS.map((step, i) => (
        <li
          key={step.text}
          className="relative flex gap-3 sm:flex-col sm:gap-2 sm:border-t sm:border-black/10 sm:pt-4 sm:pr-4 sm:dark:border-white/10"
        >
          <span className="shrink-0 font-mono text-xs text-brand">{step.year}</span>
          <span className="text-sm leading-snug text-foreground">{step.text}</span>
          {i < STEPS.length - 1 && (
            <span aria-hidden className="absolute -top-[5px] left-0 hidden h-2.5 w-2.5 rounded-full bg-brand sm:block" />
          )}
          {i === STEPS.length - 1 && (
            <span aria-hidden className="absolute -top-[5px] left-0 hidden h-2.5 w-2.5 rounded-full border-2 border-brand bg-background sm:block" />
          )}
        </li>
      ))}
    </ol>
  );
}
