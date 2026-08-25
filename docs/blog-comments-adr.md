# ADR: Blog Comments

**Status:** Accepted (implemented)
**Date:** 2026-08-25
**Deciders:** Habibi Ahmad Aziz

---

## Context

The blog system is live with posts, reactions, and share buttons. Comments would add
deeper engagement but introduce moderation overhead, spam risk, and auth requirements.

This ADR documents the decision framework for when and how to implement comments.

---

## Decision: Auth + Moderation Required

Comments will require **authentication** (Supabase Auth) and **admin moderation** before
publication. Anonymous comments are rejected.

### Why authenticated?

1. **Spam prevention:** Authenticated users are accountable; anonymous comments invite bots.
2. **Moderation queue:** Admin can review before publication, preventing harmful content.
3. **Consistency:** Matches the portfolio's existing auth system (Supabase + admin allowlist).

### Why moderation queue?

1. **SEO safety:** Unmoderated comments can inject spam links that hurt search rankings.
2. **Brand protection:** Portfolio site; comments reflect on the author.
3. **Low volume expected:** 1 post/day means few comments; manual review is sustainable.

---

## Alternatives Considered

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| A. Anonymous comments | Low friction | Spam, no accountability | **Reject** |
| B. Authenticated + auto-publish | Simple | Risk of harmful content live | **Reject** |
| C. Authenticated + moderation queue | Safe, accountable | Slightly more work | **Choose** |
| D. Third-party (Disqus, etc.) | Zero dev work | Vendor lock-in, performance, privacy | **Reject** |

---

## Schema Design

```sql
create table public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (length(body) > 0 and length(body) <= 2000),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

- **RLS:** Public reads `approved` only. Authenticated users can insert (own comments).
- **Rate limit:** 5 comments per user per hour.
- **Spam detection:** Length check, URL count limit (max 2 links), keyword blocklist.

---

## UI Design

### Public (article page)
- Comment form below reactions (authenticated users only)
- List of approved comments with user avatar + name + date
- Login prompt for anonymous visitors

### Admin (`/admin/blog/[id]`)
- Comment moderation queue: pending / approved / rejected
- Bulk approve/reject actions
- Delete option for spam

---

## Phasing

This feature is **gated behind Phase 2 stability** (reactions + admin UI working for 2+ weeks).
Do not implement until:

1. Reactions are live and stable
2. Admin blog UI is working
3. At least 10 blog posts exist
4. Manual moderation plan is confirmed

---

## Risks

| Risk | Mitigation |
|------|------------|
| Spam bots | Auth required + rate limit + moderation queue |
| Low engagement | Comments are optional; reactions may be sufficient |
| Moderation overhead | Low volume (1 post/day); admin notification via Telegram |
| Performance impact | Comments lazy-loaded; approved count cached |
