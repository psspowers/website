-- Restore public SELECT access on all five public asset storage buckets.
-- Migration 20260610072851_fix_security_issues.sql incorrectly dropped these
-- and replaced them with admin-only SELECT policies. Since all five buckets
-- are created with public:true, files must be readable by anonymous users.

DROP POLICY IF EXISTS "team_photos_select_admin"    ON storage.objects;
DROP POLICY IF EXISTS "project_images_select_admin" ON storage.objects;
DROP POLICY IF EXISTS "news_images_select_admin"    ON storage.objects;
DROP POLICY IF EXISTS "popup_images_select_admin"   ON storage.objects;
DROP POLICY IF EXISTS "milestone_logos_select_admin" ON storage.objects;

CREATE POLICY "team_photos_select_public" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'team-photos');

CREATE POLICY "project_images_select_public" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'project-images');

CREATE POLICY "news_images_select_public" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'news-images');

CREATE POLICY "popup_images_select_public" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'popup-images');

CREATE POLICY "milestone_logos_select_public" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'milestone-logos');
