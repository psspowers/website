-- ============================================================
-- RLS Audit Cleanup
--
-- Removes stale/duplicate SELECT policies accumulated across
-- earlier migrations and adds the two missing UPDATE-admin
-- policies on lead-intake tables.
--
-- No table data is touched. is_admin() and its EXECUTE grant
-- for `authenticated` are left completely untouched.
-- ============================================================

-- ------------------------------------------------------------
-- 1. projects — drop legacy duplicate SELECT policy
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "select_projects" ON public.projects;

-- ------------------------------------------------------------
-- 2. offices — drop legacy duplicate SELECT policy
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "select_offices" ON public.offices;

-- ------------------------------------------------------------
-- 3. news_posts — replace three fragmented SELECT policies with
--    one unified policy open to all roles (anon + authenticated)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "select_news_anon"            ON public.news_posts;
DROP POLICY IF EXISTS "select_news_auth"            ON public.news_posts;
DROP POLICY IF EXISTS "news_posts_select_published" ON public.news_posts;

CREATE POLICY "news_posts_select_public" ON public.news_posts
  FOR SELECT TO anon, authenticated
  USING (true);

-- ------------------------------------------------------------
-- 4. partner_inquiries — broaden INSERT to cover authenticated
--    users as well (consistent with contact_submissions), and
--    add the missing UPDATE-admin policy
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "partner_inquiries_insert_public" ON public.partner_inquiries;

CREATE POLICY "partner_inquiries_insert_public" ON public.partner_inquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "partner_inquiries_update_admin" ON public.partner_inquiries
  FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ------------------------------------------------------------
-- 5. contact_submissions — add the missing UPDATE-admin policy
-- ------------------------------------------------------------
CREATE POLICY "contact_submissions_update_admin" ON public.contact_submissions
  FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());
