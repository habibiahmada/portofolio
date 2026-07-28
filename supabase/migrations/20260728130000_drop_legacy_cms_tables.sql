-- Cleanup legacy CMS tables unused by Next.js portfolio (portofolio-v2).
-- Keep: projects, companies, certificates, allowed_users
-- Source: supabase-portofolio (tjxcfcllkceoauuwurfe)

BEGIN;

DROP TABLE IF EXISTS public.article_translations CASCADE;
DROP TABLE IF EXISTS public.articles CASCADE;
DROP TABLE IF EXISTS public.certification_translations CASCADE;
DROP TABLE IF EXISTS public.certifications CASCADE;
DROP TABLE IF EXISTS public.experience_translations CASCADE;
DROP TABLE IF EXISTS public.experiences CASCADE;
DROP TABLE IF EXISTS public.faq_translations CASCADE;
DROP TABLE IF EXISTS public.faqs CASCADE;
DROP TABLE IF EXISTS public.hero_section_translations CASCADE;
DROP TABLE IF EXISTS public.hero_sections CASCADE;
DROP TABLE IF EXISTS public.service_translations CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.statistic_translations CASCADE;
DROP TABLE IF EXISTS public.statistics CASCADE;
DROP TABLE IF EXISTS public.testimonial_translations CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.tools_logo CASCADE;
DROP TABLE IF EXISTS public.contacts CASCADE;
DROP TABLE IF EXISTS public.email_templates CASCADE;

-- Normalize active portfolio columns
UPDATE public.certificates SET is_pinned = false WHERE is_pinned IS NULL;
ALTER TABLE public.certificates ALTER COLUMN is_pinned SET DEFAULT false;
ALTER TABLE public.certificates ALTER COLUMN is_pinned SET NOT NULL;

ALTER TABLE public.projects ALTER COLUMN tags SET DEFAULT '{}';
UPDATE public.projects SET tags = '{}' WHERE tags IS NULL;
ALTER TABLE public.projects ALTER COLUMN live_url SET DEFAULT '';
ALTER TABLE public.projects ALTER COLUMN github_url SET DEFAULT '';
UPDATE public.projects SET live_url = '' WHERE live_url IS NULL;
UPDATE public.projects SET github_url = '' WHERE github_url IS NULL;

COMMIT;
