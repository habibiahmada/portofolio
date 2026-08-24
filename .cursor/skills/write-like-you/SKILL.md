---
name: write-like-you
description: >
  Writes portfolio and case-study copy in Habibi Ahmad Aziz's voice using
  Audience Profile, Voice DNA, and Business Context. Use when drafting or
  polishing case studies, project descriptions, press blurbs, hero/CTA copy,
  ROAST responses, or any public English/Indonesian marketing text on this
  site. Also when the user says "write like me", "voice DNA", or "case study copy".
---

# Write like you (portfolio voice)

Based on the Audience Profile + Voice DNA + Business Context pattern from
[The Claude Skills That Finally Made AI Write Like Me](https://aiblewmymind.substack.com/p/claude-skills-ai-write-like-you).
Adapted for this portfolio, not a newsletter.

## Hard rules (always)

1. **Never use em dashes** (`—`) or en dashes used as em dashes. Prefer commas, periods, colons, parentheses, or a simple hyphen with spaces only when needed for compounds.
2. First person for solo work. For team work: name the team, then **My role** in plain language.
3. Prefer concrete verbs and measurable outcomes over brochure adjectives ("revolutionary", "seamless", "cutting-edge").
4. Short paragraphs. One idea per sentence when possible.
5. Do not invent metrics, employers, or awards. If unknown, say what is unknown or omit.

## Audience Profile

Primary readers:

- Hiring managers and tech leads scanning for honesty, role clarity, and ship proof
- Recruiters who skim cards first, then open one case study
- Occasional clients looking for freelance web work

They care about: what you built, your exact role, constraints, trade-offs, and whether it shipped.
They bounce on: agency "we" voice, fluff, missing role, broken English on the hero.

Write so a stranger can answer in 30 seconds: solo or team, what you owned, what shipped.

## Voice DNA

- Tone: calm, direct, slightly dry. Confident without hype.
- Rhythm: mix short punch lines with one longer clarifying sentence.
- Openings: state the problem or the job, not a slogan.
- Closings: outcome or what you would defend in an interview.
- Prefer: "I built", "I owned", "we shipped", "the constraint was"
- Avoid: "leverage", "robust", "delightful", "empower", "synergy", emoji walls
- Indonesian copy: same clarity rules; keep formal-casual SMK/internship honesty

## Business Context

Habibi Ahmad Aziz. Frontend-leaning full-stack. Remote (WIB). Open to freelance and full-time.
Site: habibiahmada.dev. Stack bias: Next.js, React, Laravel, APIs, measurable performance.
Proof anchors: E-Vote (school production), Agrify/Intel country award (team), Coding Camp / Dicoding story, CV Smartplus internship.

## Case study template (required sections)

When writing or expanding a project detail:

1. **Problem** (what hurt before the build)
2. **Constraints** (time, team, hosting, devices, politics)
3. **Architecture** (2 to 4 titled blocks: what you owned)
4. **Outcomes** (shipped facts; awards only if real)
5. **Links** (live / github only if real; never fake `#` as live)

Slug lives under `/projects/[slug]`. Every public project should have one published study so the archive is even.

## Workflow

1. Read existing project title, tags, year, and any meta in `lib/data/project-meta.ts`.
2. Draft in this voice. Strip every `—`.
3. Keep EN primary for case studies unless asked for ID.
4. Update `lib/data/case-studies.ts` and card links; do not invent CMS columns unless asked.
