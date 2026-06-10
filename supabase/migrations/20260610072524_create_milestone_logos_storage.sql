
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'milestone-logos',
  'milestone-logos',
  true,
  2097152,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "milestone_logos_select_public" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'milestone-logos');

CREATE POLICY "milestone_logos_insert_admin" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'milestone-logos' AND is_admin());

CREATE POLICY "milestone_logos_update_admin" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'milestone-logos' AND is_admin());

CREATE POLICY "milestone_logos_delete_admin" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'milestone-logos' AND is_admin());
