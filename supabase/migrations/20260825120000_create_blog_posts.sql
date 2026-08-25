-- Blog phase 1: blog_posts table (see docs/blog.md §6)
-- Categories allowlist per docs/blog.md §17. Locale locked to 'en' in phase 1.
-- Public reads published only via RLS; writes go through service role on the server.

BEGIN;

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  body_md text not null,
  category text not null
    check (category in ('programming', 'education', 'web', 'career', 'opinion', 'news-commentary')),
  tags text[] not null default '{}',
  locale text not null default 'en'
    check (locale = 'en'),
  status text not null default 'published'
    check (status in ('draft', 'published', 'archived')),
  cover_url text,
  seo_title text,
  seo_description text,
  canonical_url text,
  reading_time_minutes int,
  reaction_counts jsonb not null default '{}'::jsonb,
  source text not null default 'agent'
    check (source in ('agent', 'admin')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_published_idx
  on public.blog_posts (published_at desc)
  where status = 'published';

create index if not exists blog_posts_category_idx
  on public.blog_posts (category)
  where status = 'published';

-- RLS: public SELECT only where status = 'published'; no public writes.
alter table public.blog_posts enable row level security;

drop policy if exists "Public can read published posts" on public.blog_posts;
create policy "Public can read published posts"
  on public.blog_posts
  for select
  to anon, authenticated
  using (status = 'published');

-- No INSERT/UPDATE/DELETE policies: only service_role bypasses RLS.

COMMIT;
