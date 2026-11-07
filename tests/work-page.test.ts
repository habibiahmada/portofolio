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
