
-- ============================================================
-- 1. Fix is_admin(): pin search_path, qualify table reference,
--    revoke direct REST-API execution from anon.
--    EXECUTE must remain for `authenticated` because RLS
--    policies on news_posts, projects, offices, etc. call it.
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
$$;

-- Revoke public execution; re-grant only to roles that need it.
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
GRANT  EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ============================================================
-- 2. Fix update_popup_updated_at(): pin search_path.
--    Trigger functions reference no user tables, so no
--    schema-qualification needed beyond the fix itself.
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_popup_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ============================================================
-- 3. Replace the "always true" contact_submissions INSERT
--    policy with one that validates required fields.
--    The table has no user_id column so public access is
--    intentional, but WITH CHECK (true) is unnecessarily broad.
-- ============================================================
DROP POLICY IF EXISTS "contact_submissions_insert_public" ON public.contact_submissions;

CREATE POLICY "contact_submissions_insert_public" ON public.contact_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(trim(first_name)) > 0 AND
    length(trim(last_name))  > 0 AND
    email LIKE '%@%'          AND
    length(trim(message))    > 0
  );
