-- Blog phase 2: reactions (see docs/blog.md §6 sketch)
-- One visitor = one reaction total per post.
-- visitor_key is a hashed IP+UA fingerprint for anon rate limiting.

BEGIN;

create table if not exists public.blog_reactions (
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  reaction text not null check (reaction in ('like', 'insightful', 'useful')),
  visitor_key text not null,
  created_at timestamptz not null default now(),
  primary key (post_id, visitor_key)
);

create index if not exists blog_reactions_post_idx
  on public.blog_reactions (post_id);

-- RLS: public can read reactions (for counts display)
-- Public can insert (one per visitor per post, enforced by PK)
-- No public UPDATE/DELETE
alter table public.blog_reactions enable row level security;

drop policy if exists "Public can read reactions" on public.blog_reactions;
create policy "Public can read reactions"
  on public.blog_reactions
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can insert reactions" on public.blog_reactions;
create policy "Public can insert reactions"
  on public.blog_reactions
  for insert
  to anon, authenticated
  with check (true);

COMMIT;
