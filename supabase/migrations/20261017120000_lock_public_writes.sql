-- The admin panel and visitor login were removed from the site.
-- 1. Comments: no one can sign in to comment or moderate, so close the insert path.
-- 2. Reactions: the API route writes with the service role after rate limiting;
--    the open anon INSERT policy let anyone bypass that limit with the public anon key.

BEGIN;

drop policy if exists "Authenticated users can insert comments" on public.blog_comments;
drop policy if exists "Public can insert reactions" on public.blog_reactions;

COMMIT;
