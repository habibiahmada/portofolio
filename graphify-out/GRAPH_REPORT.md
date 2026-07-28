# Graph Report - portofolio-v2  (2026-07-28)

## Corpus Check
- 118 files · ~1,096,094 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 608 nodes · 1005 edges · 43 communities (35 shown, 8 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d9df2c84`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]

## God Nodes (most connected - your core abstractions)
1. `getSupabaseServerClient()` - 32 edges
2. `cn()` - 30 edges
3. `serverError()` - 26 edges
4. `ok()` - 24 edges
5. `fail()` - 22 edges
6. `withAdmin()` - 17 edges
7. `QueryChain` - 17 edges
8. `compilerOptions` - 17 edges
9. `getSupabaseAdmin()` - 14 edges
10. `Performance task list — public pages & data` - 14 edges

## Surprising Connections (you probably didn't know these)
- `ProjectsPageRoute()` --calls--> `getProjects()`  [INFERRED]
  app/(public)/projects/page.tsx → lib/data/projects.ts
- `GET()` --calls--> `withAdmin()`  [INFERRED]
  app/api/admin/certificates/route.ts → lib/supabase/admin-auth.ts
- `POST()` --calls--> `withAdmin()`  [INFERRED]
  app/api/admin/certificates/route.ts → lib/supabase/admin-auth.ts
- `PATCH()` --calls--> `withAdmin()`  [INFERRED]
  app/api/admin/certificates/route.ts → lib/supabase/admin-auth.ts
- `DELETE()` --calls--> `withAdmin()`  [INFERRED]
  app/api/admin/certificates/route.ts → lib/supabase/admin-auth.ts

## Import Cycles
- None detected.

## Communities (43 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (58): GET(), GET(), GET(), GET(), GET(), GET(), GET(), DELETE() (+50 more)

### Community 1 - "Community 1"
Cohesion: 0.15
Nodes (6): NAV_LINKS, Navbar(), Footer(), NAV_LINKS, SOCIAL_LINKS, AnimatedThemeToggle()

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (41): AdminLayout(), NAV_ITEMS, useNonPinnedCertificates(), usePinnedCertificates(), EASING, getProjectDescription(), getProjectTitle(), Project (+33 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (40): dependencies, @base-ui/react, class-variance-authority, clsx, framer-motion, gsap, lucide-react, next (+32 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (21): useApi(), UseApiResult, useAuthUser(), useCertificates(), useCompanies(), AboutTimeline(), formatDate(), isOngoing() (+13 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (25): 10. Database Security, 1. Authentication Methods, 2. Rate Limiting, 3. Password Security, 4. Input Validation, 5. Session Management, 6. Security Headers (Global), 7. Error Handling (+17 more)

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (8): cloneDeep(), createMockSupabaseClient(), generateId(), MockSupabaseClient, QueryChain, resetStores(), ResolvedShape, stores

### Community 7 - "Community 7"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+12 more)

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (21): CARDS, Services(), CICDPipelineVisual(), LOGS, STAGES, CodeEditorVisual(), COLOR, LINES (+13 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 10 - "Community 10"
Cohesion: 0.07
Nodes (32): metadata, Page(), getAllCertificates, getCertificates(), getNonPinnedCertificates(), getPinnedCertificates(), PaginatedCertificates, AboutHero() (+24 more)

### Community 11 - "Community 11"
Cohesion: 0.11
Nodes (29): queryAllCertificates(), getCompanies, queryAllCompanies(), DATA_TAGS, FEATURED_PROJECT_IDS, getAllProjects, getFeaturedProjects(), getProjects() (+21 more)

### Community 12 - "Community 12"
Cohesion: 0.15
Nodes (12): geistMono, geistSans, spaceGrotesk, viewport, allSchemas, breadcrumbSchema, JsonLd(), localBusinessSchema (+4 more)

### Community 14 - "Community 14"
Cohesion: 0.22
Nodes (8): Boundaries, Intensity, Output, Persistence, Ponytail, Rules, The ladder, When NOT to be lazy

### Community 15 - "Community 15"
Cohesion: 0.25
Nodes (7): Configure Default Mode, Deactivate, Levels, More, Ponytail Help, Skills, Update

### Community 16 - "Community 16"
Cohesion: 0.40
Nodes (4): Boundaries, Hunt, Output, Tags

### Community 17 - "Community 17"
Cohesion: 0.40
Nodes (4): Boundaries, Honesty boundary, Ponytail Gain, Scoreboard

### Community 18 - "Community 18"
Cohesion: 0.40
Nodes (4): Boundaries, Examples, Format, Scoring

### Community 19 - "Community 19"
Cohesion: 0.40
Nodes (4): Built with v0, Getting Started, Learn More, portofolio-v2

### Community 20 - "Community 20"
Cohesion: 0.50
Nodes (3): Boundaries, Output, Scan

### Community 33 - "Community 33"
Cohesion: 0.09
Nodes (22): 0. Baseline (sebelum ubah kode), 10. Verifikasi per halaman (definition of done), 1. Image pipeline (global — kerjakan dulu), 2. Data layer server (shared), 3.A Data SSR, 3.B Section / JS, 3. Halaman Home `/`, 4. Halaman Projects `/projects` (+14 more)

### Community 34 - "Community 34"
Cohesion: 0.10
Nodes (19): 0.1 Lighthouse mobile (primary), 0.2 Desktop lab (same capture day — referensi PSI/produksi), 0.3 Network waterfall — `/api/public/*` (client after hydrate), 0.4 LCP-related image sizes (transfer), Acceptance criteria, Appendix — Baseline (2026-07-28, production), Baseline problems (as of steering date), Caching (+11 more)

### Community 35 - "Community 35"
Cohesion: 0.18
Nodes (10): Admin mutation, Architecture, Auth, Directory map, Key symbols (from graphify), Public page (current), Purpose, Request flows (+2 more)

### Community 36 - "Community 36"
Cohesion: 0.25
Nodes (7): Agent tooling (token savings), AGENTS.md, Always-on rules, Graphify, Install / refresh (maintainers), Ponytail, Project skills

### Community 37 - "Community 37"
Cohesion: 0.22
Nodes (8): Auth & admin, Backup / migration, CLI notes, Data and hosting, Database (Supabase / PostgreSQL), Deploy notes, Environment, Hosting

### Community 38 - "Community 38"
Cohesion: 0.25
Nodes (7): Code conventions, Design notes, Development, Prerequisites, Scripts, Setup, Tests

### Community 39 - "Community 39"
Cohesion: 0.33
Nodes (5): Agent / contributor map, Always-on rules (`.cursor/rules/`), Before exploring code, Commands, Do not

### Community 40 - "Community 40"
Cohesion: 0.33
Nodes (5): Checklist (copy and track), Done when, Out of scope, Patterns, Performance optimization

### Community 41 - "Community 41"
Cohesion: 0.40
Nodes (4): Always, Anti-patterns, Skills that compound savings, Token economy

## Knowledge Gaps
- **273 isolated node(s):** `metadata`, `metadata`, `metadata`, `NAV_ITEMS`, `Stats` (+268 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 2` to `Community 10`, `Community 11`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `GlitchText()` connect `Community 11` to `Community 8`, `Community 1`, `Community 2`, `Community 4`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `getSupabaseServerClient()` (e.g. with `GET()` and `GET()`) actually correct?**
  _`getSupabaseServerClient()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `serverError()` (e.g. with `GET()` and `GET()`) actually correct?**
  _`serverError()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `metadata`, `metadata`, `metadata` to the rest of the system?**
  _273 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08920027341079972 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.061952074810052604 - nodes in this community are weakly interconnected._