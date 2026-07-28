---
name: performance-optimization
description: >-
  Executes the portfolio Lighthouse performance plan — enable next/image
  optimization, migrate public pages from client use-api hooks to Server
  Components / ISR, cut JS (NodeNetwork, Framer, GSAP), then measure. Use when
  the user mentions performance, Lighthouse, PageSpeed, SSR, SSG, ISR, image
  optimization, Core Web Vitals, TTFB, LCP, INP, CLS, or "optimize the site".
---

# Performance optimization

Read `docs/performance.md` for the full checklist. Follow **priority order**; do not start with Puck or new CMS tools.

## Checklist (copy and track)

```
Perf Progress:
- [ ] 1. Images: remove/disable images.unoptimized; remotePatterns; priority/sizes
- [ ] 2. SSR/ISR: server-fetch projects/companies/certificates; props into sections
- [ ] 3. JS: dynamic() heavy visuals; reduce Framer on cards; reduced-motion
- [ ] 4. Measure: Lighthouse mobile + optional bundle analyzer
- [ ] 5. graphify update . after structural changes
```

## Patterns

**Server fetch (preferred for public pages):**

```tsx
// app/(public)/page.tsx — Server Component
export const revalidate = 60

export default async function Home() {
  const supabase = await getSupabaseServerClient()
  const { data: projects } = await supabase.from("projects").select("*")
  return <Projects initialData={projects ?? []} />
}
```

**Client section keeps animation only:**

```tsx
"use client"
export function Projects({ initialData }: { initialData: Project[] }) {
  // render initialData — no useProjects() on first paint
}
```

**Images:**

- Production: `images.unoptimized` must be false/absent
- Configure `images.remotePatterns` for Supabase storage host
- Hero avatar: `priority`; lists: lazy + correct `sizes`

**Heavy client:**

```tsx
const NodeNetwork = dynamic(() => import("@/components/ui/node-network").then(m => m.NodeNetwork), { ssr: false })
```

## Out of scope

- Puck / visual page builders (does not fix SSR/fetch waterfall)
- Redesigning brand/UI unless asked

## Done when

Public home paints content without waiting on `/api/public/*` client fetches; images go through the Next optimizer; Lighthouse mobile Performance improved vs baseline (capture before/after scores in the PR).
