/**
 * Agent blog API — unit + route tests (blog-tasks 2.10).
 * Uses SUPABASE_MOCK_ENABLED so getSupabaseAdmin() hits the in-memory mock.
 */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { NextRequest } from "next/server";
import {
  assertAgentBlogToken,
  computeReadingTimeMinutes,
  jakartaDayWindow,
  normalizeSlug,
  validateAgentBlogPayload,
} from "@/lib/agent-blog";
import { resetMockStores } from "@/lib/supabase/test-mock";

const TOKEN = "test-agent-blog-token-32chars-min!!";

function longBody(extra = ""): string {
  const base =
    "## Lead\n\n" +
    "This is a descriptive English lead paragraph for portfolio blog tests. ".repeat(8);
  return (base + extra).slice(0, 800);
}

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    title: "How SSR cuts portfolio waterfalls",
    description:
      "A short look at why server-rendered first paint beats client fetch skeletons on a personal site.",
    body_md: longBody(),
    category: "web",
    tags: ["nextjs", "ssr"],
    locale: "en",
    slug: "ssr-cuts-portfolio-waterfalls",
    ...overrides,
  };
}

function agentRequest(
  body: unknown,
  opts: { token?: string | null; ip?: string } = {},
): NextRequest {
  const headers = new Headers({
    "content-type": "application/json",
    "x-forwarded-for": opts.ip ?? `203.0.113.${Math.floor(Math.random() * 200) + 1}`,
  });
  if (opts.token !== null) {
    headers.set("authorization", `Bearer ${opts.token ?? TOKEN}`);
  }
  return new NextRequest("http://localhost:3000/api/agent/blog", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("agent-blog helpers", () => {
  it("normalizeSlug produces kebab-case", () => {
    expect(normalizeSlug("Hello World!")).toBe("hello-world");
    expect(normalizeSlug("  SSR / ISR  ")).toBe("ssr-isr");
  });

  it("computeReadingTimeMinutes uses ~200 wpm with a floor of 1", () => {
    expect(computeReadingTimeMinutes("one two")).toBe(1);
    const words = Array.from({ length: 400 }, () => "word").join(" ");
    expect(computeReadingTimeMinutes(words)).toBe(2);
  });

  it("jakartaDayWindow covers the Asia/Jakarta calendar day in UTC", () => {
    // 2026-08-25 10:00 UTC = 17:00 WIB → same Jakarta day starts 2026-08-24T17:00:00.000Z
    const window = jakartaDayWindow(new Date("2026-08-25T10:00:00.000Z"));
    expect(window.startIso).toBe("2026-08-24T17:00:00.000Z");
    expect(window.endIso).toBe("2026-08-25T17:00:00.000Z");
  });

  it("validateAgentBlogPayload rejects em dashes", () => {
    const result = validateAgentBlogPayload(
      validPayload({ title: "Bad — title with em dash" }),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.status).toBe(400);
      expect(result.error.message).toContain("em dash");
    }
  });

  it("validateAgentBlogPayload rejects unknown categories", () => {
    const result = validateAgentBlogPayload(validPayload({ category: "lifestyle" }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.status).toBe(400);
  });

  it("validateAgentBlogPayload accepts a valid payload and slugifies", () => {
    const result = validateAgentBlogPayload(validPayload({ slug: undefined }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.slug).toBe("how-ssr-cuts-portfolio-waterfalls");
      expect(result.value.category).toBe("web");
    }
  });

  it("assertAgentBlogToken returns 401 for wrong token", () => {
    process.env.AGENT_BLOG_TOKEN = TOKEN;
    const req = new Request("http://localhost/api/agent/blog", {
      headers: { authorization: "Bearer wrong-token" },
    });
    const err = assertAgentBlogToken(req);
    expect(err?.status).toBe(401);
  });

  it("assertAgentBlogToken returns null for matching token", () => {
    process.env.AGENT_BLOG_TOKEN = TOKEN;
    const req = new Request("http://localhost/api/agent/blog", {
      headers: { authorization: `Bearer ${TOKEN}` },
    });
    expect(assertAgentBlogToken(req)).toBeNull();
  });
});

describe("POST /api/agent/blog", () => {
  beforeEach(() => {
    process.env.AGENT_BLOG_TOKEN = TOKEN;
    process.env.SUPABASE_MOCK_ENABLED = "true";
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
    resetMockStores();
  });

  afterEach(() => {
    resetMockStores();
  });

  it("returns 401 for a bad token", async () => {
    const { POST } = await import("@/app/api/agent/blog/route");
    const res = await POST(agentRequest(validPayload(), { token: "nope" }));
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error?.code ?? json.code).toBeTruthy();
  });

  it("returns 201 with id, slug, and url on success", async () => {
    const { POST } = await import("@/app/api/agent/blog/route");
    const payload = validPayload({ slug: "first-agent-post" });
    const res = await POST(agentRequest(payload));
    expect(res.status).toBe(201);
    const json = await res.json();
    const data = json.data ?? json;
    expect(data.slug).toBe("first-agent-post");
    expect(data.url).toBe("http://localhost:3000/blog/first-agent-post");
    expect(data.id).toBeTruthy();
  });

  it("returns 409 when the slug already exists", async () => {
    const { POST } = await import("@/app/api/agent/blog/route");
    const payload = validPayload({ slug: "duplicate-slug-post" });
    const first = await POST(agentRequest(payload, { ip: "198.51.100.1" }));
    expect(first.status).toBe(201);

    const second = await POST(
      agentRequest(
        validPayload({
          slug: "duplicate-slug-post",
          title: "A different title for the same slug",
        }),
        { ip: "198.51.100.2" },
      ),
    );
    expect(second.status).toBe(409);
  });

  it("returns 429 when daily agent quota is already used", async () => {
    const { POST } = await import("@/app/api/agent/blog/route");
    const first = await POST(
      agentRequest(validPayload({ slug: "quota-post-one" }), { ip: "198.51.100.10" }),
    );
    expect(first.status).toBe(201);

    const second = await POST(
      agentRequest(validPayload({ slug: "quota-post-two" }), { ip: "198.51.100.11" }),
    );
    expect(second.status).toBe(429);
    const json = await second.json();
    const code = json.error?.code ?? json.code;
    expect(code).toBe("QUOTA_EXCEEDED");
  });
});
