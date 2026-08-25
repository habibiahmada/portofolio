/**
 * Agent blog API helpers (phase 1).
 * Contract: docs/blog.md §7. Token auth + validation + Asia/Jakarta quota.
 *
 * Pure logic lives here so it is unit-testable without the HTTP layer.
 */

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { BLOG_CATEGORIES } from "./data/constants";
import type { BlogCategory } from "./supabase/types";

/** Hard cap for the raw JSON body (docs/blog.md §11: body_md max ~100 KB). */
export const AGENT_BLOG_MAX_BODY_BYTES = 128 * 1024;

/** Default minutes until a draft auto-publishes if not reviewed. */
export const DEFAULT_BLOG_REVIEW_MINUTES = 20;

/** Legacy hours fallback when BLOG_REVIEW_MINUTES is unset. */
export const DEFAULT_BLOG_REVIEW_HOURS = 24;

export const TITLE_MIN = 10;
export const TITLE_MAX = 120;
export const DESCRIPTION_MIN = 50;
export const DESCRIPTION_MAX = 180;
export const BODY_MD_MIN = 400;
export const BODY_MD_MAX = 100_000;
export const TAGS_MAX = 8;

/** Reading speed used to compute reading_time_minutes (docs/blog.md §7). */
const WORDS_PER_MINUTE = 200;

/** Jakarta is UTC+7 year-round (no DST). */
const JAKARTA_OFFSET_MS = 7 * 60 * 60 * 1000;

export type AgentBlogError = {
  status: number;
  code: string;
  message: string;
};

export type ValidatedAgentPost = {
  slug: string;
  title: string;
  description: string;
  body_md: string;
  category: BlogCategory;
  tags: string[];
  seo_title: string | null;
  seo_description: string | null;
  /** Optional https cover (Unsplash / Picsum / Supabase). */
  cover_url: string | null;
};

// ── Token auth ───────────────────────────────────────────────────────────────

/**
 * Timing-safe Bearer token check against AGENT_BLOG_TOKEN.
 * Both values are hashed before comparison so length differences
 * do not leak via early exit. Returns null when authorized.
 */
export function assertAgentBlogToken(request: Request): AgentBlogError | null {
  const expected = process.env.AGENT_BLOG_TOKEN || "";
  if (!expected) {
    return {
      status: 500,
      code: "SERVER_MISCONFIGURED",
      message: "Agent blog endpoint is not configured.",
    };
  }

  const header = request.headers.get("authorization") || "";
  const match = /^Bearer\s+(.+)$/i.exec(header);
  const provided = match?.[1] ?? "";

  const providedHash = createHash("sha256").update(provided).digest();
  const expectedHash = createHash("sha256").update(expected).digest();

  if (!timingSafeEqual(providedHash, expectedHash)) {
    return { status: 401, code: "UNAUTHORIZED", message: "Invalid agent token." };
  }
  return null;
}

// ── Validation ───────────────────────────────────────────────────────────────

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function containsEmDash(value: string): boolean {
  return value.includes("—");
}

/** Kebab-case slug: lowercase, strip diacritics, non-alnum → single dash. */
export function normalizeSlug(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)
    .replace(/-+$/g, "");
}

/** ~200 wpm, minimum 1 minute. */
export function computeReadingTimeMinutes(bodyMd: string): number {
  const words = bodyMd.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** Validate the parsed JSON payload against docs/blog.md §7. */
export function validateAgentBlogPayload(
  raw: unknown,
): { ok: true; value: ValidatedAgentPost } | { ok: false; error: AgentBlogError } {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return {
      ok: false,
      error: { status: 400, code: "VALIDATION_ERROR", message: "Body must be a JSON object." },
    };
  }

  const body = raw as Record<string, unknown>;
  const invalid = (message: string): { ok: false; error: AgentBlogError } => ({
    ok: false,
    error: { status: 400, code: "VALIDATION_ERROR", message },
  });

  // Em dash ban applies to all human-visible fields.
  for (const field of ["title", "description", "body_md", "seo_title", "seo_description"] as const) {
    const value = body[field];
    if (typeof value === "string" && containsEmDash(value)) {
      return invalid(
        `Field "${field}" contains an em dash (\u2014), which is not allowed. Rewrite it with a regular hyphen or comma.`,
      );
    }
  }

  if (!isNonEmptyString(body.title)) return invalid('"title" is required.');
  const title = body.title.trim();
  if (title.length < TITLE_MIN || title.length > TITLE_MAX) {
    return invalid(`"title" must be ${TITLE_MIN}-${TITLE_MAX} characters.`);
  }

  if (!isNonEmptyString(body.description)) return invalid('"description" is required.');
  const description = body.description.trim();
  if (description.length < DESCRIPTION_MIN || description.length > DESCRIPTION_MAX) {
    return invalid(`"description" must be ${DESCRIPTION_MIN}-${DESCRIPTION_MAX} characters.`);
  }

  if (!isNonEmptyString(body.body_md)) return invalid('"body_md" is required.');
  const bodyMd = body.body_md;
  if (bodyMd.length < BODY_MD_MIN || bodyMd.length > BODY_MD_MAX) {
    return invalid(`"body_md" must be ${BODY_MD_MIN}-${BODY_MD_MAX} characters.`);
  }

  if (!isNonEmptyString(body.category)) return invalid('"category" is required.');
  const category = body.category as BlogCategory;
  if (!(BLOG_CATEGORIES as readonly string[]).includes(category)) {
    return invalid(
      `"category" must be one of: ${(BLOG_CATEGORIES as readonly string[]).join(", ")}.`,
    );
  }

  let tags: string[] = [];
  if (body.tags !== undefined && body.tags !== null) {
    if (!Array.isArray(body.tags) || body.tags.some((t) => typeof t !== "string")) {
      return invalid('"tags" must be an array of strings.');
    }
    tags = (body.tags as string[]).map((t) => t.trim()).filter(Boolean);
    if (tags.length > TAGS_MAX) return invalid(`"tags" allows at most ${TAGS_MAX} items.`);
  }

  if (body.locale !== undefined && body.locale !== "en") {
    return invalid('Only locale "en" is supported in phase 1.');
  }

  const seoTitle =
    body.seo_title === undefined || body.seo_title === null ? null : String(body.seo_title);
  if (seoTitle && seoTitle.length > TITLE_MAX) {
    return invalid(`"seo_title" must be at most ${TITLE_MAX} characters.`);
  }

  const seoDescription =
    body.seo_description === undefined || body.seo_description === null
      ? null
      : String(body.seo_description);
  if (seoDescription && seoDescription.length > DESCRIPTION_MAX) {
    return invalid(`"seo_description" must be at most ${DESCRIPTION_MAX} characters.`);
  }

  // Slug: optional; server slugifies the title when absent or unparseable.
  let slug = "";
  if (isNonEmptyString(body.slug)) {
    slug = normalizeSlug(body.slug);
  } else {
    slug = normalizeSlug(title);
  }
  if (!slug) return invalid('Could not derive a valid kebab-case "slug".');

  let coverUrl: string | null = null;
  if (body.cover_url !== undefined && body.cover_url !== null && body.cover_url !== "") {
    if (typeof body.cover_url !== "string") {
      return invalid('"cover_url" must be a string URL or null.');
    }
    const trimmedCover = body.cover_url.trim();
    if (!isAllowedCoverUrl(trimmedCover)) {
      return invalid(
        '"cover_url" must be https from images.unsplash.com, picsum.photos, images.pexels.com, or Supabase Storage.',
      );
    }
    if (trimmedCover.length > 500) {
      return invalid('"cover_url" is too long.');
    }
    coverUrl = trimmedCover;
  }

  return {
    ok: true,
    value: {
      slug,
      title,
      description,
      body_md: bodyMd,
      category,
      tags,
      seo_title: seoTitle,
      seo_description: seoDescription,
      cover_url: coverUrl,
    },
  };
}

// ── Daily quota window (Asia/Jakarta calendar day) ──────────────────────────

export type QuotaWindow = { startIso: string; endIso: string };

/**
 * UTC ISO range covering the current Asia/Jakarta calendar day.
 * Example: 2026-08-25T10:00Z → [2026-08-24T17:00:00Z, 2026-08-25T17:00:00Z).
 */
export function jakartaDayWindow(now: Date = new Date()): QuotaWindow {
  const shiftedDays = Math.floor((now.getTime() + JAKARTA_OFFSET_MS) / 86_400_000);
  const startMs = shiftedDays * 86_400_000 - JAKARTA_OFFSET_MS;
  return {
    startIso: new Date(startMs).toISOString(),
    endIso: new Date(startMs + 86_400_000).toISOString(),
  };
}

/** Hosts allowed for agent-supplied cover_url (and recommended for body images). */
const COVER_HOST_ALLOWLIST = new Set([
  "images.unsplash.com",
  "plus.unsplash.com",
  "images.pexels.com",
  "picsum.photos",
  "fastly.picsum.photos",
]);

export function isAllowedCoverUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    if (COVER_HOST_ALLOWLIST.has(u.hostname)) return true;
    // Supabase public storage
    if (u.hostname.endsWith(".supabase.co") && u.pathname.includes("/storage/v1/object/public/")) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function createPreviewToken(): string {
  return randomBytes(24).toString("base64url");
}

export function reviewDeadlineFromNow(hours?: number, minutes?: number): string {
  const envMinutes = process.env.BLOG_REVIEW_MINUTES;
  if (minutes !== undefined && Number.isFinite(minutes) && minutes > 0) {
    return new Date(Date.now() + minutes * 60 * 1000).toISOString();
  }
  if (envMinutes !== undefined && envMinutes !== "") {
    const m = Number(envMinutes);
    if (Number.isFinite(m) && m > 0) {
      return new Date(Date.now() + m * 60 * 1000).toISOString();
    }
  }

  const raw =
    hours ?? Number(process.env.BLOG_REVIEW_HOURS || DEFAULT_BLOG_REVIEW_HOURS);
  const h =
    typeof raw === "number" && Number.isFinite(raw) && raw > 0
      ? raw
      : DEFAULT_BLOG_REVIEW_HOURS;
  return new Date(Date.now() + h * 60 * 60 * 1000).toISOString();
}

export function siteBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");
}
