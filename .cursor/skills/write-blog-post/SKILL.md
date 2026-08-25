---
name: write-blog-post
description: >
  Drafts or polishes English portfolio blog posts for habibiahmada.dev:
  news-style structure, SEO meta fields, category allowlist, and hard ban on
  em dashes. Use when writing blog articles, agent publish payloads, or
  reviewing blog Markdown before POST /api/agent/blog.
---

# Write blog post (portfolio)

For `/blog` articles on this site. Voice comes from **write-like-you**; this skill adds blog structure and API-shaped fields.

Read `docs/blog.md` for architecture. Do not invent Storage uploads in phase 1.

## Hard rules

1. **English only** (phase 1).
2. **Never use em dashes** (`—`) or en dashes used as em dashes. Prefer commas, periods, colons, or parentheses.
3. Do not invent metrics, employers, awards, or citations. If unsure, omit or say it is unknown.
4. No raw HTML. Markdown only. Prefer **no** inline images in phase 1.
5. One primary category from the allowlist. Max 8 tags.
6. Target **600–1200 words**. Not a 5k essay.

## Category allowlist

`programming` | `education` | `web` | `career` | `opinion` | `news-commentary`

## Article structure

1. **Lead** (2–4 sentences): what happened / what claim, why it matters now.
2. **Context**: background a hiring manager can follow without jargon walls.
3. **Body**: H2 sections only in the Markdown body (page supplies H1 from `title`). Concrete points, trade-offs, examples.
4. **Close**: what to take away, or what you would defend in an interview. No hype CTA spam.

Optional: one internal link to a real `/projects/...` case study when relevant.

## SEO fields (required when producing a publish payload)

| Field | Guidance |
|-------|----------|
| `title` | 10–120 chars; specific; not clickbait |
| `slug` | kebab-case; unique; ASCII |
| `description` | 50–180 chars; plain summary for meta + cards |
| `body_md` | Markdown; starts at H2; no em dash |
| `category` | one allowlist value |
| `tags` | optional, max 8 |
| `locale` | `en` |
| `seo_title` / `seo_description` | optional overrides; same no-em-dash rule |

## Voice

Follow `.cursor/skills/write-like-you`: calm, direct, slightly dry; concrete verbs; short paragraphs.

Avoid: "leverage", "robust", "delightful", "cutting-edge", emoji walls, keyword stuffing.

## Self-check before handoff

- [ ] English throughout
- [ ] No `—` anywhere in title, description, or body
- [ ] Category valid; slug kebab-case
- [ ] Description length in range
- [ ] Body has clear H2s and a real lead
- [ ] No fake numbers or fake links
- [ ] No image upload instructions for phase 1 MVP
