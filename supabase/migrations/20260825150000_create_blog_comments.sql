-- Blog phase 4: comments (see docs/blog-comments-adr.md)
-- Authenticated users only; admin moderation queue.
-- Public reads approved comments only via RLS.

BEGIN;

create table if not exists public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (length(body) > 0 and length(body) <= 2000),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_comments_post_idx
  on public.blog_comments (post_id, status);

create index if not exists blog_comments_user_idx
  on public.blog_comments (user_id);

-- RLS: public reads approved only
-- Authenticated users can insert their own comments
-- No public UPDATE/DELETE (admin only via service role)
alter table public.blog_comments enable row level security;

drop policy if exists "Public can read approved comments" on public.blog_comments;
create policy "Public can read approved comments"
  on public.blog_comments
  for select
  to anon, authenticated
  using (status = 'approved');

drop policy if exists "Authenticated users can insert comments" on public.blog_comments;
create policy "Authenticated users can insert comments"
  on public.blog_comments
  for insert
  to authenticated
  with check (user_id = auth.uid());

COMMIT;
