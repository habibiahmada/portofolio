---
name: token-economy
description: >-
  Minimizes agent token use on this repo via graphify-first navigation,
  progressive docs, and ponytail-sized diffs. Use when the user mentions
  tokens, context window, graphify, cheaper agents, or "save tokens".
---

# Token economy

## Always

1. Prefer `graphify query "<q>"` / `path` / `explain` over multi-file Grep walks.
2. Open `docs/README.md` then **one** linked doc — not every markdown file.
3. Apply **ponytail** ladder so generated code stays small (less future context).
4. After architecture-touching edits: `graphify update .`

## Skills that compound savings

| Skill | Saves tokens by |
|-------|-----------------|
| graphify (rule) | Scoped subgraph vs raw corpus |
| ponytail* | Less code written & re-read |
| performance-optimization | Focused checklist, no exploratory rewrites |

## Anti-patterns

- Reading entire `components/` or `app/api/` trees "just in case"
- Re-summarizing README into the chat when a link suffices
- Installing new frameworks when Next.js already solves it
