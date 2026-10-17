# Agent / contributor map

Portfolio site for **Habibi Ahmad Aziz** — Next.js 16 + Supabase.

## Before exploring code

1. Query the knowledge graph: `graphify query "<question>"` (see `.cursor/rules/graphify.mdc`)
2. Skim `docs/README.md` for the right deep-dive page
3. Prefer `.cursor/skills/*` for repeatable workflows (performance, ponytail, token-economy, **write-like-you**, **write-blog-post**)
4. Blog / agent daily posts: read `docs/blog.md` then `docs/blog-tasks.md` before coding (phase 0 done; implement from phase 1)

## Always-on rules (`.cursor/rules/`)

| Rule | Purpose |
|------|---------|
| `graphify.mdc` | Graph-first codebase navigation |
| `ponytail.mdc` | Minimal diffs / YAGNI |
| `token-economy.mdc` | Cheap context usage |
| `project-architecture.mdc` | Stack & route map |
| `performance-optimization.mdc` | SSR/images/JS steering |

Project skills also include `write-like-you` (portfolio Voice DNA; **no em dashes**) and `write-blog-post` (English blog articles + SEO payload).

## Do not

- Add yourself as a contributor
- Commit secrets (`.env.local`)
- Use Puck for the performance initiative (see `docs/performance.md`)

## Commands

```bash
bun install
bun run dev
bun run build
graphify query "how does the agent blog api work"
graphify update .
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
