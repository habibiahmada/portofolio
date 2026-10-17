# Security

The site is public and read-only for visitors. There is no login, no admin panel, and no user accounts. Content is written by seed scripts (run locally with the service role) and by agent-hub through the agent blog API.

## Secrets

| Variable | Where | Notes |
|----------|-------|-------|
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Used by `getSupabaseAdmin()`. Never import `lib/supabase/server.ts` from a client component. |
| `AGENT_BLOG_TOKEN` | Server only, shared with agent-hub | Generate with `openssl rand -base64 32`. Rotate if leaked. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Safe to expose; access is limited by RLS. |

## Write paths

| Route | Guard |
|-------|-------|
| `POST /api/agent/blog`, `/review`, `/revise`, `/auto-publish`, `/revalidate` | Bearer `AGENT_BLOG_TOKEN`, compared with `timingSafeEqual` on SHA-256 hashes. Body size capped at 128 KB. |
| `POST /api/public/blog/[id]/view` | 40 requests per IP per post per hour, post must be published. |

The rate limiter is in-memory (`lib/security.ts`), so it resets per serverless instance. It slows casual abuse; it is not a hard limit.

## Database (RLS)

- `blog_posts`: anon can read published posts only.
- `blog_reactions` and `blog_comments`: dropped in `20261017130000_drop_reactions_and_comments.sql` (never shown on the site; visitor login is gone).

Apply new migrations with `supabase db push`. Since visitor login is gone, also turn off new sign-ups in Supabase (Authentication, Sign In / Providers).

## Headers

Set for every path in `next.config.mjs`:

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

## Content rendering

- Blog markdown goes through `react-markdown` without `rehype-raw`, so raw HTML is stripped. Image URLs pass `sanitizeUrl`; links must be `http(s)://`, a same-site path, `#anchor`, or `mailto:`; anything else renders as plain text.
- JSON-LD escapes `<` before it is injected into `<script type="application/ld+json">`.

## Reporting

Email contact@habibiahmada.dev.
