# Performance task list — public pages & data

Full checklist for performance optimization. Order = priority. Check off in PR / chat as you work.

**Scope:** all public routes + public data (`projects`, `companies`, `certificates`).  
**Out of scope:** Puck, brand redesign, admin UX (except cache revalidate after writes).

**Pages:** `/` · `/projects` · `/about` (+ shared public layout)

> **Audit 2026-07-28:** some items were previously checked without matching code. Status below has been realigned; **1.1–1.3** + **3.7** were re-applied in this session. Production Lighthouse verify items (**10.3 / 10.6 / 10.10 / 10.14**) remain open.

---

## 0. Baseline (before code changes)

- [x] **0.1** Capture Lighthouse **mobile** for `/`, `/projects`, `/about` (Performance, LCP, INP, CLS, TBT, total JS) — see `docs/lighthouse/*/mobile/` + appendix in `docs/performance.md` (Perf 60/69/69; INP n/a in lab)
- [x] **0.2** Capture PageSpeed Insights on production URL (if live) — save scores in PR / `docs/performance.md` appendix — production lab scores 2026-07-28 recorded in appendix (mobile + desktop)
- [x] **0.3** Record Network waterfall: `/api/public/projects|companies|certificates` from browser — recorded in appendix §0.3
- [x] **0.4** Record LCP image sizes (hero avatar / project cover) — `glitch-hero` ~290 KiB, `habibiahmada` ~370 KiB, covers ~35–59 KiB; appendix §0.4

---

## 1. Image pipeline (global — do first)

- [x] **1.1** Disable `images.unoptimized: true` in `next.config.mjs` (production) — optimizer on; `formats` avif/webp
- [x] **1.2** Add `images.remotePatterns` for Supabase Storage host (`*.supabase.co` + `/storage/v1/object/public/**`)
- [x] **1.3** Set `formats: ['image/avif', 'image/webp']` + quality 60/75
- [x] **1.4** Audit `next/image` — **Hero** (`components/sections/hero.tsx`): `priority`, correct dimensions/`sizes`
- [x] **1.5** Audit — **About hero** (`about-hero.tsx`): `priority` + `sizes`
- [x] **1.6** Audit — **ProjectCard** (`project-card.tsx`): `priority` only for small above-fold indices; `sizes` per featured vs archive layout
- [x] **1.7** Audit — **Companies** marquee logos: lazy, small `sizes`, no `priority`
- [x] **1.8** Audit — **CertificateCard** + **CertificateModal** pages: lazy in grid; modal may use priority on active page only
- [x] **1.9** Audit — **About tech stack** icons (`about-tech-stack.tsx`): lazy + small size
- [x] **1.10** Audit — **CV modal** images (`cv-modal.tsx`)
- [ ] **1.11** Verify in Network: requests go through `/_next/image` (not raw large files) — re-check after restart `bun dev` / deploy
- [ ] **1.12** (Optional) Compress assets in `public/` and oversized Storage uploads

---

## 2. Server data layer (shared)

- [x] **2.1** Create server fetch helpers in `lib/` (e.g. `lib/data/projects.ts`, `companies.ts`, `certificates.ts`) using `getSupabaseServerClient` — **single source of truth**, no duplicate queries per page — `lib/data/*` + `getSupabaseAnonClient` (cookie-free, cache-safe)
- [x] **2.2** Match data shape to what the UI uses today (featured pin order, pinned certs, pagination semantics)
- [x] **2.3** Add `revalidate` / `unstable_cache` + tags (e.g. `projects`, `companies`, `certificates`) — default ISR 60–300s — `DATA_REVALIDATE_SECONDS = 60` + tags in `lib/data/constants.ts`
- [x] **2.4** Admin mutations → `revalidateTag(...)` — already in `app/api/admin/{projects,companies,certificates}` (see also §8)
- [x] **2.5** Keep `/api/public/*` for clients that still need it (load-more, etc.) but **not** as the first-paint path — API uses `lib/data/*`; route comment: not SSR first-paint

---

## 3. Home page `/`

### 3.A Data SSR

- [x] **3.1** Make `app/(public)/page.tsx` an async Server Component; `Promise.all` fetch **companies** + **featured projects**
- [x] **3.2** Pass `initialData` to `<Companies />` and `<Projects />` — remove `useCompanies` / `useProjects` for first paint
- [x] **3.3** Skeletons only for soft navigation / error recovery, not initial data loading

### 3.B Section / JS

- [x] **3.4** **Hero:** dynamic-import `NodeNetwork` (`ssr: false`); gate `prefers-reduced-motion`
- [x] **3.5** **Companies:** stay client for marquee if needed; data from props
- [x] **3.6** **Projects (featured):** data from props; reduce Framer on card list where possible (CSS) — data from props; Framer cards replaced with CSS (`animate-fade-in-up`)
- [x] **3.7** **Services:** dynamic-import 5 visuals + load on in-view (`InViewVisual`)
- [x] **3.8** **CTA:** dynamic `NodeNetwork` + dynamic-import GSAP/ScrollTrigger (not static top-level import)
- [x] **3.9** Ensure home **does not** call `/api/public/*` on first load (except explicit interaction)

---

## 4. Projects page `/projects`

- [x] **4.1** `app/(public)/projects/page.tsx` async: server-fetch **all projects** (order/featured same as API)
- [x] **4.2** Refactor `ProjectsPage` to accept `initialData`; remove `useProjects()` for first paint
- [x] **4.3** Dynamic `NodeNetwork` + reduced-motion
- [x] **4.4** Archive grid: lazy images; `priority` max 1–2 first covers
- [x] **4.5** Verify HTML response already contains project titles/descriptions (View Source / disable JS)

---

## 5. About page `/about`

### 5.A Data SSR — certificates

- [x] **5.1** Server-fetch **pinned certificates** + **page 1 non-pinned** in `about/page.tsx`
- [x] **5.2** Pass to `<Certificates initialPinned initialNonPinned />`
- [x] **5.3** **Load more** may stay client → `/api/public/certificates?pinned=false&page=` (only after click)
- [x] **5.4** Remove waterfall `usePinnedCertificates` + `useNonPinnedCertificates` on mount

### 5.B Section / JS (no DB data)

- [x] **5.5** **AboutHero:** dynamic NodeNetwork + dynamic GSAP
- [x] **5.6** **AboutIntro / CpuArchitecture:** lazy / in-view if heavy (SVG — lightweight, skip)
- [x] **5.7** **AboutTechStack:** ensure icons lazy (already has `loading="lazy"`) + image optimizer
- [x] **5.8** **AboutTimeline:** dynamic-import GSAP/ScrollTrigger
- [x] **5.9** **Certificates grid:** reduce excess Framer (CSS replaces framer-motion); modal stays client
- [x] **5.10** **CTA** (shared): same as home — dynamic heavy deps

---

## 6. Shared public layout

- [x] **6.1** `app/(public)/layout.tsx` — gate CRT scanline/flicker with `prefers-reduced-motion` — CSS `.crt-overlay { display: none }` in media query
- [x] **6.2** `Navbar` / `Footer` — ensure no public data fetch (audit: clean)
- [x] **6.3** Theme toggle: keep client; do not block LCP (audit: SSR placeholder + VT API)
- [x] **6.4** Fonts in `app/layout.tsx` — ensure all `display: 'swap'`; latin subset only (done); check no double-load (audit: clean)

---

## 7. Shared UI / bundle

- [x] **7.1** Single `dynamic` helper module for NodeNetwork (already `node-network-lazy.tsx`; migrated hero.tsx + cta.tsx)
- [x] **7.2** `GlitchText` — ensure no layout thrash on LCP heading; respect reduced-motion (CSS absolute positioning, no layout shift)
- [x] **7.3** Reduce `framer-motion` in `ProjectCard` — replaced with CSS animate-fade-in-up; CertificateCard done in task 5.9
- [x] **7.4** Add `@next/bundle-analyzer`; record top modules before/after (installed + configured; run `ANALYZE=true bun run build`)
- [x] **7.5** Ensure tree-shaking: GSAP only in sections that need it (cta.tsx migrated to dynamic import; about-hero + about-timeline already dynamic)

---

## 8. Caching & correctness after admin writes

- [x] **8.1** After admin POST/PATCH/DELETE projects → invalidate tag `projects`
- [x] **8.2** Same for certificates → `certificates`
- [x] **8.3** Same for companies → `companies`
- [x] **8.4** Smoke test note: manual — change data in admin → public page refreshes immediately (without waiting for 60s TTL)

---

## 9. Public API (still exists, smaller role)

- [x] **9.1** Document in code: API for progressive enhancement / load-more, not SSR path
- [x] **9.2** Ensure API responses still match certificate load-more — switched to `lib/data/*` helpers (consistent with SSR)
- [x] **9.3** Cache-Control headers on `/api/public/*` — `public, s-maxage=60, stale-while-revalidate=300`

---

## 10. Per-page verification (definition of done)

### Home `/`

- [x] **10.1** First HTML contains companies + featured project titles (without JS) ✅ verified via browser View Source
- [x] **10.2** No `/api/public/companies` or `/projects` request on cold load ✅ verified via DevTools Network
- [ ] **10.3** LCP image via optimizer; Lighthouse mobile ↑ vs baseline (needs production deploy for accurate Lighthouse)

### `/projects`

- [x] **10.4** First HTML contains project list ✅ verified via browser View Source
- [x] **10.5** No `useProjects` waterfall on mount ✅
- [ ] **10.6** Lighthouse mobile ↑ vs baseline (needs production deploy)

### `/about`

- [x] **10.7** First HTML contains pinned certificates (title/org at minimum) ✅ verified via browser View Source
- [x] **10.8** Load-more still works via API ✅ (code: `useNonPinnedCertificates` stays active after SSR)
- [x] **10.9** No double-fetch pinned+page1 on mount ✅ (initialPinned/initialNonPinned skip client hooks)
- [ ] **10.10** Lighthouse mobile ↑ vs baseline (needs production deploy)

### Global

- [x] **10.11** `prefers-reduced-motion`: canvas/GSAP not aggressive ✅ (CRT hidden, NodeNetwork/GSAP reduced-motion gate)
- [x] **10.12** No significant CLS regression (skeleton → content in SSR must stay stable) ✅ (data already in HTML, no skeleton→content layout shift)
- [x] **10.13** `graphify update .` after structural changes ✅
- [ ] **10.14** Update final scores in PR + brief note in `docs/performance.md`

---

## Recommended execution order

```
0 Baseline
→ 1 Images
→ 2 Data helpers + ISR
→ 3 Home SSR + JS
→ 4 Projects SSR + JS
→ 5 About certificates SSR + JS
→ 6 Layout CRT / fonts
→ 7 Bundle trim
→ 8 Admin revalidateTag
→ 9 API headers/docs
→ 10 Verify all pages
```

## Quick map: public data → UI

| Data | Table | Used on | SSR task |
|------|-------|---------|----------|
| Projects (featured) | `projects` | `/` Projects | 3.1–3.2 |
| Projects (all) | `projects` | `/projects` | 4.1–4.2 |
| Companies | `companies` | `/` Companies | 3.1–3.2 |
| Certificates pinned + page | `certificates` | `/about` Certificates | 5.1–5.4 |

Static/no-DB sections (still optimize JS/images): Hero, Services visuals, About intro/timeline/tech, CTA, Nav, Footer.
