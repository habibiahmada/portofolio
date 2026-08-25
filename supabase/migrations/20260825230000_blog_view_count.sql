-- Blog view counts (public read via published posts select; increment via service role API)

BEGIN;

alter table public.blog_posts
  add column if not exists view_count integer not null default 0;

COMMIT;
