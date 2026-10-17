-- Reactions and comments were never shown on the site (the components were
-- not mounted), and visitor login is gone. Remove the tables and the
-- denormalized counter so nothing public can write to them.

BEGIN;

drop table if exists public.blog_comments;
drop table if exists public.blog_reactions;
alter table public.blog_posts drop column if exists reaction_counts;

COMMIT;
