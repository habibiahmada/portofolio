-- Blog review flow: draft preview token + auto-publish deadline
-- See docs/blog.md review workflow

BEGIN;

alter table public.blog_posts
  add column if not exists preview_token text;

alter table public.blog_posts
  add column if not exists review_deadline_at timestamptz;

-- Unique when set (multiple nulls allowed in Postgres unique indexes via partial)
create unique index if not exists blog_posts_preview_token_uidx
  on public.blog_posts (preview_token)
  where preview_token is not null;

create index if not exists blog_posts_review_deadline_idx
  on public.blog_posts (review_deadline_at)
  where status = 'draft' and review_deadline_at is not null;

COMMIT;
