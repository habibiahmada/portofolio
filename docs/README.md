# Documentation

Index for humans and coding agents. Prefer **one** page at a time (token economy).

| Doc | When to read |
|-----|----------------|
| [steering.md](./steering.md) | Map of all steering docs / rules / skills |
| [architecture.md](./architecture.md) | Stack, folders, request flow |
| [performance.md](./performance.md) | Lighthouse / SSR / images plan (**steering for optimization**) |
| [performance-tasks.md](./performance-tasks.md) | Full public-page performance task list |
| [blog.md](./blog.md) | Blog + agent publish: architecture, ADR, cost (**steering**) |
| [blog-tasks.md](./blog-tasks.md) | Blog implementation checklist (phases 0–4) |
| [data-and-hosting.md](./data-and-hosting.md) | Supabase schema, env, Vercel |
| [development.md](./development.md) | Local setup, scripts, testing |
| [agent-tooling.md](./agent-tooling.md) | Graphify, Ponytail, Cursor skills/rules |
| [../SECURITY.md](../SECURITY.md) | Auth, admin whitelist, headers |
| [../AGENTS.md](../AGENTS.md) | Short agent entry map |

## Mental model

```
Browser
  └─ Next.js (Vercel)
       ├─ Public RSC pages  → should SSR/ISR from Supabase (target state)
       ├─ Client islands    → animation / modals only
       ├─ /api/public/*     → JSON for clients that still need it
       ├─ /api/admin/*      → CRUD (service role + withAdmin)
       ├─ /api/agent/blog   → Bearer AGENT_BLOG_TOKEN (1 post/day; see blog.md)
       └─ proxy.ts          → session refresh + /admin gate
Supabase Postgres + Auth + Storage
agent-hub scheduler (optional) → POST /api/agent/blog
```

Current gap: several public sections still use **client** `use-api` hooks → waterfall + skeletons. See [performance.md](./performance.md).
