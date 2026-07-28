# Development

## Prerequisites

- Node 22+ (or Bun 1.3+)
- Bun recommended (`bun.lock` present)
- Supabase project + filled `.env.local`
- Optional: Python 3.10+ and `uv` for Graphify CLI

## Setup

```bash
bun install
cp .env.example .env.local
# fill Supabase + ADMIN_ALLOWED_EMAILS

bun run dev
# http://localhost:3000
```

## Scripts

| Command | Purpose |
|---------|---------|
| `bun run dev` | Next dev + Turbopack |
| `bun run build` | Production build |
| `bun run start` | Serve production build |
| `bun run lint` | ESLint |

Admin helper: `scripts/create-admin.ts` (needs service role / Postgres as documented in script).

## Tests

`tests/api.test.ts` — API-oriented tests. Use mock paths (`SUPABASE_MOCK_ENABLED` / `TEST_BYPASS_KEY`) as implemented in `lib/supabase/server.ts` so CI does not hang on dummy URLs.

## Code conventions

- TypeScript strictness: follow existing patterns; `next.config.mjs` currently has `typescript.ignoreBuildErrors: true` — prefer fixing types over expanding ignore.
- Prefer Server Components by default; add `"use client"` only when needed.
- Shared classnames: `cn()` from `lib/utils.ts`.
- API responses: `ok` / `fail` / `serverError` helpers.

## Design notes

Existing visual language (dark/light CRT accents, glitch headings, red/blue accents) should be preserved when changing code. Performance work should not flatten the brand unless asked.

Frontend design hard-rules for *new* marketing surfaces live in user Cursor rules; this repo already has an established look — match it.
