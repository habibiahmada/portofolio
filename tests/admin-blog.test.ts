/**
 * Admin blog moderation API tests (blog-tasks §3).
 */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { resetMockStores } from "@/lib/supabase/test-mock";

const BYPASS = "test-bypass-admin-blog";

function longBody(): string {
  return ("## Lead\n\n" + "Admin moderation body text for tests. ".repeat(20)).slice(0, 500);
}

function adminRequest(
  method: string,
  opts: { body?: unknown; id?: string } = {},
): NextRequest {
  const url = new URL("http://localhost:3000/api/admin/blog");
  if (opts.id) url.searchParams.set("id", opts.id);

  const headers = new Headers({
    "content-type": "application/json",
    "x-test-bypass": BYPASS,
  });

  return new NextRequest(url, {
    method,
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
}

async function seedPost(overrides: Record<string, unknown> = {}) {
  const supabase = getSupabaseAdmin();
  const row = {
    slug: "admin-seed-post",
    title: "Admin seed post title",
    description:
      "A long enough description used as seed data for admin blog API tests here.",
    body_md: longBody(),
    category: "web",
    tags: ["test"],
    locale: "en",
    status: "published",
    cover_url: null,
    seo_title: null,
    seo_description: null,
    canonical_url: null,
    reading_time_minutes: 2,
    reaction_counts: {},
    source: "agent",
    published_at: new Date().toISOString(),
    ...overrides,
  };
  const { data, error } = await supabase.from("blog_posts").insert(row).select().single();
  if (error) throw new Error(error.message);
  return data as { id: string; slug: string; status: string };
}

describe("GET/PATCH/DELETE /api/admin/blog", () => {
  beforeEach(() => {
    process.env.TEST_BYPASS_KEY = BYPASS;
    process.env.SUPABASE_MOCK_ENABLED = "true";
    resetMockStores();
  });

  afterEach(() => {
    resetMockStores();
  });

  it("lists all statuses including draft and archived", async () => {
    await seedPost({ slug: "pub-one", status: "published" });
    await seedPost({ slug: "draft-one", status: "draft", published_at: null });
    await seedPost({ slug: "arch-one", status: "archived" });

    const { GET } = await import("@/app/api/admin/blog/route");
    const res = await GET(adminRequest("GET"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.length).toBe(3);
    const statuses = new Set(json.data.map((p: { status: string }) => p.status));
    expect(statuses.has("published")).toBe(true);
    expect(statuses.has("draft")).toBe(true);
    expect(statuses.has("archived")).toBe(true);
  });

  it("patches status and title then revalidates path returns updated row", async () => {
    const post = await seedPost({ slug: "patch-me" });
    const { PATCH } = await import("@/app/api/admin/blog/route");
    const res = await PATCH(
      adminRequest("PATCH", {
        body: {
          id: post.id,
          status: "draft",
          title: "Updated admin title",
        },
      }),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.status).toBe("draft");
    expect(json.data.title).toBe("Updated admin title");
  });

  it("rejects em dash on patch", async () => {
    const post = await seedPost({ slug: "em-dash-patch" });
    const { PATCH } = await import("@/app/api/admin/blog/route");
    const res = await PATCH(
      adminRequest("PATCH", {
        body: { id: post.id, title: "Bad — title" },
      }),
    );
    expect(res.status).toBe(400);
  });

  it("DELETE archives instead of hard-deleting", async () => {
    const post = await seedPost({ slug: "to-archive" });
    const { DELETE, GET } = await import("@/app/api/admin/blog/route");
    const res = await DELETE(adminRequest("DELETE", { id: post.id }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.archived).toBe(post.id);
    expect(json.data.status).toBe("archived");

    const list = await GET(adminRequest("GET"));
    const body = await list.json();
    const found = body.data.find((p: { id: string }) => p.id === post.id);
    expect(found).toBeTruthy();
    expect(found.status).toBe("archived");
  });

  it("returns 401 without bypass / session", async () => {
    delete process.env.TEST_BYPASS_KEY;
    delete process.env.SUPABASE_MOCK_ENABLED;
    // Re-enable mock store for DB but no bypass key → auth fails
    process.env.SUPABASE_MOCK_ENABLED = "true";

    const { GET } = await import("@/app/api/admin/blog/route");
    const req = new NextRequest("http://localhost:3000/api/admin/blog", {
      method: "GET",
    });
    const res = await GET(req);
    expect(res.status).toBe(401);
  });
});
