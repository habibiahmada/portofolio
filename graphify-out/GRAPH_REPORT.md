# Graph Report - portofolio-v2  (2026-08-25)

## Corpus Check
- 159 files · ~1,155,019 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1010 nodes · 1733 edges · 63 communities (55 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b3913215`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- fail
- navigation.tsx
- ADR: Blog Comments
- devDependencies
- certificates.tsx
- 🔒 Security Features Implemented
- blog/[slug]/page.tsx
- compilerOptions
- about/page.tsx
- components.json
- dependencies
- [id]/page.tsx
- 🔍 Analisis Komprehensif & "Roasting" UI/UX: habibiahmada.dev
- services.tsx
- QueryChain
- agent-blog.ts
- Blog system — architecture & decisions
- page-shell.tsx
- admin/layout.tsx
- portofolio-v2
- types.ts
- projects/[slug]/page.tsx
- node-network-lazy.tsx
- proxy.ts
- create-admin.ts
- cn
- next.config.mjs
- postcss.config.mjs
- Blog — task list
- next-env.d.ts
- projects-page.tsx
- Performance task list — public pages & data
- Performance optimization steering
- Architecture
- Agent tooling (token savings)
- Data and hosting
- Development
- Agent / contributor map
- (public)/page.tsx
- Documentation
- docs/README.md
- use-api.ts
- Ponytail
- pcb-background.tsx
- Ponytail Help
- Write blog post (portfolio)
- Write like you (portfolio voice)
- Performance optimization
- ponytail-audit/SKILL.md
- Ponytail Gain
- ponytail-review/SKILL.md
- Token economy
- ponytail-debt/SKILL.md
- admin/page.tsx
- about-timeline.tsx
- Blog Runbook — Quick Reference

## God Nodes (most connected - your core abstractions)
1. `ok()` - 39 edges
2. `fail()` - 39 edges
3. `🔍 Analisis Komprehensif & "Roasting" UI/UX: habibiahmada.dev` - 38 edges
4. `cn()` - 34 edges
5. `getSupabaseAdmin()` - 31 edges
6. `serverError()` - 28 edges
7. `withAdmin()` - 27 edges
8. `getSupabaseServerClient()` - 26 edges
9. `QueryChain` - 21 edges
10. `Blog system — architecture & decisions` - 18 edges

## Surprising Connections (you probably didn't know these)
- `CvModal()` --calls--> `cn()`  [EXTRACTED]
  components/ui/cv-modal.tsx → lib/utils.ts
- `PcbBackground()` --calls--> `cn()`  [EXTRACTED]
  components/ui/pcb-background.tsx → lib/utils.ts
- `QuickLink()` --calls--> `cn()`  [EXTRACTED]
  components/ui/project-card.tsx → lib/utils.ts
- `Skeleton()` --calls--> `cn()`  [EXTRACTED]
  components/ui/skeletons.tsx → lib/utils.ts
- `generateStaticParams()` --calls--> `getPublishedPosts`  [EXTRACTED]
  app/(public)/blog/[slug]/page.tsx → lib/data/blog.ts

## Import Cycles
- None detected.

## Communities (63 total, 8 thin omitted)

### Community 0 - "fail"
Cohesion: 0.06
Nodes (95): DELETE(), dynamic, GET(), handleDelete(), handleGet(), handlePatch(), PATCH(), runtime (+87 more)

### Community 1 - "navigation.tsx"
Cohesion: 0.27
Nodes (5): linkActive(), NAV_LINKS, Navbar(), Footer(), AnimatedThemeToggle()

### Community 2 - "ADR: Blog Comments"
Cohesion: 0.15
Nodes (12): Admin (`/admin/blog/[id]`), ADR: Blog Comments, Alternatives Considered, Context, Decision: Auth + Moderation Required, Phasing, Public (article page), Risks (+4 more)

### Community 3 - "devDependencies"
Cohesion: 0.06
Nodes (31): bun-types, @next/bundle-analyzer, devDependencies, bun-types, @next/bundle-analyzer, postcss, tailwindcss, @tailwindcss/postcss (+23 more)

### Community 4 - "certificates.tsx"
Cohesion: 0.31
Nodes (6): Certificates(), CertificateCard(), CertificateCardProps, CertificateModal(), CertificateModalProps, CertificateRow

### Community 5 - "🔒 Security Features Implemented"
Cohesion: 0.08
Nodes (26): 10. Database Security, 11. Agent Blog API (`POST /api/agent/blog`), 1. Authentication Methods, 2. Rate Limiting, 3. Password Security, 4. Input Validation, 5. Session Management, 6. Security Headers (Global) (+18 more)

### Community 6 - "blog/[slug]/page.tsx"
Cohesion: 0.05
Nodes (46): CATEGORY_COLORS, metadata, BlogPage(), BlogPageProps, CATEGORY_LABELS, categoryBadgeColor(), formatDate(), metadata (+38 more)

### Community 7 - "compilerOptions"
Cohesion: 0.06
Nodes (30): bun-types, dom, dom.iterable, esnext, .next/dev/dev/types/**/*.ts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts (+22 more)

### Community 8 - "about/page.tsx"
Cohesion: 0.07
Nodes (30): metadata, Page(), AboutIntro(), AboutTechStack(), row1, row2, Tech, techs (+22 more)

### Community 9 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 10 - "dependencies"
Cohesion: 0.05
Nodes (43): @base-ui/react, class-variance-authority, clsx, framer-motion, lucide-react, next-intl, next-themes, dependencies (+35 more)

### Community 11 - "[id]/page.tsx"
Cohesion: 0.50
Nodes (4): AdminBlogPostComments(), Comment, formatDate(), STATUS_COLORS

### Community 12 - "🔍 Analisis Komprehensif & "Roasting" UI/UX: habibiahmada.dev"
Cohesion: 0.05
Nodes (39): 10. Featured Projects: Grid Sempit, Depth Nihil, 11. Tidak Ada Halaman Case Study, 12. Services Section: Brochure Agensi Generik, 13. Spotlights / Press: Link-Out Tanpa Owned Narrative, 14. Social Proof Tanpa Testimonial, 15. CTA Penutup: Generik & Tanpa Friction Remover, 16. Hybrid Nav: Hash Anchors vs Multi-page, 17. Brand Naming Tidak Stabil (+31 more)

### Community 13 - "services.tsx"
Cohesion: 0.05
Nodes (28): metadata, CTA(), CTA, HomeBelowFold(), Services, Process(), STEPS, CARDS (+20 more)

### Community 14 - "QueryChain"
Cohesion: 0.09
Nodes (10): cloneDeep(), generateId(), MockSupabaseClient, QueryChain, resetMockStores(), resetStores(), ResolvedShape, stores (+2 more)

### Community 15 - "agent-blog.ts"
Cohesion: 0.12
Nodes (24): dynamic, POST(), runtime, serverFail(), AGENT_BLOG_MAX_BODY_BYTES, AgentBlogError, assertAgentBlogToken(), BODY_MD_MAX (+16 more)

### Community 16 - "Blog system — architecture & decisions"
Cohesion: 0.07
Nodes (27): 10. Cost & resource model, 11. Security, 12. Public UX (minimal), 13. Phasing summary, 14. Risks & mitigations, 15. Acceptance criteria (MVP = phase 1 done), 16. Related docs, 17. Locked decisions (phase 0) (+19 more)

### Community 17 - "page-shell.tsx"
Cohesion: 0.17
Nodes (7): NAV_LINKS, SOCIAL_LINKS, PAGE_PAD, PAGE_SHELL, PAGE_SHELL_WIDE, PageShell(), PageShellProps

### Community 18 - "admin/layout.tsx"
Cohesion: 0.40
Nodes (3): AdminShell(), NAV_ITEMS, metadata

### Community 19 - "portofolio-v2"
Cohesion: 0.40
Nodes (4): Built with v0, Getting Started, Learn More, portofolio-v2

### Community 20 - "types.ts"
Cohesion: 0.11
Nodes (14): AdminBlog(), CATEGORY_LABELS, formatDate(), STATUS_COLORS, getSupabaseClient(), makeClient(), AllowedUserRow, BlogPost (+6 more)

### Community 21 - "projects/[slug]/page.tsx"
Cohesion: 0.06
Nodes (54): geistMono, geistSans, metadata, spaceGrotesk, viewport, ASIDE_BY_SLUG, catalogFromStatic(), CatalogProject (+46 more)

### Community 22 - "node-network-lazy.tsx"
Cohesion: 0.15
Nodes (12): AboutHero(), CvModal, HeroSection(), CV_PAGES, CvModal(), CvModalProps, GlitchText(), GlitchTextProps (+4 more)

### Community 25 - "cn"
Cohesion: 0.27
Nodes (8): Button(), buttonVariants, ProjectLinks(), ProjectLinksProps, ProjectTag(), ProjectTagProps, WavyBackground(), cn()

### Community 29 - "Blog — task list"
Cohesion: 0.12
Nodes (16): 0. Documentation & alignment, 10. Phase 2 — reactions + admin UI (after MVP), 11. Phase 3 — cover images (optional), 12. Phase 4 — comments (explicit gate), 1. Database & types (portfolio), 2. Security & agent API, 3. Admin moderation API (no UI yet), 4. Public pages & SEO (+8 more)

### Community 31 - "projects-page.tsx"
Cohesion: 0.17
Nodes (10): metadata, ProjectsPage(), ProjectsPageProps, Projects(), ProjectsProps, CompanyLogoSkeleton(), ProjectGridSkeleton(), Skeleton() (+2 more)

### Community 33 - "Performance task list — public pages & data"
Cohesion: 0.09
Nodes (22): 0. Baseline (sebelum ubah kode), 10. Verifikasi per halaman (definition of done), 1. Image pipeline (global — kerjakan dulu), 2. Data layer server (shared), 3.A Data SSR, 3.B Section / JS, 3. Halaman Home `/`, 4. Halaman Projects `/projects` (+14 more)

### Community 34 - "Performance optimization steering"
Cohesion: 0.11
Nodes (19): 0.1 Lighthouse mobile (primary), 0.2 Desktop lab (same capture day — referensi PSI/produksi), 0.3 Network waterfall — `/api/public/*` (client after hydrate), 0.4 LCP-related image sizes (transfer), Acceptance criteria, Appendix — Baseline (2026-07-28, production), Baseline problems (as of steering date), Caching (+11 more)

### Community 35 - "Architecture"
Cohesion: 0.18
Nodes (11): Admin mutation, Architecture, Auth, Directory map, Key symbols (from graphify), Planned: blog + agent publisher, Public page (current), Purpose (+3 more)

### Community 36 - "Agent tooling (token savings)"
Cohesion: 0.29
Nodes (7): Agent tooling (token savings), AGENTS.md, Always-on rules, Graphify, Install / refresh (maintainers), Ponytail, Project skills

### Community 37 - "Data and hosting"
Cohesion: 0.25
Nodes (8): Auth & admin, Backup / migration, CLI notes, Data and hosting, Database (Supabase / PostgreSQL), Deploy notes, Environment, Hosting

### Community 38 - "Development"
Cohesion: 0.25
Nodes (7): Code conventions, Design notes, Development, Prerequisites, Scripts, Setup, Tests

### Community 39 - "Agent / contributor map"
Cohesion: 0.40
Nodes (5): Agent / contributor map, Always-on rules (`.cursor/rules/`), Before exploring code, Commands, Do not

### Community 41 - "(public)/page.tsx"
Cohesion: 0.16
Nodes (15): GET(), base, Home(), metadata, ProjectsPageRoute(), FEATURES, Press(), FEATURED_PROJECT_IDS (+7 more)

### Community 44 - "use-api.ts"
Cohesion: 0.21
Nodes (12): Companies(), CompaniesProps, fetchApi(), useApi(), UseApiResult, useAuthUser(), useCertificates(), useCompanies() (+4 more)

### Community 46 - "Ponytail"
Cohesion: 0.22
Nodes (8): Boundaries, Intensity, Output, Persistence, Ponytail, Rules, The ladder, When NOT to be lazy

### Community 47 - "pcb-background.tsx"
Cohesion: 0.25
Nodes (7): ACCENT, LAYERS, PcbBackground(), PcbBackgroundProps, TIMING, TRACES, VIAS

### Community 48 - "Ponytail Help"
Cohesion: 0.25
Nodes (7): Configure Default Mode, Deactivate, Levels, More, Ponytail Help, Skills, Update

### Community 49 - "Write blog post (portfolio)"
Cohesion: 0.25
Nodes (7): Article structure, Category allowlist, Hard rules, Self-check before handoff, SEO fields (required when producing a publish payload), Voice, Write blog post (portfolio)

### Community 50 - "Write like you (portfolio voice)"
Cohesion: 0.25
Nodes (7): Audience Profile, Business Context, Case study template (required sections), Hard rules (always), Voice DNA, Workflow, Write like you (portfolio voice)

### Community 51 - "Performance optimization"
Cohesion: 0.33
Nodes (5): Checklist (copy and track), Done when, Out of scope, Patterns, Performance optimization

### Community 52 - "ponytail-audit/SKILL.md"
Cohesion: 0.40
Nodes (4): Boundaries, Hunt, Output, Tags

### Community 53 - "Ponytail Gain"
Cohesion: 0.40
Nodes (4): Boundaries, Honesty boundary, Ponytail Gain, Scoreboard

### Community 54 - "ponytail-review/SKILL.md"
Cohesion: 0.40
Nodes (4): Boundaries, Examples, Format, Scoring

### Community 55 - "Token economy"
Cohesion: 0.40
Nodes (4): Always, Anti-patterns, Skills that compound savings, Token economy

### Community 56 - "ponytail-debt/SKILL.md"
Cohesion: 0.50
Nodes (3): Boundaries, Output, Scan

### Community 63 - "about-timeline.tsx"
Cohesion: 0.31
Nodes (7): AboutTimeline(), Entry, ExperienceItem(), groupByYear(), monthLabel(), periodLabel(), timelineData

### Community 64 - "Blog Runbook — Quick Reference"
Cohesion: 0.25
Nodes (7): Blog Runbook — Quick Reference, Check Agent-Hub Logs, Check Daily Quota, Emergency: Stop Agent Publishing, Rotate AGENT_BLOG_TOKEN, Unpublish a Bad Post, Verify Blog is Live

## Knowledge Gaps
- **444 isolated node(s):** `metadata`, `CATEGORY_LABELS`, `BlogDetailPageProps`, `metadata`, `CATEGORY_LABELS` (+439 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `navigation.tsx`, `certificates.tsx`, `about/page.tsx`, `pcb-background.tsx`, `page-shell.tsx`, `admin/layout.tsx`, `projects/[slug]/page.tsx`, `node-network-lazy.tsx`, `projects-page.tsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `PageShell()` connect `page-shell.tsx` to `certificates.tsx`, `blog/[slug]/page.tsx`, `(public)/page.tsx`, `use-api.ts`, `services.tsx`, `cn`, `projects-page.tsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `metadata`, `CATEGORY_LABELS`, `BlogDetailPageProps` to the rest of the system?**
  _444 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `fail` be split into smaller, more focused modules?**
  _Cohesion score 0.05537190082644628 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `🔒 Security Features Implemented` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `blog/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05017921146953405 - nodes in this community are weakly interconnected._