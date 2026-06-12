
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-assets',
  'site-assets',
  true,
  2097152,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "site_assets_select_public" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'site-assets');

CREATE POLICY "site_assets_insert_admin" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-assets' AND is_admin());

CREATE POLICY "site_assets_update_admin" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'site-assets' AND is_admin());

CREATE POLICY "site_assets_delete_admin" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'site-assets' AND is_admin());
