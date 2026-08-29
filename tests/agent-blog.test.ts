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

  it("returns 201 draft with preview_url (not public url) on success", async () => {
    const { POST } = await import("@/app/api/agent/blog/route");
    const payload = validPayload({ slug: "first-agent-post" });
    const res = await POST(agentRequest(payload));
    expect(res.status).toBe(201);
    const json = await res.json();
    const data = json.data ?? json;
    expect(data.slug).toBe("first-agent-post");
    expect(data.status).toBe("draft");
    expect(data.url).toBeNull();
    expect(data.preview_url).toMatch(
      /^http:\/\/localhost:3000\/blog\/preview\/[A-Za-z0-9_-]+$/,
    );
    expect(data.review_deadline_at).toBeTruthy();
    expect(data.id).toBeTruthy();
  });

  it("approve then reject/review endpoints work for drafts", async () => {
    const { POST: create } = await import("@/app/api/agent/blog/route");
    const { POST: review } = await import("@/app/api/agent/blog/review/route");
    const createRes = await create(
      agentRequest(validPayload({ slug: "review-approve-post" }), {
        ip: "198.51.100.50",
      }),
    );
    expect(createRes.status).toBe(201);
    const created = ((await createRes.json()).data ?? {}) as {
      id: string;
    };

    const approveReq = new NextRequest(
      "http://localhost:3000/api/agent/blog/review",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${TOKEN}`,
          "x-forwarded-for": "198.51.100.51",
        },
        body: JSON.stringify({ id: created.id, action: "approve" }),
      },
    );
    const approveRes = await review(approveReq);
    expect(approveRes.status).toBe(200);
    const approved = ((await approveRes.json()).data ?? {}) as {
      url: string;
      slug: string;
    };
    expect(approved.slug).toBe("review-approve-post");
    expect(approved.url).toBe(
      "http://localhost:3000/blog/review-approve-post",
    );
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

  it("GET returns the post body for revision after reject", async () => {
    const { POST: create, GET } = await import("@/app/api/agent/blog/route");
    const { POST: review } = await import("@/app/api/agent/blog/review/route");
    const createdRes = await create(
      agentRequest(validPayload({ slug: "reject-then-get" }), {
        ip: "198.51.100.60",
      }),
    );
    expect(createdRes.status).toBe(201);
    const created = ((await createdRes.json()).data ?? {}) as { id: string };

    const rejectRes = await review(
      new NextRequest("http://localhost:3000/api/agent/blog/review", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${TOKEN}`,
          "x-forwarded-for": "198.51.100.61",
        },
        body: JSON.stringify({ id: created.id, action: "reject" }),
      }),
    );
    expect(rejectRes.status).toBe(200);

    const getReq = new NextRequest(
      `http://localhost:3000/api/agent/blog?id=${created.id}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${TOKEN}`,
          "x-forwarded-for": "198.51.100.62",
        },
      },
    );
    const getRes = await GET(getReq);
    expect(getRes.status).toBe(200);
    const got = ((await getRes.json()).data ?? {}) as {
      slug: string;
      status: string;
      body_md: string;
    };
    expect(got.slug).toBe("reject-then-get");
    expect(got.status).toBe("archived");
    expect(got.body_md.length).toBeGreaterThan(100);
  });

  it("POST /revise restores archived post as a new draft without quota", async () => {
    const { POST: create } = await import("@/app/api/agent/blog/route");
    const { POST: review } = await import("@/app/api/agent/blog/review/route");
    const { POST: revise } = await import("@/app/api/agent/blog/revise/route");

    const createdRes = await create(
      agentRequest(validPayload({ slug: "reject-then-revise" }), {
        ip: "198.51.100.70",
      }),
    );
    expect(createdRes.status).toBe(201);
    const created = ((await createdRes.json()).data ?? {}) as { id: string };

    const rejectRes = await review(
      new NextRequest("http://localhost:3000/api/agent/blog/review", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${TOKEN}`,
          "x-forwarded-for": "198.51.100.71",
        },
        body: JSON.stringify({ id: created.id, action: "reject" }),
      }),
    );
    expect(rejectRes.status).toBe(200);

    const reviseRes = await revise(
      new NextRequest("http://localhost:3000/api/agent/blog/revise", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${TOKEN}`,
          "x-forwarded-for": "198.51.100.72",
        },
        body: JSON.stringify({
          id: created.id,
          ...validPayload({
            slug: "reject-then-revise",
            title: "Revised title about SSR waterfalls",
            description:
              "A rewritten meta description that stays within the fifty to one hundred eighty range.",
            body_md: longBody(" rewritten body for the restored draft."),
          }),
        }),
      }),
    );
    expect(reviseRes.status).toBe(200);
    const revised = ((await reviseRes.json()).data ?? {}) as {
      slug: string;
      status: string;
      preview_url: string;
      action: string;
    };
    expect(revised.action).toBe("revise");
    expect(revised.slug).toBe("reject-then-revise");
    expect(revised.status).toBe("draft");
    expect(revised.preview_url).toMatch(/\/blog\/preview\//);
  });
});
