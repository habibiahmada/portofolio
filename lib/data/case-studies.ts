import { projects as staticProjects } from "@/lib/projects"

export type CaseStudy = {
  slug: string
  /** Must match a row in the projects list (Supabase / projects.json). */
  projectId: string
  role: string
  problem: string
  constraints: string[]
  architecture: { title: string; body: string }[]
  outcomes: string[]
  /** Story hooks instead of "01 · Problem" labels. */
  hooks?: {
    opening: string
    reality: string
    build: string
    close: string
  }
  /** When false, hidden from routes + card links. */
  published?: boolean
}

/**
 * Narrative overlay keyed by projectId.
 * Catalog fields (title, image, tags, year, live/github) come from the project list.
 * Copy follows .cursor/skills/write-like-you (no em dashes).
 */
export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "aksara-pustaka",
    projectId: "1408a39d-9eee-47a3-b939-27f48e868030",
    role: "Solo full-stack developer",
    problem:
      "Library operations were split across notebooks and ad hoc spreadsheets. Staff could not see stock, loans, and member history in one place, so overdue books and double-entries kept slipping through.",
    constraints: [
      "School or small-org hosting: PHP and MySQL, not a Node farm.",
      "Staff users needed a clear UI without training manuals.",
      "Data integrity mattered more than fancy animations: loans and returns must not diverge from stock.",
      "I shipped solo, so scope had to stay a complete vertical slice, not a half-finished CMS.",
    ],
    architecture: [
      {
        title: "Domain model",
        body: "Laravel models for books, members, loans, returns, and stock movements. Loan and return flows update stock in the same request path so counts stay honest.",
      },
      {
        title: "Admin UI",
        body: "Tailwind screens for catalog search, member lookup, and transaction history. Tables stay filterable; empty states say what to do next.",
      },
      {
        title: "Auth and roles",
        body: "Staff login with role-gated menus so casual browsers cannot mutate the catalog.",
      },
    ],
    outcomes: [
      "A single web app for catalog, members, loans, returns, and history.",
      "Fewer spreadsheet round-trips for day-to-day library work.",
      "A solo Laravel ship I can walk through end to end in an interview.",
    ],
  },
  {
    slug: "sipadu",
    projectId: "f77d37fe-acaa-4491-8d47-2b9f434149a9",
    role: "Solo full-stack developer",
    problem:
      "Facility complaints at school lived on paper or chat. Reports got lost, status was opaque, and nobody could see whether a repair was queued, in progress, or done.",
    constraints: [
      "Reporters and staff share the same system with different permissions.",
      "Status must be visible without chasing people in WhatsApp.",
      "Mobile-friendly forms: many reports start from a phone between classes.",
      "Laravel + MySQL to match what the school can host.",
    ],
    architecture: [
      {
        title: "Report lifecycle",
        body: "Tickets move through clear states (submitted, acknowledged, in progress, closed). Each transition is recorded so progress is auditable.",
      },
      {
        title: "Roles",
        body: "Students or staff file reports; facility admins triage and update. Laravel policies keep write actions on the right side of the desk.",
      },
      {
        title: "UI",
        body: "Tailwind list and detail views with status chips. Filters by status and date so open work does not drown in closed noise.",
      },
    ],
    outcomes: [
      "Facility issues track in one queue instead of vanishing into chat.",
      "Reporters can see progress without chasing staff.",
      "A practical ops tool, not a demo form that never updates.",
    ],
  },
  {
    slug: "parking-app",
    projectId: "be97de22-b78b-4fed-8a3a-88dc23994d6c",
    role: "Solo full-stack developer",
    problem:
      "Parking check-in and check-out were manual and hard to audit. Operators needed a simple flow for entry, exit, and reporting without a heavyweight ERP.",
    constraints: [
      "Operators work fast at a gate; UI must be obvious under time pressure.",
      "Reports and audit trails matter for disputes later.",
      "Keep the stack small enough to deploy without a dedicated DevOps person.",
    ],
    architecture: [
      {
        title: "Gate flow",
        body: "Check-in creates an active session; check-out closes it and stamps duration. Invalid double check-ins fail closed.",
      },
      {
        title: "Reporting",
        body: "Daily and range reports for traffic and exceptions so managers can reconcile without opening raw tables.",
      },
    ],
    outcomes: [
      "One flow for check-in, check-out, and basic audit reporting.",
      "Less reliance on handwritten logs at the gate.",
    ],
  },
  {
    slug: "inventoryflow",
    projectId: "fd57265a-c96e-40fe-98c4-4ace2a52b80c",
    role: "Solo full-stack developer",
    problem:
      "Schools and labs loan tools with spreadsheets. Approvals stall, returns go missing, and nobody trusts the current stock number.",
    constraints: [
      "Approvers and borrowers are different people with different screens.",
      "Stock must move with loans and returns, not as a separate chore.",
      "Responsive UI for staff who bounce between desk and lab.",
    ],
    architecture: [
      {
        title: "Loan pipeline",
        body: "Request, approve, hand out, return. Each step is explicit so a half-finished loan cannot silently drain stock.",
      },
      {
        title: "Inventory",
        body: "Items and quantities live in MySQL; loan events adjust availability. History stays queryable for lost-item disputes.",
      },
      {
        title: "UI",
        body: "Tailwind tables and forms for catalog, pending approvals, and active loans.",
      },
    ],
    outcomes: [
      "Loans and returns stay tied to stock in one system.",
      "Approvals are visible instead of buried in chat threads.",
      "A reusable pattern for school inventory ops.",
    ],
  },
  {
    slug: "bagiberkah",
    projectId: "169275ea-ca4a-4701-857f-1417fc4fec23",
    role: "Full-stack developer",
    problem:
      "Digital THR (holiday allowance) experiences are usually a dull transfer form. I wanted something playful that still handled money paths carefully: games for engagement, clear allocation, and real payment rails.",
    constraints: [
      "Payments must go through real providers (Mayar / Xendit), not fake success screens.",
      "Next.js client plus Express API needed a clear contract for sessions and payouts.",
      "Gamification cannot hide broken money flows; failure states have to be honest.",
      "Ship to a public Vercel URL people can actually open.",
    ],
    architecture: [
      {
        title: "Client",
        body: "Next.js UI for the THR experience, mini-games, and allocation suggestions. Keep money actions explicit and confirm before charging.",
      },
      {
        title: "API and data",
        body: "Express + Prisma for accounts, sessions, and payment records. Provider webhooks or callbacks update status; the UI never invents paid.",
      },
      {
        title: "Payments",
        body: "Mayar and Xendit integrations for the money path. Errors surface as retryable states, not silent success.",
      },
    ],
    outcomes: [
      "Live demo at bagiberkah.vercel.app.",
      "A full-stack piece that mixes product playfulness with payment seriousness.",
      "Clear split between engagement UI and money truth.",
    ],
  },
  {
    slug: "e-vote",
    projectId: "1dd8ca69-4921-4ca7-80e3-56177efaf499",
    role: "Solo full-stack developer",
    problem:
      "OSIS elections at SMKN 1 Karawang still ran on paper ballots and manual tallies. That meant queues, opaque counting, and a long wait before anyone trusted the result. I wanted a school-run digital election students could use on campus devices without turning voting day into an IT helpdesk.",
    constraints: [
      "School network and shared lab PCs: not everyone had a personal phone or a clean browser profile.",
      "One election window; no second chance if auth or ballot UX failed mid-day.",
      "Admins needed to open and close voting, manage candidates, and watch results without me on site.",
      "Stack had to match what the school could host and what I could ship alone: Laravel, Bootstrap, MySQL.",
      "Votes are sensitive. Even in a school context I treated ballot data as something you do not casually expose or overwrite.",
    ],
    architecture: [
      {
        title: "App and auth",
        body: "Laravel app with role-aware auth: voters cast once per election; admins configure candidates, schedule, and monitoring. Controllers stay thin. Eligibility and already-voted checks live close to the ballot write path so a refresh cannot double-submit.",
      },
      {
        title: "Data and integrity",
        body: "MySQL holds elections, candidates, and vote records. The cast path is a single transactional write keyed by voter and election so duplicate ballots fail closed rather than silently stacking.",
      },
      {
        title: "Ballot UX",
        body: "Bootstrap UI keeps the ballot readable on lab monitors: clear candidate cards, confirm step, then a locked already-voted state. Results stay admin-gated until the election closes.",
      },
      {
        title: "Deploy",
        body: "Deployed on school hosting at vote.smkn1karawang.sch.id. Boring ops on purpose so election day depends on process, not a fragile SPA.",
      },
    ],
    outcomes: [
      "Live production elections for OSIS at SMKN 1 Karawang.",
      "Paper queues replaced with a guided digital ballot students could finish in minutes.",
      "Admins could run the day without me sitting next to the server.",
      "A concrete full-stack ship I still point to for auth, data integrity, and real users under time pressure.",
    ],
  },
  {
    slug: "agrify",
    projectId: "bde24764-8fcf-4d67-8bb2-697cb57fb66d",
    role: "Frontend and ML integration (team of 3)",
    problem:
      "Smallholder farmers rarely get timely, local advice. Generic dashboards look impressive in demos and fail in the field. Our team built Agrify (Smartfarm AI) to turn sensor and model output into something a farmer or an extension worker could act on without reading a research paper.",
    constraints: [
      "Team of three with split ownership: models, data plumbing, and the product surface had to meet in the middle.",
      "Intel AI Global Impact Festival deadline: ship a credible demo, not a science fair poster.",
      "Inference and UX had to stay understandable on modest devices; cloud-only magic was a non-starter for the story we wanted to tell.",
      "I owned the web-facing experience: if the model was right but the UI lied, the award case still failed.",
    ],
    architecture: [
      {
        title: "Product surface",
        body: "React client that surfaces plant and soil signals as readable scores and next actions, not raw tensors. I focused on information hierarchy: what to trust first, what to verify, what to ignore under time pressure.",
      },
      {
        title: "ML handoff",
        body: "Python and ML teammates owned training and scoring. My job was a stable contract: clear payloads into the UI, honest empty and error states, and no silent fallbacks that invent confidence.",
      },
      {
        title: "Demo vs production honesty",
        body: "Festival demos tempt you to hard-code happy paths. We kept the flow wired to real model outputs where we could, and labeled limits when we could not. Judges notice vaporware faster than farmers do.",
      },
    ],
    outcomes: [
      "Indonesia country award at Intel AI Global Impact Festival 2025 (AI Changemakers). Team: Muhammad Salman Al Farisi, Muhammad Sultan Nurulloh Telaumbanua, Habibi Ahmad Aziz.",
      "A portfolio piece I can defend in interviews: my role was the usable surface, not I did the whole AI.",
      "Open client reference on GitHub (intel-farm-AI/smart-farmer-client).",
    ],
  },
  {
    slug: "culture-connect",
    projectId: "ff98b3c6-e267-4ee0-9059-9444858eacf4",
    role: "Full-stack (capstone team)",
    problem:
      "Travelers often get generic itineraries that ignore local culture and community impact. CultureConnect aimed to recommend more personal cultural experiences while keeping the product usable for real users, not just a slide deck.",
    constraints: [
      "Distributed capstone team across regions: trust and communication were part of the build.",
      "Coding Camp timeline: ship a credible product path under review pressure.",
      "Stack mix (React, Express, Python, Prisma) needed clear ownership boundaries.",
      "AI suggestions must degrade gracefully when the model is wrong or slow.",
    ],
    architecture: [
      {
        title: "Product UI",
        body: "React experience for discovery and itinerary-style recommendations. I helped keep flows understandable when model suggestions arrived late or empty.",
      },
      {
        title: "API and data",
        body: "Express and Prisma for core entities. Contract-first payloads so the UI does not depend on ad hoc JSON shapes.",
      },
      {
        title: "ML collaboration",
        body: "Python services for ranking or recommendation logic. Failures surface as fallback content, not blank screens.",
      },
    ],
    outcomes: [
      "Capstone project that reached the Coding Camp top 15.",
      "Public demo at culture-connect-iota.vercel.app.",
      "Team delivery practice: empathy, ownership, and shipping under time pressure.",
    ],
  },
  {
    slug: "spacelab",
    projectId: "13e602b8-c324-44e6-9c61-e9e40f388394",
    role: "Solo full-stack developer",
    problem:
      "School scheduling still collided: rooms double-booked, teachers overlapped, and fixes lived in spreadsheets nobody trusted by mid-semester.",
    constraints: [
      "Conflict detection has to run before a schedule is published, not after complaints.",
      "Admins need CRUD for classes, rooms, teachers, and students without a consultant on call.",
      "Laravel hosting constraints again: keep it boring and deployable.",
    ],
    architecture: [
      {
        title: "Schedule core",
        body: "Entities for classes, rooms, teachers, and time slots. Conflict checks reject overlapping room or teacher assignments before save.",
      },
      {
        title: "Admin UI",
        body: "Laravel views and JS helpers for editing schedules and scanning conflicts. Feedback is immediate when a slot is illegal.",
      },
    ],
    outcomes: [
      "A scheduling prototype that refuses obvious collisions instead of logging them after the fact.",
      "Less spreadsheet archaeology for timetable changes.",
      "Solo ownership of the full loop: model, checks, and admin UX.",
    ],
  },
  {
    slug: "renshuu",
    projectId: "f5c13a15-1bc6-4e82-8d62-d1196894d189",
    role: "Web developer intern (CV Smartplus)",
    hooks: {
      opening: "The PKL assignment",
      reality: "Working inside a company repo",
      build: "React up front, Laravel underneath",
      close: "What the internship left me with",
    },
    problem:
      "During PKL at CV Smartplus, my team and I were handed Renshuu: a job-search web app aimed at SMKN 1 Karawang students. It was not a brief I invented for the school. It was the company assignment we had to deliver together under internship deadlines.",
    constraints: [
      "I was contributing inside an existing Smartplus codebase and review process, not starting a greenfield vanity repo.",
      "The front end lived in React and the APIs in Laravel, so the first job was matching team patterns before inventing new ones.",
      "School and industry stakeholders both had opinions, and scope moved while the clock kept running.",
    ],
    architecture: [
      {
        title: "Front end",
        body: "I worked on React screens for browsing and applying to roles, staying inside the team's component and state patterns so the UI felt like one product, not a patchwork of intern experiments.",
      },
      {
        title: "API collaboration",
        body: "Laravel endpoints were owned with the Smartplus team. My side was honest consumption: loading states, empty states, and errors that matched what the API actually returned.",
      },
    ],
    outcomes: [
      "I shipped real internship contributions on a live collaboration between the school context and CV Smartplus.",
      "I practiced company review culture instead of only solo school repos.",
      "In interviews I can separate what I owned as an intern from what the company already owned.",
    ],
  },
]

const published = CASE_STUDIES.filter((c) => c.published !== false)
const bySlug = Object.fromEntries(published.map((c) => [c.slug, c]))
const slugByProjectId = Object.fromEntries(
  published.map((c) => [c.projectId, c.slug]),
)

/** Case studies whose projectId exists in the static project catalog. */
export function getLinkedCaseStudies() {
  const projectIds = new Set(staticProjects.map((p) => p.id))
  return published.filter((c) => projectIds.has(c.projectId))
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  const study = bySlug[slug]
  if (!study) return undefined
  if (!staticProjects.some((p) => p.id === study.projectId)) return undefined
  return study
}

export function getCaseStudySlugByProjectId(
  projectId: string,
): string | undefined {
  if (!staticProjects.some((p) => p.id === projectId)) return undefined
  return slugByProjectId[projectId]
}

export function getCaseStudySlugs(): string[] {
  return getLinkedCaseStudies().map((c) => c.slug)
}

/** Neighbors follow project list order (same order as Work archive). */
export function getAdjacentCaseStudies(slug: string) {
  const order = staticProjects
    .map((p) => slugByProjectId[p.id])
    .filter((s): s is string => Boolean(s))
  const i = order.indexOf(slug)
  if (i < 0) return { prev: null, next: null }
  const prevSlug = i > 0 ? order[i - 1]! : null
  const nextSlug = i < order.length - 1 ? order[i + 1]! : null
  return {
    prev: prevSlug ? (bySlug[prevSlug] ?? null) : null,
    next: nextSlug ? (bySlug[nextSlug] ?? null) : null,
  }
}
