# Blog system — architecture & decisions

Steering doc for the portfolio blog. **Read this before implementing.** Task checklist: [blog-tasks.md](./blog-tasks.md).

**Status:** design only (no feature code yet). Phase **0 complete**.  
**Principles:** minimal resources, complete architecture, YAGNI per phase.  
**Host stack:** Next.js (Vercel) + Supabase Postgres (+ Auth). **No private VPS.**

**Language:** all public blog posts and blog docs use **English**.

---

## 1. Product goal

Portfolio (`habibiahmada.dev`) gets an editorial blog that:

1. Publishes **at most one article per day** via an agent (not a heavy manual CMS).
2. Supports multiple categories (programming, education, technical opinion, etc.).
3. Is SEO-optimized (metadata, sitemap, JSON-LD, clean URLs, descriptive copy).
4. Uses clear, news-style writing; **no em dashes** (`—`); aligned with Voice DNA (`write-like-you` / `write-blog-post`).
5. Has light interaction: share in MVP; reactions later. Comments are **not** early scope.
6. Does not burn storage/bandwidth on images over time.

Primary audience remains hiring managers / tech leads. The blog proves thinking and adds SEO reach; it is not a social network.

---

## 2. Constraints (hard)

| Constraint | Implication |
|------------|-------------|
| No private server | Everything on Vercel + Supabase cloud |
| Free / hobby budget | Avoid heavy Storage, paid CDN, Redis, queue services |
| 1 post / day | Low volume → Postgres text is enough; do not over-engineer |
| Legacy CMS dropped | Do not revive old `articles` tables; use a slim new schema |
| Perf initiative still active | Blog must **SSR/ISR first paint**, not `use-api` waterfalls |
| Agent token can leak | Separate auth, rate limits, schema validation, minimal audit logs |
| Spam / abuse | Open comments deferred; reactions rate-limited |

---

## 3. Non-goals (explicit)

- Multi-author CMS / Puck / visual editor.
- Multi-image galleries per post (phases 1–2).
- Full comments + nested threads + moderation UI (phase 4+ only if needed).
- Newsletter, paywall, member area.
- Search cluster / Elasticsearch / Algolia.
- Non-English blog posts in phase 1 (English only).
- Realtime WebSocket like counters.

---

## 4. Decision analysis (short ADRs)

### 4.1 Where is content stored?

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| A. Markdown in git | Cheap, versioned | Agent must PR/commit; deploy latency; awkward for token API | Reject for daily agent |
| B. Supabase Postgres (`blog_posts`) | Already in stack; ISR; category queries; RLS | Needs migration | **Choose** |
| C. External headless CMS | Admin UI | Cost, vendor, complexity | Reject |
| D. Revive legacy `articles` | Familiar name | Dirty schema; intentionally dropped | **Reject** |

**Decision:** new `blog_posts` table (+ optional `blog_reactions` later). Body = **Markdown** in `body_md`. Server render with one light library (e.g. `react-markdown` + sanitize). Raw HTML from the agent is **rejected**.

### 4.2 Auth for agent writes

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| A. Reuse admin cookie session | Exists | Non-browser agent; fragile | Reject |
| B. Service role in agent | Powerful | Blast radius if leaked in agent-hub | Reject on agent |
| C. Bearer `AGENT_BLOG_TOKEN` on a dedicated route | Narrow scope; easy rotate | Secret management | **Choose** |
| D. Short-lived signed JWT | More formal | Overkill for 1/day | Later if needed |

**Decision:** `POST /api/agent/blog` with `Authorization: Bearer <AGENT_BLOG_TOKEN>`. Server uses `getSupabaseAdmin()` only after token validation. Token is **not** the service role. Env on Vercel + agent-hub only.

**Daily quota:** **1 successful agent create per calendar day in `Asia/Jakarta`**. Second create → **429**.

### 4.3 Publish flow: live vs draft

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| A. Immediate `published` | Simple | Bad AI copy hurts SEO | Superseded |
| B. Always `draft` + review | Safer | Needs notify + timeout | **Current** |
| C. Auto-publish + admin can unpublish | Balance | Needs admin API | Fallback after deadline |

**Current:** agent creates `status: draft` with `preview_token` + `review_deadline_at` (default **24h**, env `BLOG_REVIEW_HOURS`). Preview at `/blog/preview/[token]` (noindex). Telegram Approve / Reject, or auto-publish when deadline passes. Preview token cleared on publish/reject.

### 4.4 Images / covers

| Option | Storage cost | Social SEO | Decision |
|--------|--------------|------------|----------|
| A. No cover file; dynamic OG (`ImageResponse`) | ~0 | Good | **Phase 1 required** |
| B. External URL only | 0 storage | Link rot / licensing | Optional nullable `cover_url` |
| C. Small Supabase Storage WebP | Low | Good | Phase 3 if needed |
| D. Many inline body images | High | Hurts LCP | **Reject** until budgeted |

**Decision:** phase 1 **zero uploads**. Visual cover = OG route. Prefer no inline images in Markdown.

### 4.5 Social interaction

| Feature | Phase | Minimal design |
|---------|-------|----------------|
| Share | 1 | Client-only: Web Share API + copy URL. **No table.** |
| Like / reactions | 2 | `blog_reactions` + denormalized `reaction_counts` jsonb |
| Comments | 4+ | Needs auth + moderation. Out of scope until 1–2 are stable |
| View count | optional | Skip or use Analytics; never write DB on every pageview |

**Decision:** phase 1 = share only. Reactions in phase 2. Comments gated.

### 4.6 Who generates content?

| Option | Decision |
|--------|----------|
| Manual admin only | Not the goal |
| agent-hub daily one-shot scheduler | **Choose** |
| Vercel Cron + LLM on edge | Cost/coupling on Vercel | Reject as primary |
| GitHub Action | Backup option | Secondary |

**Decision:** primary = **agent-hub** skill `portfolio_blog`:

1. Pick topic/category (rotation and/or existing RSS).
2. Generate English Markdown + SEO fields.
3. Validate locally (length, no em dash, slug, category).
4. `POST` to portfolio API with token.
5. Log success/failure to Telegram `system_logs`.

Portfolio **does not** run the LLM. It only accepts the final payload.

### 4.7 Rendering & caching

Follow portfolio SSR/ISR targets (no public first-paint `use-api`):

- `app/(public)/blog/page.tsx` — RSC list, ISR + tag `blog`.
- `app/(public)/blog/[slug]/page.tsx` — RSC detail + `generateMetadata`.
- After agent POST → `revalidateTag('blog')`.
- Markdown → HTML on server; sanitize (no raw script).

### 4.8 Categories

Fixed allowlist (CHECK or app validation). No separate `categories` table in phase 1.

| slug | Label (EN) |
|------|------------|
| `programming` | Programming |
| `education` | Education |
| `web` | Web |
| `career` | Career |
| `opinion` | Opinion |
| `news-commentary` | News commentary |

One post = one primary `category` + optional `tags text[]`.

---

## 5. Target architecture

```
┌─────────────────┐     Bearer token      ┌──────────────────────────────┐
│ agent-hub       │ ───────────────────►  │ Vercel: Next.js portfolio    │
│ scheduler       │   POST /api/agent/blog│  ├─ validate token + quota   │
│ skill:          │                       │  ├─ insert blog_posts        │
│ portfolio_blog  │                       │  ├─ revalidateTag(blog)      │
└─────────────────┘                       │  └─ /api/og/blog (dynamic)   │
                                          └──────────────┬───────────────┘
                                                         │
                                                         ▼
                                          ┌──────────────────────────────┐
                                          │ Supabase Postgres            │
                                          │  blog_posts (RLS read public)│
                                          │  blog_reactions (phase 2)    │
                                          └──────────────────────────────┘

Browser ──► /blog, /blog/[slug]  (RSC + ISR, Markdown render)
         └─► share buttons (no API)
         └─► POST /api/public/blog/[id]/react (phase 2 only)
```

### Route map (new)

| Route | Auth | Role |
|-------|------|------|
| `GET /blog` | public | Index + category filter |
| `GET /blog/[slug]` | public | Article detail |
| `GET /api/og/blog` | public | Dynamic OG image |
| `POST /api/agent/blog` | Bearer agent | Create (1/day) |
| `GET/PATCH/DELETE /api/admin/blog` | withAdmin | Moderation |
| `POST /api/public/blog/[id]/react` | public + rate limit | Phase 2 |
| `GET /api/public/blog` | public | Optional JSON; **not** first paint |

---

## 6. Data model (phase 1)

```sql
-- Conceptual; exact migration in implementation phase

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,          -- meta + card excerpt (150–160 chars ideal)
  body_md text not null,              -- markdown source
  category text not null,             -- checked against allowlist
  tags text[] not null default '{}',
  locale text not null default 'en',  -- English only (reserved column)
  status text not null default 'published'
    check (status in ('draft', 'published', 'archived')),
  cover_url text,                     -- null in phase 1
  seo_title text,                     -- optional override
  seo_description text,               -- optional override
  canonical_url text,                 -- usually null → site/blog/slug
  reading_time_minutes int,           -- computed on write
  reaction_counts jsonb not null default '{}'::jsonb,  -- phase 2; empty for now
  source text not null default 'agent', -- 'agent' | 'admin'
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index blog_posts_published_idx
  on public.blog_posts (published_at desc)
  where status = 'published';

create index blog_posts_category_idx
  on public.blog_posts (category)
  where status = 'published';
```

**RLS:** anon `SELECT` only where `status = 'published'`. Writes only via service role on the server.

**Phase 2 reactions (sketch):**

```sql
create table public.blog_reactions (
  post_id uuid references public.blog_posts(id) on delete cascade,
  reaction text not null check (reaction in ('like', 'insightful', 'useful')),
  visitor_key text not null,
  created_at timestamptz not null default now(),
  primary key (post_id, visitor_key)
);
```

One visitor = **one reaction total** per post (simplest).

---

## 7. Agent API contract (phase 1)

`POST /api/agent/blog`

**Headers:** `Authorization: Bearer $AGENT_BLOG_TOKEN`, `Content-Type: application/json`

**Body (JSON):**

```json
{
  "title": "string, 10–120 chars",
  "slug": "kebab-case, optional; server may slugify title",
  "description": "string, 50–180 chars",
  "body_md": "markdown, 400–8000 chars typical",
  "category": "programming|education|web|career|opinion|news-commentary",
  "tags": ["optional", "max 8"],
  "seo_title": "optional",
  "seo_description": "optional"
}
```

**Server duties:**

1. Timing-safe token compare.
2. Enforce daily quota (`Asia/Jakarta`).
3. Validate category allowlist, slug uniqueness, max lengths.
4. Reject payload containing em dash `—` with **400** (force agent fix).
5. Compute `reading_time_minutes` (~200 wpm).
6. Insert `status=draft`, `preview_token`, `review_deadline_at`, `source=agent` (`published_at` null).
7. `revalidateTag('blog')`.
8. Return `{ id, slug, status, preview_url, review_deadline_at, url: null }`.

**Review APIs (same Bearer token):**

- `POST /api/agent/blog/review` `{ id, action: "approve"|"reject" }` → publish or archive; clears preview.
- `POST /api/agent/blog/auto-publish` → publish drafts with `review_deadline_at <= now`.

**Errors:** 401 token, 409 slug, 429 quota, 400 validation.

**No** multipart upload in phase 1.

---

## 8. SEO checklist (required by design)

Per article:

- Unique `title` + `description`.
- Canonical `https://www.habibiahmada.dev/blog/{slug}`.
- `generateMetadata` + Open Graph + Twitter (`og:image` → `/api/og/blog?...`).
- JSON-LD `BlogPosting` (author = existing Person, `datePublished`, `headline`, `description`).
- Sitemap: `/blog` + each published slug (`lastModified` = `updated_at`).
- `robots`: allow `/blog`; disallow `/blog/preview/`, `/api/`, `/admin`.
- Heading hierarchy: page H1 from title; body starts at H2.
- Optional internal links to `/projects/...` when relevant.
- Clear English; no keyword stuffing.

Content:

- News/analysis shape: lead, context, points, close.
- Target length: **600–1200 words**.
- Writing skill: `.cursor/skills/write-blog-post` (+ Voice DNA from `write-like-you`).

---

## 9. Content pipeline (agent-hub)

Portfolio contract only; agent-hub implementation is tracked there.

| Step | Owner | Resource note |
|------|-------|---------------|
| Schedule 1×/day | agent-hub systemd/scheduler | Already one-shot; no interval in Next |
| Pick topic | agent-hub | Category rotation; title/slug dedup |
| Generate MD | LLM via 9Router | Cost on agent-hub, not Vercel |
| Validate | agent-hub script | Length, em dash, category, English |
| Publish | HTTP to portfolio | Timeout + one retry |
| Log | Telegram system_logs | One summary |

Idempotency: after success, retry → 429 or 409. Agent stores daily `last_blog_slug` locally.

---

## 10. Cost & resource model

Assumptions: 1 post/day, ~5–10 KB text body, no Storage.

| Resource | Estimate | Notes |
|----------|----------|-------|
| Postgres rows | ~365/year | Negligible |
| DB text storage | ~2–4 MB/year | Negligible |
| Vercel invocations | Agent POST + views | ISR cuts origin hits |
| Image optimization | 0 (phase 1) | OG on demand / platform cache |
| Supabase Storage | 0 (phase 1) | |
| LLM tokens | agent-hub only | Cap output length in prompt |

**Expensive if misdesigned:** pageview → DB writes, unauth comments, large images, client fetch waterfalls, full static rebuild without tag revalidation.

---

## 11. Security

- `AGENT_BLOG_TOKEN`: ≥ 32 random bytes; rotate via env; never commit.
- Compare with `crypto.timingSafeEqual`.
- Never log Authorization header.
- Extra IP rate limit besides daily quota (e.g. 5 req/hour).
- Sanitize Markdown (no `javascript:` links; no unsafe raw HTML).
- Agent route errors must not leak secrets.
- Admin unpublish uses existing `withAdmin`.
- RLS: public reads published only.
- Payload size limit (e.g. `body_md` max 100 KB).

Update [SECURITY.md](../SECURITY.md) during phase 1 implementation.

---

## 12. Public UX (minimal)

- Nav + footer: single **Blog** link.
- `/blog`: title, date, category, description; `?category=` filter.
- `/blog/[slug]`: clean article typography; share row at end.
- Empty state when zero posts.
- Avoid card-heavy hero clutter; stay consistent with portfolio design direction.
- Motion: subtle only; respect `prefers-reduced-motion`.

Phase 1 admin UI: **not required**. Admin API + Supabase dashboard is enough. `/admin/blog` UI = phase 2.

---

## 13. Phasing summary

| Phase | Contents | Resource delta |
|-------|----------|----------------|
| **0 Docs** | `blog.md` + `blog-tasks.md` + indexes + skills note | 0 runtime |
| **1 MVP** | Schema, agent API, `/blog` SSR, OG, sitemap, SEO, share, agent-hub stub | Text only |
| **2 Light social** | Reactions + counts; admin blog UI; optional draft default | One small table |
| **3 Media** | Supabase Storage cover WebP + size validation; still no gallery | Small storage |
| **4 Comments** | Only if needed; auth + moderation | Highest |

Do not jump to phases 3–4 before MVP runs cleanly for 2–4 weeks (or explicit request).

---

## 14. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Bad / hallucinated AI claims | Strict prompts; no fake metrics; admin unpublish; Voice DNA |
| Em dashes & generic tone | API reject + `write-blog-post` skill |
| Token leak in agent-hub | Blog-create scope only; rotate; rate limit |
| Duplicate daily posts | Quota by Asia/Jakarta calendar day |
| Thin SEO content | Min length + structure validation |
| Image cost creep | Phase 1 no storage; cap covers in phase 3 |
| Perf regression | SSR/ISR only; no new client waterfalls |
| Comments scope creep | Locked behind phase 4 |

---

## 15. Acceptance criteria (MVP = phase 1 done)

1. Agent can create **exactly one** draft post per Asia/Jakarta day with the token (preview URL returned).
2. Second create same day → 429.
3. `/blog` and `/blog/[slug]` first paint include **published** content without `/api/public/*` fetch.
4. Sitemap & JSON-LD `BlogPosting` valid for published posts (previews excluded).
5. OG image works without Storage files.
6. Share works without backend.
7. Em dashes cannot pass validation.
8. No image upload on the agent path.
9. `AGENT_BLOG_TOKEN` documented in `.env.example` (no real value).
10. Docs index points here; posts are **English**.
11. Unreviewed drafts auto-publish after `review_deadline_at`; preview links die after publish/reject.

---

## 16. Related docs

| Doc | Relation |
|-----|----------|
| [architecture.md](./architecture.md) | Folder map, request flows |
| [data-and-hosting.md](./data-and-hosting.md) | Supabase / Vercel; update when table is live |
| [performance.md](./performance.md) | SSR/ISR rules apply to blog |
| [agent-tooling.md](./agent-tooling.md) | Skills index |
| [../SECURITY.md](../SECURITY.md) | Token & rate limit |
| `.cursor/skills/write-like-you` | Voice DNA |
| `.cursor/skills/write-blog-post` | Blog article structure + SEO fields |
| agent-hub `docs/feature-status.md` | Planned skill `portfolio_blog` |

---

## 17. Locked decisions (phase 0)

| Topic | Decision |
|-------|----------|
| Blog language | **English only** in phase 1 |
| Daily quota timezone | **`Asia/Jakarta`** (midnight boundary) |
| Categories | `programming`, `education`, `web`, `career`, `opinion`, `news-commentary` |
| Slug collision | **409** (agent must pick another slug) |
| Admin UI in MVP | **No** (API + dashboard only) |
| Agent `draft` default | **Yes** (preview + Telegram review; auto-publish on timeout) |
| Body language | English news/analysis style; no em dashes |
