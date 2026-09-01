import { projects as catalogProjects } from "@/lib/projects"

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
    /** Optional intro under section 02–04 titles. */
    realityLead?: string
    buildLead?: string
    closeLead?: string
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
    hooks: {
      opening: "The catalog lived in notebooks",
      reality: "Small hosting, real librarians",
      build: "Laravel as one vertical slice",
      close: "What daily ops look like now",
      realityLead:
        "School libraries run on tight budgets and staff who cannot afford a broken loan flow. These constraints kept the product honest.",
      buildLead:
        "Every screen had to tie back to stock and member history, not decorative CRUD.",
      closeLead:
        "The win was operational: fewer double entries and one place to answer what is on loan today.",
    },
    problem:
      "Library operations at school were split across notebooks and ad hoc spreadsheets. Staff could not see stock, active loans, and member history in one place, so overdue books and double-entries kept slipping through every semester.",
    constraints: [
      "Hosting had to stay PHP and MySQL on modest school infrastructure, not a Node farm or managed Postgres the lab would never maintain.",
      "Staff users are not developers. Screens had to be obvious on first open: search a book, find a member, record a loan, close a return, without a training manual.",
      "Data integrity beat animations. A loan and return must update stock in the same request path; partial writes that leave counts wrong are worse than a plain UI.",
      "I shipped solo, so scope had to be a complete vertical slice (catalog, members, transactions, history), not a half-finished CMS that still sends people back to spreadsheets.",
    ],
    architecture: [
      {
        title: "Domain model",
        body: "Laravel models for books, members, loans, returns, and stock movements. Loan and return flows update availability in the same transaction so on-hand counts stay aligned with what is actually on the shelf.",
      },
      {
        title: "Admin UI",
        body: "Tailwind screens for catalog search, member lookup, and transaction history. Tables stay filterable; empty states say what to do next instead of showing a blank grid that looks like a bug.",
      },
      {
        title: "Auth and roles",
        body: "Staff login with role-gated menus so casual browsers cannot mutate the catalog. The auth boundary matches who actually works the front desk, not a generic admin flag.",
      },
    ],
    outcomes: [
      "One web app for catalog, members, loans, returns, and history instead of three overlapping spreadsheets.",
      "Fewer manual round-trips for day-to-day library work: staff can answer what is out on loan without opening last week's notebook.",
      "A solo Laravel ship I can walk through end to end in an interview, from schema to gate flow to staff screens.",
    ],
  },
  {
    slug: "sipadu",
    projectId: "f77d37fe-acaa-4491-8d47-2b9f434149a9",
    role: "Solo full-stack developer",
    hooks: {
      opening: "Complaints vanished into chat",
      reality: "Two roles, one queue",
      build: "Tickets with a visible lifecycle",
      close: "Progress you can see without chasing",
      realityLead:
        "Facility teams already juggle repairs between classes. The product had to reduce WhatsApp noise, not add another inbox nobody checks.",
      buildLead:
        "Status, permissions, and mobile-friendly forms had to work together or reporters would go back to paper.",
      closeLead:
        "Success meant a report stayed visible from filed to closed, with a trail staff could defend.",
    },
    problem:
      "Facility complaints at school lived on paper or chat. Reports got lost, status was opaque, and nobody could see whether a repair was queued, in progress, or done without chasing someone in WhatsApp.",
    constraints: [
      "Reporters and facility staff share one system with different permissions. Students file; admins triage and update. Blurring those roles creates either spam or locked queues.",
      "Status must be visible without chasing people. If the UI hides state behind admin-only pages, reporters stop trusting the tool.",
      "Many reports start from a phone between classes. Forms and list views had to work on small screens, not only on a staff desktop.",
      "Stack stayed Laravel and MySQL to match what the school can host and what I could maintain solo after handover.",
    ],
    architecture: [
      {
        title: "Report lifecycle",
        body: "Tickets move through clear states (submitted, acknowledged, in progress, closed). Each transition is recorded with a timestamp so progress is auditable when someone asks what happened last week.",
      },
      {
        title: "Roles",
        body: "Students or staff file reports; facility admins triage and update. Laravel policies keep write actions on the right side of the desk so a reporter cannot close someone else's ticket.",
      },
      {
        title: "UI",
        body: "Tailwind list and detail views with status chips. Filters by status and date so open work does not drown in closed noise, and reporters can open one link and see where their report sits.",
      },
    ],
    outcomes: [
      "Facility issues track in one queue instead of vanishing into chat threads or lost paper slips.",
      "Reporters can see progress without chasing staff, which was the main adoption test.",
      "A practical ops tool with a real lifecycle, not a demo form that accepts submissions and never updates them.",
    ],
  },
  {
    slug: "parking-app",
    projectId: "be97de22-b78b-4fed-8a3a-88dc23994d6c",
    role: "Solo full-stack developer",
    hooks: {
      opening: "Gate logs were not auditable",
      reality: "Seconds matter at the booth",
      build: "Sessions that fail closed",
      close: "Reports managers can trust",
      realityLead:
        "Operators work under time pressure at entry and exit. Confusing UI or silent double check-ins would break trust faster than a missing chart.",
      buildLead:
        "Check-in, check-out, and reporting had to share one session model so disputes had a paper trail.",
      closeLead:
        "The product was done when managers could reconcile a day without opening raw database tables.",
    },
    problem:
      "Parking check-in and check-out were manual and hard to audit. Operators needed a simple flow for entry, exit, and reporting without a heavyweight ERP or a spreadsheet someone edits at shift change.",
    constraints: [
      "Operators work fast at a gate. UI must be obvious under time pressure: large actions, minimal steps, no nested menus during rush hour.",
      "Reports and audit trails matter for disputes later. A session record had to show who entered, when, and how long they stayed.",
      "Stack stayed small enough to deploy without a dedicated DevOps person: Laravel, MySQL, and a host the operator already uses.",
      "Invalid operations must fail closed. Double check-ins or check-outs without an active session should reject clearly, not create ghost records.",
    ],
    architecture: [
      {
        title: "Gate flow",
        body: "Check-in creates an active session with plate and timestamp; check-out closes it and stamps duration. Invalid double check-ins fail closed with a message the operator can read at a glance.",
      },
      {
        title: "Reporting",
        body: "Daily and range reports for traffic and exceptions so managers can reconcile without opening raw tables or asking the developer to export CSVs.",
      },
      {
        title: "Operator UI",
        body: "Tailwind screens tuned for booth use: high-contrast actions, minimal navigation, and immediate feedback when a session state is wrong.",
      },
    ],
    outcomes: [
      "One flow for check-in, check-out, and basic audit reporting instead of handwritten gate logs.",
      "Less reliance on memory and paper when a vehicle disputes how long it stayed.",
      "A solo ops prototype I can explain as a session model with fail-closed rules, not just CRUD with parking in the title.",
    ],
  },
  {
    slug: "inventoryflow",
    projectId: "fd57265a-c96e-40fe-98c4-4ace2a52b80c",
    role: "Solo full-stack developer",
    hooks: {
      opening: "Spreadsheets could not track loans",
      reality: "Borrowers and approvers disagree by default",
      build: "Stock moves with every handoff",
      close: "Inventory people can argue with",
      realityLead:
        "Labs loan tools between classes. If approvals stall or returns go missing, everyone stops trusting the number on the sheet.",
      buildLead:
        "Each loan step had to be explicit so half-finished requests cannot silently drain stock.",
      closeLead:
        "Done meant approvers, borrowers, and stock counts pointed at the same history.",
    },
    problem:
      "Schools and labs loan tools with spreadsheets. Approvals stall, returns go missing, and nobody trusts the current stock number when two teachers need the same kit the same week.",
    constraints: [
      "Approvers and borrowers are different people with different screens. Borrowers request; staff approve and hand out. Mixing those flows creates either bottlenecks or unauthorized loans.",
      "Stock must move with loans and returns, not as a separate end-of-day chore someone forgets.",
      "Responsive UI for staff who bounce between desk and lab. Pending approvals need to be visible on a phone in the storage room.",
      "History had to survive disputes: who had item X last semester is a real question, not a nice-to-have.",
    ],
    architecture: [
      {
        title: "Loan pipeline",
        body: "Request, approve, hand out, return. Each step is explicit so a half-finished loan cannot silently drain stock or leave an item marked available while it is still in a student's bag.",
      },
      {
        title: "Inventory",
        body: "Items and quantities live in MySQL; loan events adjust availability. History stays queryable for lost-item disputes and end-of-year audits.",
      },
      {
        title: "UI",
        body: "Tailwind tables and forms for catalog, pending approvals, and active loans. Status chips and filters keep open work visible without exporting to Excel.",
      },
    ],
    outcomes: [
      "Loans and returns stay tied to stock in one system instead of three inconsistent spreadsheets.",
      "Approvals are visible instead of buried in chat threads or verbal OKs in the hallway.",
      "A reusable pattern for school inventory ops I can compare to library and facility tools in the same portfolio.",
    ],
  },
  {
    slug: "bagiberkah",
    projectId: "169275ea-ca4a-4701-857f-1417fc4fec23",
    role: "Full-stack developer",
    hooks: {
      opening: "THR did not have to feel like a receipt",
      reality: "Playful surface, serious money path",
      build: "Next.js up front, Express and Prisma behind",
      close: "What shipped and what stayed honest",
      realityLead:
        "Mini-games and playful copy attract clicks; payment providers decide truth. Those two paths could not contradict each other.",
      buildLead:
        "The client and API contract had to make money state visible at every step, not hide behind optimistic UI.",
      closeLead:
        "Public demo plus honest payment handling is the combination I still use when interviewers ask about fintech-ish side projects.",
    },
    problem:
      "Digital THR (holiday allowance) experiences are usually a dull transfer form. I wanted something playful that still handled money paths carefully: mini-games for engagement, clear allocation choices, and real payment rails instead of fake success screens.",
    constraints: [
      "Payments had to go through real providers (Mayar / Xendit). A green checkmark on the UI could not mean paid unless the provider confirmed it.",
      "The Next.js client and Express API needed a strict contract for sessions, allocations, and payout status so the front end never guessed state.",
      "Gamification could not hide broken money flows. Failed charges, timeouts, and partial sessions had to stay visible to the user.",
      "The product had to ship to a public Vercel URL that anyone could open, not a localhost demo buried in a README.",
    ],
    architecture: [
      {
        title: "Client experience",
        body: "Next.js UI for the THR flow, mini-games, and allocation suggestions. Money actions stay explicit: confirm before charge, show provider state after, and never overwrite a failed payment with cheerful copy.",
      },
      {
        title: "API and data",
        body: "Express + Prisma for accounts, sessions, and payment records. Webhooks or provider callbacks update status in the database; the UI reads that truth instead of optimistically marking success.",
      },
      {
        title: "Payments",
        body: "Mayar and Xendit integrations for the actual transfer path. Errors surface as retryable states with plain language, not silent success or mystery spinners.",
      },
    ],
    outcomes: [
      "Live demo at bagiberkah.vercel.app that people can walk through without me narrating over localhost.",
      "A full-stack piece that mixes product playfulness with payment seriousness, which is a harder balance than either side alone.",
      "Clear separation between engagement UI and money truth, so I can explain the architecture in interviews without hand-waving the payment layer.",
    ],
  },
  {
    slug: "e-vote",
    projectId: "1dd8ca69-4921-4ca7-80e3-56177efaf499",
    role: "Solo full-stack developer",
    hooks: {
      opening: "Paper ballots were the bottleneck",
      reality: "One election day, no second take",
      build: "Laravel, Bootstrap, and votes that fail closed",
      close: "What production actually proved",
      realityLead:
        "OSIS voting happens once, on shared lab machines, with admins who are teachers—not full-time IT. There was no room for fragile auth or ambiguous ballot state.",
      buildLead:
        "Every layer from eligibility check to results lock had to assume someone would refresh, double-click, or open two tabs.",
      closeLead:
        "Production on vote.smkn1karawang.sch.id is the proof: real students, real admins, one election window.",
    },
    problem:
      "OSIS elections at SMKN 1 Karawang still ran on paper ballots and manual tallies. That meant queues, opaque counting, and a long wait before anyone trusted the result. I wanted a school-run digital election students could use on campus devices without turning voting day into an IT helpdesk.",
    constraints: [
      "School network and shared lab PCs: not everyone had a personal phone or a clean browser profile, so the ballot had to work on machines I did not control.",
      "One election window; no second chance if auth or ballot UX failed mid-day. Downtime during voting hours was not an acceptable tradeoff.",
      "Admins needed to open and close voting, manage candidates, and watch results without me on site. The ops path had to be boring and obvious.",
      "Stack had to match what the school could host and what I could ship alone: Laravel, Bootstrap, MySQL.",
      "Votes are sensitive. Even in a school context I treated ballot data as something you do not casually expose, overwrite, or leave editable after cast.",
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
        body: "Bootstrap UI keeps the ballot readable on lab monitors: clear candidate cards, a confirm step, then a locked already-voted state. Results stay admin-gated until the election closes so early leaks do not poison trust.",
      },
      {
        title: "Deploy",
        body: "Deployed on school hosting at vote.smkn1karawang.sch.id. I kept ops deliberately simple so election day depended on process and backups, not a fragile SPA toolchain.",
      },
    ],
    outcomes: [
      "Live production elections for OSIS at SMKN 1 Karawang, not a classroom prototype.",
      "Paper queues replaced with a guided digital ballot students could finish in minutes on shared lab machines.",
      "Admins could run the full day without me sitting next to the server, which was the real acceptance test.",
      "A concrete full-stack ship I still point to for auth, data integrity, and real users under time pressure.",
    ],
  },
  {
    slug: "agrify",
    projectId: "bde24764-8fcf-4d67-8bb2-697cb57fb66d",
    role: "Frontend and ML integration (team of 3)",
    hooks: {
      opening: "Farmers need advice, not tensors",
      reality: "Three people, one festival deadline",
      build: "React surface on a Python ML pipeline",
      close: "What the award actually measured",
      realityLead:
        "Intel AI Global Impact Festival judges care about impact and clarity, not notebook accuracy alone. Our constraint was explainability under demo pressure.",
      buildLead:
        "The React client had to translate model output into next actions a farmer or extension worker could use without reading feature importances.",
      closeLead:
        "Country award on a team of three, with my lane on the React surface and ML integration.",
    },
    problem:
      "Smallholder farmers rarely get timely, local advice. Generic dashboards look impressive in demos and fail in the field. Our team built Agrify (Smartfarm AI) to turn sensor and model output into something a farmer or an extension worker could act on without reading a research paper.",
    constraints: [
      "Team of three with split ownership: models, data plumbing, and the product surface had to meet in the middle without each person silently rewriting the contract.",
      "Intel AI Global Impact Festival deadline: ship a credible demo, not a science fair poster with screenshots of fake charts.",
      "Inference and UX had to stay understandable on modest devices; cloud-only magic was a non-starter for the story we wanted to tell judges and farmers.",
      "I owned the web-facing experience. If the model was right but the UI lied, the award case still failed regardless of notebook accuracy.",
    ],
    architecture: [
      {
        title: "Product surface",
        body: "React client that surfaces plant and soil signals as readable scores and next actions, not raw tensors. I focused on information hierarchy: what to trust first, what to verify in the field, and what to ignore when time is short.",
      },
      {
        title: "ML handoff",
        body: "Python and ML teammates owned training and scoring. My job was a stable contract: clear payloads into the UI, honest empty and error states, and no silent fallbacks that invent confidence when the model hesitates.",
      },
      {
        title: "Festival demo wiring",
        body: "Festival demos tempt you to hard-code happy paths. We kept the flow wired to real model outputs where we could, and labeled limits when we could not. Judges notice vaporware faster than farmers do.",
      },
    ],
    outcomes: [
      "Indonesia country award at Intel AI Global Impact Festival 2025 (AI Changemakers). Team: Muhammad Salman Al Farisi, Muhammad Sultan Nurulloh Telaumbanua, Habibi Ahmad Aziz.",
      "A portfolio piece centered on the usable surface and integration between model output and the farmer-facing UI.",
      "Proof that I can sit between ML output and human decision-making without turning the UI into a dashboard cosplay.",
    ],
  },
  {
    slug: "culture-connect",
    projectId: "ff98b3c6-e267-4ee0-9059-9444858eacf4",
    role: "Full-stack (capstone team)",
    hooks: {
      opening: "Itineraries were too generic",
      reality: "Distributed team, fixed camp deadline",
      build: "React, Express, Prisma, and Python in one product",
      close: "What capstone actually tested",
      realityLead:
        "Coding Camp was as much about team delivery as code. Async handoffs and scope fights were part of the product risk.",
      buildLead:
        "Three runtimes only work when JSON contracts stay stable; the UI had to survive slow or wrong model responses.",
      closeLead:
        "Top 15 finish and a public Vercel demo matter because external judges could open the app, not just our slides.",
    },
    problem:
      "Travelers often get generic itineraries that ignore local culture and community impact. CultureConnect aimed to recommend more personal cultural experiences while keeping the product usable for real users, not just a slide deck.",
    constraints: [
      "Distributed capstone team across regions: trust, async communication, and clear ownership were part of the build, not a side note.",
      "Coding Camp timeline: ship a credible product path under review pressure, not a slide deck with mock screenshots.",
      "Stack mix (React, Express, Python, Prisma) needed explicit boundaries so nobody silently changed JSON shapes the UI depended on.",
      "AI suggestions had to degrade gracefully when the model was wrong or slow; blank screens were worse than honest fallback content.",
    ],
    architecture: [
      {
        title: "Product UI",
        body: "React experience for discovery and itinerary-style recommendations. I helped keep flows understandable when model suggestions arrived late, empty, or partially wrong, so users still knew what to do next.",
      },
      {
        title: "API and data",
        body: "Express and Prisma for core entities. Contract-first payloads so the UI does not depend on ad hoc JSON shapes that change every sprint.",
      },
      {
        title: "ML collaboration",
        body: "Python services for ranking or recommendation logic. Failures surface as fallback content and copy that admits uncertainty, not infinite loading states.",
      },
    ],
    outcomes: [
      "Capstone project that reached the Coding Camp top 15, which validated the product path under real review, not just internal team applause.",
      "Public demo at culture-connect-iota.vercel.app that judges and classmates could open without a guided tour.",
      "Team delivery practice I still reference: empathy, ownership splits, and shipping under a hard external deadline.",
    ],
  },
  {
    slug: "spacelab",
    projectId: "13e602b8-c324-44e6-9c61-e9e40f388394",
    role: "Solo full-stack developer",
    hooks: {
      opening: "Schedules collided every semester",
      reality: "Conflicts before publish, not after",
      build: "Laravel checks on real entities",
      close: "Less spreadsheet archaeology",
      realityLead:
        "Timetable mistakes show up on Monday morning, not in a unit test. The system had to block illegal slots before anyone printed a schedule.",
      buildLead:
        "Classes, rooms, teachers, and time slots needed one model so overlap rules had a single source of truth.",
      closeLead:
        "Success was an admin who could change a schedule and see conflicts immediately, not a CSV export and prayer.",
    },
    problem:
      "School scheduling still collided every semester: rooms double-booked, teachers overlapped, and fixes lived in spreadsheets nobody trusted by mid-term. I built SpaceLab to catch conflicts before a schedule went public.",
    constraints: [
      "Conflict detection had to run before publish, not after parents complain. Saving an illegal slot should fail with a clear reason, not a note in row 47.",
      "Admins need CRUD for classes, rooms, teachers, and students without calling a developer for every timetable tweak.",
      "Laravel hosting constraints again: keep deployment boring so the school can run it on familiar PHP hosting.",
      "Solo scope meant one coherent admin loop, not a student portal and a mobile app that never ship.",
    ],
    architecture: [
      {
        title: "Schedule core",
        body: "Entities for classes, rooms, teachers, and time slots. Conflict checks reject overlapping room or teacher assignments before save, with messages that point at which constraint broke.",
      },
      {
        title: "Admin UI",
        body: "Laravel views and JS helpers for editing schedules and scanning conflicts. Feedback is immediate when a slot is illegal, so admins do not discover collisions after printing.",
      },
      {
        title: "Publish boundary",
        body: "Draft edits stay separate from published timetables where possible, so experimenting with a week does not overwrite what teachers already follow.",
      },
    ],
    outcomes: [
      "A scheduling prototype that refuses obvious collisions instead of logging them after the fact.",
      "Less spreadsheet archaeology when the semester shifts and three rooms change at once.",
      "Solo ownership of the full loop: model, checks, admin UX, and the story of why fail-closed beats post-hoc fixes.",
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
      realityLead:
        "Renshuu came from CV Smartplus as the PKL brief: a job-search web app for SMKN 1 Karawang students, with internship deadlines already set.",
      buildLead:
        "My work was real screens on real endpoints: loading, empty, and error states that matched API behavior the team already shipped.",
      closeLead:
        "Shipping inside company review cycles, with a clear picture of what I touched on the React side versus what Smartplus already owned.",
    },
    problem:
      "During PKL at CV Smartplus, my team and I were handed Renshuu: a job-search web app aimed at SMKN 1 Karawang students. CV Smartplus set the brief and timeline; our job was to deliver it together under internship deadlines.",
    constraints: [
      "The codebase and review process were already in place at Smartplus, so the first task was fitting new screens into existing React and Laravel patterns.",
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
        body: "Laravel endpoints were owned with the Smartplus team. My side was tight API consumption: loading states, empty states, and errors that matched what the API actually returned.",
      },
    ],
    outcomes: [
      "I shipped internship work on a live collaboration between the school context and CV Smartplus.",
      "I practiced company review culture instead of only solo school repos.",
      "Clear memory of what I owned on the React screens versus what the company already maintained.",
    ],
  },
  {
    slug: "jepangku",
    projectId: "36b5bfa0-db1f-51cd-8861-8eac729f2afb",
    role: "Web Developer at PT Webekspres Teknologi Indonesia",
    hooks: {
      opening: "A community that needed more than a brochure",
      reality: "One product, several apps",
      build: "News on Next.js, identity in Core",
      close: "What I can stand behind",
      realityLead:
        "JepangKu spans several apps under one brand. This write-up follows the news portal at jepangku.com: articles, quizzes, polls, and the gamification path readers use today.",
      buildLead:
        "Clerk SSO into Core JWT meant the news app could trust XP and roles without duplicating user tables that drift over time.",
      closeLead:
        "Production readers at jepangku.com, scoped to the news surface I helped ship on the Webekspres team.",
    },
    problem:
      "JepangKu needed a live community portal: articles, quizzes, polls, and XP, not a company-profile WordPress theme. On the Webekspres team I worked on the news portal: reader modules, admin CMS, and Core auth integration.",
    constraints: [
      "Auth and XP had to stay consistent across apps. Clerk login issues a Core JWT; the news app verifies it instead of inventing a second user table that would drift from Core.",
      "Core and news are shared team codebases. My work sat at the intersection: news modules, CMS paths, and JWT verification against Core claims.",
      "Admin CMS, comments, and leaderboards had to ship on a production Cloudflare/Next.js host that real readers open, not a staging URL we only demo internally.",
      "Gamification (quizzes, polls, XP) had to feel native to reading, not bolted on as a separate mini-app with its own login.",
    ],
    architecture: [
      {
        title: "News surface",
        body: "Next.js portal at jepangku.com for articles, quizzes, polls, and gamification UI. I worked on reader-facing modules and the admin CMS path editors use to publish without touching code.",
      },
      {
        title: "Shared identity",
        body: "Clerk SSO into a Bun/Elysia Core API on PostgreSQL. News verifies Core JWT claims (XP, level, roles) so points do not drift between surfaces when a user moves between apps.",
      },
      {
        title: "News portal focus",
        body: "Other JepangKu surfaces (LMS, job board) live in separate apps. Here the focus stays on the public news portal: what ships at jepangku.com and how it shares identity with Core.",
      },
    ],
    outcomes: [
      "Production at jepangku.com with real readers, not a localhost walkthrough.",
      "A Webekspres team ship centered on the news portal: reader-facing modules, CMS, and shared auth with Core.",
      "Proof I can work in a multi-app auth setup and ship on modern Next.js, not only WordPress landing pages.",
    ],
  },
  {
    slug: "terraju",
    projectId: "d62e4264-031d-5926-8b5f-a8c67bb2daac",
    role: "Web Developer at PT Webekspres Teknologi Indonesia",
    hooks: {
      opening: "Tourism info was scattered",
      reality: "A directory, not a brochure",
      build: "WordPress categories people can browse",
      close: "Live and local",
      realityLead:
        "Terraju is regional discovery for Sumbawa visitors: destinations, UMKM, and coffeeshops to browse. Package tours were still marked coming soon, so the IA stayed directory-first.",
      buildLead:
        "WordPress taxonomies and Elementor layouts let editors grow listings without redeploying code for every new coffeeshop.",
      closeLead:
        "terraju.id is the proof: browseable categories today, not a staging export or admin screenshot.",
    },
    problem:
      "Regional tourism and UMKM listings lived in chats and one-off posts. Terraju needed one public directory for destinations, coffee shops, local businesses, and souvenir centers that visitors could actually browse. I developed the site structure and front-end on the Webekspres team.",
    constraints: [
      "A curated directory, not checkout. Package tours were still marked coming soon on the live site, so browse paths and category IA came first.",
      "Editors had to add listings without a custom app. WordPress categories and Elementor had to carry the information architecture editors already understood.",
      "The listings are client content; my work was category structure, public browse paths, and the Elementor front-end build.",
      "Performance and readability on mobile mattered because tourists search on phones, not desktop dashboards.",
    ],
    architecture: [
      {
        title: "Portal structure",
        body: "WordPress + Elementor at terraju.id. Homepage taxonomies for wisata, UMKM, oleh-oleh, and coffeeshop, plus a news section. Each listing type gets detail pages editors can extend without redeploying code.",
      },
      {
        title: "Editor workflow",
        body: "Content teams add destinations and businesses through the CMS. My work was making the public browse path obvious: category landing, filtered lists, and detail pages that do not dead-end.",
      },
      {
        title: "Delivery",
        body: "Production on LiteSpeed/Exabytes. Public proof is the live directory at terraju.id, not an admin screenshot or a local export.",
      },
    ],
    outcomes: [
      "Live at terraju.id with browseable categories visitors can open today.",
      "WordPress directory work on the Webekspres team, complementing JepangKu's Next.js stack on the same roster.",
      "Clear scope: content portal and local discovery, with checkout left for a later phase.",
    ],
  },
  {
    slug: "miru",
    projectId: "dfd144d5-84d7-5f1f-be03-1554dee928b1",
    role: "Web Developer at PT Webekspres Teknologi Indonesia",
    hooks: {
      opening: "A waste bank is not a landing page",
      reality: "Field staff, admin, and a mobile app",
      build: "Next.js admin on a Django API",
      close: "Shipped code, domain still waiting",
      realityLead:
        "Bank sampah ops span petugas in the field, admins at a desk, and nasabah on mobile. The web admin is only one leg of that tripod.",
      buildLead:
        "JWT-backed Django REST is the single source of truth; the admin never caches shadow balances that disagree with the API.",
      closeLead:
        "Shipped admin UI and API integration; the public domain was still pending when this was documented.",
    },
    problem:
      "Bank sampah operations (deposit, pickup, weigh-in, points, rewards) cannot live in a spreadsheet once petugas, admins, and a district coordinator share the same queue. MIRU needed an ops platform. I contributed on the Webekspres team, mainly the web admin and API integration.",
    constraints: [
      "Nasabah use a separate mobile app. The web admin is for staff roles: petugas, admin, and coordinator workflows.",
      "No local database in the admin. It talks to a Django REST API with JWT, so there is one source of truth for transactions and balances.",
      "The public domain had not resolved at audit time; delivery proof sits in the shipped admin UI and API integration.",
      "Role screens (petugas, admin, coordinator) had to reflect real workflows: setoran, jemput, timbang, poin, redeem, not generic CRUD with green labels.",
    ],
    architecture: [
      {
        title: "Admin surface",
        body: "Next.js 16 + TypeScript + Tailwind. Role-aware screens for petugas (deposit, pickup, weigh), admins (nasabah, pricing, partners, reports), and read-heavy coordinator views that monitor district activity.",
      },
      {
        title: "API and infra",
        body: "Django REST on PostgreSQL. Docker, nginx, and MinIO in the infra layer. The admin consumes JSON envelopes and surfaces errors; it does not cache a shadow copy of balances.",
      },
      {
        title: "Workflow design",
        body: "Setoran, jemput, timbang, poin, and reward redeem are explicit states with UI that matches how petugas actually work in the field. That is the product, not a contact form with an eco icon.",
      },
    ],
    outcomes: [
      "Shipped admin and API integration on the Webekspres team, with a codebase I can walk through in interviews.",
      "Delivery and DNS are separate milestones: the admin shipped even though the custom domain was still pending.",
      "Web ops surface on the team; nasabah flows stay in the separate mobile app.",
    ],
  },
  {
    slug: "luzins-academy",
    projectId: "ecbcd798-00c0-5c63-8b51-4a3ad1708fff",
    role: "Web Developer at PT Webekspres Teknologi Indonesia",
    hooks: {
      opening: "A training brand that needed a real landing page",
      reality: "Not another Elementor theme",
      build: "React, Vite, TanStack, Tailwind",
      close: "Live and specific",
      realityLead:
        "Luzins sells workshops with changing packages and promo copy. Marketing velocity mattered as much as first-load aesthetics.",
      buildLead:
        "Structured package data and a conversion-first section order: proof before adjectives, WhatsApp before a buried contact form.",
      closeLead:
        "luzinsworkshop.web.id is open proof; the story is team delivery on a custom React stack, not a theme swap.",
    },
    problem:
      "Luzins Academy sells public-speaking workshops. They needed a conversion landing page with packages, proof, and WhatsApp, not a generic company profile. I developed it on the Webekspres team.",
    constraints: [
      "Package prices and promo copy change often. The package section had to stay data-driven so marketing updates did not require a developer every week.",
      "Gallery and video proof matter more than a long about-us essay. The page had to sell with evidence, not adjectives.",
      "Ship on Vercel with a .web.id domain the client actually opens, not a default Vercel subdomain we keep as the real URL.",
      "Custom React stack was chosen deliberately to differentiate from the WordPress catalog work elsewhere in the client roster.",
    ],
    architecture: [
      {
        title: "Landing composition",
        body: "React + TypeScript + Vite + TanStack Router + Tailwind + shadcn. Hero, coach profile, six modules, dynamic packages, photo gallery, YouTube embed, testimonials, FAQ, and WhatsApp CTA wired as one conversion path.",
      },
      {
        title: "Dynamic packages",
        body: "Package cards pull from structured data so price changes and promos do not require hunting through JSX. Editors get predictable sections; developers get fewer one-off hotfixes.",
      },
      {
        title: "Delivery",
        body: "Production at luzinsworkshop.web.id on Vercel. The live site is the proof, not a Loom recording or a staging branch.",
      },
    ],
    outcomes: [
      "A custom landing page in production, distinct from the WordPress catalog work in the same client portfolio.",
      "Custom React landing page for Luzins Academy, developed on the Webekspres team.",
      "A reference for custom frontend delivery when WordPress is not the right tool.",
    ],
  },
  {
    slug: "ptmgc",
    projectId: "d7401d61-cd67-5430-a574-122d35e61cc4",
    role: "Web Developer at PT Webekspres Teknologi Indonesia",
    hooks: {
      opening: "The site was done. The domain was not.",
      reality: "Client kept hosting access",
      build: "TanStack Start, not WordPress",
      close: "Proof while DNS catches up",
      realityLead:
        "Delivery and DNS handover are separate milestones. ptmgc.co.id still shows the Rumahweb default page, so this case study leans on the finished build.",
      buildLead:
        "TanStack Start gave a composed corporate page with centralized SEO metadata, not a CMS the client could break without us.",
      closeLead:
        "Finished build output until the client points the domain at our deployment.",
    },
    problem:
      "PT Mustika Galuh Cakrawala (MGC) needed a construction and trading company site with a serious visual system. I built it with TanStack Start on the Webekspres team. The client did not hand over cPanel/DNS, so ptmgc.co.id still shows the Rumahweb default page.",
    constraints: [
      "ptmgc.co.id still shows the registrar default page, so delivery proof is the finished build, not a screenshot of hosting.",
      "The legal name is Mustika Galuh Cakrawala, not a similar-sounding holding company from an old recap sheet.",
      "The project grew from a Lovable scaffold into a composed TanStack Start marketing site.",
      "The marketing site is one composed page with SEO metadata, not a CMS the client can edit without us.",
    ],
    architecture: [
      {
        title: "App composition",
        body: "TanStack Start + React 19 + Vite + Tailwind + shadcn. Sections for hero, about, industries, process, quality and safety, and WhatsApp CTA. SEO and JSON-LD live in lib/seo.ts so metadata stays centralized.",
      },
      {
        title: "Visual system",
        body: "Brand assets, OG image, and PWA icons ship with the repo. The design is intentional corporate positioning, not a stock WordPress theme with swapped logos.",
      },
      {
        title: "Delivery while DNS is pending",
        body: "Build output and deployment artifacts are the proof until the client points DNS. Code finished; hosting handover still with the client.",
      },
    ],
    outcomes: [
      "A finished custom corporate site with a modern stack beyond WordPress company profiles.",
      "A delivery story I use in interviews: the build can be done while DNS is still on the registrar default page.",
      "TanStack Start implementation on the Webekspres team; public domain awaits client DNS handover.",
    ],
  },
]

const published = CASE_STUDIES.filter((c) => c.published !== false)
const bySlug = Object.fromEntries(published.map((c) => [c.slug, c]))
const slugByProjectId = Object.fromEntries(
  published.map((c) => [c.projectId, c.slug]),
)

export function getLinkedCaseStudies() {
  const catalogIds = new Set(catalogProjects.map((p) => p.id))
  return published.filter((c) => catalogIds.has(c.projectId))
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  const study = bySlug[slug]
  if (!study) return undefined
  if (!catalogProjects.some((p) => p.id === study.projectId)) return undefined
  return study
}

export function getCaseStudySlugByProjectId(
  projectId: string,
): string | undefined {
  if (!catalogProjects.some((p) => p.id === projectId)) return undefined
  return slugByProjectId[projectId]
}

export function getCaseStudySlugs(): string[] {
  return getLinkedCaseStudies().map((c) => c.slug)
}

/** Neighbors follow project list order (same order as Work archive). */
export function getAdjacentCaseStudies(slug: string) {
  const order = catalogProjects
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
