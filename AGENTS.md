# Agent / contributor map

Portfolio site for **Habibi Ahmad Aziz** — Next.js 16 + Supabase.

## Before exploring code

1. Query the knowledge graph: `graphify query "<question>"` (see `.cursor/rules/graphify.mdc`)
2. Skim `docs/README.md` for the right deep-dive page
3. Prefer `.cursor/skills/*` for repeatable workflows (performance, ponytail, token-economy, **write-like-you**)

## Always-on rules (`.cursor/rules/`)

| Rule | Purpose |
|------|---------|
| `graphify.mdc` | Graph-first codebase navigation |
| `ponytail.mdc` | Minimal diffs / YAGNI |
| `token-economy.mdc` | Cheap context usage |
| `project-architecture.mdc` | Stack & route map |
| `performance-optimization.mdc` | SSR/images/JS steering |

Project skills also include `write-like-you` (portfolio Voice DNA; **no em dashes**).

## Do not

- Add yourself as a contributor
- Commit secrets (`.env.local`)
- Use Puck for the performance initiative (see `docs/performance.md`)

## Commands

```bash
bun install
bun run dev
bun run build
graphify query "how does admin auth work"
graphify update .
```
