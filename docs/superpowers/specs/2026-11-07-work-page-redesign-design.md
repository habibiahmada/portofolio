# Work page redesign

Issue: #9. Audit: `anti-slop/audit-001-2026-11-07.md`.

## Intent

In the first ten seconds on `/projects`, a recruiter, client, or developer should think: this person builds working digital products, not only websites. Three messages, in the owner's words:

1. **Real experience, not a pile of projects.** Personal, school, collaborative, and professional work, each with its own context and responsibility.
2. **Solves problems, not only writes code.** Understands user needs; builds workflows, auth, APIs, and databases; works front to back; integrates external services; handles deployment.
3. **Growing toward mature engineering.** Interest in code quality, infrastructure, automation, security, and architecture.

One-line message: *I build more than websites. I turn real-world problems into working digital products.*

## Goals

- A capability map right under the page intro that states the five capabilities and proves each one with real projects.
- Choosing a capability filters the archive to the projects that prove it.
- A one-line delivery path (2024 to 2026) under the stats, for message 3.
- Fix audit findings 1 to 11.

## Non-goals

- Copy and claims on other pages (Home, About, Services, experience timeline). That is the next piece of work, audited separately.
- New projects, new images, new data in Supabase.
- Sharing a filter by URL.
- The Go terminal.

## Anti-goals

- Any number, claim, or capability without a project behind it (R-17, R-36, R-38). A capability with weak proof is dropped, not padded.
- Decoration added to create the "wow" (orbs, glows, grids). The wow comes from the content and the interaction.
- A mobile page that is the desktop page squeezed.

## Constraints

- Next.js 16, React 19, Tailwind 4, existing tokens (`--muted-foreground`, brand red), light and dark themes, Lenis smooth scroll, React `ViewTransition` on project media.
- Project rows come from Supabase; taxonomy, case studies, briefs, and featured IDs live in code. The capability map lives in code too.
- No em dashes. English copy, matching the rest of the site.
- Git: one branch, small commits, PR closes #9.

## Approaches considered

| | Approach | Trade-off |
|---|---|---|
| **A (picked)** | Capability map with proof; choosing one filters the archive | Answers "what kind of developer" directly and turns the archive into evidence. Needs a curated mapping. |
| B | Growth timeline 2024 to 2026 | Strong for message 3, weak for message 2. Kept as a one-line strip only. |
| C | Animated anatomy of one system (HK GOLD) | Highest visual impact, but tells one project's story. |

The owner picked A plus a compact B.

## Design Read

Portfolio work page for recruiters and clients, in the site's own glitch-accented language (Space Grotesk headings, mono labels, brand red accent, light and dark). Dial: ENERGY 2 / RHYTHM 3 / MOTION 2.

## Page structure (top to bottom)

1. **Intro.** Eyebrow "Work", H1 "I build more than websites", one paragraph carrying the one-line message. The stats row stays (featured, projects, kinds of work, personal and school), with "kinds of work" counting the archive groups plus Open Source (finding 6).
2. **Delivery path (compact B).** One horizontal strip, wraps to a vertical list under 640px:
   `2024 School systems` → `2025 Coding Camp Top 15 · Intel AI country award · internship` → `2026 Webekspres: client sites to systems (MIRU, HK GOLD)` → `2026 CI/CD platform and open source`.
   Every step comes from the experience timeline, certificates, or project data already on the site.
3. **Capability map (A).** Five rows, each: capability name, one sentence, and the proving projects as small linked chips. One control row of six buttons above the archive: "All work" plus the five capabilities (`aria-pressed`). Choosing one filters every list below it. If a filter ever leaves a group empty, the group hides; if all are empty, show "No projects match this capability" with a reset button (R-27).
4. **Featured case studies.** Six, as now.
5. **Open Source.** As now, with the mobile padding fix (finding 3).
6. **Archive, with hierarchy (finding 7).**
   - *Web applications*: image cards.
   - *Business websites* and *Catalogs and directories*: compact rows (64px thumbnail, title, one-line subtitle, year, Live link). These are the many similar client sites, so they should take less room than the systems.

### Capability mapping (to verify against each project's copy before shipping)

| Capability | Proving projects |
|---|---|
| Turn user needs into a product | MIRU, HK GOLD VIP, E-Vote, Louise Pilates, SiPadu |
| Workflows, auth, APIs, databases | MIRU, HK GOLD VIP, E-Vote, JepangKu, Aksara Pustaka, InventoryFlow, ParkingApp, Spacelab |
| Front end to back end | JepangKu, HK GOLD VIP, BagiBerkah, CultureConnect, Smartfarm AI |
| Integrations with outside services | HK GOLD VIP (WhatsApp OTP, FCM, Resend), JepangKu (Clerk, R2, Zoom), BagiBerkah (payment, AI), Smartfarm AI (ML model), Louise Pilates (transactional email) |
| Deployment and infrastructure | Webekspres CI/CD platform, MIRU (VPS, Play release), HK GOLD VIP (CI to Play Console), JepangKu (per-app CI) |

A project stays in a row only if its case study, brief, or description says so. Drop it otherwise.

## Card fixes

- **Text (finding 2).** Cards stop showing the long problem-first description. They show the title's subtitle (the part after the colon in `title_en`, e.g. "loyalty app and back office for a gold jeweller") in full, plus the `outcome` badge when there is one. The full description stays on the detail page.
- **Mobile size (finding 1).** Below 640px, web-application cards turn horizontal (96px thumbnail beside text). Target: mobile page under 9,000px.
- **Hover-only (finding 5).** The year moves into the always-visible meta line. The image-overlay quick link goes; the footer's Live link stays and gets a 44px target.
- **Tags (finding 10).** One line, no wrap: origin plus at most two tags on mobile, three on desktop, then "+n".
- **Hover effects (finding 8).** Keep the glitch hover (site motif) and a border colour change. Drop the large shadows and the image zoom.

## Page fixes

- **Gaps (finding 4).** Section spacing `space-y-12 md:space-y-20`; remove the `h-24 md:h-32` spacer.
- **Decoration (finding 9).** Remove the three blurred orbs. Keep the node-network background (the site-wide identity motif from the home hero) and the bottom CPU "DEV" drawing (owner decision, 2026-11-07: it stays as the page's closing motif).
- **Rhythm (finding 11).** Covered by the new structure: intro, strip, map, image cards, open source, compact rows.

## Motion

- Filtering: lists cross-fade (150 to 200ms) using the existing view transition setup when available, instant under `prefers-reduced-motion`.
- Capability chips and filter buttons: hover and pressed states, visible focus ring, 44px targets.

## Decisions from the builder check (author's calls)

- **Filter scope.** The control row sits directly under the capability map, above Featured. A capability filters Featured and the archive. Open Source is outside the filter and stays visible, because none of its tools belong to a client capability.
- **Mobile cards.** Below 640px, Featured cards and archive web-application cards both turn horizontal (96px thumbnail beside text). The `ViewTransition` morph keeps working: it animates from whatever box the thumbnail occupies. Mobile target: under 10,000px (Open Source cards keep their image, so 9,000px is not realistic).
- **Thin capabilities.** The map is built from data, not fixed at five. A capability needs at least two proving projects after verification, or it is dropped and its button with it. The intro copy does not promise a number. The owner reviews the final mapping in the PR.
- **Card subtitle.** The card line is the part of `title_en` after the colon. Six titles have no colon or a slogan there (Renshuu web, E-Vote, Aksara Pustaka, Smartfarm AI, CultureConnect, and any other slogan found while building). For those, a short descriptive line lives in code as a card-subtitle override. Titles in Supabase and on detail pages are not changed here; that belongs to the site-wide copy audit.

## Left to the builder

- Component and file names, and whether the capability data sits in its own file or the taxonomy.
- Exact copy for the five capability sentences and the intro paragraph, in the site's voice (problem first, no buzzwords, no em dashes).
- How the filter state is shared between the map and the lists (lifting state in the client `ProjectsPage` is fine).
