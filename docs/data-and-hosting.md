# Data and hosting

## Database (Supabase / PostgreSQL)

Project: **supabase-portofolio** (`tjxcfcllkceoauuwurfe`) — linked via Supabase CLI (`supabase link`).

Tables (see `lib/supabase/types.ts`):

| Table | Role |
|-------|------|
| `projects` | Portfolio items (bilingual titles/descriptions, tags, URLs, year, image) |
| `certificates` | Certs with `pages[]`, thumb, `is_pinned` |
| `companies` | Collaborator logos |
| `allowed_users` | Extra allowlist rows (alongside env emails) |
| `blog_posts` | Blog articles (Markdown body, category, tags, SEO fields, status, source) |
| `blog_reactions` | One reaction per visitor per post (`like` / `insightful` / `useful`) |
| `blog_comments` | Authenticated comments (`pending` → admin approve/reject) |

**Cleanup (2026-07-28):** dropped unused legacy CMS tables (`articles`, `certifications`, `experiences`, `faqs`, `hero_sections`, `services`, `statistics`, `testimonials`, `tools_logo`, translation tables, `contacts`, `email_templates`). Migration: `supabase/migrations/20260728130000_drop_legacy_cms_tables.sql`.

**Blog migrations:** `20260825120000_create_blog_posts.sql`, `20260825140000_create_blog_reactions.sql`, `20260825150000_create_blog_comments.sql`.

Active row counts after cleanup: projects 10 · companies 5 · certificates 52 · allowed_users 1.

RLS: public `SELECT` on `projects` / `companies` / `certificates`; published-only on `blog_posts`; approved-only on `blog_comments`. Writes use `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS) except authenticated comment inserts.

Access patterns:

- **Public reads:** anon key via server client or `/api/public/*`
- **Admin writes:** `SUPABASE_SERVICE_ROLE_KEY` through `getSupabaseAdmin()` only on server
- **RLS:** enabled on Supabase; do not expose service role to the browser

Direct Postgres URL (`POSTGRES_URL`) is for seeding/scripts (`scripts/`), not for the Next request path in normal use.

### CLI notes

```bash
# scoop shim if not on PATH
supabase link --project-ref tjxcfcllkceoauuwurfe
supabase db query --linked "select count(*) from projects"
supabase migration list --linked
```

`db dump` / `db pull` need Docker Desktop. Schema changes can still be applied with `supabase db query --linked -f supabase/migrations/….sql` then `supabase migration repair --status applied <version>`.

## Auth & admin

- Providers: Google, GitHub, email/password (Supabase)
- Gate: `ADMIN_ALLOWED_EMAILS` (+ DB allowlist as implemented)
- Session cookies: `@supabase/ssr` refreshed in `proxy.ts`
- Details: [SECURITY.md](../SECURITY.md)

## Environment

Copy `.env.example` → `.env.local`:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server admin ops only |
| `NEXT_PUBLIC_SITE_URL` | Canonical site / OAuth redirects |
| `POSTGRES_URL` | Optional direct DB for scripts |
| `ADMIN_ALLOWED_EMAILS` | Comma-separated admin emails |
| `AGENT_BLOG_TOKEN` | Bearer token for agent-hub blog publisher (`POST /api/agent/blog`) |
| `TEST_BYPASS_KEY` | **Dev/test only** — remove in production |

## Hosting

| Piece | Where |
|-------|--------|
| Next.js app | **Vercel** (repo linked from v0; `main` auto-deploys) |
| Database / Auth / Storage | **Supabase** cloud project |
| Blog covers (optional) | Supabase Storage bucket `blog-covers` (WebP ≤ 200 KB) |
| Images | Prefer Supabase Storage URLs through `next/image` once optimization is on |
| Domain | Production site: `https://www.habibiahmada.dev` (see metadata) |
| Blog ops | [blog-runbook.md](./blog-runbook.md) |

### Deploy notes

- Set all env vars in Vercel project settings (Production + Preview as needed)
- OAuth redirect URLs must include production and local callbacks
- After enabling image optimization, confirm Vercel Image Optimization works with Supabase host allowlist

## Backup / migration

- Schema source of truth: Supabase dashboard + `lib/supabase/types.ts` (keep types in sync when altering tables)
- Content backup: Supabase dumps / table exports
- Do not commit `.env.local`
