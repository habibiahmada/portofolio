/**
 * What the Work page claims I can do, and the projects that prove each claim.
 * A project is listed only when its own case study, brief, or description
 * says so. A capability with fewer than two proving projects is not shown.
 */
export type CapabilityId = "product" | "systems" | "full-stack" | "integrations" | "delivery"

export type Capability = {
  id: CapabilityId
  label: string
  sentence: string
  projectIds: string[]
}

const P = {
  miru: "dfd144d5-84d7-5f1f-be03-1554dee928b1",
  hkGold: "958d7eda-2748-52ee-a9b3-f408a112d136",
  eVote: "1dd8ca69-4921-4ca7-80e3-56177efaf499",
  louise: "08ad34a3-c3f9-4630-817e-e08140f6b0ad",
  sipadu: "f77d37fe-acaa-4491-8d47-2b9f434149a9",
  jepangku: "36b5bfa0-db1f-51cd-8861-8eac729f2afb",
  aksara: "1408a39d-9eee-47a3-b939-27f48e868030",
  inventoryflow: "fd57265a-c96e-40fe-98c4-4ace2a52b80c",
  parkingApp: "be97de22-b78b-4fed-8a3a-88dc23994d6c",
  spacelab: "13e602b8-c324-44e6-9c61-e9e40f388394",
  bagiBerkah: "169275ea-ca4a-4701-857f-1417fc4fec23",
  cultureConnect: "ff98b3c6-e267-4ee0-9059-9444858eacf4",
  smartfarm: "bde24764-8fcf-4d67-8bb2-697cb57fb66d",
  cicd: "40fc57ed-1ce0-5375-9732-a66df807beff",
} as const

export const CAPABILITIES: Capability[] = [
  {
    id: "product",
    label: "Real needs into products",
    sentence:
      "I start from who uses it and what breaks today: waste-bank staff sharing one queue, a school voting on paper ballots, customers who will not make an account.",
    projectIds: [P.miru, P.hkGold, P.eVote, P.louise, P.sipadu],
  },
  {
    id: "systems",
    label: "Workflows, auth, and data",
    sentence:
      "Roles, sign-in, APIs, and a database that stays the single source of truth when staff, admins, and apps touch the same records.",
    projectIds: [P.miru, P.hkGold, P.eVote, P.jepangku, P.aksara, P.inventoryflow, P.parkingApp, P.spacelab],
  },
  {
    id: "full-stack",
    label: "Front end to back end",
    sentence:
      "I build the screen and the API behind it, so the contract between them is mine to keep honest.",
    projectIds: [P.jepangku, P.hkGold, P.bagiBerkah, P.cultureConnect, P.eVote, P.aksara],
  },
  {
    id: "integrations",
    label: "Outside services",
    sentence:
      "WhatsApp codes, push notifications, payment providers, email verification, and model output wired in without faking success.",
    projectIds: [P.hkGold, P.jepangku, P.bagiBerkah, P.louise, P.smartfarm],
  },
  {
    id: "delivery",
    label: "Shipping and infrastructure",
    sentence:
      "CI pipelines, container images, self-hosted runners, and release builds that reach the app store, not only localhost.",
    projectIds: [P.cicd, P.hkGold, P.jepangku],
  },
]

/** Capabilities with enough proof to show. */
export function getCapabilities(): Capability[] {
  return CAPABILITIES.filter((c) => c.projectIds.length >= 2)
}

/** `null` means All work. */
export function projectHasCapability(projectId: string, id: CapabilityId | null): boolean {
  if (id === null) return true
  return CAPABILITIES.some((c) => c.id === id && c.projectIds.includes(projectId))
}
