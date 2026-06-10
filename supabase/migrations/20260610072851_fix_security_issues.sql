-- Fix 1: partner_inquiries INSERT policy - restrict to anon role only
-- (public contact form should only allow unauthenticated submissions)
DROP POLICY IF EXISTS "partner_inquiries_insert_public" ON public.partner_inquiries;
CREATE POLICY "partner_inquiries_insert_public" ON public.partner_inquiries
  FOR INSERT TO anon
  WITH CHECK (true);

-- Fix 2: Remove broad SELECT policies on all public storage buckets.
-- Public buckets serve files directly via CDN without RLS. These policies
-- allow API-level listing of all filenames which is unnecessary and exposes metadata.
DROP POLICY IF EXISTS "milestone_logos_select_public" ON storage.objects;
DROP POLICY IF EXISTS "news_images_select_public" ON storage.objects;
DROP POLICY IF EXISTS "popup_images_select_public" ON storage.objects;
DROP POLICY IF EXISTS "project_images_select_public" ON storage.objects;
DROP POLICY IF EXISTS "team_photos_select_public" ON storage.objects;

-- Replace with admin-only SELECT so the admin dashboard can still list objects if needed
CREATE POLICY "milestone_logos_select_admin" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'milestone-logos' AND is_admin());

CREATE POLICY "news_images_select_admin" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'news-images' AND is_admin());

CREATE POLICY "popup_images_select_admin" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'popup-images' AND is_admin());

CREATE POLICY "project_images_select_admin" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'project-images' AND is_admin());

CREATE POLICY "team_photos_select_admin" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'team-photos' AND is_admin());

-- Fix 3: Revoke EXECUTE on is_admin() from public roles.
-- The function is used in RLS policy expressions (which PostgreSQL evaluates
-- internally regardless of EXECUTE privilege), but must not be callable via
-- /rest/v1/rpc/is_admin by regular users.
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM authenticated;
