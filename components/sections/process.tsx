import { PageShell } from "@/components/ui/page-shell";

const STEPS = [
  {
    n: "01",
    title: "Scope the real job",
    body: "I write down the user, the constraint, and the non-goals before opening an editor. Fancy stacks wait until the problem is boringly clear.",
  },
  {
    n: "02",
    title: "Ship a thin vertical slice",
    body: "One path that works end to end (auth, data, UI) beats a polished shell. Preview deploys keep feedback honest.",
  },
  {
    n: "03",
    title: "Harden what users can break",
    body: "Validation at trust boundaries, fail-closed writes, and empty/error states you can explain to a non-engineer.",
  },
  {
    n: "04",
    title: "Measure, then decorate",
    body: "Motion and polish come after the page is readable and fast enough on a mid-range phone. If it is not measurable, it is not a claim.",
  },
] as const;

/** Static how I work. SSR-friendly, no client JS. */
export function Process() {
  return (
    <section id="process" className="py-16 md:py-24 w-full bg-transparent">
      <PageShell wide>
        <div className="max-w-2xl mb-14 space-y-3">
          <span className="text-xs font-mono tracking-widest text-brand uppercase block">
            How I ship
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
            Process over{" "}
            <span className="text-brand">performance theater</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium max-w-lg">
            A short operating manual, the same sequence I use on school systems,
            internships, and competition deadlines.
          </p>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 list-none">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-950 p-5 md:p-6 space-y-3"
            >
              <span className="text-[10px] font-mono font-semibold tracking-widest text-brand uppercase">
                {step.n}
              </span>
              <h3 className="text-base md:text-lg font-bold text-foreground leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </PageShell>
    </section>
  );
}
