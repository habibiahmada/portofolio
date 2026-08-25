# Steering documents

Canonical product/engineering steering for agents and humans.

| Steering topic | Living doc | Cursor rule | Skill |
|----------------|------------|-------------|-------|
| Performance → Lighthouse | [performance.md](./performance.md) · [performance-tasks.md](./performance-tasks.md) | `.cursor/rules/performance-optimization.mdc` | `performance-optimization` |
| Blog + agent publish | [blog.md](./blog.md) · [blog-tasks.md](./blog-tasks.md) | — | `write-blog-post`, `write-like-you`; agent-hub `portfolio_blog` (planned) |
| Architecture | [architecture.md](./architecture.md) | `.cursor/rules/project-architecture.mdc` | — |
| Token / agent cost | [agent-tooling.md](./agent-tooling.md) | `token-economy.mdc`, `graphify.mdc`, `ponytail.mdc` | `token-economy`, `ponytail*` |
| Security | [../SECURITY.md](../SECURITY.md) | — | — |

When implementing the performance initiative, treat [performance.md](./performance.md) as the source of truth for priority order and acceptance criteria.

When implementing the blog / daily agent publisher, treat [blog.md](./blog.md) as the source of truth; execute work only via [blog-tasks.md](./blog-tasks.md) phase order (MVP = phases 0–1; phase 0 is complete).
