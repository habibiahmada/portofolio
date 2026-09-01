-- Card / case-study presentation fields (moved from project-meta.ts)
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS outcome text NOT NULL DEFAULT '';

COMMENT ON COLUMN public.projects.role IS 'My role on the project (card + detail sidebar).';
COMMENT ON COLUMN public.projects.outcome IS 'Short outcome line for featured cards, e.g. live URL or award.';
