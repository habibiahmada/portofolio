# Graph Report - portofolio  (2026-08-28)

## Corpus Check
- 172 files · ~1,159,537 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1085 nodes · 1921 edges · 74 communities (65 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5660cdc4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ok
- footer.tsx
- ADR: Blog Comments
- devDependencies
- blog/[slug]/page.tsx
- 🔒 Security Features Implemented
- about/page.tsx
- compilerOptions
- cpu-architecture.tsx
- components.json
- dependencies
- [id]/page.tsx
- 🔍 Analisis Komprehensif & "Roasting" UI/UX: habibiahmada.dev
- services.tsx
- QueryChain
- agent-blog.ts
- Blog system — architecture & decisions
- (public)/page.tsx
- site-metadata.ts
- portofolio-v2
- types.ts
- projects/[slug]/page.tsx
- cn
- proxy.ts
- create-admin.ts
- companies.tsx
- next.config.mjs
- postcss.config.mjs
- Done — completed work
- next-env.d.ts
- projects-page.tsx
- Performance task list — public pages & data
- Performance optimization steering
- Architecture
- Agent tooling (token savings)
- Data and hosting
- Development
- Agent / contributor map
- app/layout.tsx
- data/projects.ts
- Documentation
- docs/README.md
- use-api.ts
- case-studies.ts
- Ponytail
- json-ld.tsx
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
- node-graph-visual.tsx
- about-timeline.tsx
- Blog Runbook — Quick Reference
- admin/blog/page.tsx
- getProjectTitle
- services/page.tsx
- cta.tsx
- code-editor-visual.tsx
- comment-section.tsx
- lib/projects.ts
- reaction-buttons.tsx

## God Nodes (most connected - your core abstractions)
1. `ok()` - 45 edges
2. `fail()` - 44 edges
3. `getSupabaseAdmin()` - 38 edges
4. `🔍 Analisis Komprehensif & "Roasting" UI/UX: habibiahmada.dev` - 38 edges
5. `cn()` - 34 edges
6. `serverError()` - 28 edges
7. `withAdmin()` - 27 edges
8. `getSupabaseServerClient()` - 26 edges
9. `getClientIp()` - 21 edges
10. `QueryChain` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Skeleton()` --calls--> `cn()`  [EXTRACTED]
  components/ui/skeletons.tsx → lib/utils.ts
- `generateStaticParams()` --calls--> `getPublishedPosts`  [EXTRACTED]
  app/(public)/blog/[slug]/page.tsx → lib/data/blog.ts
- `resolveCatalog()` --calls--> `getProjectById()`  [EXTRACTED]
  app/(public)/projects/[slug]/page.tsx → lib/data/projects.ts
- `generateStaticParams()` --calls--> `getCaseStudySlugs()`  [EXTRACTED]
  app/(public)/projects/[slug]/page.tsx → lib/data/case-studies.ts
- `ProjectsPageRoute()` --calls--> `getProjects()`  [EXTRACTED]
  app/(public)/projects/page.tsx → lib/data/projects.ts

## Import Cycles
- None detected.

## Communities (74 total, 9 thin omitted)

### Community 0 - "ok"
Cohesion: 0.06
Nodes (93): DELETE(), dynamic, GET(), handleDelete(), handleGet(), handlePatch(), PATCH(), runtime (+85 more)

### Community 1 - "footer.tsx"
Cohesion: 0.15
Nodes (7): linkActive(), NAV_LINKS, Navbar(), Footer(), NAV_LINKS, SOCIAL_LINKS, AnimatedThemeToggle()

### Community 2 - "ADR: Blog Comments"
Cohesion: 0.17
Nodes (12): Admin (`/admin/blog/[id]`), ADR: Blog Comments, Alternatives Considered, Context, Decision: Auth + Moderation Required, Phasing, Public (article page), Risks (+4 more)

### Community 3 - "devDependencies"
Cohesion: 0.06
Nodes (34): bun-types, @next/bundle-analyzer, allowScripts, @parcel/watcher@2.6.0, @swc/core@1.15.47, devDependencies, bun-types, @next/bundle-analyzer (+26 more)

### Community 4 - "blog/[slug]/page.tsx"
Cohesion: 0.09
Nodes (36): BlogPreviewPage(), CATEGORY_LABELS, dynamic, generateMetadata(), robots, BlogDetailPage(), BlogDetailPageProps, CATEGORY_LABELS (+28 more)

### Community 5 - "🔒 Security Features Implemented"
Cohesion: 0.08
Nodes (26): 10. Database Security, 11. Agent Blog API (`POST /api/agent/blog`), 1. Authentication Methods, 2. Rate Limiting, 3. Password Security, 4. Input Validation, 5. Session Management, 6. Security Headers (Global) (+18 more)

### Community 6 - "about/page.tsx"
Cohesion: 0.08
Nodes (34): GET(), metadata, Page(), BlogPage(), BlogPageProps, CATEGORY_LABELS, categoryBadgeColor(), formatDate() (+26 more)

### Community 7 - "compilerOptions"
Cohesion: 0.06
Nodes (30): bun-types, dom, dom.iterable, esnext, .next/dev/dev/types/**/*.ts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts (+22 more)

### Community 8 - "cpu-architecture.tsx"
Cohesion: 0.12
Nodes (17): AboutIntro(), BOT_ENDS, BOT_PINS, buildCometKeyframes(), buildTextKeyframes(), COMET_COLORS, CpuArchitecture(), CpuArchitectureSvgProps (+9 more)

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
Cohesion: 0.12
Nodes (10): CARDS, CICDPipelineVisual, LayoutDesignerVisual, SpeedometerGaugeVisual, LOGS, STAGES, DEVICES, DeviceType (+2 more)

### Community 14 - "QueryChain"
Cohesion: 0.09
Nodes (11): cloneDeep(), createMockSupabaseClient(), generateId(), MockSupabaseClient, QueryChain, resetMockStores(), resetStores(), ResolvedShape (+3 more)

### Community 15 - "agent-blog.ts"
Cohesion: 0.09
Nodes (38): dynamic, POST(), runtime, dynamic, POST(), runtime, AGENT_BLOG_MAX_BODY_BYTES, AgentBlogError (+30 more)

### Community 16 - "Blog system — architecture & decisions"
Cohesion: 0.07
Nodes (27): 10. Cost & resource model, 11. Security, 12. Public UX (minimal), 13. Phasing summary, 14. Risks & mitigations, 15. Acceptance criteria (MVP = phase 1 done), 16. Related docs, 17. Locked decisions (phase 0) (+19 more)

### Community 17 - "(public)/page.tsx"
Cohesion: 0.27
Nodes (8): base, Home(), metadata, FEATURES, Press(), PageShell(), getCompanies, getFeaturedProjects()

### Community 18 - "site-metadata.ts"
Cohesion: 0.19
Nodes (6): CATEGORY_COLORS, metadata, IDENTITY_KEYWORDS, PageMetaInput, SITE, SITE_COPY

### Community 19 - "portofolio-v2"
Cohesion: 0.40
Nodes (4): Built with v0, Getting Started, Learn More, portofolio-v2

### Community 20 - "types.ts"
Cohesion: 0.11
Nodes (13): getSupabaseClient(), makeClient(), AllowedUserRow, BlogComment, BlogCommentRow, BlogCommentStatus, BlogPost, BlogReaction (+5 more)

### Community 21 - "projects/[slug]/page.tsx"
Cohesion: 0.15
Nodes (17): ASIDE_BY_SLUG, CatalogProject, DEFAULT_HOOKS, generateMetadata(), hooksFor(), ProjectDetailPage(), Props, StackIcons() (+9 more)

### Community 22 - "cn"
Cohesion: 0.05
Nodes (44): AdminShell(), NAV_ITEMS, metadata, AboutHero(), Certificates(), CvModal, HeroSection(), Button() (+36 more)

### Community 25 - "companies.tsx"
Cohesion: 0.20
Nodes (4): CompaniesProps, CompanyLogoSkeleton(), Skeleton(), Company

### Community 29 - "Done — completed work"
Cohesion: 0.09
Nodes (22): 0. Documentation & alignment, 10. Reactions + admin UI, 11. Cover images (code), 12. Comments, 1. Database & types (portfolio), 2. Security & agent API, 3. Admin moderation API, 4. Public pages & SEO (+14 more)

### Community 31 - "projects-page.tsx"
Cohesion: 0.39
Nodes (7): ProjectsPage(), ProjectsPageProps, Projects(), ProjectsProps, ProjectGridSkeleton(), useProjects(), Project

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

### Community 40 - "app/layout.tsx"
Cohesion: 0.20
Nodes (8): geistMono, geistSans, metadata, spaceGrotesk, viewport, JsonLd(), rootMetadata, ThemeProvider()

### Community 41 - "data/projects.ts"
Cohesion: 0.22
Nodes (11): GET(), metadata, ProjectsPageRoute(), FEATURED_PROJECT_IDS, getAllProjects, getProjectById(), getProjects(), PaginatedProjects (+3 more)

### Community 44 - "use-api.ts"
Cohesion: 0.33
Nodes (9): fetchApi(), useApi(), UseApiResult, useAuthUser(), useCertificates(), useCompanies(), useNonPinnedCertificates(), usePinnedCertificates() (+1 more)

### Community 45 - "case-studies.ts"
Cohesion: 0.24
Nodes (9): generateStaticParams(), sitemap(), bySlug, CASE_STUDIES, CaseStudy, getCaseStudySlugs(), getLinkedCaseStudies(), published (+1 more)

### Community 46 - "Ponytail"
Cohesion: 0.22
Nodes (8): Boundaries, Intensity, Output, Persistence, Ponytail, Rules, The ladder, When NOT to be lazy

### Community 47 - "json-ld.tsx"
Cohesion: 0.20
Nodes (10): allSchemas, BlogJsonLd(), breadcrumbSchema, personSchema, professionalServiceSchema, ProjectJsonLd(), projectListSchema, serviceSchemas (+2 more)

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

### Community 62 - "node-graph-visual.tsx"
Cohesion: 0.22
Nodes (7): NodeGraphVisual, EDGES, FLOW, NODE_MAP, NodeId, NODES, Step

### Community 63 - "about-timeline.tsx"
Cohesion: 0.27
Nodes (8): AboutTimeline(), Entry, ExperienceItem(), groupByYear(), monthLabel(), periodLabel(), timelineData, Companies()

### Community 64 - "Blog Runbook — Quick Reference"
Cohesion: 0.17
Nodes (12): Apply preview/review migration, Blog Runbook — Quick Reference, Check Agent-Hub Logs, Check Daily Quota, Comment moderation (daily plan), Create Storage bucket `blog-covers` (one-time), Emergency: Stop Agent Publishing, Rotate AGENT_BLOG_TOKEN (+4 more)

### Community 65 - "admin/blog/page.tsx"
Cohesion: 0.33
Nodes (6): AdminBlog(), CATEGORY_LABELS, formatDate(), STATUS_COLORS, BlogPostRow, BlogStatus

### Community 66 - "getProjectTitle"
Cohesion: 0.38
Nodes (7): catalogFromStatic(), displayTitle(), neighborTitle(), resolveCatalog(), projectDisplayTitle(), workExamples, getProjectTitle()

### Community 67 - "services/page.tsx"
Cohesion: 0.33
Nodes (4): metadata, Process(), STEPS, Services()

### Community 68 - "cta.tsx"
Cohesion: 0.33
Nodes (4): CTA(), CTA, HomeBelowFold(), Services

### Community 69 - "code-editor-visual.tsx"
Cohesion: 0.40
Nodes (3): CodeEditorVisual, COLOR, LINES

### Community 70 - "comment-section.tsx"
Cohesion: 0.50
Nodes (4): Comment, CommentSection(), CommentSectionProps, formatDate()

### Community 71 - "lib/projects.ts"
Cohesion: 0.40
Nodes (4): ProjectCardProps, EASING, Project, projects

## Knowledge Gaps
- **470 isolated node(s):** `metadata`, `CATEGORY_LABELS`, `BlogDetailPageProps`, `metadata`, `CATEGORY_LABELS` (+465 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `footer.tsx`, `cpu-architecture.tsx`, `(public)/page.tsx`, `projects/[slug]/page.tsx`, `companies.tsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `PageShell()` connect `(public)/page.tsx` to `footer.tsx`, `services/page.tsx`, `blog/[slug]/page.tsx`, `cta.tsx`, `about/page.tsx`, `services.tsx`, `projects/[slug]/page.tsx`, `cn`, `companies.tsx`, `projects-page.tsx`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `metadata`, `CATEGORY_LABELS`, `BlogDetailPageProps` to the rest of the system?**
  _470 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ok` be split into smaller, more focused modules?**
  _Cohesion score 0.05794582065768506 - nodes in this community are weakly interconnected._
- **Should `footer.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14705882352941177 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `blog/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08788159111933395 - nodes in this community are weakly interconnected._