# Architecture

## Purpose

Personal portfolio for **Habibi Ahmad Aziz** (web developer, Karawang): showcase projects, certificates, collaborators, services, and a blog fed by the agent API. There is no admin panel or visitor login; content is managed through seed scripts and the agent API (content.

## Stack

| Concern | Technology |
|---------|------------|
| Framework | [Next.js 16](https://nextjs.org) App Router (`app/`) |
| UI | React 19, Tailwind CSS 4, Base UI / shadcn-style primitives |
| Motion | Framer Motion, GSAP (+ ScrollTrigger), custom canvas (`NodeNetwork`) |
| Data | Supabase JS + `@supabase/ssr` |
| DB | PostgreSQL (Supabase) |
| Auth | Supabase Auth (Google/GitHub OAuth, email/password) + email allowlist |
| Analytics | `@vercel/analytics` available in deps (wire as needed) |
| Package manager | Bun (`bun.lock`) |

## Directory map

```
app/
  (public)/          # Marketing pages (home, about, projects)
  api/
    public/          # Unauthenticated JSON APIs
    agent/           # Bearer-token blog API for agent-hub
  layout.tsx         # Root fonts, ThemeProvider, JSON-LD
  sitemap.ts
components/
  sections/          # Page sections (hero, projects, …)
  ui/                # Primitives + visuals
lib/
  supabase/          # service-role + anon clients, types, api-response
  hooks/use-api.ts   # Client fetch hooks (migrate off public pages)
  projects.ts, certificates.ts, …
scripts/             # seed + export scripts
tests/
docs/                # This documentation
.cursor/rules/       # Always-on agent steering
.cursor/skills/      # Invocable agent skills
graphify-out/        # Knowledge graph for agents
```

## Request flows

### Public page (current)

1. RSC shell renders section components marked `"use client"`.
2. Hooks call `/api/public/*` after hydration.
3. Skeletons → data.

**Target:** server queries Supabase in the page/layout → HTML includes content → client islands hydrate for motion only.

### Writes

There is no interactive auth. Writes happen only on the server:

1. `/api/agent/blog/*` checks `AGENT_BLOG_TOKEN`, then writes with `getSupabaseAdmin()`.
2. `/api/public/blog/[id]/react` and `/view` rate-limit per IP, then write with `getSupabaseAdmin()`.
3. Seed scripts in `scripts/` use the service role from `.env.local`.

Security headers are set in `next.config.mjs`. See `SECURITY.md`.

## Key symbols (from graphify)

High-degree nodes agents should know:

- `getSupabaseAnonClient` / `getSupabaseAdmin`
- `ok` / `fail` / `serverError` (`lib/supabase/api-response.ts`)
- `useApi` family (`lib/hooks/use-api.ts`) — public-page antipattern for SSR goals

Refresh: `graphify query "agent blog api"` or read `graphify-out/GRAPH_REPORT.md`.

## What this is not

- Not a multi-tenant CMS
- Not a Puck/page-builder product (performance work uses native Next.js)

## Planned: blog + agent publisher

Phase 0 (docs) is complete. Implementation starts at phase 1. Daily English Markdown posts via Bearer token API, SSR/ISR public `/blog`, no private server, images deferred (dynamic OG first). Full ADR + phases: [blog.md](./blog.md) · tasks: [blog-tasks.md](./blog-tasks.md).
