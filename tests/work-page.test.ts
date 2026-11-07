import { describe, expect, it } from "bun:test";
import projects from "../public/data/projects.json";
import {
  CAPABILITIES,
  getCapabilities,
  projectHasCapability,
} from "../lib/data/capabilities";

const projectIds = new Set((projects as { id: string }[]).map((p) => p.id));

describe("capabilities", () => {
  it("only points at projects that exist", () => {
    for (const cap of CAPABILITIES) {
      for (const id of cap.projectIds) expect(projectIds.has(id)).toBe(true);
    }
  });

  it("keeps only capabilities with at least two proving projects", () => {
    for (const cap of getCapabilities()) {
      expect(cap.projectIds.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("has no em dash in labels or sentences", () => {
    for (const cap of CAPABILITIES) {
      expect(cap.label.includes("—")).toBe(false);
      expect(cap.sentence.includes("—")).toBe(false);
    }
  });

  it("treats null as All work", () => {
    expect(projectHasCapability("dfd144d5-84d7-5f1f-be03-1554dee928b1", null)).toBe(true);
  });

  it("puts the CI/CD platform under delivery", () => {
    expect(projectHasCapability("40fc57ed-1ce0-5375-9732-a66df807beff", "delivery")).toBe(true);
  });
});

import { getCardSubtitle } from "../lib/data/card-subtitle";

describe("card subtitle", () => {
  it("uses the part of the title after the colon", () => {
    expect(
      getCardSubtitle({
        id: "958d7eda-2748-52ee-a9b3-f408a112d136",
        title_en: "HK GOLD VIP: loyalty app and back office for a gold jeweller",
      }),
    ).toBe("loyalty app and back office for a gold jeweller");
  });

  it("gives Renshuu a descriptive line even without a colon", () => {
    expect(
      getCardSubtitle({ id: "f5c13a15-1bc6-4e82-8d62-d1196894d189", title_en: "Renshuu web" }).length,
    ).toBeGreaterThan(0);
  });

  it("gives every project a non-empty line with no em dash", () => {
    for (const p of projects as { id: string; title_en: string }[]) {
      const line = getCardSubtitle(p);
      expect(line.length).toBeGreaterThan(0);
      expect(line.includes("—")).toBe(false);
    }
  });
});

import { ARCHIVE_GROUPS, PROJECT_STATS } from "../lib/data/project-taxonomy";

describe("work stats", () => {
  it("counts Open Source as a kind of work", () => {
    expect(PROJECT_STATS.kinds).toBe(ARCHIVE_GROUPS.length + 1);
  });
});

import { getProjectTaxonomy } from "../lib/data/project-taxonomy";

describe("personal stat", () => {
  it("counts only personal and school projects, not the internship", () => {
    const personal = (projects as { id: string }[]).filter(
      (p) => getProjectTaxonomy(p.id)?.origin === "personal",
    ).length;
    expect(PROJECT_STATS.personalOnly).toBe(personal);
  });
});
