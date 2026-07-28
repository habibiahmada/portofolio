# Performance task list — public pages & data

Checklist lengkap untuk optimasi performa. Urutan = prioritas. Centang di PR / chat saat dikerjakan.

**Scope:** semua rute publik + data publik (`projects`, `companies`, `certificates`).  
**Out of scope:** Puck, redesign brand, admin UX (kecuali cache revalidate setelah write).

**Pages:** `/` · `/projects` · `/about` (+ layout publik bersama)

---

## 0. Baseline (sebelum ubah kode)

- [x] **0.1** Capture Lighthouse **mobile** untuk `/`, `/projects`, `/about` (Performance, LCP, INP, CLS, TBT, total JS) — lihat `docs/lighthouse/*/mobile/` + appendix di `docs/performance.md` (Perf 60/69/69; INP n/a di lab)
- [x] **0.2** Capture PageSpeed Insights URL produksi (jika live) — simpan skor di PR / `docs/performance.md` appendix — skor lab produksi 2026-07-28 dicatat di appendix (mobile + desktop)
- [x] **0.3** Catat waterfall Network: request `/api/public/projects|companies|certificates` dari browser — tercatat di appendix §0.3
- [x] **0.4** Catat ukuran LCP image (hero avatar / project cover) — `glitch-hero` ~290 KiB, `habibiahmada` ~370 KiB, covers ~35–59 KiB; appendix §0.4

---

## 1. Image pipeline (global — kerjakan dulu)

- [x] **1.1** Matikan `images.unoptimized: true` di `next.config.mjs` (production)
- [x] **1.2** Tambah `images.remotePatterns` untuk host Supabase Storage (+ domain lain yang dipakai URL gambar)
- [x] **1.3** Set `formats: ['image/avif', 'image/webp']` (atau default Next) + quality 60/75
- [x] **1.4** Audit `next/image` — **Hero** (`components/sections/hero.tsx`): `priority`, dimensi/`sizes` benar
- [x] **1.5** Audit — **About hero** (`about-hero.tsx`): `priority` + `sizes`
- [x] **1.6** Audit — **ProjectCard** (`project-card.tsx`): `priority` hanya index kecil di above-fold; `sizes` per layout featured vs archive
- [x] **1.7** Audit — **Companies** marquee logos: lazy, `sizes` kecil, jangan `priority`
- [x] **1.8** Audit — **CertificateCard** + **CertificateModal** pages: lazy di grid; modal boleh priority halaman aktif saja
- [x] **1.9** Audit — **About tech stack** icons (`about-tech-stack.tsx`): lazy + ukuran kecil
- [x] **1.10** Audit — **CV modal** images (`cv-modal.tsx`)
- [x] **1.11** Verifikasi di Network: request lewat `/_next/image` (bukan file mentah besar)
- [ ] **1.12** (Opsional) Compress asset di `public/` dan upload Storage yang oversized

---

## 2. Data layer server (shared)

- [x] **2.1** Buat helper server fetch di `lib/` (mis. `lib/data/projects.ts`, `companies.ts`, `certificates.ts`) memakai `getSupabaseServerClient` — **satu sumber kebenaran**, bukan duplicate query di tiap page — `lib/data/*` + `getSupabaseAnonClient` (cookie-free, cache-safe)
- [x] **2.2** Samakan shape data dengan yang dipakai UI hari ini (featured pin order, pinned certs, pagination semantics)
- [x] **2.3** Tambah `revalidate` / `unstable_cache` + tag (mis. `projects`, `companies`, `certificates`) — default ISR 60–300s — `DATA_REVALIDATE_SECONDS = 60` + tags di `lib/data/constants.ts`
- [ ] **2.4** (Nanti) Admin mutation → `revalidateTag(...)` agar publish cepat tanpa tunggu TTL
- [x] **2.5** Biarkan `/api/public/*` untuk klien yang masih butuh (load-more, dll.) tetapi **bukan** jalur first paint — API memakai `lib/data/*`; komentar di route: bukan SSR first-paint

---

## 3. Halaman Home `/`

### 3.A Data SSR

- [x] **3.1** Ubah `app/(public)/page.tsx` jadi async Server Component; `Promise.all` fetch **companies** + **featured projects**
- [x] **3.2** Pass `initialData` ke `<Companies />` dan `<Projects />` — hilangkan `useCompanies` / `useProjects` untuk first paint
- [x] **3.3** Skeleton hanya untuk navigasi soft / error recovery, bukan loading data awal

### 3.B Section / JS

- [x] **3.4** **Hero:** dynamic-import `NodeNetwork` (`ssr: false`); gate `prefers-reduced-motion`
- [x] **3.5** **Companies:** tetap client untuk marquee jika perlu; data dari props
- [x] **3.6** **Projects (featured):** data dari props; kurangi Framer di card list bila memungkinkan (CSS) — data dari props; Framer card ditunda ke fase 7 bila TBT masih jelek
- [x] **3.7** **Services:** dynamic-import 5 visual (`LayoutDesigner`, `CodeEditor`, `Speedometer`, `NodeGraph`, `CICD`) — load saat in-view
- [x] **3.8** **CTA:** dynamic `NodeNetwork` + dynamic-import GSAP/ScrollTrigger (bukan static top-level import)
- [x] **3.9** Pastikan home **tidak** memanggil `/api/public/*` pada load pertama (kecuali interaksi eksplisit)

---

## 4. Halaman Projects `/projects`

- [x] **4.1** `app/(public)/projects/page.tsx` async: server-fetch **all projects** (urutan/featured sama seperti API)
- [x] **4.2** Refactor `ProjectsPage` terima `initialData`; hapus `useProjects()` untuk first paint
- [x] **4.3** Dynamic `NodeNetwork` + reduced-motion
- [x] **4.4** Grid archive: lazy images; `priority` max 1–2 cover pertama
- [x] **4.5** Verifikasi HTML response sudah berisi judul/deskripsi project (View Source / disable JS)

---

## 5. Halaman About `/about`

### 5.A Data SSR — certificates

- [ ] **5.1** Server-fetch **pinned certificates** + **page 1 non-pinned** di `about/page.tsx`
- [ ] **5.2** Pass ke `<Certificates initialPinned initialNonPinned />`
- [ ] **5.3** **Load more** boleh tetap client → `/api/public/certificates?pinned=false&page=` (hanya setelah klik)
- [ ] **5.4** Hilangkan waterfall `usePinnedCertificates` + `useNonPinnedCertificates` pada mount

### 5.B Section / JS (tanpa data DB)

- [ ] **5.5** **AboutHero:** dynamic NodeNetwork + dynamic GSAP
- [ ] **5.6** **AboutIntro / CpuArchitecture:** lazy / in-view jika berat
- [ ] **5.7** **AboutTechStack:** pastikan icon lazy (sudah ada `loading="lazy"`) + image optimizer
- [ ] **5.8** **AboutTimeline:** dynamic-import GSAP/ScrollTrigger
- [ ] **5.9** **Certificates grid:** kurangi Framer berlebih; modal tetap client
- [ ] **5.10** **CTA** (shared): sama seperti home — dynamic heavy deps

---

## 6. Layout publik bersama

- [ ] **6.1** `app/(public)/layout.tsx` — gate CRT scanline/flicker dengan `prefers-reduced-motion` (atau kurangi opacity/animation)
- [ ] **6.2** `Navbar` / `Footer` — pastikan tidak memicu fetch data publik
- [ ] **6.3** Theme toggle: biarkan client; jangan block LCP
- [ ] **6.4** Fonts di `app/layout.tsx` — pastikan semua `display: 'swap'`; subset latin saja (sudah); cek tidak double-load

---

## 7. Shared UI / bundle

- [ ] **7.1** Satu modul `dynamic` helper untuk NodeNetwork (hindari copy-paste config beda-beda)
- [ ] **7.2** `GlitchText` — pastikan tidak memicu layout thrash di LCP heading; hormati reduced-motion
- [ ] **7.3** Kurangi `framer-motion` di `ProjectCard` / `CertificateCard` jika skor TBT masih jelek
- [ ] **7.4** Pasang `@next/bundle-analyzer`; catat top modules before/after
- [ ] **7.5** Pastikan tree-shaking: GSAP hanya di section yang butuh (no shared barrel yang menarik semua visual)

---

## 8. Caching & correctness setelah admin write

- [ ] **8.1** Setelah POST/PATCH/DELETE admin projects → invalidate tag `projects`
- [ ] **8.2** Sama untuk certificates → `certificates`
- [ ] **8.3** Sama untuk companies → `companies`
- [ ] **8.4** Smoke: ubah data di admin → halaman publik refresh dalam TTL / on-demand

---

## 9. API publik (tetap ada, peran mengecil)

- [ ] **9.1** Document di code: API untuk progressive enhancement / load-more, bukan SSR path
- [ ] **9.2** Pastikan response API tetap cocok dengan load-more certificates
- [ ] **9.3** Cache-Control headers pada `/api/public/*` (mis. `s-maxage` pendek) — opsional, selaras ISR

---

## 10. Verifikasi per halaman (definition of done)

### Home `/`

- [ ] **10.1** First HTML berisi companies + featured project titles (tanpa JS)
- [ ] **10.2** Tidak ada request `/api/public/companies` atau `/projects` pada cold load
- [ ] **10.3** LCP image lewat optimizer; Lighthouse mobile ↑ vs baseline

### `/projects`

- [ ] **10.4** First HTML berisi daftar project
- [ ] **10.5** Tidak ada `useProjects` waterfall pada mount
- [ ] **10.6** Lighthouse mobile ↑ vs baseline

### `/about`

- [ ] **10.7** First HTML berisi pinned certificates (judul/org minimal)
- [ ] **10.8** Load-more masih bekerja via API
- [ ] **10.9** Tidak ada double-fetch pinned+page1 pada mount
- [ ] **10.10** Lighthouse mobile ↑ vs baseline

### Global

- [ ] **10.11** `prefers-reduced-motion`: canvas/GSAP tidak jalan agresif
- [ ] **10.12** Tidak regress CLS signifikan (skeleton → content di SSR harus stabil tinggi)
- [ ] **10.13** `graphify update .` setelah perubahan struktural
- [ ] **10.14** Update skor akhir di PR + singkat di `docs/performance.md`

---

## Urutan eksekusi yang disarankan

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

## Mapping cepat: data publik → UI

| Data | Table | Digunakan di | Task SSR |
|------|-------|--------------|----------|
| Projects (featured) | `projects` | `/` Projects | 3.1–3.2 |
| Projects (all) | `projects` | `/projects` | 4.1–4.2 |
| Companies | `companies` | `/` Companies | 3.1–3.2 |
| Certificates pinned + page | `certificates` | `/about` Certificates | 5.1–5.4 |

Static/no-DB sections (tetap optimasi JS/images): Hero, Services visuals, About intro/timeline/tech, CTA, Nav, Footer.
