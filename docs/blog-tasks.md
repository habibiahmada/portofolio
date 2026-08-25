# Blog — task list

Implementation checklist. **Open items first; completed work below.**

**Steering:** [blog.md](./blog.md) (architecture & resource decisions).  
**Language:** English only (docs, UI copy, post bodies).  
**Runbook:** [blog-runbook.md](./blog-runbook.md)

---

## Open — do these next

### Ops (manual)

- [ ] **Apply migration** `20260825160000_blog_preview_review.sql` on Supabase (preview_token + review_deadline_at)
- [ ] **Register Telegram topic:** in the Blog forum topic run `/register_topic portfolio_blog_ops`
- [ ] Ensure gateway + scheduler env have `PORTFOLIO_URL` + `AGENT_BLOG_TOKEN` (needed for Approve/Reject callbacks)
- [ ] Merge agent-hub `develop` → deploy branch (`main` if EC2 deploys from main) and redeploy

### Acceptance (manual)

- [ ] **9.4** Manual: one post on `/blog`, sitemap, OG, share
- [ ] **9.5** Lighthouse spot-check `/blog` mobile (no severe regression vs home)
- [ ] **9.6** Check all acceptance criteria in [blog.md](./blog.md) §15

### Optional / deferred

- [ ] **11.1** Create Supabase Storage bucket `blog-covers` (public) — steps in [blog-runbook.md](./blog-runbook.md)

---

## Done — completed work

### Review / Telegram queue (draft → preview → approve)

- [x] **10.5** Agent default → `draft` + `preview_token` + `review_deadline_at`
- [x] Preview page `/blog/preview/[token]` (noindex) + robots disallow
- [x] `POST /api/agent/blog/review` + `POST /api/agent/blog/auto-publish`
- [x] Queue in Obsidian vault (`08-Blog/Queue.md` + `Published.md`) + gateway skill `portfolio_blog_ops`
- [x] Scheduler notifies draft with Approve/Reject; auto-publish reports public URL → vault

### Ops (manual)

- [x] **8.3** Set `AGENT_BLOG_TOKEN` in Vercel Production (+ Preview if needed)
- [x] **8.4** Set token + site URL in agent-hub secrets/env

### 0. Documentation & alignment

- [x] **0.1** Write `docs/blog.md` (architecture, ADR, cost, security, phasing)
- [x] **0.2** Write `docs/blog-tasks.md` (this checklist)
- [x] **0.3** Index in `docs/README.md` + `docs/steering.md` (+ `architecture.md`, `AGENTS.md`)
- [x] **0.4** Lock decisions: locale default **`en`**, final categories, quota timezone **Asia/Jakarta** (see blog.md §17)
- [x] **0.5** Record planned agent-hub skill `portfolio_blog` in `agent-hub/docs/feature-status.md` (link back to porto `blog.md`)
- [x] **0.6** Cursor skill `write-blog-post` (news structure + no em dash + SEO meta; uses Voice DNA from `write-like-you`)

### 1. Database & types (portfolio)

- [x] **1.1** SQL migration: `blog_posts` per blog.md §6 (indexes + CHECK status/category allowlist)
- [x] **1.2** RLS: public `SELECT` only `status = 'published'`; no public INSERT/UPDATE/DELETE
- [x] **1.3** Apply migration to linked project (`supabase` CLI / dashboard) + `migration repair` if needed
- [x] **1.4** Update `lib/supabase/types.ts` (`BlogPostRow`, Database tables)
- [x] **1.5** `DATA_TAGS.blog` + revalidate seconds in `lib/data/constants.ts`
- [x] **1.6** Server helpers `lib/data/blog.ts`: `getPublishedPosts`, `getPostBySlug`, `getPostsByCategory` (anon client, cache tags; **not** client hooks for first paint)

### 2. Security & agent API

- [x] **2.1** Env `AGENT_BLOG_TOKEN` in `.env.example` (placeholder) + `SECURITY.md` section
- [x] **2.2** Helper `assertAgentBlogToken(request)` (timing-safe) + payload size limit
- [x] **2.3** `POST /api/agent/blog`: schema validation (zod or manual, match repo style)
- [x] **2.4** Daily quota Asia/Jakarta (1 published create / day from `source=agent`)
- [x] **2.5** Reject title/description/body containing em dash `—` (400 + clear message)
- [x] **2.6** Slug: normalize kebab-case; **409** on conflict
- [x] **2.7** Insert via `getSupabaseAdmin()`; set `published_at`, `reading_time_minutes`, `source=agent`, `locale=en`
- [x] **2.8** `revalidateTag(DATA_TAGS.blog)` after successful create
- [x] **2.9** Extra IP rate limit (reuse `lib/security.ts` pattern)
- [x] **2.10** Tests: bad token → 401; quota → 429; valid → 201 + URL (`tests/agent-blog.test.ts`)

### 3. Admin moderation API

- [x] **3.1** `GET /api/admin/blog` — list all statuses (`withAdmin`)
- [x] **3.2** `PATCH /api/admin/blog` — `status` draft/published/archived; edit title/slug/meta
- [x] **3.3** `DELETE /api/admin/blog?id=` — prefer **archive-only** over hard delete unless needed
- [x] **3.4** Revalidate tag after mutations

### 4. Public pages & SEO

- [x] **4.1** `app/(public)/blog/page.tsx` — RSC list + optional `?category=`
- [x] **4.2** `app/(public)/blog/[slug]/page.tsx` — RSC detail + Markdown render (sanitize)
- [x] **4.3** `generateMetadata` per slug (title, description, canonical, OG/Twitter)
- [x] **4.4** JSON-LD `BlogPosting` on detail page (existing Person author)
- [x] **4.5** Update `app/sitemap.ts`: `/blog` + published slugs (`lastModified` from DB)
- [x] **4.6** Confirm `robots.ts` does not block `/blog`
- [x] **4.7** Nav + footer Blog link
- [x] **4.8** Share UI: copy link + Web Share (no API)
- [x] **4.9** Empty state on `/blog` when 0 posts
- [x] **4.10** Verify View Source: title/excerpt present without JS

### 5. OG image (no Storage)

- [x] **5.1** `GET /api/og/blog` (or per-slug `opengraph-image`) via `ImageResponse`
- [x] **5.2** Input: title (+ category); PNG output; sensible cache headers
- [x] **5.3** Wire `og:image` in article metadata
- [x] **5.4** Keep fonts/assets light

### 6. Markdown & content rules

- [x] **6.1** Minimal render stack (`react-markdown` + `remark-gfm` only if needed)
- [x] **6.2** Sanitize: no dangerous raw HTML; https-only images
- [x] **6.3** Article typography (prose) matching theme; no new design system
- [x] **6.4** Enforce content rules via `write-blog-post` + agent-hub prompt

### 7. Agent-hub integration (repo `agent-hub`)

- [x] **7.1** Skill/config `portfolio_blog` (1×/day, one-shot)
- [x] **7.2** Prompt: category rotation + news structure + SEO JSON fields (English)
- [x] **7.3** Local validator before POST (length, em dash, category allowlist)
- [x] **7.4** HTTP client to `POST {PORTFOLIO_URL}/api/agent/blog` (env base URL + token)
- [x] **7.5** Daily dedup / lock under `data/` (avoid double post on retry)
- [x] **7.6** Concise Telegram system_logs (success: slug URL; failure: status code)
- [x] **7.7** `DRY_RUN=1` support
- [x] **7.8** Smoke test script (mock or staging)

### 8. Observability & ops (code)

- [x] **8.1** Server log creates without leaking token (`[BLOG_AGENT] created slug=...`)
- [x] **8.2** Update `docs/data-and-hosting.md`: `blog_posts` table, new env
- [x] **8.5** Short runbook: rotate token, unpublish bad post, check quota

### 9. Tests (automated)

- [x] **9.1** Unit/integration: validation (em dash, category, slug)
- [x] **9.2** Quota test (two creates same calendar day → 429)
- [x] **9.3** Auth test (missing/wrong token)

### 10. Reactions + admin UI

- [x] **10.1** Migration `blog_reactions` + `reaction_counts` updates
- [x] **10.2** `POST /api/public/blog/[id]/react` + rate limit + visitor_key
- [x] **10.3** Reaction UI on article page
- [x] **10.4** `/admin/blog` list + unpublish/edit basics

### 11. Cover images (code)

- [x] **11.2** Upload path with max size (e.g. 200 KB) + WebP only
- [x] **11.3** `cover_url` in metadata + `next/image` + existing Storage remotePatterns
- [x] **11.4** Keep multi-image body galleries banned

### 12. Comments

- [x] **12.1** Short ADR: required auth vs anon + moderation — [blog-comments-adr.md](./blog-comments-adr.md)
- [x] **12.2** Schema + RLS + rate limit + spam strategy
- [x] **12.3** UI + admin moderation queue
- [x] **12.4** Daily moderation plan documented in [blog-runbook.md](./blog-runbook.md) + ADR

---

## Explicit rejects (do not sneak into MVP)

- Revive legacy CMS tables (`articles`, etc.)
- View counter writes to Postgres per pageview
- Redis / separate queue for 1 post/day
- Client-side first fetch `/api/public/blog` for list/detail
- Multi-image body / self-hosted video embeds
- Puck / visual CMS
- Non-English default locale in phase 1
