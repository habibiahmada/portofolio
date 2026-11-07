# Work Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/projects` around a capability map with proof and a compact delivery path, and fix antislop audit 001 findings 1 to 11.

**Architecture:** Capability data and card subtitles live in small pure modules under `lib/data/`, unit-tested with `bun test`. `ProjectsPage` (client) holds the selected capability and passes it to the map, Featured, and the archive. Archive web apps keep image cards (horizontal under 640px); business websites and catalogs become compact rows.

**Tech Stack:** Next.js 16 App Router, React 19 (`ViewTransition`), Tailwind 4, Bun test.

**Spec:** `docs/superpowers/specs/2026-11-07-work-page-redesign-design.md` (audit: `anti-slop/audit-001-2026-11-07.md`)

## Global Constraints

- No em dashes in any copy. English copy, problem first, no buzzwords (R-02, R-16).
- No number or claim without data behind it; a capability needs at least 2 proving projects or it is dropped (R-17, R-38).
- Light and dark themes both verified; tap targets at least 44px; visible focus; `prefers-reduced-motion` respected (R-03, R-32, R-34, R-39).
- Keep the node-network background and the bottom CPU "DEV" drawing (owner decision). Remove only the three blurred orbs.
- Open Source is outside the capability filter.
- Mobile `/projects` page height under 10,000px at 375px.
- Delivery path correction: data has no 2024 work. The path starts at 2023 (SMK Negeri 1 Karawang, Software Engineering), from `about-timeline.tsx`.
- Commits: Conventional Commits, no AI attribution, `Refs #9`.

## Review Focus

- A capability whose projects are all archive websites (none featured): Featured must hide, not show an empty heading.
- Switching capability while scrolled far down: the list must not jump the user to a blank area; the control row stays reachable.
- A project title with no colon or a slogan subtitle (Renshuu web, E-Vote): the card must still show a descriptive line.
- Keyboard: Tab reaches each filter button, Enter/Space toggles it, `aria-pressed` reflects state.
- Theme switch while a filter is active: chips and pressed states keep 3:1 contrast in both themes.

---

### Task 1: Capability data

**Files:**
- Create: `lib/data/capabilities.ts`
- Test: `tests/work-page.test.ts`

**Interfaces:**
- Produces: `type Capability = { id: CapabilityId; label: string; sentence: string; projectIds: string[] }`, `type CapabilityId = "product" | "systems" | "full-stack" | "integrations" | "delivery"`, `CAPABILITIES: Capability[]`, `getCapabilities(): Capability[]` (drops any with fewer than 2 ids), `projectHasCapability(projectId: string, id: CapabilityId | null): boolean` (`null` means All work, returns true).

- [ ] **Step 1: Write failing tests** in `tests/work-page.test.ts`: every `projectIds` entry exists in `public/data/projects.json`; every capability returned by `getCapabilities()` has at least 2 ids; no `label` or `sentence` contains "—"; `projectHasCapability(anyId, null)` is true; `projectHasCapability("40fc57ed-1ce0-5375-9732-a66df807beff", "delivery")` is true.
- [ ] **Step 2: Run** `bun test tests/work-page.test.ts`. Expected: FAIL, module not found.
- [ ] **Step 3: Verify the mapping against copy.** For each project in the spec's mapping table, read its case study, brief, or meta-seed description and keep it in a row only if that copy states the capability. Record dropped ones in the commit message.
- [ ] **Step 4: Implement** `lib/data/capabilities.ts` with the verified ids (UUIDs from `projects.json`) and one sentence per capability in the site's voice.
- [ ] **Step 5: Run** `bun test tests/work-page.test.ts`. Expected: PASS.
- [ ] **Step 6: Commit** `feat(work): add capability data with proving projects`.

### Task 2: Card subtitle

**Files:**
- Create: `lib/data/card-subtitle.ts`
- Test: `tests/work-page.test.ts`

**Interfaces:**
- Produces: `getCardSubtitle(project: { id: string; title_en: string }): string`. Returns the override for the id if one exists, otherwise the text after the first colon of `title_en`, trimmed; `""` when neither exists.

- [ ] **Step 1: Write failing tests:** `"HK GOLD VIP: loyalty app and back office for a gold jeweller"` gives `"loyalty app and back office for a gold jeweller"`; Renshuu (`f5c13a15-1bc6-4e82-8d62-d1196894d189`, title "Renshuu web") gives a non-empty override; every project in `projects.json` gets a non-empty subtitle with no "—".
- [ ] **Step 2: Run** the test file. Expected: FAIL.
- [ ] **Step 3: Implement** with overrides for Renshuu, E-Vote, Aksara Pustaka, Smartfarm AI, CultureConnect, and any other slogan subtitle found (descriptive, lowercase start like the others, taken from each project's own copy).
- [ ] **Step 4: Run** tests. Expected: PASS.
- [ ] **Step 5: Commit** `feat(work): descriptive card subtitles`.

### Task 3: Cards and rows

**Files:**
- Modify: `components/ui/project-card.tsx`
- Create: `components/ui/project-row.tsx`
- Modify: `components/ui/open-source-card.tsx` (mobile padding only)

**Interfaces:**
- Consumes: `getCardSubtitle` (Task 2).
- Produces: `ProjectCard` props unchanged; `ProjectRow({ project, locale }: { project: Project; locale?: string })`.

- [ ] **Step 1: ProjectCard.** Below `sm` the card is horizontal (96px square thumbnail inside the existing `ViewTransition`, text beside it); from `sm` up keep the 16:10 image. Text: meta line (origin · year · at most 2 tags on mobile, 3 from `sm`, then "+n", single line, no wrap), title, `getCardSubtitle` line (no clamp), `outcome` badge if present. Remove the image overlay year and the hover-only QuickLink. Footer Live link gets a 44px hit area. Hover: keep `hover-glitch-card` and a border colour change; drop shadows and the image `scale-105`.
- [ ] **Step 2: ProjectRow.** One row: 64px thumbnail, title linked to the detail page, subtitle, year, Live link (44px target). Whole row min-height 80px; border-bottom separator.
- [ ] **Step 3: Open Source card.** Under `sm`: padding `p-4`, image box full width of the card content (no extra inset).
- [ ] **Step 4: Verify** at 375px and 1440px in both themes: no tag row wraps, no text clamped, no hover-only control. `bunx tsc --noEmit -p .` passes.
- [ ] **Step 5: Commit** `feat(work): compact cards and rows for the archive`.

### Task 4: Capability map, filter, and page structure

**Files:**
- Create: `components/sections/work-capabilities.tsx`, `components/sections/work-path.tsx`
- Modify: `components/sections/projects-page.tsx`, `lib/data/project-taxonomy.ts` (`PROJECT_STATS`)
- Test: `tests/work-page.test.ts`

**Interfaces:**
- Consumes: `getCapabilities`, `projectHasCapability` (Task 1), `ProjectCard`, `ProjectRow` (Task 3).
- Produces: `WorkCapabilities({ selected, onSelect }: { selected: CapabilityId | null; onSelect: (id: CapabilityId | null) => void })`, `WorkPath()`, `PROJECT_STATS.kinds` (archive groups + 1 for Open Source).

- [ ] **Step 1: Write failing test:** `PROJECT_STATS.kinds === ARCHIVE_GROUPS.length + 1`.
- [ ] **Step 2: Run** tests. Expected: FAIL.
- [ ] **Step 3: Stats and intro.** Add `kinds`; the stat label "Kinds of work" uses it. H1 "I build more than websites"; one intro paragraph carrying the spec's one-line message.
- [ ] **Step 4: WorkPath.** Four steps from data: `2023 SMK Negeri 1 Karawang, Software Engineering` · `2025 Internship, Coding Camp Top 15, Intel AI country award` · `2026 Webekspres: client sites to systems (MIRU, HK GOLD VIP)` · `2026 CI/CD platform and open source`. Horizontal from `sm`, vertical list below.
- [ ] **Step 5: WorkCapabilities.** Rows of label, sentence, and linked project chips (to `/projects/<slug>`); then a control row of "All work" plus one button per capability, `aria-pressed`, 44px. Placed under the map, above Featured.
- [ ] **Step 6: Filtering in ProjectsPage.** Hold `selected` in state; filter Featured and archive groups with `projectHasCapability`; hide empty groups and an empty Featured; if everything is empty show "No projects match this capability" with an "All work" reset button. Wrap the filtered lists in a `ViewTransition` with a 150 to 200ms cross-fade, instant under reduced motion. Open Source is not filtered.
- [ ] **Step 7: Archive hierarchy and spacing.** Web applications render `ProjectCard`; Business websites and Catalogs render `ProjectRow` lists. Section spacing `space-y-12 md:space-y-20`; remove the `h-24 md:h-32` spacer; remove the three blurred orb divs; keep NodeNetwork and the CPU drawing.
- [ ] **Step 8: Run** `bun test` and `bunx tsc --noEmit -p .`. Expected: PASS.
- [ ] **Step 9: Commit** `feat(work): capability map, delivery path, and filtered archive`.

### Task 5: Verification and audit report

**Files:**
- Create: `anti-slop/audit-001-2026-11-07-report.md`

- [ ] **Step 1: Measure** on the dev server: mobile page height at 375px (target under 10,000px), clamped text count (target 0), horizontal overflow (0), console errors (none), in light and dark.
- [ ] **Step 2: Click through** every filter button, a capability chip, a row link, a card link, the Live link, and the empty-state reset; keyboard-only pass for the filter row.
- [ ] **Step 3: Write the report:** each finding 1 to 11 with the fix and the measured evidence; the Delivery Gate PASS/FAIL list.
- [ ] **Step 4: Commit** `docs: antislop audit 001 follow-up report`, push, open the PR closing #9.
