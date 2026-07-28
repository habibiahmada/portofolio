# Agent tooling (token savings)

This repo is set up so coding agents spend fewer tokens while staying accurate.

## Graphify

Knowledge graph of the codebase (AST extraction, local, no API key for code-only updates).

| Artifact | Path |
|----------|------|
| Graph JSON | `graphify-out/graph.json` |
| Report | `graphify-out/GRAPH_REPORT.md` |
| Cursor rule | `.cursor/rules/graphify.mdc` (`alwaysApply`) |

### Install / refresh (maintainers)

```bash
# CLI package name on PyPI is graphifyy; command is still `graphify`
uv tool install graphifyy

graphify cursor install          # writes .cursor/rules/graphify.mdc
graphify update .                # AST re-extract after code changes
graphify cluster-only . --no-label --no-viz   # communities + GRAPH_REPORT.md
graphify query "how does withAdmin work"
```

Agents **must** prefer `graphify query|path|explain` before wide Grep/Read (see rule).

Official project: [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) / PyPI `graphifyy`.

## Ponytail

Forces minimal solutions (YAGNI → stdlib → native → one-liner).

| Piece | Path |
|-------|------|
| Always-on rule | `.cursor/rules/ponytail.mdc` |
| Skills | `.cursor/skills/ponytail*` |

Triggers: “ponytail”, “be lazy”, “yagni”, `/ponytail-review`, `/ponytail-audit`, etc.

Upstream: [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail).

## Project skills

| Skill | Role |
|-------|------|
| `performance-optimization` | Execute SSR/image/JS plan |
| `token-economy` | Graph-first + progressive docs |
| `ponytail` (+ review/audit/debt/gain/help) | Minimal code / complexity reviews |

## Always-on rules

| File | Role |
|------|------|
| `graphify.mdc` | Graph before explore |
| `ponytail.mdc` | Smallest correct diff |
| `token-economy.mdc` | Cheap context |
| `project-architecture.mdc` | Stack map |
| `performance-optimization.mdc` | Perf steering |

## AGENTS.md

Root [AGENTS.md](../AGENTS.md) is the one-page agent brief for any tool that auto-loads it.
