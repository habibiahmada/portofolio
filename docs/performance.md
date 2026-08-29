# Performance optimization steering

**Goal:** push public site toward Lighthouse ~100 (mobile-first), via SSR/SSG/ISR, image pipeline, and JS budget — **not** via Puck or a new CMS.

Cursor loads `.cursor/rules/performance-optimization.mdc` and skill `.cursor/skills/performance-optimization/SKILL.md` when working on this.

## Baseline problems (as of steering date)

| Issue | Where | Impact |
|-------|--------|--------|
| Client data waterfall | `lib/hooks/use-api.ts` → Projects, Companies, Certificates | Delayed LCP, extra RTTs, skeletons |
| Image optimizer off | `next.config.mjs` → `images.unoptimized: true` | Large unoptimized assets |
| Heavy always-on client | `NodeNetwork` canvas, Framer on cards, GSAP sections | Main-thread / INP / TBT |
| CRT overlays | `app/(public)/layout.tsx` fixed overlays + CSS animation | Minor paint cost; keep intentional but watch CLS/CPU |

## Phase 1 — Images (do first)

1. Remove or set `images.unoptimized` to `false` for production builds.
2. Add `images.remotePatterns` for the Supabase project host (and any CDN).
3. Audit every `next/image`:
   - Hero / LCP candidate: `priority` + explicit dimensions or `fill` + `sizes`
   - Below fold: default lazy
   - Prefer quality ~60–75 already listed in config
4. Serve AVIF/WebP via Next optimizer (automatic when optimized).
5. Compress source uploads in Supabase Storage when possible.

**Verify:** Network panel shows `/_next/image?url=…` (or equivalent) not raw huge PNGs for remote URLs.

## Phase 2 — SSR / ISR for public content

### Migrate off client hooks on marketing pages

Replace:

```ts
const { data, loading } = useProjects(...)
```

With server load + props:

```ts
// Server Component page
export const revalidate = 60 // tune as needed

const supabase = await getSupabaseServerClient()
const { data } = await supabase.from("projects").select("*")...
return <Projects initialData={data ?? []} />
```

Keep `"use client"` on the section **only** if it needs hooks for UI (modals, marquee, motion). First paint must not depend on `/api/public/*`.

### Pages / sections in scope

- Home: Companies, Projects (+ Certificates if shown)
- `/projects`, `/about` data-bound parts
- Prefer parallel server fetches with `Promise.all` in one place

### Caching

- Start with `export const revalidate = 60` (or 300) on public pages
- Optionally `unstable_cache` / tagged revalidation after admin writes (later)
- Keep `/api/public/*` for any remaining client needs (admin previews, infinite scroll that stays client-side)

### SEO

Server HTML improves crawlability of project titles/descriptions vs post-hydration inject.

## Phase 3 — JavaScript & motion budget

1. `next/dynamic(..., { ssr: false })` for `NodeNetwork` and heavy visual demos; load when in view or after `requestIdleCallback`.
2. Reduce Framer Motion on project/certificate **grids** — CSS transitions often enough.
3. Dynamic-import GSAP only in about/CTA sections that need it.
4. `prefers-reduced-motion: reduce` → disable canvas loops and large motion.
5. Consider removing or gating CRT flicker overlays on low-end / reduced-motion.
6. Run `@next/bundle-analyzer` after changes; hunt `framer-motion` / `gsap` weight on first load.

## Phase 4 — Measure & gate

| Tool | Use |
|------|-----|
| Chrome Lighthouse (mobile) | Local regression |
| [PageSpeed Insights](https://pagespeed.web.dev/) | Field + lab on production URL |
| Web Vitals extension / Vercel Speed Insights | Real-user optional |

Record before/after: Performance, LCP, INP, CLS, total JS transferred.

**Realistic target:** Performance 90–100. Perfect 100 every run is unstable with canvas/theme; optimize until scores are stable high and UX feels instant.

## Explicit non-goals

- Integrating [Puck](https://puckeditor.com/) for “HTML-only” speed — SSR is a Next concern; Puck is a visual editor.
- Rewriting the design system unless required for perf.
- Premature micro-optimizations before Phases 1–2.

## Implementation order for agents

Checklist berbutir (semua halaman + data publik): **[performance-tasks.md](./performance-tasks.md)**.

1. Config images  
2. Home page SSR (projects + companies)  
3. Remaining public lists  
4. Dynamic heavy visuals  
5. Measure + iterate  
6. `graphify update .`

## Acceptance criteria

- [x] Public home content visible without waiting on client `/api/public/*` for primary sections  
- [x] Production image optimization enabled with correct remote patterns  
- [x] Heavy canvas/GSAP not blocking first interaction by default (dynamic imports + reduced-motion gating)  
- [ ] Documented before/after Lighthouse mobile scores in the PR description (requires production deploy for accurate Lighthouse)  
- [x] No new CMS/editor dependency added for this initiative  

---

## Appendix — Baseline (2026-07-28, production)

Source: Chrome Lighthouse JSON under [`docs/lighthouse/`](./lighthouse/) against `https://www.habibiahmada.dev` (lab, before code changes). **INP** is not in this lab report (often empty in Lighthouse lab; compare via PSI/CrUX later).

### 0.1 Lighthouse mobile (primary)

| Page | Perf | LCP | TBT | CLS | FCP | SI | TTI | JS transfer |
|------|------|-----|-----|-----|-----|----|-----|-------------|
| `/` | **60** | **5.3 s** | 769 ms | 0 | 1.7 s | 3.5 s | 5.4 s | **296 KiB** (24 scripts) |
| `/projects` | **69** | **2.6 s** | 1608 ms | 0 | 1.4 s | 3.6 s | 4.1 s | **231 KiB** (18 scripts) |
| `/about` | **69** | **3.5 s** | 801 ms | 0 | 1.6 s | 4.4 s | 5.5 s | **282 KiB** (20 scripts) |

Files:

- `docs/lighthouse/main-page/mobile/www.habibiahmada.dev-20260728T191758.json`
- `docs/lighthouse/project-page/mobile/www.habibiahmada.dev-20260728T191854.json`
- `docs/lighthouse/about-page/mobile/www.habibiahmada.dev-20260728T192146.json`

### 0.2 Desktop lab (same capture day — PSI/production reference)

| Page | Perf | LCP | TBT | CLS | JS transfer |
|------|------|-----|-----|-----|-------------|
| `/` | 88 | 1.4 s | 197 ms | 0 | 308 KiB |
| `/projects` | 94 | 1.2 s | 66 ms | 0.09 | 254 KiB |
| `/about` | 98 | 0.7 s | 51 ms | 0 | 305 KiB |

Unused JS (mobile estimate): ~705–723 KiB potential savings. **No `/_next/image` requests** on all three mobile pages — all images served as raw URLs (`images.unoptimized` still on).

### 0.3 Network waterfall — `/api/public/*` (client after hydrate)

| Page | Requests on cold load |
|------|------------------------|
| `/` | `/api/public/companies` + `/api/public/projects?page_size=50&featured=…` (~0.96 s after nav start) |
| `/projects` | `/api/public/projects?page_size=50` (~1.4 s) |
| `/about` | `/api/public/companies` + `/api/public/certificates?pinned=true` + `/api/public/certificates?pinned=false&page=1&page_size=4` (~0.80 s) |

Hooks: `useCompanies` / `useProjects` / `usePinnedCertificates` / `useNonPinnedCertificates` in `lib/hooks/use-api.ts`.

### 0.4 LCP-related image sizes (transfer)

| Page | Dominant / LCP-related asset | Transfer | Note |
|------|------------------------------|----------|------|
| `/` | `/images/glitch-hero.webp` | **~290 KiB** | Priority `Low` despite preload; largest image on home |
| `/about` | `/images/habibiahmada.webp` | **~370 KiB** | Avatar; LCP node in lab = text paragraph (render delay), avatar still large payload |
| `/projects` | Supabase `project-*.webp` covers | **~35–59 KiB** each | LCP node in lab = intro text; covers from Storage without optimizer |
| `/` covers | e.g. `project-6.webp` | ~59 KiB | Raw Supabase Storage URL |

Mobile total image transfer: home ~415 KiB · projects ~189 KiB · about ~377 KiB.

### Phase 2 — Data helpers (2026-07-28)

| Module | Exports | Cache |
|--------|---------|--------|
| `lib/data/projects.ts` | `getProjects`, `getFeaturedProjects`, `getProjectById` | tag `projects`, 60s |
| `lib/data/companies.ts` | `getCompanies` | tag `companies`, 60s |
| `lib/data/certificates.ts` | `getPinnedCertificates`, `getNonPinnedCertificates`, `getCertificates` | tag `certificates`, 60s |
| `lib/data/constants.ts` | `DATA_REVALIDATE_SECONDS`, `DATA_TAGS` | — |

Public `/api/public/*` routes now call these helpers (load-more / client only). SSR pages wire helpers in phase 3+. Admin `revalidateTag` = task 2.4 / phase 8.
